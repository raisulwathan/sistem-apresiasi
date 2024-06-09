import { useState, useEffect } from "react";
import { PiUserDuotone } from "react-icons/pi";
import Profile from "./Profile";
import Upload from "./Upload";
import Transkrip from "./Transkrip";
import History from "./History";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getToken, getUserId } from "../../../utils/Config";
import { FaUser, FaUpload, FaClipboard, FaHistory } from "react-icons/fa";
import { TbHistory } from "react-icons/tb";
import { FiUserCheck } from "react-icons/fi";
import { TbHistoryToggle } from "react-icons/tb";
import { SlDocs } from "react-icons/sl";
import { HiOutlineDocumentArrowDown } from "react-icons/hi2";

const SideBar = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [npm, setNpm] = useState("");
  const navigate = useNavigate();

  const Menus = [
    { title: "Profile", src: "Profile", content: <Profile />, icon: <FiUserCheck size={30} /> },
    { title: "Upload Kegiatan", src: "Upload", content: <Upload />, icon: <HiOutlineDocumentArrowDown size={30} /> },
    { title: "Transkrip SKPI", src: "Transkrip", content: <Transkrip />, icon: <SlDocs size={27} /> },
    { title: "Riwayat", src: "History", content: <History />, icon: <TbHistoryToggle size={30} /> },
  ];

  const [selectedMenu, setSelectedMenu] = useState(Menus[0]);

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

  const handleMenuClick = (menu) => {
    setSelectedMenu(menu);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const toggleUserDropdown = () => {
    setUserDropdownOpen(!userDropdownOpen);
  };

  const handleResize = () => {
    setSidebarOpen(window.innerWidth > 768);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="flex w-full h-screen bg-black">
      <div className={`fixed inset-y-0 left-0 z-50 w-[400px] bg-white shadow-xl border border-black overflow-y-auto transform transition-transform lg:hidden ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-4">
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="text-black hover:text-red-600 focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M3.414 6.343a2 2 0 0 1 2.828-2.828L10 7.172l3.757-3.757a2 2 0 1 1 2.828 2.828L12.828 10l3.757 3.757a2 2 0 1 1-2.828 2.828L10 12.828l-3.757 3.757a2 2 0 1 1-2.828-2.828L7.172 10 3.414 6.343z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
        <div className="p-4">
          <ul>
            {Menus.map((menu, index) => (
              <li key={index} className="mb-4 ">
                <button onClick={() => handleMenuClick(menu)} className={`text-gray-900 flex font-medium hover:text-secondary focus:outline-none ${selectedMenu === menu ? "text-secondary" : ""}`}>
                  {menu.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="absolute bottom-0 w-full">
          <button onClick={handleLogout} className="block w-full py-2 font-bold text-center text-white bg-slate-800 hover:bg-gray-300 focus:outline-none">
            Log Out
          </button>
        </div>
      </div>
      {!isSidebarOpen && (
        <button onClick={() => setSidebarOpen(true)} className="fixed p-2 text-white rounded-full left-2 lg:hidden top-10 focus:outline-none">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      )}
      <div className={`lg:flex lg:flex-col w-auto p-4  lg:w-80 lg:m-4 lg:rounded-lg lg:p-8 lg:pt-8 lg:relative lg:duration-300 ${!isSidebarOpen && ""}`}>
        <ul className="lg:pt-6">
          <li className="relative hidden py-2 mx-1 mt-20 mb-24 text-white rounded-lg lg:block hover:bg-dimBlue">
            <div className="flex items-center cursor-pointer" onClick={toggleUserDropdown}>
              <div className={`flex flex-col items-start pt-2 duration-400`}>
                <PiUserDuotone size={50} />
                <span className="text-[30px] hidden lg:block">{username}</span>
                <span className="hidden text-base text-gray-500 lg:block">{npm}</span>
              </div>
              <ul className={`absolute left-0 ${userDropdownOpen ? "" : "hidden"} mt-[230px] bg-white border w-40 text-black rounded-lg`}>
                <li className="cursor-pointer " onClick={() => handleMenuClick(Menus[0])}>
                  <div className="flex items-center p-2 rounded-lg hover:bg-dimBlue ">
                    {" "}
                    <h1 className="lg:pl-3">Profile</h1>
                  </div>
                </li>
                <li className="cursor-pointer " onClick={handleLogout}>
                  <div className="flex items-center p-2 rounded-lg hover:bg-dimBlue ">
                    {" "}
                    <h1 className="lg:pl-3">Log Out</h1>
                  </div>
                </li>
              </ul>
            </div>
          </li>
          <div className="mt-32 lg:mt-0">
            {Menus.map((menu, index) => (
              <li key={index} className="mb-4 ">
                <button
                  onClick={() => handleMenuClick(menu)}
                  className={`flex rounded-md p-2 text-[25px] text-slate-600 cursor-pointer hover:text-white hover:text-[27px] items-center gap-x-4 ${selectedMenu === menu ? "bg-light-white" : ""}`}
                >
                  {!isSidebarOpen && menu.icon}
                  {isSidebarOpen && menu.title}
                </button>
              </li>
            ))}
          </div>
        </ul>
      </div>
      <div className="flex-1 h-screen text-lg">{selectedMenu.content}</div>
    </div>
  );
};

export default SideBar;
