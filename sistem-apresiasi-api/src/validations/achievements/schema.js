import Joi from "joi";

const participantsSchema = Joi.object({
  name: Joi.string().required(),
  npm: Joi.string().required(),
  // ... tambahkan properti lain sesuai kebutuhan
});

export const PostAcheivementPayloadSchema = Joi.object({
  activityId: Joi.string().required(),
  ownerId: Joi.string().required(),
});

export const PostAchievementIndependentPayloadSchema = Joi.object({
  name: Joi.string().required(),
  levelActivity: Joi.string().required(),
  participantType: Joi.string().allow("Individu", "Kelompok").required(),
  totalParticipants: Joi.number().allow(null),
  participants: Joi.array().items(participantsSchema).required(),
  faculty: Joi.string().required(),
  major: Joi.string().required(),
  achievement: Joi.string().required(),
  mentor: Joi.string().allow(""),
  year: Joi.string().required(),
  startDate: Joi.string().allow(""),
  endDate: Joi.string().allow(""),
  fileUrl: Joi.array().items(Joi.string()).required(),
});

export const PutAchievementIndependentPayloadSchema = Joi.object({
  name: Joi.string().required(),
  levelActivity: Joi.string().required(),
  participantType: Joi.string().allow("Individu", "Kelompok").required(),
  totalParticipants: Joi.number().allow(null),
  participants: Joi.array().items(participantsSchema).required(),
  faculty: Joi.string().required(),
  major: Joi.string().required(),
  achievement: Joi.string().required(),
  mentor: Joi.string().allow(""),
  year: Joi.string().required(),
  startDate: Joi.string().allow(""),
  endDate: Joi.string().allow(""),
  fileUrl: Joi.array().items(Joi.string()).required(),
});

export const PostAchievementNonCompetitionPayloadSchema = Joi.object({
  name: Joi.string().required(),
  category: Joi.string().valid("Rekognisi", "Mahasiswa Berwirausaha", "Pertukaran Mahasiswa Nasional dan Internasional", "Pengabdian Mahasiswa kepada Masyarakat", "Pembinaan Mental Kebangsaan").required(),
  faculty: Joi.string().required(),
  activity: Joi.when("category", {
    is: "Rekognisi",
    then: Joi.string().required(),
    otherwise: Joi.when("category", {
      is: "Pembinaan Mental Kebangsaan",
      then: Joi.string().required(),
      otherwise: Joi.optional(),
    }),
  }),
  levelActivity: Joi.when("category", {
    is: "Pembinaan Mental Kebangsaan",
    then: Joi.string().required(),
    otherwise: Joi.optional(),
  }),
  numberOfStudents: Joi.when("category", {
    is: "Pembinaan Mental Kebangsaan",
    then: Joi.optional,
    otherwise: Joi.number().required(),
  }),
  year: Joi.string().required(),
  fileUrl: Joi.array().items(Joi.string()).required(),
});

export const PutAchievementNonCompetitionPayloadSchema = Joi.object({
  name: Joi.string().required(),
  category: Joi.string().valid("Rekognisi", "Mahasiswa Berwirausaha", "Pertukaran Mahasiswa Nasional dan Internasional", "Pengabdian Mahasiswa kepada Masyarakat", "Pembinaan Mental Kebangsaan").required(),
  faculty: Joi.string().required(),
  activity: Joi.when("category", {
    is: "Rekognisi",
    then: Joi.string().required(),
    otherwise: Joi.when("category", {
      is: "Pembinaan Mental Kebangsaan",
      then: Joi.string().required(),
      otherwise: Joi.optional(),
    }),
  }),
  levelActivity: Joi.when("category", {
    is: "Pembinaan Mental Kebangsaan",
    then: Joi.string().required(),
    otherwise: Joi.optional(),
  }),
  numberOfStudents: Joi.number().required(),
  year: Joi.string().required(),
  fileUrl: Joi.array().items(Joi.string()).required(),
});
