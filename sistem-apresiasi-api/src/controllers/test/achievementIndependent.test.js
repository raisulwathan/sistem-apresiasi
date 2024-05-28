import request from "supertest"
import express from "express"
import {
    postAchievementIndependentController,
    getAchievementIndependentController,
    getAchievementIndependentByFacultyController,
    getAchievementIndependentByIdController,
    putAchievementIndependentByIdController,
    deleteAchievementIndependentByIdController,
} from "../achievementIndependent"
import * as AchievementIndependentService from "../../services/AchievementIndependentService"
import * as UsersServices from "../../services/UsersService"
import { tryCatch } from "../../utils/index.js"
import { errorHandler } from "../../middleware/errorHandler.js"

jest.mock("../../services/AchievementIndependentService")
jest.mock("../../services/UsersService")

const app = express()
const setUser = (req, res, next) => {
    req.userId = req.header("userId")
    req.userRole = req.header("userRole")
    next()
}

app.use(express.json())
app.use(setUser)

app.post("/achievements", tryCatch(postAchievementIndependentController))
app.get("/achievements", tryCatch(getAchievementIndependentController))
app.get("/achievements/faculty", tryCatch(getAchievementIndependentByFacultyController))
app.get("/achievements/:id", tryCatch(getAchievementIndependentByIdController))
app.put("/achievements/:id", tryCatch(putAchievementIndependentByIdController))
app.delete("/achievements/:id", tryCatch(deleteAchievementIndependentByIdController))

// Error handler
app.use(errorHandler)

const engineeringPayloadAchievement = {
    name: "Achievement",
    levelActivity: "National",
    participantType: "Individual",
    totalParticipants: 1,
    participants: [{ name: "John Doe", npm: "2008107010038" }],
    faculty: "Engineering",
    major: "Computer Science",
    achievement: "First Place",
    mentor: "Jane Doe",
    year: "2021",
    startDate: "2021-01-01",
    endDate: "2021-01-10",
    fileUrl: ["http://example.com"],
}

const updateEngineeringPayloadAchievement = {
    name: "Updated Achievement",
    levelActivity: "National",
    participantType: "Individual",
    totalParticipants: 1,
    participants: [{ name: "John Doe", npm: "2008107010038" }],
    faculty: "Engineering",
    major: "Computer Science",
    achievement: "First Place",
    mentor: "Jane Doe",
    year: "2021",
    startDate: "2021-01-01",
    endDate: "2021-01-10",
    fileUrl: ["http://example.com"],
}

const sciencePayloadAchievement = {
    name: "Achievement",
    levelActivity: "National",
    participantType: "Individual",
    totalParticipants: 1,
    participants: [{ name: "John Doe", npm: "2008107010038" }],
    faculty: "Science",
    major: "Biology",
    achievement: "First Place",
    mentor: "Jane Doe",
    year: "2021",
    startDate: "2021-01-01",
    endDate: "2021-01-10",
    fileUrl: ["http://example.com"],
}

const updateSciencePayloadAchievement = {
    name: "Updated Achievement",
    levelActivity: "National",
    participantType: "Individual",
    totalParticipants: 1,
    participants: [{ name: "John Doe", npm: "2008107010038" }],
    faculty: "Science",
    major: "Biology",
    achievement: "First Place",
    mentor: "Jane Doe",
    year: "2021",
    startDate: "2021-01-01",
    endDate: "2021-01-10",
    fileUrl: ["http://example.com"],
}

