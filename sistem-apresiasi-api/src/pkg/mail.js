// const nodemailer = require("nodemailer")
import nodemailer from "nodemailer"

// Konfigurasi transporter untuk mengirim email
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.SMTP_USER_EMAIL,
        pass: process.env.SMTP_USER_PASSWORD,
    },
})

export async function sendNotificationEmail(email, htmlBody) {
    try {
        // Konfigurasi email yang akan dikirim
        const mailOptions = {
            from: process.env.SMTP_USER_EMAIL,
            to: email,
            subject: "[Notifications] - No Replay",
            html: htmlBody,
        }

        // Kirim email
        await transporter.sendMail(mailOptions)

        console.info("Email Sent!!!")
    } catch (error) {
        console.error("Error sending email:", error)
        throw error
    }
}
