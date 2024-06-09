import styles from "../../style";
import { discount, robot } from "../../assets";
import GetStarted from "./GetStarted";

const Hero = () => {
  return (
    <section id="home" className={`flex md:flex-row flex-col mx-5  ${styles.paddingY}`}>
      <div className={`flex-1 ${styles.flexStart} flex-col xl:px-0 sm:px-16 `}>
        <div className="flex flex-row items-center py-[6px] px-4 bg-discount-gradient rounded-[10px] mb-2">
          <img src={discount} alt="discount" className="w-[32px] h-[32px]" />
          <p className={`${styles.paragraph} ml-2`}>
            <span className="text-white "></span> Semakin simple <span className="text-white">Dan</span> Cepat
          </p>
        </div>

        <div className="flex flex-row items-center justify-between w-full">
          <h1 className="flex-1 font-poppins  ss:text-[62px] text-[42px] text-white ss:leading-[100.8px] leading-[75px]">
            <span className="text-gradient">Apresiasi</span>{" "}
          </h1>
          <div className="hidden mr-0 ss:flex md:mr-4">
            <GetStarted />
          </div>
        </div>

        <h1 className="font-poppins text-[40px] lg:text-[52px] text-gray-300 ss:leading-[100.8px] leading-[75px] w-full">Universitas Syiah Kuala.</h1>
        <p className={`${styles.paragraph} max-w-[470px] mt-5`}>
          Website apresiasi adalah website yang membantu mahasiswa untuk mendapatkan skpi dan rekognisi beserta melaporkan prestasi yang pernah di ikuti’ oleh mahasiswa universitas syiah kuala.
        </p>
      </div>

      <div className={`flex-1 flex ${styles.flexCenter} md:my-0 my-10  relative`}>
        <img src={robot} alt="billing" className="w-[531px] hidden lg:block h-[603px] md:hidden relative z-[5] " />

        <div className="absolute z-[0] w-[40%] h-[35%] top-0 pink__gradient" />
        <div className="absolute z-[1] w-[80%] h-[80%] rounded-full white__gradient bottom-40" />
        <div className="absolute z-[0] w-[50%] h-[50%] right-20 bottom-20 blue__gradient" />
      </div>

      <div className={`ss:hidden ${styles.flexCenter}`}>
        <GetStarted />
      </div>
    </section>
  );
};

export default Hero;
