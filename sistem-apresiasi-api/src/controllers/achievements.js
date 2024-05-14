import { AuthorizationError } from "../exceptions/AuthorizationError.js"
import * as UsersServices from "../services/UsersService.js"
import { AchievementValidator } from "../validations/achievements/index.js"
import * as AchievementsServices from "../services/AchievementsService.js"

export const postAchievementController = async (req, res) => {
    AchievementValidator.validatePostAchievementPayload(req.body)

    const { userId, userRole } = req
    const { activityId, ownerId } = req.body

    if (userRole === "BASIC") {
        throw new AuthorizationError("Users doesnt not have right to access resources")
    }

    await activitiesService.verifyActivityAccess(userId, activityId)
    await AchievementsServices.isActivityExist(activityId)

    const achievement = await AchievementsServices.create({
        activityId,
        ownerId,
    })

    res.status(201)
    res.json({
        status: "success",
        message: "Achievement added",
        data: {
            achievement,
        },
    })
}

export const getAchievementsController = async (req, res) => {
    const { userRole, userId } = req

    if (userRole === "BASIC") {
        throw new AuthorizationError("Users doesnt not have right to access resources")
    }

    if (userRole === "OPERATOR" || userRole === "WD") {
        const users = await UsersServices.getById(userId)
        const achievements = await AchievementsServices.getByFaculty(users.faculty)

        return res.json({
            status: "success",
            data: {
                achievements,
            },
        })
    }

    const achievements = await AchievementsServices.getAll()

    res.json({
        status: "success",
        data: {
            achievements,
        },
    })
}

export const getAchievementByIdController = async (req, res) => {
    const { id } = req.params
    const { userId } = req

    await AchievementsServices.verifyAccess(userId, id)
    const achievement = await AchievementsServices.getById(id)

    res.json({
        status: "success",
        data: {
            achievement,
        },
    })
}
