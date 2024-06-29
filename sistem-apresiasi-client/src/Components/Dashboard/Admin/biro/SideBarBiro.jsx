import { useState, useEffect } from "react";
import { logoDark, cup, Upload, nonlomba, next } from "../../../../assets";
import KegiatanLomba from "./KegiatanLomba";
import { useNavigate } from "react-router-dom";
import PertukaranMahasiswa from "./PertukaranMahasiswa";
import PengabdianMahasiswa from "./PengabdianMahasiswa";
import Formulir from "./Formulir";
import PembinaanMental from "./PembinaanMental";
import MahasiswaBerwiraUsaha from "./MahasiswaBerwiraUsaha";
import Dashboard from "../biro/Dashboard";
import Skpi from "./Skpi";
import axios from "axios";
import { getToken, getUserId } from "../../../../utils/Config";
import { LuUsers } from "react-icons/lu";
import { IoIosLogOut } from "react-icons/io";
import { GoFileSymlinkFile } from "react-icons/go";
import { RxDashboard } from "react-icons/rx";
import { TfiCup } from "react-icons/tfi";
import { LiaFileUploadSolid } from "react-icons/lia";
import { LiaExchangeAltSolid } from "react-icons/lia";
import { LiaHandsHelpingSolid } from "react-icons/lia";
import { PiStudentLight } from "react-icons/pi";
import { LiaBusinessTimeSolid } from "react-icons/lia";

