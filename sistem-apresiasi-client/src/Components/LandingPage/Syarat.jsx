import { card } from "../../assets";
import styles, { layout } from "../../style";
import Button from "./Button";

const Syarat = () => (
  <section className={`${layout.section} ${styles.paddingX}`} id="syarat">
    <div className={layout.sectionInfo}>
      <h2 className={styles.heading2}>Syarat Dan Ketentuan</h2>
      <p className={`${styles.paragraph} max-w-[470px] mt-5`}>kegiatan-kegiatan mahasiswa yang mendapatkan prestasi dibidang seni ,bakat dan akademis anda bisa mendownload tabel panduan di bawah ini !!</p>

      <div className="hidden mt-10 sm:flex">
        ß
        <Button text="Login" to="/login" />
      </div>
    </div>

    <div className={layout.sectionImg}>
      <img src={card} alt="billing" className="w-[100%] h-[100%]" />
    </div>
  </section>
);

export default Syarat;
