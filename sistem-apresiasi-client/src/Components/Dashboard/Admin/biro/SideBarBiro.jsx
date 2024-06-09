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

  return (
    <div className="flex h-screen bg-white font-poppins">
      <div className="w-full p-4 md:w-64 md:p-6">
        <div className="flex items-center mb-6 gap-x-4">
          <img src="./src/assets/logousk.png" className="w-[60px] cursor-pointer h-[60px] " alt="Logo" />
          <h1 className="text-xl font-medium text-black duration-200 origin-left">APRESIASI</h1>
        </div>
        <ul className="pt-4">
          <li onClick={() => setSelectedMenu("Dashboard")} className={`cursor-pointer mb-7 flex gap-3 items-center ${selectedMenu === "Dashboard" ? " text-amber-500 " : ""}`}>
            <RxDashboard size={27} />
            <span className="hidden  md:block text-[15px]">Dashboard</span>
          </li>
          <div>
            <h3 className=" ml-2 text-[14px] mb-4 text-slate-600 lg:ml-5 ">Manajement Berkas</h3>
          </div>
          <li onClick={() => setSelectedMenu("SKPI")} className={`cursor-pointer mb-7 flex gap-3 items-center ${selectedMenu === "SKPI" ? " text-amber-500 " : ""}`}>
            <GoFileSymlinkFile size={27} />
            <span className="hidden  md:block text-[15px]">SKPI</span>
          </li>
          <div>
            <h3 className="ml-2 text-[14px] mb-4 text-slate-600 lg:ml-5">Kegiatan Mandiri</h3>
          </div>
          <li onClick={() => setSelectedMenu("Kegiatan Lomba")} className={`cursor-pointer mb-7 flex gap-3 items-center ${selectedMenu === "Kegiatan Lomba" ? " text-amber-500 " : ""}`}>
            <TfiCup size={27} />
            <span className="hidden  md:block text-[15px]">Kegiatan Lomba</span>
          </li>
          <li onClick={() => setSelectedMenu("Formulir")} className={`cursor-pointer mb-7 flex gap-3 items-center ${selectedMenu === "Formulir" ? " text-amber-500 " : ""}`}>
            <LiaFileUploadSolid size={33} />
            <span className="hidden  md:block text-[15px]">Formulir</span>
          </li>
          <div>
            <h3 className=" ml-2 text-[14px] mb-4 text-slate-600 lg:ml-5 ">Kegiatan Non-Mandiri</h3>
          </div>
          <li className={`cursor-pointer mb-7 flex gap-3 items-center ${selectedMenu === "Pertukaran Mahasiswa" ? " text-amber-500 " : ""}`} onClick={() => setSelectedMenu("Pertukaran Mahasiswa")}>
            <LiaExchangeAltSolid size={27} />
            <span className="hidden  md:block text-[15px]">Pertukaran Mahasiswa</span>
          </li>
          <li className={`cursor-pointer mb-7 flex gap-3 items-center ${selectedMenu === "Pengabdian Mahasiswa" ? " text-amber-500 " : ""}`} onClick={() => setSelectedMenu("Pengabdian Mahasiswa")}>
            <LiaHandsHelpingSolid size={30} />
            <span className="hidden  md:block text-[15px]">Pengabdian Mahasiswa</span>
          </li>
          <li className={`cursor-pointer mb-7 flex gap-3 items-center ${selectedMenu === "Pembinaan Mental Bangsa" ? " text-amber-500 " : ""}`} onClick={() => setSelectedMenu("Pembinaan Mental Bangsa")}>
            <PiStudentLight size={30} />
            <span className="hidden  md:block text-[15px]"> Pembinaan Mental Bangsa</span>
          </li>
          <li className={`cursor-pointer mb-7 flex gap-3 items-center ${selectedMenu === "Mahasiswa Berwira Usaha" ? " text-amber-500 " : ""}`} onClick={() => setSelectedMenu("Mahasiswa Berwira Usaha")}>
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

      <div className="h-screen p-8 text-lg lg:flex-1">
        {selectedMenu === "Dashboard" && <Dashboard />}
        {selectedMenu === "SKPI" && <Skpi />}
        {selectedMenu === "Kegiatan Lomba" && <KegiatanLomba />}
        {selectedMenu === "Formulir" && <Formulir />}
        {selectedMenu === "Pertukaran Mahasiswa" && <PertukaranMahasiswa />}
        {selectedMenu === "Pengabdian Mahasiswa" && <PengabdianMahasiswa />}
        {selectedMenu === "Pembinaan Mental Bangsa" && <PembinaanMental />}
        {selectedMenu === "Mahasiswa Berwira Usaha" && <MahasiswaBerwiraUsaha />}
      </div>
    </div>
  );
};

export default SideBarBiro;
