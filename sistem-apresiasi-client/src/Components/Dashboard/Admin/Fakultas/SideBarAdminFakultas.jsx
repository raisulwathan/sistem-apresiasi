import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import KegiatanLomba from "./KegiatanLomba";
import KegiatanMahasiswa from "./KegiatanMahasiswa";
import Formulir from "./Formulir";
import axios from "axios";
import { getToken, getUserId } from "../../../../utils/Config";
import Skpi from "./Skpi";
import Dashboard from "./Dashboard";
import { GoFileSymlinkFile } from "react-icons/go";
import { RxDashboard } from "react-icons/rx";
import { GoFile } from "react-icons/go";
import { TfiCup } from "react-icons/tfi";
import { LiaFileUploadSolid } from "react-icons/lia";
import { IoIosLogOut } from "react-icons/io";

const SideBarAdminFakultas = () => {
  const [selectedMenu, setSelectedMenu] = useState("Dashboard");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState("Dashboard");

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
    setActiveMenu(menu);
    setSelectedMenu(menu);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const fetchUserData = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5001/api/v1/users/${userId}`);
      const userRole = response.data.data.user.role;
      if (userRole !== "OPERATOR") {
        navigate("/forbidden");
      }
      setUsername(response.data.data.user.name);
    } catch (error) {
      setIsLoggedIn(false);
      navigate("/login");
    }
  };

  const renderContent = () => {
    switch (selectedMenu) {
      case "Dashboard":
        return <Dashboard />;
      case "Skpi":
        return <Skpi />;
      case "Kegiatan Mahasiswa":
        return <KegiatanMahasiswa />;
      case "Kegiatan Lomba":
        return <KegiatanLomba />;
      case "Formulir":
        return <Formulir />;
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
        <hr className="border-t border-gray-600 mb-7"></hr>
        <ul className="flex-1 pt-10">
          <li onClick={() => handleMenuClick("Dashboard")} className={`flex text-slate-300 py-2 px-1 rounded-lg items-center gap-3 cursor-pointer mb-7 ${activeMenu === "Dashboard" ? "bg-[#0F6292] " : " hover:bg-[#0F6292]"}`}>
            <RxDashboard size={25} />
            <span className="hidden text-sm md:block">Dashboard</span>
          </li>
          <hr className="border-t border-gray-600 mb-7"></hr>
          {isLoggedIn && (
            <>
              <li
                onClick={() => handleMenuClick("Kegiatan Mahasiswa")}
                className={`flex text-slate-300 items-center gap-3 py-2 px-1 rounded-lg cursor-pointer mb-7 ${activeMenu === "Kegiatan Mahasiswa" ? "bg-[#0F6292] " : " hover:bg-[#0F6292]"}`}
              >
                <GoFile size={25} />
                <span className="hidden text-sm md:block">Kegiatan Mahasiswa</span>
              </li>
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
            </>
          )}
          <hr className="border-t border-gray-600 mb-7"></hr>
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

export default SideBarAdminFakultas;
