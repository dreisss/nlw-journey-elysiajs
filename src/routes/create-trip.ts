import { Elysia, t } from 'elysia'
import nodemailer from 'nodemailer'

import { type NewParticipant, participants, trips } from '../../db/schema'
import { db } from '../lib/drizzle'
import dayjs from '../lib/dayjs'
import { getMailClient } from '../lib/mail'
import { apiBaseUrl } from '..'

const createTripSchema = t.Object({
  destination: t.String({ minLength: 4 }),
  startsAt: t.String({ format: 'date' }),
  endsAt: t.String({ format: 'date' }),
  ownerName: t.String(),
  ownerEmail: t.String({ format: 'email' }),
  emailsToInvite: t.Array(t.String({ format: 'email' })),
})

export const createTrip = new Elysia().post(
  '/trips',
  async ({ body }) => {
    const { destination, startsAt, endsAt, ownerName, ownerEmail, emailsToInvite } = body

    if (dayjs(startsAt).isBefore(new Date())) throw new Error('Invalid trip start date.')
    if (dayjs(endsAt).isBefore(startsAt)) throw new Error('Invalid trip end date.')

    const trip = await db.transaction(async (tx) => {
      const newTrip = (await tx.insert(trips).values(body).returning({ id: trips.id }))[0]

      const owner: NewParticipant = {
        name: ownerName,
        email: ownerEmail,
        isConfirmed: true,
        isOwner: true,
        tripId: newTrip.id,
      }

      const participantsToInvite: NewParticipant[] = emailsToInvite.map((email) => ({ email, tripId: newTrip.id }))

      await tx.insert(participants).values([owner, ...participantsToInvite])

      return newTrip
    })

    const formattedStartDate = dayjs(startsAt).format('LL')
    const formattedEndDate = dayjs(startsAt).format('LL')

    const confirmationLink = `http://${apiBaseUrl}/trips/${trip.id}/confirm`

    const mail = await getMailClient()
    const message = await mail.sendMail({
      from: {
        name: 'Equipe plann.er',
        address: 'oi@plann.er',
      },
      to: {
        name: ownerName,
        address: ownerEmail,
      },
      subject: `Confirme sua viagem para ${destination} em ${formattedStartDate}`,
      html: `
        <div style="font-family: sans-serif; font-size: 16px; line-height: 1.6;">
          <p>Você solicitou a criação de uma viagem para <strong>${destination}</strong> nas datas de <strong>${formattedStartDate}</strong> até <strong>${formattedEndDate}</strong>.</p>
          <p></p>
          <p>Para confirmar sua viagem, clique no link abaixo:</p>
          <p></p>
          <p>
            <a href="${confirmationLink}">Confirmar viagem</a>
          </p>
          <p></p>
          <p>Caso você não saiba do que se trata esse e-mail, apenas ignore esse e-mail.</p>
        </div>
      `.trim(),
    })

    console.log(nodemailer.getTestMessageUrl(message))

    return { id: trip.id }
  },
  { body: createTripSchema },
)
