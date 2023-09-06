export default function (data, { activity, level, detail }) {
  const matchActivity = data.bobotSkp.find(
    (item) => item.kegiatan === activity
  );

  if (matchActivity) {
    if (matchActivity.tingkat) {
      if (detail) {
        return matchActivity.tingkat[level][detail];
      }

      return matchActivity.tingkat[level];
    }

    if (matchActivity.semuaLevel) return matchActivity.semuaLevel;

    throw new Error('tingkat kegiatan tidak ditemukan');
  }
  throw new Error('Kegiatan tidak ditemukan');
}
