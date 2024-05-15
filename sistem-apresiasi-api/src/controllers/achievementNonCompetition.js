import { AuthorizationError } from "../exceptions/AuthorizationError.js"
import { InvariantError } from "../exceptions/InvariantError.js"
import * as UsersServices from "../services/UsersService.js"
import { AchievementValidator } from "../validations/achievements/index.js"
import * as AchievementNonCompetitionService from "../services/AchievementNonCompetitionService.js"

export const postAchievementNonCompetitionController = async (req, res) => {
    AchievementValidator.validatePostAchievementNonCompetitionPayload(req.body)
    const { name, category, faculty, activity, levelActivity, numberOfStudents, year, fileUrl } =
        req.body

    const users = await UsersServices.getById(req.userId)

    if (req.userRole === "OPERATOR") {
        if (faculty !== users.faculty) {
            throw new InvariantError("cannot added achievement to other faculty")
        }
    }

    const newAchievement = await AchievementNonCompetitionService.create({
        name,
        category,
        faculty,
        activity,
        levelActivity,
        numberOfStudents,
        year,
        fileUrl,
    })

    res.status(201).json({
        status: "success",
        message: "achievement added",
        data: {
            achievementId: newAchievement.id,
        },
    })
}

export const getAchievementNonCompetitionsController = async (req, res) => {
    if (req.userRole !== "ADMIN") {
        throw new AuthorizationError("Doesnt have right to access this resources")
    }

    const achivements = await AchievementNonCompetitionService.getAll()

    res.json({
        status: "success",
        data: achivements,
    })
}

export const getAchievementNonCompetitionsByFacultyController = async (req, res) => {
    const users = await UsersServices.getById(req.userId)

    const achievements = await AchievementNonCompetitionService.getByFaculty(users.faculty)

    res.json({
        status: "success",
        data: achievements,
    })
}

export const getAchievementNonCompetitionByIdController = async (req, res) => {
    const { id } = req.params

    const achievement = await AchievementNonCompetitionService.getById(id)
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

export const putAchievementNonCompetitionByIdController = async (req, res) => {
    AchievementValidator.validatePutAchievementNonCompetitionPayload
    const { id } = req.params
    const { name, category, faculty, activity, levelActivity, numberOfStudents, year, fileUrl } =
        req.body

    const achievement = await AchievementNonCompetitionService.getById(id)
    const users = await UsersServices.getById(req.userId)

    if (req.userRole === "OPERATOR") {
        if (users.faculty !== achievement.faculty) {
            throw new AuthorizationError("Doesnt have right to access this resources")
        }
    }

    const updatedAchievement = await AchievementNonCompetitionService.update(id, {
        name,
        category,
        faculty,
        activity,
        levelActivity,
        numberOfStudents,
        year,
        fileUrl,
    })

    res.json({
        status: "success",
        message: "Achievement is updated",
        data: {
            achievementId: updatedAchievement.id,
        },
    })
}

export const deleteAchievementNonCompetitionByIdController = async (req, res) => {
    const { id } = req.params

    const achievement = await AchievementNonCompetitionService.getById(id)
    const users = await UsersServices.getById(req.userId)

    if (req.userRole === "OPERATOR") {
        if (users.faculty !== achievement.faculty) {
            throw new AuthorizationError("Doesnt have right to access this resources")
        }
    }

    await AchievementNonCompetitionService.deleteById(id)

    res.json({
        status: "success",
        message: "Achievement deleted",
    })
}
