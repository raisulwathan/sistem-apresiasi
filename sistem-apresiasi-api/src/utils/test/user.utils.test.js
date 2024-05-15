import { generateStatusActive, generateStatusGraduate } from "../user.utils"

describe("generateStatusActive", () => {
    it('should return "AKTIF" for input "Aktif"', () => {
        const result = generateStatusActive("Aktif")
        expect(result).toBe("AKTIF")
    })

    it('should return "TIDAK_AKTIF" for input "Tidak Aktif"', () => {
        const result = generateStatusActive("Tidak Aktif")
        expect(result).toBe("TIDAK_AKTIF")
    })

    it("should return undefined for unrecognized input", () => {
        const result = generateStatusActive("Unknown")
        expect(result).toBeUndefined()
    })
})

describe("generateStatusGraduate", () => {
    it('should return "LULUS" for input "Lulus"', () => {
        const result = generateStatusGraduate("Lulus")
        expect(result).toBe("LULUS")
    })

    it('should return "BELUM_LULUS" for input "Belum Lulus"', () => {
        const result = generateStatusGraduate("Belum Lulus")
        expect(result).toBe("BELUM_LULUS")
    })

    it("should return undefined for unrecognized input", () => {
        const result = generateStatusGraduate("Unknown")
        expect(result).toBeUndefined()
    })
})
