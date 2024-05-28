import request from "supertest"
import express from "express"
import * as ActivitiesService from "../../services/ActivitiesService.js"
import * as SkpiService from "../../services/SkpiService.js"
import * as UsersServices from "../../services/UsersService.js"
import { tryCatch } from "../../utils/index.js"
import * as SkpiController from "../skpi.js"
import { errorHandler } from "../../middleware/errorHandler.js"
import { InvariantError } from "../../exceptions/InvariantError.js"

jest.mock("../../services/ActivitiesService.js")
jest.mock("../../services/SkpiService.js")
jest.mock("../../services/UsersService.js")

const app = express()

const setUser = (req, res, next) => {
    req.userId = req.header("userId")
    req.userRole = req.header("userRole")
    next()
}

app.use(express.json())
app.use(setUser)

app.post("/skpi", tryCatch(SkpiController.postSkpiController))
app.get("/skpi", tryCatch(SkpiController.getSkpiController))
app.get("/skpi/:id", tryCatch(SkpiController.getSkpiByIdController))
app.put("/skpi/:id/validate", tryCatch(SkpiController.putStatusSkpiByIdController))

app.use(errorHandler)

describe("postSkpiController", () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it("should create a new SKPI", async () => {
        const mockActivityPoints = {
            "Kegiatan Wajib": 10,
            "Bidang Organisasi Kemahasiswaan dan Kepemimpinan": 5,
            "Bidang Minat, Bakat, Mental Spritiual Kebangsaan dan Kewirausahaan": 4,
            "Bidang Penalaran dan Keilmuan, Penyelarasan dan Pengembangan Karir": 3,
            "Bidang Kepedulian Sosial": 2,
            "Bidang Lainnya": 1,
        }
        ActivitiesService.getTotalPoint.mockResolvedValue(mockActivityPoints)
        SkpiService.isExist.mockResolvedValue(false)
        const mockNewSkpi = { id: 1, ownerId: "userId" }
        SkpiService.create.mockResolvedValue(mockNewSkpi)

        await request(app)
            .post("/skpi")
            .set("userId", "userId")
            .expect(201)
            .then((response) => {
                expect(ActivitiesService.getTotalPoint).toHaveBeenCalledWith("userId")
                expect(SkpiService.create).toHaveBeenCalledWith({
                    mandatoryPoints: 10,
                    organizationPoints: 5,
                    scientificPoints: 3,
                    talentPoints: 4,
                    charityPoints: 2,
                    otherPoints: 1,
                    owner: "userId",
                })
                expect(response.body.status).toBe("success")
                expect(response.body.message).toBe("SKPI added")
                expect(response.body.data).toEqual({
                    skpiId: mockNewSkpi.id,
                    userId: mockNewSkpi.ownerId,
                })
            })
    })

    it("should handle error when SKPI already exists", async () => {
        const mockActivityPoints = {
            "Kegiatan Wajib": 10,
            "Bidang Organisasi Kemahasiswaan dan Kepemimpinan": 5,
            "Bidang Minat, Bakat, Mental Spritiual Kebangsaan dan Kewirausahaan": 4,
            "Bidang Penalaran dan Keilmuan, Penyelarasan dan Pengembangan Karir": 3,
            "Bidang Kepedulian Sosial": 2,
            "Bidang Lainnya": 1,
        }
        ActivitiesService.getTotalPoint.mockResolvedValue(mockActivityPoints)
        SkpiService.isExist.mockRejectedValue(new InvariantError("SKPI already exists"))

        await request(app)
            .post("/skpi")
            .set("userId", "userId")
            .expect(400)
            .then((response) => {
                expect(response.body.status).toBe("fail")
                expect(response.body.message).toBe("SKPI already exists")
            })
    })

    it("should handle error when point is 0", async () => {
        const mockActivityPoints = {
            "Kegiatan Wajib": 0,
            "Bidang Organisasi Kemahasiswaan dan Kepemimpinan": 0,
            "Bidang Minat, Bakat, Mental Spritiual Kebangsaan dan Kewirausahaan": 0,
            "Bidang Penalaran dan Keilmuan, Penyelarasan dan Pengembangan Karir": 0,
            "Bidang Kepedulian Sosial": 0,
            "Bidang Lainnya": 0,
        }
        ActivitiesService.getTotalPoint.mockResolvedValue(mockActivityPoints)
        SkpiService.isExist.mockRejectedValue(
            new InvariantError("Kegiatan Wajib harus memiliki minimal 20 skp")
        )

        await request(app)
            .post("/skpi")
            .set("userId", "userId")
            .expect(400)
            .then((response) => {
                expect(response.body.status).toBe("fail")
                expect(response.body.message).toBe("Kegiatan Wajib harus memiliki minimal 20 skp")
            })
    })
})

