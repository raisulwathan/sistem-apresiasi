import styles from "../../style";
import { arrowUp } from "../../assets";
import { Link } from "react-router-dom";

const GetStarted = () => (
  <div className={`${styles.flexCenter} w-[140px] h-[140px] rounded-full bg-blue-gradient p-[2px] cursor-pointer`}>
    <div className={`${styles.flexCenter} flex-col bg-primary w-[100%] h-[100%] rounded-full`}>
      <div className={`${styles.flexStart} flex-row`}>
        <Link to="/login" className="font-poppins font-medium text-[28px] leading-[23.4px]">
          <span className="text-gradient"> Login </span>
        </Link>
        <img src={arrowUp} alt="arrow-up" className="w-[23px] h-[23px] object-contain" />
      </div>
    </div>
  </div>
);

export default GetStarted;
