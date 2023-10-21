import { Link } from "react-router-dom";
import { logoApresiasi } from "../../assets";

const Logo = () => {
  return (
    <nav className="fixed top-0 left-0 z-50 flex items-center justify-between w-full py-6">
      <Link to="/" className="flex items-center">
        <img src={logoApresiasi} alt="Apresiasi" className="w-[40px] h-[40px] lg:ml-16" />
        <span className="ml-2 text-xl font-semibold text-white">Apresiasi</span>
      </Link>
    </nav>
  );
};

export default Logo;
