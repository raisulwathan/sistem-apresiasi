import { AuthorizationError } from "../exceptions/AuthorizationError.js";
import AchievementIndependentService from "../services/AchievementIndependentService.js";
import AchievementNonCompetitionService from "../services/AchievementNonCompetitionService.js";
import UsersService from "../services/UsersService.js";
import ExcelJS from "exceljs";

const achievementIndependentService = new AchievementIndependentService();
const achievementNonCompetitionService = new AchievementNonCompetitionService();
const usersService = new UsersService();

const CATEGORY = {
  wirausaha: "Mahasiswa Berwirausaha",
  rekognisi: "Rekognisi",
  pertukaran: "Pertukaran Mahasiswa Nasional dan Internasional",
  pengabdian: "Pengabdian Mahasiswa kepada Masyarakat",
  pembinaan: "Pembinaan Mental Kebangsaan",
};

export const getExportAchievementIndependentsController = async (req, res) => {
  const { userId, userRole } = req;

  if (userRole !== "ADMIN" && userRole !== "OPERATOR") {
    throw new AuthorizationError("User doenst have right to access this resources");
  }

  if (userRole === "OPERATOR") {
    const users = await usersService.getUserById(userId);

    const achievementData = await achievementIndependentService.getAchievementIndependentByFacultyForExport(users.faculty);

    const achievementDataWithoutIds = achievementData.map(({ id, ...rest }) => rest);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Data");

    worksheet.columns = [
      { header: "Nama Kegiatan", key: "name", width: 50 },
      { header: "Tingkat Kegiatan", key: "level_activity", width: 15 },
      { header: "Jenis Kepesertaan", key: "participant_type", width: 15 },
      { header: "Peserta", key: "participants", width: 50 },
      { header: "Fakultas", key: "faculty", width: 20 },
      { header: "Program Studi", key: "major", width: 20 },
      { header: "Capaian Prestasi", key: "achievement", width: 15 },
      { header: "Pembimbing", key: "mentor", width: 50 },
      { header: "Tahun", key: "year", width: 10 },
      { header: "Tanggal Mulai", key: "start_date", width: 20 },
      { header: "Tanggal Selesai", key: "end_date", width: 20 },
      { header: "Berkas", key: "file_url", width: 50 },
    ];

    achievementDataWithoutIds.forEach((row) => {
      worksheet.addRow(row);
    });

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename=mandiri_export.xlsx`);

    await workbook.xlsx.write(res);
    res.end();
  }

  if (userRole === "ADMIN") {
    const achievementData = await achievementIndependentService.getAchievementIndependentForExport();

    const achievementDataWithoutIds = achievementData.map(({ id, ...rest }) => rest);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Data");

    worksheet.columns = [
      { header: "Nama Kegiatan", key: "name", width: 50 },
      { header: "Tingkat Kegiatan", key: "level_activity", width: 15 },
      { header: "Jenis Kepesertaan", key: "participant_type", width: 15 },
      { header: "Peserta", key: "participants", width: 50 },
      { header: "Fakultas", key: "faculty", width: 20 },
      { header: "Program Studi", key: "major", width: 20 },
      { header: "Capaian Prestasi", key: "achievement", width: 15 },
      { header: "Pembimbing", key: "mentor", width: 50 },
      { header: "Tahun", key: "year", width: 10 },
      { header: "Tanggal Mulai", key: "start_date", width: 20 },
      { header: "Tanggal Selesai", key: "end_date", width: 20 },
      { header: "Berkas", key: "file_url", width: 50 },
    ];

    achievementDataWithoutIds.forEach((row) => {
      worksheet.addRow(row);
    });

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename=mandiri_export.xlsx`);

    await workbook.xlsx.write(res);
    res.end();
  }
};

export const getExportAchievementNonCompetitionByCategoryController = async (req, res) => {
  const { userId, userRole } = req;
  const { category } = req.params;

  const parseCategory = CATEGORY[category];

  if (userRole !== "ADMIN" && userRole !== "OPERATOR") {
    throw new AuthorizationError("User doenst have right to access this resources");
  }

  if (userRole === "OPERATOR") {
    const users = await usersService.getUserById(userId);

    const achievementData = await achievementNonCompetitionService.getAchievementNonCompetitionsByFaculty(users.faculty);

    const filteredAchievementData = achievementData.filter((achievement) => achievement.category === parseCategory);

    const achievementDataWithoutIds = filteredAchievementData.map(({ id, ...rest }) => rest);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Data");

    worksheet.columns = [
      { header: "Nama Kegiatan", key: "name", width: 50 },
      { header: "Kategori", key: "category", width: 50 },
      { header: "Pengakuan/Jenis Kegiatan", key: "activity", width: 50 },
      { header: "Fakultas", key: "faculty", width: 20 },
      { header: "Jumlah Mahasiswa", key: "number_of_students" },
      { header: "Tahun", key: "year", width: 10 },
      { header: "Berkas", key: "file_url", width: 50 },
    ];

    achievementDataWithoutIds.forEach((row) => {
      worksheet.addRow(row);
    });

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename=non-competition_${parseCategory}_export.xlsx`);

    await workbook.xlsx.write(res);
    res.end();
  }

  if (userRole === "ADMIN") {
    const achievementData = await achievementNonCompetitionService.getAchievementNonCompetitions();
    console.log(achievementData);

    const filteredAchievementData = achievementData.filter((achievement) => achievement.category === parseCategory);
    console.log(filteredAchievementData);

    const achievementDataWithoutIds = filteredAchievementData.map(({ id, ...rest }) => rest);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Data");

    worksheet.columns = [
      { header: "Nama Kegiatan", key: "name", width: 50 },
      { header: "Kategori", key: "category", width: 50 },
      { header: "Pengakuan/Jenis Kegiatan", key: "activity", width: 50 },
      { header: "Fakultas", key: "faculty", width: 20 },
      { header: "Jumlah Mahasiswa", key: "number_of_students" },
      { header: "Tahun", key: "year", width: 10 },
      { header: "Berkas", key: "file_url", width: 50 },
    ];

    achievementDataWithoutIds.forEach((row) => {
      worksheet.addRow(row);
    });

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename=non-competition_${parseCategory}_export.xlsx`);

    await workbook.xlsx.write(res);
    res.end();
  }
};
