import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getToken, getUserId } from "../../../../utils/Config";
import Skpi from "./Skpi";
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
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false); // State untuk mengontrol tampilan sidebar mobile
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
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

      if (userRole !== "WR") {
        navigate("/forbidden");
      }
      setUsername(response.data.data.user.name);
    } catch (error) {
      setIsLoggedIn(false);
      navigate("/login");
    }
  };

  return (
    <div className="flex bg-white font-poppins">
      <div className={` lg:p-8 lg:w-[285px] pt-11 relative`}>
        <div className="flex items-center mb-6 gap-x-4">
          <div className="flex items-center mb-6 gap-x-4">
            <img src="./src/assets/logousk.png" className="w-[60px] cursor-pointer h-[60px] " alt="Logo" />
            <h1 className="text-xl font-medium text-black duration-200 origin-left">APRESIASI</h1>
          </div>
          <button onClick={toggleMobileSidebar} className="lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-black cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
        <ul className={`${isMobileSidebarOpen ? "block" : "hidden"} pt-10 lg:block`}>
          <li onClick={() => setSelectedMenu("Dashboard")} className={`cursor-pointer mb-7 flex gap-3 items-center ${selectedMenu === "Dashboard" ? " text-indigo-400 " : ""}`}>
            <RxDashboard size={27} />
            <span className="hidden  md:block text-[15px]">Dashboard</span>
          </li>

          <li onClick={() => setSelectedMenu("SKPI")} className={`cursor-pointer mb-7 flex gap-3 items-center ${selectedMenu === "SKPI" ? " text-indigo-400 " : ""}`}>
            <GoFileSymlinkFile size={27} />
            <span className="hidden  md:block text-[15px]">SKPI</span>
          </li>
        </ul>

        <div className="hidden lg:block">
          <li className="relative mx-1 mt-[380px] rounded-lg" onClick={toggleDropdown}>
            <div className="flex items-center cursor-pointer">
              <LuUsers size={27} />
              <span className={`pl-4 pt-2 duration-400`}>{username}</span>
            </div>

            {isDropdownOpen && (
              <ul className={`absolute left-0 mt-2 bg-white border w-40 border-slate-700 rounded-lg z-10`}>
                <li className="cursor-pointer" onClick={handleLogout}>
                  <div className="flex items-center p-2 rounded-lg hover:bg-dimBlue hover:text-secondary">
                    <IoIosLogOut size={27} />
                    <h1 className="lg:pl-3">Log Out</h1>
                  </div>
                </li>
              </ul>
            )}
          </li>
        </div>
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
              <button onClick={() => setSelectedMenu("Dashboard")} className={`text-gray-900 flex font-medium hover:text-secondary focus:outline-none ${selectedMenu === "Kegiatan Mahasiswa" ? "text-secondary" : ""}`}>
                <RxDashboard size={27} />
                <h4 className="mt-1 ml-2">Dashboard</h4>
              </button>
            </li>
            <li className="mb-4 ">
              <button onClick={() => setSelectedMenu("Kegiatan Mahasiswa")} className={`text-gray-900 flex font-medium hover:text-secondary focus:outline-none ${selectedMenu === "Kegiatan Mahasiswa" ? "text-secondary" : ""}`}>
                <GoFile size={27} />
                <h4 className="mt-1 ml-2">Kegiatan Mahasiswa</h4>
              </button>
            </li>
            <li className="mt-8 mb-4 ">
              <button onClick={() => setSelectedMenu("SKPI")} className={`text-gray-900 flex font-medium hover:text-secondary focus:outline-none ${selectedMenu === "SKPI" ? "text-secondary" : ""}`}>
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

      <div className="h-screen p-8 text-lg lg:flex-1">
        {selectedMenu === "Dashboard" && <Dashboard />}

        {selectedMenu === "SKPI" && <Skpi />}
      </div>
    </div>
  );
};

export default SideBarWd3;