describe("AchievementIndependentController", () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    describe("postAchievementIndependentController", () => {
        it("should create a new achievement wiht role OPERATOR", async () => {
            UsersServices.getById.mockResolvedValue({ faculty: "Engineering" })
            AchievementIndependentService.create.mockResolvedValue({ id: 1 })

            const res = await request(app)
                .post("/achievements")
                .send(engineeringPayloadAchievement)
                .set("userId", 1)
                .set("userRole", "OPERATOR")

            expect(res.statusCode).toBe(201)
            expect(res.body).toEqual({
                status: "success",
                message: "independent achievement added",
                data: { achievementId: 1 },
            })
        })

        it("should create a new achievement wiht role ADMIN", async () => {
            UsersServices.getById.mockResolvedValue({ faculty: "" })
            AchievementIndependentService.create.mockResolvedValue({ id: 1 })

            const res = await request(app)
                .post("/achievements")
                .send(engineeringPayloadAchievement)
                .set("userId", 1)
                .set("userRole", "ADMIN")

            expect(res.statusCode).toBe(201)
            expect(res.body).toEqual({
                status: "success",
                message: "independent achievement added",
                data: { achievementId: 1 },
            })
        })

        it("should throw an error if user does not belong to the same faculty", async () => {
            UsersServices.getById.mockResolvedValue({ faculty: "Engineering" })

            const res = await request(app)
                .post("/achievements")
                .send(sciencePayloadAchievement)
                .set("userId", 1)
                .set("userRole", "OPERATOR")

            expect(res.statusCode).toBe(400)
            expect(res.body).toEqual({
                status: "fail",
                message: "cannot added achievement to other faculty",
            })
        })

        it("should throw 403 when role neither OPERATOR or ADMIN", async () => {
            const res = await request(app)
                .post("/achievements")
                .send(sciencePayloadAchievement)
                .set("userId", 1)
                .set("userRole", "BASIC")

            expect(res.statusCode).toBe(403)
            expect(res.body).toEqual({
                status: "fail",
                message: "cannot access this resources",
            })
        })
    })

    describe("getAchievementIndependentController", () => {
        it("should get all achievements for admin or WR", async () => {
            AchievementIndependentService.getAll.mockResolvedValue([{ id: 1 }])

            const res = await request(app)
                .get("/achievements")
                .set("userId", 1)
                .set("userRole", "ADMIN")

            expect(res.statusCode).toBe(200)
            expect(res.body).toEqual({
                status: "success",
                data: [{ id: 1 }],
            })
        })

        it("should throw an error if user is not admin or WR", async () => {
            const res = await request(app)
                .get("/achievements")
                .set("userId", 1)
                .set("userRole", "OPERATOR")

            expect(res.statusCode).toBe(403) // Assuming AuthorizationError is mapped to 403 status code
            expect(res.body).toEqual({
                status: "fail",
                message: "Doesnt have right to access this resources",
            })
        })
    })

    describe("getAchievementIndependentByFacultyController", () => {
        it("should get all achievements for user's faculty", async () => {
            UsersServices.getById.mockResolvedValue({ faculty: "Engineering" })
            AchievementIndependentService.getByFaculty.mockResolvedValue([{ id: 1 }])

            const res = await request(app)
                .get("/achievements/faculty")
                .set("userId", 1)
                .set("userRole", "OPERATOR")

            expect(res.statusCode).toBe(200)
            expect(res.body).toEqual({
                status: "success",
                data: [{ id: 1 }],
            })
        })
    })

    describe("getAchievementIndependentByIdController", () => {
        it("should get achievement by id for operator of the same faculty", async () => {
            UsersServices.getById.mockResolvedValue({ faculty: "Engineering" })
            AchievementIndependentService.getById.mockResolvedValue({
                id: 1,
                faculty: "Engineering",
            })

            const res = await request(app)
                .get("/achievements/1")
                .set("userId", 1)
                .set("userRole", "OPERATOR")

            expect(res.statusCode).toBe(200)
            expect(res.body).toEqual({
                status: "success",
                data: { id: 1, faculty: "Engineering" },
            })
        })

        it("should get achievement by id for ADMIN", async () => {
            UsersServices.getById.mockResolvedValue({ faculty: "" })
            AchievementIndependentService.getById.mockResolvedValue({
                id: 1,
                faculty: "Engineering",
            })

            const res = await request(app)
                .get("/achievements/1")
                .set("userId", 1)
                .set("userRole", "ADMIN")

            expect(res.statusCode).toBe(200)
            expect(res.body).toEqual({
                status: "success",
                data: { id: 1, faculty: "Engineering" },
            })
        })

        it("should throw an error if user is an operator of a different faculty", async () => {
            UsersServices.getById.mockResolvedValue({ faculty: "Engineering" })
            AchievementIndependentService.getById.mockResolvedValue({ id: 1, faculty: "Science" })

            const res = await request(app)
                .get("/achievements/1")
                .set("userId", 1)
                .set("userRole", "OPERATOR")

            expect(res.statusCode).toBe(403) // Assuming AuthorizationError is mapped to 403 status code
            expect(res.body).toEqual({
                status: "fail",
                message: "Doesnt have right to access this resources",
            })
        })

        it("should return 403 when role is BASIC", async () => {
            const res = await request(app)
                .get("/achievements/1")
                .set("userId", 1)
                .set("userRole", "BASIC")

            expect(res.statusCode).toBe(403) // Assuming AuthorizationError is mapped to 403 status code
            expect(res.body).toEqual({
                status: "fail",
                message: "cannot access this resources",
            })
        })
    })

    describe("putAchievementIndependentByIdController", () => {
        it("should update achievement by id for operator of the same faculty", async () => {
            UsersServices.getById.mockResolvedValue({ faculty: "Engineering" })
            AchievementIndependentService.getById.mockResolvedValue({
                id: 1,
                faculty: "Engineering",
            })
            AchievementIndependentService.update.mockResolvedValue({ id: 1 })

            const res = await request(app)
                .put("/achievements/1")
                .send(updateEngineeringPayloadAchievement)
                .set("userId", 1)
                .set("userRole", "OPERATOR")

            expect(res.statusCode).toBe(200)
            expect(res.body).toEqual({
                status: "success",
                message: "Achievement updated",
                data: { achievementId: 1 },
            })
        })

        it("should update achievement by id for ADMIN", async () => {
            UsersServices.getById.mockResolvedValue({ faculty: "" })
            AchievementIndependentService.getById.mockResolvedValue({
                id: 1,
                faculty: "Engineering",
            })
            AchievementIndependentService.update.mockResolvedValue({ id: 1 })

            const res = await request(app)
                .put("/achievements/1")
                .send(updateEngineeringPayloadAchievement)
                .set("userId", 1)
                .set("userRole", "ADMIN")

            expect(res.statusCode).toBe(200)
            expect(res.body).toEqual({
                status: "success",
                message: "Achievement updated",
                data: { achievementId: 1 },
            })
        })

        it("should throw an error if user is an operator of a different faculty", async () => {
            UsersServices.getById.mockResolvedValue({ faculty: "Engineering" })
            AchievementIndependentService.getById.mockResolvedValue({ id: 1, faculty: "Science" })

            const res = await request(app)
                .put("/achievements/1")
                .send(updateSciencePayloadAchievement)
                .set("userId", 1)
                .set("userRole", "OPERATOR")

            expect(res.body).toEqual({
                status: "fail",
                message: "Doesnt have right to access this resources",
            })
            expect(res.statusCode).toBe(403) // Assuming AuthorizationError is mapped to 403 status code
        })

        it("should throw 403 when role is neither OPERATOR or ADMIN", async () => {
            const res = await request(app)
                .put("/achievements/1")
                .send(updateSciencePayloadAchievement)
                .set("userId", 1)
                .set("userRole", "WD")

            expect(res.body).toEqual({
                status: "fail",
                message: "cannot access this resources",
            })
            expect(res.statusCode).toBe(403) // Assuming AuthorizationError is mapped to 403 status code
        })
    })

    describe("deleteAchievementIndependentByIdController", () => {
        it("should delete achievement by id for operator of the same faculty", async () => {
            UsersServices.getById.mockResolvedValue({ faculty: "Engineering" })
            AchievementIndependentService.getById.mockResolvedValue({
                id: 1,
                faculty: "Engineering",
            })

            const res = await request(app)
                .delete("/achievements/1")
                .set("userId", 1)
                .set("userRole", "OPERATOR")

            expect(res.statusCode).toBe(200)
            expect(res.body).toEqual({
                status: "success",
                message: "Achievement deleted",
            })
        })

        it("should delete achievement by id for ADMIN", async () => {
            UsersServices.getById.mockResolvedValue({ faculty: "" })
            AchievementIndependentService.getById.mockResolvedValue({
                id: 1,
                faculty: "Engineering",
            })

            const res = await request(app)
                .delete("/achievements/1")
                .set("userId", 1)
                .set("userRole", "ADMIN")

            expect(res.statusCode).toBe(200)
            expect(res.body).toEqual({
                status: "success",
                message: "Achievement deleted",
            })
        })

        it("should throw an error if user is an operator of a different faculty", async () => {
            UsersServices.getById.mockResolvedValue({ faculty: "Engineering" })
            AchievementIndependentService.getById.mockResolvedValue({ id: 1, faculty: "Science" })

            const res = await request(app)
                .delete("/achievements/1")
                .set("userId", 1)
                .set("userRole", "OPERATOR")

            expect(res.statusCode).toBe(403) // Assuming AuthorizationError is mapped to 403 status code
            expect(res.body).toEqual({
                status: "fail",
                message: "Doesnt have right to access this resources",
            })
        })

        it("should return 403 when role is neiher OPERATOR or ADMIN", async () => {
            const res = await request(app)
                .delete("/achievements/1")
                .set("userId", 1)
                .set("userRole", "WR")

            expect(res.statusCode).toBe(403) // Assuming AuthorizationError is mapped to 403 status code
            expect(res.body).toEqual({
                status: "fail",
                message: "cannot access this resources",
            })
        })
    })
})
