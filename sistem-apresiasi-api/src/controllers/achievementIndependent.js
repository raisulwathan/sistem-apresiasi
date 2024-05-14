import { AuthorizationError } from "../exceptions/AuthorizationError.js"
import { InvariantError } from "../exceptions/InvariantError.js"
import * as AchievementIndependentService from "../services/AchievementIndependentService.js"
import { AchievementValidator } from "../validations/achievements/index.js"
import * as UsersServices from "../services/UsersService.js"

export const postAchievementIndependentController = async (req, res) => {
    AchievementValidator.validatePostAchievementIndependentPayload(req.body)
    const {
        name,
        levelActivity,
        participantType,
        totalParticipants,
        participants,
        faculty,
        major,
        achievement,
        mentor,
        year,
        startDate,
        endDate,
        fileUrl,
    } = req.body

    const users = await UsersServices.getById(req.userId)

    if (req.userRole === "OPERATOR") {
        if (faculty !== users.faculty) {
            throw new InvariantError("cannot added achievement to other faculty")
        }
    }

    const newAchievement = await AchievementIndependentService.create({
        name,
        levelActivity,
        participantType,
        totalParticipants,
        participants,
        faculty,
        major,
        achievement,
        mentor,
        year,
        startDate,
        endDate,
        fileUrl,
    })
    res.status(201).json({
        status: "success",
        message: "independent achievement added",
        data: {
            achievementId: newAchievement.id,
        },
    })
}

export const getAchievementIndependentController = async (req, res) => {
    if (req.userRole !== "ADMIN" && req.userRole !== "WR") {
        throw new AuthorizationError("Doesnt have right to access this resources")
    }
    const achievements = await AchievementIndependentService.getAll()

    res.json({
        status: "success",
        data: achievements,
    })
}

export const getAchievementIndependentByFacultyController = async (req, res) => {
    const users = await UsersServices.getById(req.userId)
    const achievements = await AchievementIndependentService.getByFaculty(users.faculty)

    res.json({
        status: "success",
        data: achievements,
    })
}

export const getAchievementIndependentByIdController = async (req, res) => {
    const { id } = req.params

    const achievement = await AchievementIndependentService.getById(id)

    const users = await UsersServices.getById(req.userId)

    if (req.userRole === "OPERATOR") {
        if (users.faculty !== achievement.faculty) {
            throw new AuthorizationError("Doesnt have right to access this resources")
        }
    }

    res.json({
        status: "success",
        data: achievement,
    })
}

export const putAchievementIndependentByIdController = async (req, res) => {
    AchievementValidator.validatePutAchievementIndependentPayload(req.body)
    const { id } = req.params
    const {
        name,
        levelActivity,
        participantType,
        totalParticipants,
        participants,
        faculty,
        major,
        achievement,
        mentor,
        year,
        startDate,
        endDate,
        fileUrl,
    } = req.body

    const targetAchievement = await AchievementIndependentService.getById(id)

    const users = await UsersServices.getById(req.userId)

    if (req.userRole === "OPERATOR") {
        if (users.faculty !== targetAchievement.faculty) {
            throw new AuthorizationError("Doesnt have right to access this resources")
        }
    }

    const upadatedAchievement = await AchievementIndependentService.update(id, {
        name,
        levelActivity,
        participantType,
        totalParticipants,
        participants,
        faculty,
        major,
        achievement,
        mentor,
        year,
        startDate,
        endDate,
        fileUrl,
    })

    res.json({
        status: "success",
        message: "Achievement updated",
        data: {
            achievementId: upadatedAchievement.id,
        },
    })
}

export const deleteAchievementIndependentByIdController = async (req, res) => {
    const { id } = req.params

    const targetAchievement = await AchievementIndependentService.getById(id)

    const users = await UsersServices.getById(req.userId)

    if (req.userRole === "OPERATOR") {
        if (users.faculty !== targetAchievement.faculty) {
            throw new AuthorizationError("Doesnt have right to access this resources")
        }
    }

    await AchievementIndependentService.deleteById(id)

    res.json({
        status: "success",
        message: "Achievement deleted",
    })
}
