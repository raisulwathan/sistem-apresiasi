import { AuthorizationError } from "../exceptions/AuthorizationError.js"
import { InvariantError } from "../exceptions/InvariantError.js"
import * as ActivitiesService from "../services/ActivitiesService.js"
import * as SkpiService from "../services/SkpiService.js"
import * as UsersServices from "../services/UsersService.js"

export const postSkpiController = async (req, res) => {
    const userId = req.userId
    const activityPoints = await ActivitiesService.getTotalPoint(userId)

    const mandatoryPoints = activityPoints["Kegiatan Wajib"]
    const organizationPoints =
        activityPoints["Bidang Organisasi Kemahasiswaan dan Kepemimpinan"] || 0
    const talentPoints =
        activityPoints["Bidang Minat, Bakat, Mental Spritiual Kebangsaan dan Kewirausahaan"] || 0
    const scientificPoints =
        activityPoints["Bidang Penalaran dan Keilmuan, Penyelarasan dan Pengembangan Karir"] || 0
    const charityPoints = activityPoints["Bidang Kepedulian Sosial"] || 0
    const otherPoints = activityPoints["Bidang Lainnya"] || 0

    await SkpiService.isExist(userId)
    const newSkpi = await SkpiService.create({
        mandatoryPoints,
        organizationPoints,
        scientificPoints,
        talentPoints,
        charityPoints,
        otherPoints,
        owner: userId,
    })

    res.status(201)
    res.json({
        status: "success",
        message: "SKPI added",
        data: {
            skpiId: newSkpi.id,
            userId: newSkpi.ownerId,
        },
    })
}

export const getSkpiController = async (req, res) => {
    const { userId, userRole } = req

    if (userRole === "WD" || userRole === "OPERATOR") {
        const users = await UsersServices.getById(userId)
        const skpi = await SkpiService.getByFaculty(users.faculty)

        return res.json({
            status: "success",
            data: {
                skpi,
            },
        })
    }

    if (userRole === "WR" || userRole === "ADMIN") {
        const skpi = await SkpiService.getAll()

        return res.json({
            status: "success",
            data: {
                skpi,
            },
        })
    }

    const skpi = await SkpiService.getByOwnerId(userId)

    res.json({
        status: "success",
        data: {
            ...skpi,
        },
    })
}

export const getSkpiByIdController = async (req, res) => {
    const { id } = req.params

    const skpi = await SkpiService.getById(id)

    res.json({
        status: "success",
        data: {
            ...skpi,
        },
    })
}

export const putStatusSkpiByIdController = async (req, res) => {
    const { id } = req.params
    const { userRole } = req
    let status = String(req.query.status)

    const skpi = await SkpiService.getById(id)

    if (status !== "rejected") {
        switch (userRole) {
            case "OPERATOR":
                if (skpi.status !== "pending") {
                    throw new InvariantError("SKPI sudah divalidasi atau sudah selesai")
                }
                status = "accepted by OPERATOR"
                break

            case "WD":
                if (skpi.status !== "accepted by OPERATOR") {
                    throw new InvariantError("SKPI sudah divalidasi atau sudah selesai")
                }
                status = "accepted by WD"
                break

            case "ADMIN":
                if (skpi.status !== "accepted by WD") {
                    throw new InvariantError("SKPI sudah divalidasi atau sudah selesai")
                }
                status = "accepted by ADMIN"
                break

            case "WR":
                if (skpi.status !== "accepted by ADMIN") {
                    throw new InvariantError("SKPI sudah divalidasi atau sudah selesai")
                }
                status = "completed"
                break

            default:
                throw new AuthorizationError("tidak berhak mengakses resource ini")
        }
    }

    await SkpiService.processSkpi(id, status)

    res.json({
        status: "success",
        message: "skpi berhasil divalidasi",
    })
}