const SideBarBiro = () => {
  const [selectedMenu, setSelectedMenu] = useState("Dashboard");
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [activeMenu, setActiveMenu] = useState("Dashboard");

  const fetchUserData = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5001/api/v1/users/${userId}`);

      const userRole = response.data.data.user.role;

      if (userRole !== "ADMIN") {
        navigate("/forbidden");
      }
      setUsername(response.data.data.user.name);
    } catch (error) {
      setIsLoggedIn(false);
      navigate("/login");
    }
  };

  useEffect(() => {
    setSelectedMenu("Dashboard");
    const token = getToken();
    const userId = getUserId();
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
      navigate("/login");
    }
    fetchUserData(userId);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const toggleUserDropdown = () => {
    setUserDropdownOpen(!userDropdownOpen);
  };

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
    setSelectedMenu(menu);
  };

  const renderContent = () => {
    switch (selectedMenu) {
      case "Dashboard":
        return <Dashboard />;
      case "Skpi":
        return <Skpi />;
      case "Kegiatan Lomba":
        return <KegiatanLomba />;
      case "Formulir":
        return <Formulir />;
      case "Pertukaran Mahasiswa":
        return <PertukaranMahasiswa />;
      case "Pengabdian Mahasiswa":
        return <PengabdianMahasiswa />;
      case "Pembinaan Mental Bangsa":
        return <PembinaanMental />;
      case "Mahasiswa Berwira Usaha":
        return <MahasiswaBerwiraUsaha />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen w-full  bg-[#313347] font-poppins">
      <div className="flex flex-col p-7  bg-[#313347]">
        <div className="flex items-center mb-6 gap-x-4">
          <img src="./src/assets/logousk.png" className="w-12 h-12 cursor-pointer" alt="Logo" />
          <h1 className="font-medium text-slate-300 duration-200 origin-left text-[18px] font-poppins">APRESIASI</h1>
        </div>
        <hr className="mb-5 border-t border-gray-600"></hr>
        <ul className="flex-1 pt-10">
          <li onClick={() => handleMenuClick("Dashboard")} className={`flex text-slate-300 py-2 px-1 rounded-lg items-center gap-3 cursor-pointer mb-7 ${activeMenu === "Dashboard" ? "bg-[#0F6292] " : " hover:bg-[#0F6292]"}`}>
            <RxDashboard size={25} />
            <span className="hidden text-sm md:block">Dashboard</span>
          </li>
          <hr className="mb-5 border-t border-gray-600"></hr>
          {isLoggedIn && (
            <>
              <li onClick={() => handleMenuClick("Skpi")} className={`flex items-center py-2 px-1 rounded-lg text-slate-300 gap-3 cursor-pointer mb-7 ${activeMenu === "Skpi" ? "bg-[#0F6292] " : " hover:bg-[#0F6292]"}`}>
                <GoFileSymlinkFile size={25} />
                <span className="hidden text-sm md:block">SKPI</span>
              </li>

              <li onClick={() => handleMenuClick("Kegiatan Lomba")} className={`flex text-slate-300 items-center gap-3 py-2 px-1 rounded-lg cursor-pointer mb-7 ${activeMenu === "Kegiatan Lomba" ? "bg-[#0F6292] " : " hover:bg-[#0F6292]"}`}>
                <TfiCup size={25} />
                <span className="hidden text-sm md:block">Kegiatan Lomba</span>
              </li>
              <li onClick={() => handleMenuClick("Formulir")} className={`flex text-slate-300 py-2 px-1 rounded-lg items-center gap-3 cursor-pointer mb-7 ${activeMenu === "Formulir" ? "bg-[#0F6292] " : " hover:bg-[#0F6292]"}`}>
                <LiaFileUploadSolid size={25} />
                <span className="hidden text-sm md:block">Formulir</span>
              </li>
              <hr className="mb-5 border-t border-gray-600"></hr>
              <li
                onClick={() => handleMenuClick("Pertukaran Mahasiswa")}
                className={`flex text-slate-300 py-2 px-1 rounded-lg items-center gap-3 cursor-pointer mb-7 ${activeMenu === "Pertukaran Mahasiswa" ? "bg-[#0F6292] " : " hover:bg-[#0F6292]"}`}
              >
                <LiaExchangeAltSolid size={25} />
                <span className="hidden text-sm md:block">Pertukaran Mahasiswa</span>
              </li>
              <li
                onClick={() => handleMenuClick("Pengabdian Mahasiswa")}
                className={`flex text-slate-300 py-2 px-1 rounded-lg items-center gap-3 cursor-pointer mb-7 ${activeMenu === "Pengabdian Mahasiswa" ? "bg-[#0F6292] " : " hover:bg-[#0F6292]"}`}
              >
                <LiaHandsHelpingSolid size={25} />
                <span className="hidden text-sm md:block">Pengabdian Mahasiswa</span>
              </li>
              <li
                onClick={() => handleMenuClick("Pembinaan Mental Bangsa")}
                className={`flex text-slate-300 py-2 px-1 rounded-lg items-center gap-3 cursor-pointer mb-7 ${activeMenu === "Pembinaan Mental Bangsa" ? "bg-[#0F6292] " : " hover:bg-[#0F6292]"}`}
              >
                <PiStudentLight size={25} />
                <span className="hidden text-sm md:block">Pembinaan Mental </span>
              </li>
              <li
                onClick={() => handleMenuClick("Mahasiswa Berwira Usaha")}
                className={`flex text-slate-300 py-2 px-1 rounded-lg items-center gap-3 cursor-pointer mb-7 ${activeMenu === "Mahasiswa Berwira Usaha" ? "bg-[#0F6292] " : " hover:bg-[#0F6292]"}`}
              >
                <LiaBusinessTimeSolid size={25} />
                <span className="hidden text-sm md:block"> Berwira Usaha</span>
              </li>
            </>
          )}
          <hr className="mb-5 border-t border-gray-600"></hr>
          {isLoggedIn && (
            <li onClick={handleLogout} className="flex items-center hover:bg-[#0F6292] gap-3 px-1 py-2 rounded-lg cursor-pointer text-slate-300 mb-7">
              <IoIosLogOut size={25} />
              <span className="hidden text-sm text-slate-300 md:block">Log Out</span>
            </li>
          )}
        </ul>
      </div>

      <div className="flex-1 text-base ">{renderContent()}</div>
    </div>
  );
};

export default SideBarBiro;
