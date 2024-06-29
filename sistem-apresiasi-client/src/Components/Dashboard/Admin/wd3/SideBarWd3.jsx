import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getToken, getUserId } from "../../../../utils/Config";
import Skpi from "./Skpi";
import KegiatanMahasiswa from "./KegiatanMahasiswa";
import Dashboard from "./Dashboard";
import { GoFileSymlinkFile } from "react-icons/go";
import { RxDashboard } from "react-icons/rx";
import { GoFile } from "react-icons/go";
import { LuUsers } from "react-icons/lu";
import { IoIosLogOut } from "react-icons/io";

const SideBarWd3 = () => {
  const [selectedMenu, setSelectedMenu] = useState("Kegiatan Mahasiswa");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState("Dashboard");

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
    setSelectedMenu(menu);
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

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
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

      if (userRole !== "WD") {
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
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen w-full  bg-[#313347] font-poppins">
      <div className="flex flex-col p-7  bg-[#313347]">
        <div className="flex items-center mb-6 gap-x-4">
          <img src="./src/assets/logousk.png" className="hidden w-12 h-12 cursor-pointer lg:block" alt="Logo" />
          <h1 className="hidden font-medium text-slate-300  text-[18px] font-poppins duration-200 origin-left lg:block">APRESIASI</h1>
          <button onClick={toggleMobileSidebar} className="pl-5 lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-black cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
        <hr className="border-t border-gray-600 mb-7"></hr>
        <ul className="flex-1 pt-10 lg:block">
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

      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl border border-secondary overflow-y-auto transform transition-transform lg:hidden ${isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        {/* Konten Sidebar Mobile */}
        <div className="p-4">
          <button onClick={toggleMobileSidebar} className="text-secondary hover:text-gray-900 focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M3.414 6.343a2 2 0 0 1 2.828-2.828L10 7.172l3.757-3.757a2 2 0 1 1 2.828 2.828L12.828 10l3.757 3.757a2 2 0 1 1-2.828 2.828L10 12.828l-3.757 3.757a2 2 0 1 1-2.828-2.828L7.172 10 3.414 6.343z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
        <div className={`${isMobileSidebarOpen ? "block" : "hidden"} p-4`}>
          <ul>
            <li className="mb-4 ">
              <button onClick={() => setSelectedMenu("Dashboard")} className={`text-gray-900 flex font-medium hover:text-amber-700 focus:outline-none ${selectedMenu === "Kegiatan Mahasiswa" ? "text-amber-500" : ""}`}>
                <RxDashboard size={27} />
                <h4 className="mt-1 ml-2">Dashboard</h4>
              </button>
            </li>
            <li className="mb-4 ">
              <button onClick={() => setSelectedMenu("Kegiatan Mahasiswa")} className={`text-gray-900 flex font-medium hover:text-amber-700 focus:outline-none ${selectedMenu === "Kegiatan Mahasiswa" ? "text-amber-500" : ""}`}>
                <GoFile size={27} />
                <h4 className="mt-1 ml-2">Kegiatan Mahasiswa</h4>
              </button>
            </li>
            <li className="mt-8 mb-4 ">
              <button onClick={() => setSelectedMenu("SKPI")} className={`text-gray-900 flex font-medium hover:text-amber-700 focus:outline-none ${selectedMenu === "SKPI" ? "text-amber-500" : ""}`}>
                <GoFileSymlinkFile size={27} />
                <p className="mt-1 ml-2">SKPI</p>
              </button>
            </li>
          </ul>
        </div>

        <div className={`${isMobileSidebarOpen ? "block" : "hidden"} absolute bottom-0 w-full`}>
          <button onClick={handleLogout} className="block w-full py-2 font-bold text-center text-gray-900 bg-secondary hover:bg-gray-300 focus:outline-none">
            Log Out
          </button>
        </div>
      </div>
      <div className="flex-1 text-base ">{renderContent()}</div>
    </div>
  );
};

export default SideBarWd3;