describe("getSkpiController", () => {
    it("should return SKPI by faculty for WD or OPERATOR role", async () => {
        const mockUser = {
            id: "userId",
            faculty: "Faculty",
        }
        UsersServices.getById.mockResolvedValue(mockUser)
        const mockSkpi = [
            { id: 1, name: "SKPI 1" },
            { id: 2, name: "SKPI 2" },
        ]
        SkpiService.getByFaculty.mockResolvedValue(mockSkpi)

        await request(app)
            .get("/skpi")
            .set("userId", "userId")
            .set("userRole", "WD")
            .expect(200)
            .then((response) => {
                expect(UsersServices.getById).toHaveBeenCalledWith("userId")
                expect(SkpiService.getByFaculty).toHaveBeenCalledWith("Faculty")
                expect(response.body.status).toBe("success")
                expect(response.body.data.skpi).toEqual(mockSkpi)
            })
    })

    it("should return all SKPIs for WR or ADMIN role", async () => {
        const mockSkpi = [
            { id: 1, name: "SKPI 1" },
            { id: 2, name: "SKPI 2" },
        ]
        SkpiService.getAll.mockResolvedValue(mockSkpi)

        await request(app)
            .get("/skpi")
            .set("userId", "userId")
            .set("userRole", "WR")
            .expect(200)
            .then((response) => {
                expect(SkpiService.getAll).toHaveBeenCalled()
                expect(response.body.status).toBe("success")
                expect(response.body.data.skpi).toEqual(mockSkpi)
            })
    })

    it("should return SKPI by owner ID for other roles", async () => {
        const mockSkpi = { id: 1, name: "SKPI 1", ownerId: "userId" }
        SkpiService.getByOwnerId.mockResolvedValue(mockSkpi)

        await request(app)
            .get("/skpi")
            .set("userId", "userId")
            .set("userRole", "SOME_ROLE")
            .expect(200)
            .then((response) => {
                expect(SkpiService.getByOwnerId).toHaveBeenCalledWith("userId")
                expect(response.body.status).toBe("success")
                expect(response.body.data).toEqual(mockSkpi)
            })
    })
})

describe("getSkpiByIdController", () => {
    it("should return SKPI by ID", async () => {
        const mockSkpi = { id: "skpiId", name: "SKPI Name" }
        SkpiService.getById.mockResolvedValue(mockSkpi)

        await request(app)
            .get("/skpi/skpiId")
            .expect(200)
            .then((response) => {
                expect(SkpiService.getById).toHaveBeenCalledWith("skpiId")
                expect(response.body.status).toBe("success")
                expect(response.body.data).toEqual(mockSkpi)
            })
    })
})

