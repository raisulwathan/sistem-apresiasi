import { prisma } from "../utils/prisma.utils"
import { DateTime } from "luxon"

export async function generateOtp() {
    let otpExist = true
    let otpCode = ""

    while (otpExist) {
        const newCode = Math.floor(10000 + Math.random() * 900000).toString()

        const codeExist = await prisma.otpCode.findUnique({
            where: {
                code: newCode,
            },
        })

        if (!codeExist) {
            otpCode = newCode
            otpExist = false
        }
    }

    return otpCode
}
