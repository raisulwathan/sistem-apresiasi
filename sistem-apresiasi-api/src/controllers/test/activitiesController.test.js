import request from "supertest"
import express from "express"
import * as ActivitiesController from "../activities"
import * as ActivitiesService from "../../services/ActivitiesService"
import * as RejectedActivityService from "../../services/RejectedActivityService"
import * as UsersService from "../../services/UsersService"
import { errorHandler } from "../../middleware/errorHandler"
import { tryCatch } from "../../utils"

const app = express()

const setUser = (req, res, next) => {
    req.userId = req.header("userId")
    req.userRole = req.header("userRole")
    next()
}

jest.mock("../../services/ActivitiesService")
jest.mock("../../services/RejectedActivityService")
jest.mock("../../services/UsersService")

app.use(express.json())
app.use(setUser)

app.post("/activities", tryCatch(ActivitiesController.postActivityController))
app.get("/activities/", tryCatch(ActivitiesController.getActivitiesController))
app.get("/activities/rejects", tryCatch(ActivitiesController.getRejectActivitiesController))
app.get("/activities/points", tryCatch(ActivitiesController.getActivitiesPointsController))
app.get("/activities/faculties", tryCatch(ActivitiesController.getActivitiesByFacultyController))
app.get("/activities/:id", tryCatch(ActivitiesController.getActivityByIdController))
app.put("/activities/:id/validate", tryCatch(ActivitiesController.putStatusActivityController))
app.get("/activities/:id/rejects", tryCatch(ActivitiesController.getRejectActivityByIdController))

app.use(errorHandler)

afterEach(() => {
    jest.clearAllMocks()
})

describe("postActivitiesController", () => {
    it("should create a new activity", async () => {
        ActivitiesService.create.mockResolvedValue({ activityId: "1", ownerId: "1" })

        const res = await request(app)
            .post("/activities")
            .send({
                name: "New Activity",
                fieldActivity: "kegiatanWajib",
                activity: "Activity 1",
                level: "Level 1",
                possitionAchievement: "Position 1",
                location: "Location 1",
                years: "2024",
                fileUrl: "file-url",
            })
            .set("userId", "1")

        expect(res.statusCode).toBe(201)
        expect(res.body).toEqual({
            status: "success",
            message: "activity added",
            data: {
                activityId: "1",
                ownerId: "1",
            },
        })
    })
})

describe("getActivitiesController", () => {
    it("should return array of data", async () => {
        ActivitiesService.getByOwnerId.mockResolvedValue([
            { id: 1, name: "Activity 1" },
            { id: 2, name: "Activity 2" },
        ])

        const res = await request(app).get("/activities").set("userId", "1")

        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({
            status: "success",
            data: {
                activities: [
                    { id: 1, name: "Activity 1" },
                    { id: 2, name: "Activity 2" },
                ],
            },
        })
    })
})

describe("getActivitiesByFacultyController", () => {
    it("should return 403 when role is BASIC", async () => {
        const res = await request(app)
            .get("/activities/faculties")
            .set("userId", "1")
            .set("userRole", "BASIC")

        expect(res.statusCode).toBe(403)
        expect(res.body).toEqual({
            status: "fail",
            message: "Anda tidak berhak mengakses resource ini",
        })
    })

    it("should return array of data", async () => {
        UsersService.getById.mockResolvedValue({ faculty: "MIPA" })
        ActivitiesService.getByFaculty.mockResolvedValue([
            { id: 1, name: "Activity 1", faculty: "MIPA" },
            { id: 2, name: "Activity 2", faculty: "MIPA" },
        ])

        const res = await request(app)
            .get("/activities/faculties")
            .set("userId", "1")
            .set("userRole", "OPERATOR")

        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({
            status: "success",
            data: {
                activities: [
                    { id: 1, name: "Activity 1", faculty: "MIPA" },
                    { id: 2, name: "Activity 2", faculty: "MIPA" },
                ],
            },
        })
    })
})

describe("getActivityByIdController", () => {
    it("should return data by id", async () => {
        ActivitiesService.getById.mockResolvedValue({
            id: "1",
            name: "Activity 1",
            faculty: "MIPA",
        })

        const res = await request(app).get("/activities/1").set("userId", "1")

        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({
            status: "success",
            data: {
                activity: { id: "1", name: "Activity 1", faculty: "MIPA" },
            },
        })
    })
})

describe("putStatusActivityController", () => {
    it("should return 403 statusCode when userRole is BASIC", async () => {
        const res = await request(app)
            .put("/activities/1/validate")
            .send({ status: "accepted", message: "ok" })
            .set("userId", "1")
            .set("userRole", "BASIC")

        expect(res.statusCode).toBe(403)
        expect(res.body).toEqual({
            status: "fail",
            message: "anda tidak berhak mengakses resources ini",
        })
    })

    it("should update data correctly", async () => {
        ActivitiesService.verifyAccess.mockResolvedValue()
        ActivitiesService.processActivity.mockResolvedValue()

        const res = await request(app)
            .put("/activities/1/validate")
            .send({ status: "accepted", message: "ok" })
            .set("userId", "1")
            .set("userRole", "OPERATOR")

        expect(res.body).toEqual({
            status: "success",
            message: "kegiatan berhasil divalidasi",
        })
        expect(res.statusCode).toBe(200)
        expect(ActivitiesService.verifyAccess).toHaveBeenCalledWith("1", "1")
        expect(ActivitiesService.processActivity).toHaveBeenCalledWith("1", "accepted", "ok")
    })
})

describe("getActivitiesPointController", () => {
    it("should return total points correclty", async () => {
        ActivitiesService.getTotalPoint.mockResolvedValue({ totalPoint: 100 })

        const res = await request(app).get("/activities/points").set("userId", "1")

        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({
            status: "success",
            data: {
                points: {
                    totalPoint: 100,
                },
            },
        })
        expect(ActivitiesService.getTotalPoint).toHaveBeenCalledWith("1")
    })
})

describe("getRejectedActivitiesController", () => {
    it("should return rejected activity data correctly", async () => {
        RejectedActivityService.getByOwnerId.mockResolvedValue({ id: "1", activity: "kegiatan A" })

        const res = await request(app).get("/activities/rejects").set("userId", "1")

        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({
            status: "success",
            data: {
                rejectedActivities: {
                    id: "1",
                    activity: "kegiatan A",
                },
            },
        })
        expect(RejectedActivityService.getByOwnerId).toHaveBeenCalledWith("1")
    })
})

describe("getRejectedActivitiesById", () => {
    it("should return rejected activity data correctly", async () => {
        RejectedActivityService.getByActivityId.mockResolvedValue({
            id: "1",
            activity: "kegiatan A",
        })

        const res = await request(app).get("/activities/1/rejects")

        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({
            status: "success",
            data: {
                rejectedActivity: {
                    id: "1",
                    activity: "kegiatan A",
                },
            },
        })
        expect(RejectedActivityService.getByActivityId).toHaveBeenCalledWith("1")
    })
})
