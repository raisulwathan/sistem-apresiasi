import express from "express"
import {
    getExportAchievementNonCompetitionByCategoryController,
    getExportAchievementIndependentsController,
} from "../exports.js"
import { errorHandler } from "../../middleware/errorHandler.js"
import request from "supertest"
import * as AchievementNonCompetitionService from "../../services/AchievementNonCompetitionService.js"
import * as AchievementIndependentService from "../../services/AchievementIndependentService.js"
import * as UsersService from "../../services/UsersService.js"
import { tryCatch } from "../../utils/index.js"

const setUser = (req, res, next) => {
    req.userId = req.header("userId")
    req.userRole = req.header("userRole")
    next()
}

const app = express()
app.use(express.json())
app.use(setUser)

app.get(
    "/export/non-competitions/:category",
    tryCatch(getExportAchievementNonCompetitionByCategoryController)
)
app.get("/export/independents", tryCatch(getExportAchievementIndependentsController))

app.use(errorHandler)

jest.mock("../../services/AchievementNonCompetitionService")
jest.mock("../../services/UsersService")
jest.mock("../../services/AchievementIndependentService")

describe("getExportAchievementIndependentsController", () => {
    beforeEach(() => {
        UsersService.getById.mockClear()
        AchievementIndependentService.getByFaculty.mockClear()
        AchievementIndependentService.getAll.mockClear()
    })

    it("should throw AuthorizationError if userRole is not ADMIN or OPERATOR", async () => {
        await request(app)
            .get("/export/independents")
            .set("userId", "1")
            .set("userRole", "BASIC")
            .expect(403) // Assuming 403 for AuthorizationError
            .then((response) => {
                expect(response.body.status).toBe("fail")
                expect(response.body.message).toBe(
                    "User doenst have right to access this resources"
                )
            })
    })

    it("should export achievements for OPERATOR role", async () => {
        const mockUser = { id: 1, faculty: "Engineering" }
        UsersService.getById.mockResolvedValue(mockUser)

        const mockAchievements = [
            {
                id: 1,
                name: "Event 1",
                level_activity: "National",
                participant_type: "Individual",
                participants: "John Doe",
                faculty: "Engineering",
                major: "Computer Science",
                achievement: "First Place",
                mentor: "Jane Smith",
                year: 2022,
                start_date: "2022-01-01",
                end_date: "2022-01-10",
                file_url: "http://example.com/file1",
            },
        ]
        AchievementIndependentService.getByFaculty.mockResolvedValue(mockAchievements)

        await request(app)
            .get("/export/independents")
            .set("userId", "1")
            .set("userRole", "OPERATOR")
            .expect(200)
            .then((response) => {
                expect(UsersService.getById).toHaveBeenCalledWith("1")
                expect(AchievementIndependentService.getByFaculty).toHaveBeenCalledWith(
                    mockUser.faculty
                )
                expect(response.headers["content-type"]).toBe(
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                )
                expect(response.headers["content-disposition"]).toBe(
                    "attachment; filename=mandiri_export.xlsx"
                )
            })
    })

    it("should export achievements for ADMIN role", async () => {
        const mockAchievements = [
            {
                id: 1,
                name: "Event 1",
                level_activity: "National",
                participant_type: "Individual",
                participants: "John Doe",
                faculty: "Engineering",
                major: "Computer Science",
                achievement: "First Place",
                mentor: "Jane Smith",
                year: 2022,
                start_date: "2022-01-01",
                end_date: "2022-01-10",
                file_url: "http://example.com/file1",
            },
        ]
        AchievementIndependentService.getAll.mockResolvedValue(mockAchievements)

        await request(app)
            .get("/export/independents")
            .set("userId", "1")
            .set("userRole", "ADMIN")
            .expect(200)
            .then((response) => {
                expect(AchievementIndependentService.getAll).toHaveBeenCalled()
                expect(response.headers["content-type"]).toBe(
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                )
                expect(response.headers["content-disposition"]).toBe(
                    "attachment; filename=mandiri_export.xlsx"
                )
            })
    })
})

describe("getExportAchievementNonCompetitionByCategoryController", () => {
    beforeEach(() => {
        UsersService.getById.mockClear()
        AchievementNonCompetitionService.getByFaculty.mockClear()
        AchievementNonCompetitionService.getAll.mockClear()
    })

    it("should throw AuthorizationError if userRole is not ADMIN or OPERATOR", async () => {
        const token = "some-invalid-token"

        await request(app)
            .get("/export/non-competitions/wirausaha")
            .set("userId", "1")
            .set("userRole", "BASIC")
            .expect(403) // Assuming 403 for AuthorizationError
            .then((response) => {
                expect(response.body.status).toBe("fail")
                expect(response.body.message).toBe(
                    "User doenst have right to access this resources"
                )
            })
    })

    it("should export achievements for OPERATOR role", async () => {
        const token = "valid-token"
        const mockUser = { id: 1, faculty: "Engineering" }
        UsersService.getById.mockResolvedValue(mockUser)

        const mockAchievements = [
            {
                id: 1,
                name: "Event 1",
                category: "Mahasiswa Berwirausaha",
                faculty: "Engineering",
                activity: "Activity 1",
                number_of_students: 10,
                year: 2022,
                file_url: "http://example.com/file1",
            },
        ]
        AchievementNonCompetitionService.getByFaculty.mockResolvedValue(mockAchievements)

        await request(app)
            .get("/export/non-competitions/wirausaha")
            .set("userId", "1")
            .set("userRole", "OPERATOR")
            .expect(200)
            .then((response) => {
                expect(UsersService.getById).toHaveBeenCalledWith("1")
                expect(AchievementNonCompetitionService.getByFaculty).toHaveBeenCalledWith(
                    mockUser.faculty
                )
                expect(response.headers["content-type"]).toBe(
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                )
                expect(response.headers["content-disposition"]).toBe(
                    "attachment; filename=non-competition_Mahasiswa Berwirausaha_export.xlsx"
                )
            })
    })

    it("should export achievements for ADMIN role", async () => {
        const token = "valid-token"

        const mockAchievements = [
            {
                id: 1,
                name: "Event 1",
                category: "Mahasiswa Berwirausaha",
                faculty: "Engineering",
                activity: "Activity 1",
                number_of_students: 10,
                year: 2022,
                file_url: "http://example.com/file1",
            },
        ]
        AchievementNonCompetitionService.getAll.mockResolvedValue(mockAchievements)

        await request(app)
            .get("/export/non-competitions/wirausaha")
            .set("userId", "1")
            .set("userRole", "ADMIN")
            .expect(200)
            .then((response) => {
                expect(AchievementNonCompetitionService.getAll).toHaveBeenCalled()
                expect(response.headers["content-type"]).toBe(
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                )
                expect(response.headers["content-disposition"]).toBe(
                    "attachment; filename=non-competition_Mahasiswa Berwirausaha_export.xlsx"
                )
            })
    })
})
