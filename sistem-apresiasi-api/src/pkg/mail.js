// const nodemailer = require("nodemailer")
import nodemailer from "nodemailer"

// Konfigurasi transporter untuk mengirim email
export const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.SMTP_USER_EMAIL,
        pass: process.env.SMTP_USER_PASSWORD,
    },
})
