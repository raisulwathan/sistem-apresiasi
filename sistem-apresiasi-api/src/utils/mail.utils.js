import { PrismaClient } from "@prisma/client"
import { sendNotificationEmail } from "../pkg/mail.js"

const prisma = new PrismaClient()

export async function pushEmailNotificationFaculty(ownerId, role) {
    const user = await prisma.user.findUnique({
        where: {
            id: ownerId,
        },
    })

    const approver = await prisma.user.findFirst({
        where: {
            faculty: user.faculty,
            role,
        },
    })

    const htmlBody = `<!DOCTYPE html>
                          <html lang="en">
                          <head>
                              <meta charset="UTF-8">
                              <meta name="viewport" content="width=device-width, initial-scale=1.0">
                              <title>Notification</title>
                          </head>
                          <body style="font-family: Arial, sans-serif;">
                              <div style="background-color: #f4f4f4; padding: 20px;">
                                  <h2 style="color: #333;">Notification</h2>
                                  <p>Pengajuan SKPI</p>
                                  <p>Anda memiliki SKPI Mahaiswa yang harus di proses.</p>
                                  <p>Nama: ${user.name}</p>
                                  <p>NPM: ${user.npm}</p>
                                  <p>Fakultas: ${user.faculty}</p>
                                  <p>Program Studi: ${user.major}</p>
                                  <p>Silakan login ke sistem untuk informasi lebih lanjut.</p>
                                  <p>Terima kasih.</p>
                                  <p><i>Admin</i></p>
                              </div>
                          </body>
                          </html>`

    await sendNotificationEmail(approver.email, htmlBody)
}

export async function pushEmailNotification(ownerId, role) {
    const user = await prisma.user.findUnique({
        where: {
            id: ownerId,
        },
    })

    const approver = await prisma.user.findFirst({
        where: {
            role,
        },
    })

    const htmlBody = `<!DOCTYPE html>
                          <html lang="en">
                          <head>
                              <meta charset="UTF-8">
                              <meta name="viewport" content="width=device-width, initial-scale=1.0">
                              <title>Notification</title>
                          </head>
                          <body style="font-family: Arial, sans-serif;">
                              <div style="background-color: #f4f4f4; padding: 20px;">
                                  <h2 style="color: #333;">Notification</h2>
                                  <p>Pengajuan SKPI</p>
                                  <p>Anda memiliki SKPI Mahaiswa yang harus di proses.</p>
                                  <p>Nama: ${user.name}</p>
                                  <p>NPM: ${user.npm}</p>
                                  <p>Fakultas: ${user.faculty}</p>
                                  <p>Silakan login ke sistem untuk informasi lebih lanjut.</p>
                                  <p>Terima kasih.</p>
                                  <p><i>Admin</i></p>
                              </div>
                          </body>
                          </html>`

    await sendNotificationEmail(approver.email, htmlBody)
}

export async function pushEmailNotificationMahasiswa(ownerId) {
    const user = await prisma.user.findUnique({
        where: {
            id: ownerId,
        },
    })

    const htmlBody = `<!DOCTYPE html>
                          <html lang="en">
                          <head>
                              <meta charset="UTF-8">
                              <meta name="viewport" content="width=device-width, initial-scale=1.0">
                              <title>Notification</title>
                          </head>
                          <body style="font-family: Arial, sans-serif;">
                              <div style="background-color: #f4f4f4; padding: 20px;">
                                  <h2 style="color: #333;">Notification</h2>
                                  <p>SKPI Anda sudah Selesai</p>
                                  <p>Silakan login ke sistem untuk informasi lebih lanjut.</p>
                                  <p>Terima kasih.</p>
                                  <p><i>Admin</i></p>
                              </div>
                          </body>
                          </html>`

    await sendNotificationEmail(user.email, htmlBody)
}