describe("putStatusSkpiByIdController", () => {
    it("should update SKPI status accepted", async () => {
        const mockSkpi = { id: "skpiId", status: "pending" }
        SkpiService.getById.mockResolvedValue(mockSkpi)
        SkpiService.processSkpi.mockResolvedValue()

        await request(app)
            .put("/skpi/skpiId/validate?status=accepted")
            .set("userRole", "OPERATOR")
            .expect(200)
            .then((response) => {
                expect(SkpiService.getById).toHaveBeenCalledWith("skpiId")
                expect(SkpiService.processSkpi).toHaveBeenCalledWith(
                    "skpiId",
                    "accepted by OPERATOR"
                )
                expect(response.body.status).toBe("success")
                expect(response.body.message).toBe("skpi berhasil divalidasi")
            })
    })

    it("should update SKPI status by WD", async () => {
        const mockSkpi = { id: "skpiId", status: "accepted by OPERATOR" }
        SkpiService.getById.mockResolvedValue(mockSkpi)
        SkpiService.processSkpi.mockResolvedValue()

        await request(app)
            .put("/skpi/skpiId/validate")
            .set("userRole", "WD")
            .expect(200)
            .then((response) => {
                expect(SkpiService.getById).toHaveBeenCalledWith("skpiId")
                expect(SkpiService.processSkpi).toHaveBeenCalledWith("skpiId", "accepted by WD")
                expect(response.body.status).toBe("success")
                expect(response.body.message).toBe("skpi berhasil divalidasi")
            })
    })

    it("should update SKPI status by ADMIN", async () => {
        const mockSkpi = { id: "skpiId", status: "accepted by WD" }
        SkpiService.getById.mockResolvedValue(mockSkpi)
        SkpiService.processSkpi.mockResolvedValue()

        await request(app)
            .put("/skpi/skpiId/validate")
            .set("userRole", "ADMIN")
            .expect(200)
            .then((response) => {
                expect(SkpiService.getById).toHaveBeenCalledWith("skpiId")
                expect(SkpiService.processSkpi).toHaveBeenCalledWith("skpiId", "accepted by ADMIN")
                expect(response.body.status).toBe("success")
                expect(response.body.message).toBe("skpi berhasil divalidasi")
            })
    })

    it("should update SKPI status by WR", async () => {
        const mockSkpi = { id: "skpiId", status: "accepted by ADMIN" }
        SkpiService.getById.mockResolvedValue(mockSkpi)
        SkpiService.processSkpi.mockResolvedValue()

        await request(app)
            .put("/skpi/skpiId/validate")
            .set("userRole", "WR")
            .expect(200)
            .then((response) => {
                expect(SkpiService.getById).toHaveBeenCalledWith("skpiId")
                expect(SkpiService.processSkpi).toHaveBeenCalledWith("skpiId", "completed")
                expect(response.body.status).toBe("success")
                expect(response.body.message).toBe("skpi berhasil divalidasi")
            })
    })

    it("should update SKPI with status rejected", async () => {
        const mockSkpi = { id: "skpiId", status: "accepted by ADMIN" }
        SkpiService.getById.mockResolvedValue(mockSkpi)
        SkpiService.processSkpi.mockResolvedValue()

        await request(app)
            .put("/skpi/skpiId/validate?status=rejected")
            .set("userRole", "WR")
            .expect(200)
            .then((response) => {
                expect(SkpiService.getById).toHaveBeenCalledWith("skpiId")
                expect(SkpiService.processSkpi).toHaveBeenCalledWith("skpiId", "rejected")
                expect(response.body.status).toBe("success")
                expect(response.body.message).toBe("skpi berhasil divalidasi")
            })
    })

    it("should throw InvariantError when SKPI status is not pending", async () => {
        const mockSkpi = { id: "skpiId", status: "accepted by OPERATOR" }
        SkpiService.getById.mockResolvedValue(mockSkpi)

        await request(app)
            .put("/skpi/skpiId/validate?status=accepted")
            .set("userRole", "OPERATOR")
            .expect(400)
            .then((response) => {
                expect(response.body.status).toBe("fail")
                expect(response.body.message).toBe("SKPI sudah divalidasi atau sudah selesai")
            })
    })

    it("should throw InvariantError when SKPI status is not 'accepted by OPERATOR' by WD", async () => {
        const mockSkpi = { id: "skpiId", status: "pending" }
        SkpiService.getById.mockResolvedValue(mockSkpi)

        await request(app)
            .put("/skpi/skpiId/validate")
            .set("userRole", "WD")
            .expect(400)
            .then((response) => {
                expect(response.body.status).toBe("fail")
                expect(response.body.message).toBe("SKPI sudah divalidasi atau sudah selesai")
            })
    })

    it("should throw InvariantError when SKPI status is not 'accepted by WD' by ADMIN", async () => {
        const mockSkpi = { id: "skpiId", status: "pending" }
        SkpiService.getById.mockResolvedValue(mockSkpi)

        await request(app)
            .put("/skpi/skpiId/validate")
            .set("userRole", "ADMIN")
            .expect(400)
            .then((response) => {
                expect(response.body.status).toBe("fail")
                expect(response.body.message).toBe("SKPI sudah divalidasi atau sudah selesai")
            })
    })

    it("should throw InvariantError when SKPI status is not 'accepted by ADMIN' by WR", async () => {
        const mockSkpi = { id: "skpiId", status: "pending" }
        SkpiService.getById.mockResolvedValue(mockSkpi)

        await request(app)
            .put("/skpi/skpiId/validate")
            .set("userRole", "WR")
            .expect(400)
            .then((response) => {
                expect(response.body.status).toBe("fail")
                expect(response.body.message).toBe("SKPI sudah divalidasi atau sudah selesai")
            })
    })

    it("should throw AuthorizationError when Role is invalid", async () => {
        const mockSkpi = { id: "skpiId", status: "pending" }
        SkpiService.getById.mockResolvedValue(mockSkpi)

        await request(app)
            .put("/skpi/skpiId/validate")
            .set("userRole", "BASIC")
            .expect(403)
            .then((response) => {
                expect(response.body.status).toBe("fail")
                expect(response.body.message).toBe("tidak berhak mengakses resource ini")
            })
    })
})
