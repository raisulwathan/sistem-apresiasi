import fs from "fs"
import { loadData, tryCatch, getBobotSKP, verifyMinimumPoints } from "../index.js"
import { NotFoundError } from "../../exceptions/NotFoundError.js"
import { InvariantError } from "../../exceptions/InvariantError.js"

jest.mock("fs")

describe("loadData", () => {
    it("should load data from a JSON file", () => {
        const fakePath = "/fake/path/data.json"
        const fakeData = { key: "value" }
        fs.readFileSync.mockReturnValue(JSON.stringify(fakeData))

        const data = loadData(fakePath)

        expect(fs.readFileSync).toHaveBeenCalledWith(fakePath, "utf-8")
        expect(data).toEqual(fakeData)
    })
})

describe("getBobotSKP", () => {
    const data = {
        bobotSkp: [
            {
                kegiatan: "activity1",
                tingkat: {
                    level1: {
                        possition1: 10,
                    },
                },
            },
            {
                kegiatan: "activity2",
                tingkat: {
                    level1: 25,
                },
            },
            {
                kegiatan: "activity3",
                semuaLevel: 50,
            },
            {
                kegiatan: "activity4",
                semuaLevel: {
                    ketua: 40,
                },
            },
            {
                kegiatan: "activity5",
                tingkat: {
                    level1: {
                        possition1: 10,
                    },
                },
            },
        ],
    }

    it("should return the correct bobotSKP", () => {
        const result = getBobotSKP(data, {
            activity: "activity1",
            level: "level1",
            possitionAchievement: "possition1",
        })
        expect(result).toBe(10)
    })

    it("should return the correct when data only have level not possition bobotSKP", () => {
        const result = getBobotSKP(data, {
            activity: "activity2",
            level: "level1",
        })
        expect(result).toBe(25)
    })

    it("should throw NotFoundError if activity is not found", () => {
        expect(() => getBobotSKP(data, { activity: "nonexistent", level: "level1" })).toThrow(
            NotFoundError
        )
    })

    it("should throw NotFoundError if level is not found", () => {
        expect(() => getBobotSKP(data, { activity: "activity1", level: "nonexistent" })).toThrow(
            NotFoundError
        )
    })

    it("should return semuaLevel if present", () => {
        const result = getBobotSKP(data, {
            activity: "activity3",
            level: "level1",
        })
        expect(result).toBe(50)
    })

    it("should return semuaLevel with posstion if present", () => {
        const result = getBobotSKP(data, {
            activity: "activity4",
            possitionAchievement: "ketua",
        })
        expect(result).toBe(40)
    })
})

describe("verifyMinimumPoints", () => {
    it("should throw InvariantError if mandatoryPoints is less than 20", () => {
        expect(() => verifyMinimumPoints({ mandatoryPoints: 10 })).toThrow(InvariantError)
    })

    it("should throw InvariantError if no optional points are provided", () => {
        expect(() =>
            verifyMinimumPoints({
                mandatoryPoints: 20,
                organizationPoints: 0,
                scientificPoints: 0,
                charityPoints: 0,
                talentPoints: 0,
                otherPoints: 0,
            })
        ).toThrow(InvariantError)
    })

    it("should not throw error if minimum points are met", () => {
        expect(() =>
            verifyMinimumPoints({
                mandatoryPoints: 20,
                organizationPoints: 1,
                scientificPoints: 0,
                charityPoints: 0,
                talentPoints: 0,
                otherPoints: 0,
            })
        ).not.toThrow()
    })
})

describe("tryCatch", () => {
    it("should call next with error if controller throws", async () => {
        const error = new Error("Test error")
        const controller = jest.fn().mockRejectedValue(error)
        const next = jest.fn()

        const wrappedController = tryCatch(controller)
        await wrappedController({}, {}, next)

        expect(next).toHaveBeenCalledWith(error)
    })

    it("should call controller and not call next if no error", async () => {
        const controller = jest.fn().mockResolvedValue()
        const next = jest.fn()

        const wrappedController = tryCatch(controller)
        await wrappedController({}, {}, next)

        expect(controller).toHaveBeenCalled()
        expect(next).not.toHaveBeenCalled()
    })
})
