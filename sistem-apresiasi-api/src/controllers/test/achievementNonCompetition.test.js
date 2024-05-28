import request from "supertest"
import express from "express"
import * as AchievementNonCompetitionService from "../../services/AchievementNonCompetitionService"
import * as UsersServices from "../../services/UsersService"
import * as AchievementNonCompetitionController from "../achievementNonCompetition"
import { errorHandler } from "../../middleware/errorHandler"
import { tryCatch } from "../../utils"

const app = express()

const setUser = (req, res, next) => {
    req.userId = req.header("userId")
    req.userRole = req.header("userRole")
    next()
}

jest.mock("../../services/AchievementNonCompetitionService")
jest.mock("../../services/UsersService")

app.use(express.json())
app.use(setUser)

app.post(
    "/achievements/non-competition",
    tryCatch(AchievementNonCompetitionController.postAchievementNonCompetitionController)
)
app.get(
    "/achievements/non-competition",
    tryCatch(AchievementNonCompetitionController.getAchievementNonCompetitionsController)
)
app.get(
    "/achievements/non-competition/faculty",
    tryCatch(AchievementNonCompetitionController.getAchievementNonCompetitionsByFacultyController)
)
app.get(
    "/achievements/non-competition/:id",
    tryCatch(AchievementNonCompetitionController.getAchievementNonCompetitionByIdController)
)
app.put(
    "/achievements/non-competition/:id",
    tryCatch(AchievementNonCompetitionController.putAchievementNonCompetitionByIdController)
)
app.delete(
    "/achievements/non-competition/:id",
    tryCatch(AchievementNonCompetitionController.deleteAchievementNonCompetitionByIdController)
)

// Error handler
app.use(errorHandler)

