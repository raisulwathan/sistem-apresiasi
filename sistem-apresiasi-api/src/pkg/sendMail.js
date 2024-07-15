import { transporter } from "./mail.js"

export async function sendNotificationEmail(email, htmlBody) {
    try {
        // Konfigurasi email yang akan dikirim
        const mailOptions = {
            from: process.env.SMTP_USER_EMAIL,
            to: email,
            subject: "[Notifications] - No Reply",
            html: htmlBody,
        }

        // Kirim email
        await transporter.sendMail(mailOptions)

        console.info("Email Sent!!!")
    } catch (error) {
        // console.error("Error sending email:", error)
        throw error
    }
}
