export function generateStatusActive(status) {
    let statusActive
    switch (status) {
        case "Aktif":
            statusActive = "AKTIF"
            break
        case "Tidak Aktif":
            statusActive = "TIDAK_AKTIF"
            break
        default:
            break
    }

    return statusActive
}
export function generateStatusGraduate(status) {
    let statusGraduate
    switch (status) {
        case "Lulus":
            statusGraduate = "LULUS"
            break
        case "Belum Lulus":
            statusGraduate = "BELUM_LULUS"
            break
        default:
            break
    }

    return statusGraduate
}
