import { features } from "../../constants";
import styles, { layout } from "../../style";
import Button from "./Button";

const FeatureCard = ({ icon, title, content, index }) => (
  <div className={`flex flex-row p-6 rounded-[20px] ${index !== features.length - 1 ? "mb-6" : "mb-0"} feature-card`}>
    <div className={`w-[64px] h-[64px] rounded-full ${styles.flexCenter} bg-dimBlue`}>
      <img src={icon} alt="star" className="w-[50%] h-[50%] object-contain" />
    </div>
    <div className="flex flex-col flex-1 ml-3">
      <h4 className="font-poppins font-semibold text-white text-[18px] leading-[23.4px] mb-1">{title}</h4>
      <p className="font-poppins font-normal text-dimWhite text-[16px] leading-[24px]">{content}</p>
    </div>
  </div>
);

const Panduan = () => (
  <section id="Panduan" className={`${layout.section} ${styles.paddingX}`}>
    <div className={layout.sectionInfo}>
      <h2 className={styles.heading2}>Panduan pengguna</h2>
      <p className={`${styles.paragraph} max-w-[470px] mt-5`}>
        Anda bisa mengupload prestasi untuk menghitung point bobot skp yang telah ditentukan sesuai prestasi yang anda dapatkan selama berpendidikan di universitas syiah kuala silahkan login untuk mengupload berkas anda
      </p>

      <div className="hidden mt-10 sm:flex">
        <Button text="Login" to="/login" />
      </div>
    </div>

    <div className={`${layout.sectionImg} ${styles.paddingX} flex-col`}>
      {features.map((feature, index) => (
        <FeatureCard key={feature.id} {...feature} index={index} />
      ))}
    </div>
  </section>
);

export default Panduan;
