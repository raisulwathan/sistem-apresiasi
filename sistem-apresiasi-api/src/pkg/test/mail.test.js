import { transporter } from "../mail"
import { sendNotificationEmail } from "../sendMail"

jest.mock("nodemailer", () => ({
    createTransport: jest.fn(() => ({
        sendMail: jest.fn(),
    })),
}))

jest.mock("../mail")

describe("sendNotificationEmail", () => {
    it("should send an email with the correct options", async () => {
        const mockSendMail = transporter.sendMail
        mockSendMail.mockResolvedValue("Email Sent")

        const email = "test@example.com"
        const htmlBody = "<h1>Hello</h1>"

        await sendNotificationEmail(email, htmlBody)

        expect(mockSendMail).toHaveBeenCalledWith({
            from: process.env.SMTP_USER_EMAIL,
            to: email,
            subject: "[Notifications] - No Reply",
            html: htmlBody,
        })
    })

    it("should throw an error if sending email fails", async () => {
        const mockSendMail = transporter.sendMail
        const errorMessage = "Error sending email"
        mockSendMail.mockRejectedValue(new Error(errorMessage))

        const email = "test@example.com"
        const htmlBody = "<h1>Hello</h1>"

        await expect(sendNotificationEmail(email, htmlBody)).rejects.toThrow(errorMessage)

        expect(mockSendMail).toHaveBeenCalledWith({
            from: process.env.SMTP_USER_EMAIL,
            to: email,
            subject: "[Notifications] - No Reply",
            html: htmlBody,
        })
    })
})
