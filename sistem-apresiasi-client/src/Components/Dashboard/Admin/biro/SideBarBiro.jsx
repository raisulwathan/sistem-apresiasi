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
  const [subMenuOpenMandiri, setSubMenuOpenMandiri] = useState(false);
  const [subMenuOpenNonLomba, setSubMenuOpenNonLomba] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

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
  }, []);

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

  const handleMenuClick = (menu) => {
    if (menu === "Kegiatan Mandiri") {
      setSubMenuOpenMandiri(!subMenuOpenMandiri);
    } else if (menu === "Kegiatan Non Lomba") {
      setSubMenuOpenNonLomba(!subMenuOpenNonLomba);
    } else {
      setSelectedMenu(menu);
      setSubMenuOpenMandiri(false);
      setSubMenuOpenNonLomba(false);
    }
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const toggleUserDropdown = () => {
    setUserDropdownOpen(!userDropdownOpen);
  };

  const renderContent = () => {
    switch (selectedMenu) {
      case "Dashboard":
        return <Dashboard />;
      case "SKPI":
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
    <div className="flex h-screen bg-white font-poppins">
      <div className="w-full p-4 md:w-64 md:p-6">
        <div className="flex items-center mb-6 gap-x-4">
          <img src="./src/assets/logousk.png" className="w-[60px] cursor-pointer h-[60px] " alt="Logo" />
          <h1 className="text-xl font-medium text-black duration-200 origin-left">APRESIASI</h1>
        </div>
        <ul className="pt-4">
          <li onClick={() => handleMenuClick("Dashboard")} className="flex items-center gap-3 cursor-pointer mb-7">
            <RxDashboard size={27} />
            <span className="hidden  md:block text-[15px]">Dashboard</span>
          </li>
          <div>
            <h3 className=" ml-2 text-[14px] text-slate-600 lg:ml-5 ">Manajement Berkas</h3>
          </div>
          <li onClick={() => handleMenuClick("SKPI")} className="flex items-center gap-3 mt-4 cursor-pointer mb-7">
            <GoFileSymlinkFile size={27} />
            <span className="hidden  md:block text-[15px]">SKPI</span>
          </li>
          <div>
            <h3 className=" ml-2 text-[14px] text-slate-600 lg:ml-5 ">Kegiatan Mandiri</h3>
          </div>
          <li onClick={() => handleMenuClick("Kegiatan Lomba")} className="flex items-center gap-3 mt-4 cursor-pointer mb-7">
            <TfiCup size={27} />
            <span className="hidden  md:block text-[15px]">Kegiatan Lomba</span>
          </li>
          <li onClick={() => handleMenuClick("Formulir")} className="flex items-center gap-3 cursor-pointer mb-7 ">
            <LiaFileUploadSolid size={33} />
            <span className="hidden  md:block text-[15px]">Formulir</span>
          </li>
          <div>
            <h3 className=" ml-2 text-[14px] text-slate-600 lg:ml-5 ">Kegiatan Non-Mandiri</h3>
          </div>
          <li className="flex items-center gap-3 mt-4 cursor-pointer mb-7 " onClick={() => setSelectedMenu("Pertukaran Mahasiswa")}>
            <LiaExchangeAltSolid size={27} />
            <span className="hidden  md:block text-[15px]">Pertukaran Mahasiswa</span>
          </li>
          <li className="flex items-center gap-3 cursor-pointer mb-7 " onClick={() => setSelectedMenu("Pengabdian Mahasiswa")}>
            <LiaHandsHelpingSolid size={30} />
            <span className="hidden  md:block text-[15px]">Pengabdian Mahasiswa</span>
          </li>
          <li className="flex items-center gap-3 cursor-pointer mb-7 " onClick={() => setSelectedMenu("Pembinaan Mental Bangsa")}>
            <PiStudentLight size={30} />
            <span className="hidden  md:block text-[15px]"> Pembinaan Mental Bangsa</span>
          </li>
          <li className="flex items-center gap-3 cursor-pointer mb-7 " onClick={() => setSelectedMenu("Mahasiswa Berwira Usaha")}>
            <LiaBusinessTimeSolid size={27} />
            <span className="hidden  md:block text-[15px]"> Mahasiswa Berwira Usaha</span>
          </li>

          <div className=" mt-[80px]">
            <div className="flex items-center cursor-pointer" onClick={toggleUserDropdown}>
              <LuUsers size={27} />
              <span className="hidden pt-2 pl-4 text-[15px] md:block duration-400">{username}</span>
              {userDropdownOpen && (
                <ul className="absolute z-10 w-40 mt-[100px] bg-white border rounded-lg left-7 border-slate-700">
                  <li className="cursor-pointer" onClick={handleLogout}>
                    <div className="flex items-center p-2 rounded-lg hover:bg-dimBlue hover:text-secondary">
                      <IoIosLogOut size={27} />
                      <h1 className="lg:pl-3">Log Out</h1>
                    </div>
                  </li>
                </ul>
              )}
            </div>
          </div>
        </ul>{" "}
      </div>

      <div className="flex-1 p-8 text-lg">{renderContent()}</div>
    </div>
  );
};

export default SideBarBiro;
