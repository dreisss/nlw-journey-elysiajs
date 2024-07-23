import { Elysia, t } from 'elysia'
import nodemailer from 'nodemailer'

import { db } from '../lib/drizzle'
import { participants } from '../../db/schema'
import dayjs from '../lib/dayjs'
import { getMailClient } from '../lib/mail'

const createInviteParamsSchema = t.Object({
  id: t.String({ format: 'uuid' }),
})

const createInviteBodySchema = t.Object({
  email: t.String({ format: 'email' }),
})

export const createInvite = new Elysia().post(
  '/trips/:id/invites',
  async ({ params, body }) => {
    const trip = await db.query.trips.findFirst({
      where: (trip, { eq }) => eq(trip.id, params.id),
    })

    const { email } = body

    if (!trip) {
      throw new Error('Trip not found!')
    }

    const participant = (
      await db
        .insert(participants)
        .values({
          email,
          tripId: trip.id,
        })
        .returning({ id: participants.id, email: participants.email })
    )[0]

    const formattedStartDate = dayjs(trip.startsAt).format('LL')
    const formattedEndDate = dayjs(trip.endsAt).format('LL')

    const confirmationLink = `${process.env.BASE_URL}/participants/${participant.id}/confirm`

    const mail = await getMailClient()
    const message = await mail.sendMail({
      from: {
        name: 'Equipe plann.er',
        address: 'oi@plann.er',
      },
      to: participant.email,
      subject: `Confirme sua viagem para ${trip.destination} em ${formattedStartDate}`,
      html: `
        <div style="font-family: sans-serif; font-size: 16px; line-height: 1.6;">
          <p>Você foi convidado(a) para participar de uma viagem para <strong>${trip.destination}</strong> nas datas de <strong>${formattedStartDate}</strong> até <strong>${formattedEndDate}</strong>.</p>
          <p></p>
          <p>Para confirmar sua presença na viagem, clique no link abaixo:</p>
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

    return { id: participant.id }
  },
  {
    params: createInviteParamsSchema,
    body: createInviteBodySchema,
  },
)
