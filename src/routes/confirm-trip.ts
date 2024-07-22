import { Elysia, t } from 'elysia'
import { eq } from 'drizzle-orm'
import nodemailer from 'nodemailer'

import { apiBaseUrl, appBaseUrl } from '..'
import { trips } from '../../db/schema'
import dayjs from '../lib/dayjs'
import { db } from '../lib/drizzle'
import { getMailClient } from '../lib/mail'

const confirmTripSchema = t.Object({
  id: t.String({ format: 'uuid' }),
})

export const confirmTrip = new Elysia().get(
  '/trips/:id/confirm',
  async ({ params, redirect }) => {
    const trip = await db.query.trips.findFirst({
      where: (trip, { eq }) => eq(trip.id, params.id),
      with: {
        participants: {
          where: (participant, { eq }) => eq(participant.isOwner, false),
        },
      },
    })

    if (!trip) {
      throw new Error('Trip not found!')
    }

    if (trip.isConfirmed) {
      return redirect(`http:${appBaseUrl}/trips/${trip.id}`)
    }

    await db.update(trips).set({ isConfirmed: true }).where(eq(trips.id, trip.id))

    const formattedStartDate = dayjs(trip.startsAt).format('LL')
    const formattedEndDate = dayjs(trip.endsAt).format('LL')

    const mail = await getMailClient()

    await Promise.all(
      trip.participants.map(async (participant) => {
        const confirmationLink = `http://${apiBaseUrl}/participants/${participant.id}/confirm`

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
      }),
    )

    return redirect(`http:${appBaseUrl}/trips/${trip.id}`)
  },
  { params: confirmTripSchema },
)