describe("AchievementNonCompetitionController", () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    describe("postAchievementNonCompetitionController", () => {
        it("should create a new non-competition achievement by OPERATOR", async () => {
            UsersServices.getById.mockResolvedValue({ faculty: "Engineering" })
            AchievementNonCompetitionService.create.mockResolvedValue({ id: 1 })

            const res = await request(app)
                .post("/achievements/non-competition")
                .send({
                    name: "Achievement",
                    category: "Mahasiswa Berwirausaha",
                    faculty: "Engineering",
                    activity: "Activity",
                    levelActivity: "National",
                    numberOfStudents: 10,
                    year: "2021",
                    fileUrl: ["http://example.com"],
                })
                .set("userId", "1")
                .set("userRole", "OPERATOR")

            expect(res.statusCode).toBe(201)
            expect(res.body).toEqual({
                status: "success",
                message: "achievement added",
                data: { achievementId: 1 },
            })
        })

        it("should create a new non-competition achievement by ADMIN", async () => {
            UsersServices.getById.mockResolvedValue({ faculty: "" })
            AchievementNonCompetitionService.create.mockResolvedValue({ id: 1 })

            const res = await request(app)
                .post("/achievements/non-competition")
                .send({
                    name: "Achievement",
                    category: "Mahasiswa Berwirausaha",
                    faculty: "Engineering",
                    activity: "Activity",
                    levelActivity: "National",
                    numberOfStudents: 10,
                    year: "2021",
                    fileUrl: ["http://example.com"],
                })
                .set("userId", "1")
                .set("userRole", "ADMIN")

            expect(res.statusCode).toBe(201)
            expect(res.body).toEqual({
                status: "success",
                message: "achievement added",
                data: { achievementId: 1 },
            })
        })

        it("should throw an error if user does not belong to the same faculty", async () => {
            UsersServices.getById.mockResolvedValue({ faculty: "Engineering" })

            const res = await request(app)
                .post("/achievements/non-competition")
                .send({
                    name: "Achievement",
                    category: "Mahasiswa Berwirausaha",
                    faculty: "Science",
                    activity: "Activity",
                    levelActivity: "National",
                    numberOfStudents: 10,
                    year: "2021",
                    fileUrl: ["http://example.com"],
                })
                .set("userId", "1")
                .set("userRole", "OPERATOR")

            expect(res.statusCode).toBe(400) // Assuming InvariantError is mapped to 400 status code
            expect(res.body).toEqual({
                status: "fail",
                message: "cannot added achievement to other faculty",
            })
        })

        it("should 403 when role is neither OPERATOR or ADMIN", async () => {
            const res = await request(app)
                .post("/achievements/non-competition")
                .send({
                    name: "Achievement",
                    category: "Mahasiswa Berwirausaha",
                    faculty: "Science",
                    activity: "Activity",
                    levelActivity: "National",
                    numberOfStudents: 10,
                    year: "2021",
                    fileUrl: ["http://example.com"],
                })
                .set("userId", "1")
                .set("userRole", "WD")

            expect(res.statusCode).toBe(403) // Assuming InvariantError is mapped to 400 status code
            expect(res.body).toEqual({
                status: "fail",
                message: "cannot access this resources",
            })
        })
    })

    describe("getAchievementNonCompetitionsController", () => {
        it("should get all non-competition achievements for ADMIN role", async () => {
            AchievementNonCompetitionService.getAll.mockResolvedValue([
                { id: 1, name: "Achievement 1" },
                { id: 2, name: "Achievement 2" },
            ])

            const res = await request(app)
                .get("/achievements/non-competition")
                .set("userId", "1")
                .set("userRole", "ADMIN")

            expect(res.statusCode).toBe(200)
            expect(res.body).toEqual({
                status: "success",
                data: [
                    { id: 1, name: "Achievement 1" },
                    { id: 2, name: "Achievement 2" },
                ],
            })
        })

        it("should throw an error if user does not have access rights", async () => {
            const res = await request(app)
                .get("/achievements/non-competition")
                .set("userId", "1")
                .set("userRole", "OPERATOR")

            expect(res.statusCode).toBe(403) // Assuming AuthorizationError is mapped to 403 status code
            expect(res.body).toEqual({
                status: "fail",
                message: "Doesnt have right to access this resources",
            })
        })
    })

    describe("getAchievementNonCompetitionsByFacultyController", () => {
        it("should get non-competition achievements by faculty", async () => {
            UsersServices.getById.mockResolvedValue({ faculty: "Engineering" })
            AchievementNonCompetitionService.getByFaculty.mockResolvedValue([
                { id: 1, name: "Achievement 1", faculty: "Engineering" },
                { id: 2, name: "Achievement 2", faculty: "Engineering" },
            ])

            const res = await request(app)
                .get("/achievements/non-competition/faculty")
                .set("userId", "1")
                .set("userRole", "OPERATOR")

            expect(res.statusCode).toBe(200)
            expect(res.body).toEqual({
                status: "success",
                data: [
                    { id: 1, name: "Achievement 1", faculty: "Engineering" },
                    { id: 2, name: "Achievement 2", faculty: "Engineering" },
                ],
            })
        })
    })

    describe("getAchievementNonCompetitionByIdController", () => {
        it("should get non-competition achievement by id", async () => {
            AchievementNonCompetitionService.getById.mockResolvedValue({
                id: 1,
                name: "Achievement 1",
                faculty: "Engineering",
            })
            UsersServices.getById.mockResolvedValue({ faculty: "Engineering" })

            const res = await request(app)
                .get("/achievements/non-competition/1")
                .set("userId", "1")
                .set("userRole", "OPERATOR")

            expect(res.statusCode).toBe(200)
            expect(res.body).toEqual({
                status: "success",
                data: { id: 1, name: "Achievement 1", faculty: "Engineering" },
            })
        })

        it("should get non-competition achievement by id with ADMIN", async () => {
            AchievementNonCompetitionService.getById.mockResolvedValue({
                id: 1,
                name: "Achievement 1",
                faculty: "Engineering",
            })
            UsersServices.getById.mockResolvedValue({ faculty: "" })

            const res = await request(app)
                .get("/achievements/non-competition/1")
                .set("userId", "1")
                .set("userRole", "ADMIN")

            expect(res.statusCode).toBe(200)
            expect(res.body).toEqual({
                status: "success",
                data: { id: 1, name: "Achievement 1", faculty: "Engineering" },
            })
        })

        it("should throw an error if user does not have access rights", async () => {
            AchievementNonCompetitionService.getById.mockResolvedValue({
                id: 1,
                name: "Achievement 1",
                faculty: "Science",
            })
            UsersServices.getById.mockResolvedValue({ faculty: "Engineering" })

            const res = await request(app)
                .get("/achievements/non-competition/1")
                .set("userId", "1")
                .set("userRole", "OPERATOR")

            expect(res.statusCode).toBe(403)
            expect(res.body).toEqual({
                status: "fail",
                message: "Doesnt have right to access this resources",
            })
        })

        it("should return 403 when role is BASIC", async () => {
            const res = await request(app)
                .get("/achievements/non-competition/1")
                .set("userId", "1")
                .set("userRole", "BASIC")

            expect(res.statusCode).toBe(403)
            expect(res.body).toEqual({
                status: "fail",
                message: "cannot access this resources",
            })
        })
    })

    describe("putAchievementNonCompetitionByIdController", () => {
        it("should update non-competition achievement by OPERATOR", async () => {
            AchievementNonCompetitionService.getById.mockResolvedValue({
                id: 1,
                faculty: "Engineering",
            })
            UsersServices.getById.mockResolvedValue({ faculty: "Engineering" })
            AchievementNonCompetitionService.update.mockResolvedValue({ id: 1 })

            const res = await request(app)
                .put("/achievements/non-competition/1")
                .send({
                    name: "Updated Achievement",
                    category: "Mahasiswa Berwirausaha",
                    faculty: "Engineering",
                    activity: "Updated Activity",
                    levelActivity: "National",
                    numberOfStudents: 15,
                    year: "2022",
                    fileUrl: ["http://example-updated.com"],
                })
                .set("userId", "1")
                .set("userRole", "OPERATOR")

            expect(res.statusCode).toBe(200)
            expect(res.body).toEqual({
                status: "success",
                message: "Achievement is updated",
                data: { achievementId: 1 },
            })
        })

        it("should update non-competition achievement by ADMIN", async () => {
            AchievementNonCompetitionService.getById.mockResolvedValue({
                id: 1,
                faculty: "Engineering",
            })
            UsersServices.getById.mockResolvedValue({ faculty: "" })
            AchievementNonCompetitionService.update.mockResolvedValue({ id: 1 })

            const res = await request(app)
                .put("/achievements/non-competition/1")
                .send({
                    name: "Updated Achievement",
                    category: "Mahasiswa Berwirausaha",
                    faculty: "Engineering",
                    activity: "Updated Activity",
                    levelActivity: "National",
                    numberOfStudents: 15,
                    year: "2022",
                    fileUrl: ["http://example-updated.com"],
                })
                .set("userId", "1")
                .set("userRole", "ADMIN")

            expect(res.statusCode).toBe(200)
            expect(res.body).toEqual({
                status: "success",
                message: "Achievement is updated",
                data: { achievementId: 1 },
            })
        })

        it("should throw an error if user does not have access rights", async () => {
            AchievementNonCompetitionService.getById.mockResolvedValue({
                id: 1,
                faculty: "Science",
            })
            UsersServices.getById.mockResolvedValue({ faculty: "Engineering" })

            const res = await request(app)
                .put("/achievements/non-competition/1")
                .send({
                    name: "Updated Achievement",
                    category: "Mahasiswa Berwirausaha",
                    faculty: "Science",
                    activity: "Updated Activity",
                    levelActivity: "National",
                    numberOfStudents: 15,
                    year: "2022",
                    fileUrl: ["http://example-updated.com"],
                })
                .set("userId", "1")
                .set("userRole", "OPERATOR")

            expect(res.statusCode).toBe(403)
            expect(res.body).toEqual({
                status: "fail",
                message: "Doesnt have right to access this resources",
            })
        })

        it("should return 403 when role is neither OPERATOR or ADMIN", async () => {
            const res = await request(app)
                .put("/achievements/non-competition/1")
                .send({
                    name: "Updated Achievement",
                    category: "Mahasiswa Berwirausaha",
                    faculty: "Science",
                    activity: "Updated Activity",
                    levelActivity: "National",
                    numberOfStudents: 15,
                    year: "2022",
                    fileUrl: ["http://example-updated.com"],
                })
                .set("userId", "1")
                .set("userRole", "BASIC")

            expect(res.statusCode).toBe(403)
            expect(res.body).toEqual({
                status: "fail",
                message: "cannot access this resources",
            })
        })
    })

    describe("deleteAchievementNonCompetitionByIdController", () => {
        it("should delete non-competition achievement by OPERATOR", async () => {
            AchievementNonCompetitionService.getById.mockResolvedValue({
                id: 1,
                faculty: "Engineering",
            })
            UsersServices.getById.mockResolvedValue({ faculty: "Engineering" })
            AchievementNonCompetitionService.deleteById.mockResolvedValue()

            const res = await request(app)
                .delete("/achievements/non-competition/1")
                .set("userId", "1")
                .set("userRole", "OPERATOR")

            expect(res.statusCode).toBe(200)
            expect(res.body).toEqual({
                status: "success",
                message: "Achievement deleted",
            })
        })

        it("should delete non-competition achievement by ADMIN", async () => {
            AchievementNonCompetitionService.getById.mockResolvedValue({
                id: 1,
                faculty: "Engineering",
            })
            UsersServices.getById.mockResolvedValue({ faculty: "" })
            AchievementNonCompetitionService.deleteById.mockResolvedValue()

            const res = await request(app)
                .delete("/achievements/non-competition/1")
                .set("userId", "1")
                .set("userRole", "ADMIN")

            expect(res.statusCode).toBe(200)
            expect(res.body).toEqual({
                status: "success",
                message: "Achievement deleted",
            })
        })

        it("should throw an error if user does not have access rights", async () => {
            AchievementNonCompetitionService.getById.mockResolvedValue({
                id: 1,
                faculty: "Science",
            })
            UsersServices.getById.mockResolvedValue({ faculty: "Engineering" })

            const res = await request(app)
                .delete("/achievements/non-competition/1")
                .set("userId", "1")
                .set("userRole", "OPERATOR")

            expect(res.statusCode).toBe(403)
            expect(res.body).toEqual({
                status: "fail",
                message: "Doesnt have right to access this resources",
            })
        })

        it("should 403 when role is neither OPERATOR or ADMIN", async () => {
            const res = await request(app)
                .delete("/achievements/non-competition/1")
                .set("userId", "1")
                .set("userRole", "WR")

            expect(res.statusCode).toBe(403)
            expect(res.body).toEqual({
                status: "fail",
                message: "cannot access this resources",
            })
        })
    })
})
