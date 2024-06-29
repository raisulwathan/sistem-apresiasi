import { useState, useEffect } from "react";
import Profile from "./Profile";
import Upload from "./Upload";
import Transkrip from "./Transkrip";
import History from "./History";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getToken, getUserId } from "../../../utils/Config";
import { RiUserLocationLine } from "react-icons/ri";
import { SlCloudUpload } from "react-icons/sl";
import { GrDocumentTime } from "react-icons/gr";
import { TbHistory, TbScanPosition } from "react-icons/tb";
import { IoIosLogOut } from "react-icons/io";
import { FaUserGraduate } from "react-icons/fa6";

const SideBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [npm, setNpm] = useState("");
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState("Profile");
  const [selectedMenu, setSelectedMenu] = useState("Profile");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
    setSelectedMenu(menu);
  };

  const renderContent = () => {
    switch (selectedMenu) {
      case "Profile":
        return <Profile />;
      case "Upload":
        return <Upload />;
      case "Transkrip":
        return <Transkrip />;
      case "History":
        return <History />;
      default:
        return null;
    }
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  useEffect(() => {
    const token = getToken();
    const userId = getUserId();
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
      navigate("/login");
    }

    const fetchDataUser = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/v1/users/${userId}`);

        const userRole = response.data.data.user.role;

        if (userRole !== "BASIC") {
          navigate("/forbidden");
        }
        setUsername(response.data.data.user.name);
        setNpm(response.data.data.user.npm);
      } catch (error) {
        setIsLoggedIn(false);
        navigate("/login");
      }
    };

    fetchDataUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <div className="flex w-full h-screen bg-[#0f172a]">
      <div className="flex flex-col p-7 bg-[#0f172a] ">
        <div className="flex items-center mb-6 gap-x-4">
          <img src="./src/assets/logoApresiasi.png" className="hidden w-8 h-8 cursor-pointer lg:block" alt="Logo" />
          <h1 className="hidden font-medium text-slate-300  text-[18px] font-poppins duration-200 origin-left lg:block">APRESIASI</h1>
          <button onClick={toggleMobileSidebar} className="pl-5 lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-gray-300 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
        <hr className="border-t border-gray-600 mb-7"></hr>
        <div className=" text-center p-3 hidden lg:block rounded-lg opacity-60 bg-[#1A4057] ">
          <h1 className="text-lg font-medium text-slate-300">{username}</h1>
          <p className="text-sm text-slate-300">{npm}</p>
        </div>
        <ul className="flex-1 pt-10 lg:block">
          <hr className="border-t border-gray-600 mb-7"></hr>
          {isLoggedIn && (
            <>
              <li onClick={() => handleMenuClick("Profile")} className={`flex text-gray-300 py-3 px-1 rounded-md items-center gap-3 cursor-pointer mb-7 ${activeMenu === "Profile" ? "bg-[#1A4057] text-[#77b5c5] " : " hover:bg-[#1A4057]"}`}>
                <RiUserLocationLine size={24} />
                <span className="hidden text-sm md:block">Profil</span>
              </li>
              <li onClick={() => handleMenuClick("Upload")} className={`flex items-center py-3 px-1 rounded-md text-gray-300 gap-3 cursor-pointer mb-7 ${activeMenu === "Upload" ? "bg-[#1A4057] text-[#77b5c5] " : " hover:bg-[#1A4057]"}`}>
                <SlCloudUpload size={24} />
                <span className="hidden text-sm md:block">Upload Kegiatan </span>
              </li>
              <li
                onClick={() => handleMenuClick("Transkrip")}
                className={`flex items-center py-3 px-1 rounded-md text-gray-300 gap-3 cursor-pointer mb-7 ${activeMenu === "Transkrip" ? "bg-[#1A4057] text-[#77b5c5]" : " hover:bg-[#1A4057]"}`}
              >
                <GrDocumentTime size={24} />
                <span className="hidden text-sm md:block">Transkrip Mahasiswa </span>
              </li>
              <li onClick={() => handleMenuClick("History")} className={`flex items-center py-3 px-1 rounded-md text-gray-300 gap-3 cursor-pointer mb-7 ${activeMenu === "History" ? "bg-[#1A4057] text-[#77b5c5]" : " hover:bg-[#1A4057]"}`}>
                <TbHistory size={24} />
                <span className="hidden text-sm md:block">Riwayat Kegiatan</span>
              </li>
            </>
          )}
          <hr className="border-t border-gray-600 mb-7"></hr>
          {isLoggedIn && (
            <li onClick={handleLogout} className="flex items-center hover:bg-[#1A4057] gap-3 px-1 py-3 rounded-md cursor-pointer text-gray-300 mb-7">
              <IoIosLogOut size={24} />
              <span className="hidden text-sm text-slate-300 md:block">Log Out</span>
            </li>
          )}
        </ul>
      </div>
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0f172a] shadow-xl  overflow-y-auto transform transition-transform lg:hidden ${isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
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
              <button onClick={() => setSelectedMenu("Upload")} className={`text-gray-300 flex font-medium hover:bg-[#1A4057] focus:outline-none ${selectedMenu === "Upload" ? "text-gray-300" : ""}`}>
                <SlCloudUpload size={24} />
                <h4 className="mt-1 ml-2 text-gray-300">Upload Kegiatan</h4>
              </button>
            </li>
            <li className="mb-4 ">
              <button onClick={() => setSelectedMenu("Transkrip")} className={`text-gray-300 flex font-medium hover:bg-[#1A4057] focus:outline-none ${selectedMenu === "Transkrip" ? "text-gray-300" : ""}`}>
                <GrDocumentTime size={24} />
                <h4 className="mt-1 ml-2 ">Transkrip</h4>
              </button>
            </li>
            <li className="mt-8 mb-4 ">
              <button onClick={() => setSelectedMenu("History")} className={`text-gray-300 flex font-medium hover:bg-[#1A4057] focus:outline-none ${selectedMenu === "History" ? "text-gray-300" : ""}`}>
                <TbHistory size={24} />
                <p className="mt-1 ml-2">Riwayat</p>
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

export default SideBar;
