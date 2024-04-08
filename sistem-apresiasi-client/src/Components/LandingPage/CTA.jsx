import styles from "../../style";

const CTA = () => (
  <section id="CTA" className={`${styles.flexCenter} ${styles.marginY} ${styles.padding} ${styles.marginX} sm:flex-row flex-col bg-gray-800 rounded-xl shadow-xl`}>
    <div className="flex flex-col flex-1">
      <h2 className={`${styles.heading2} text-white font-semibold text-3xl sm:text-4xl`}>Ajukan Prestasimu !!</h2>
      <p className={`${styles.paragraph} max-w-[470px] text-gray-300 text-lg sm:text-xl mt-5`}>Dapatkan pencapaian terbaikmu dengan kami. Mulai sekarang dan lihat Prestasi apa saja yang sudah kamu gapai !</p>
      <button className="px-6 py-3 mt-8 font-semibold text-white transition duration-300 bg-teal-900 rounded-lg hover:bg-teal-700">Ajukan Sekarang</button>
    </div>

    <div className={`${styles.flexCenter} sm:ml-10 ml-0 sm:mt-0 mt-10`}>{/* Konten tambahan di sini jika diperlukan */}</div>
  </section>
);

export default CTA;
