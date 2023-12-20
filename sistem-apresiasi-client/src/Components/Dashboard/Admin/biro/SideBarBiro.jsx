import { useState, useEffect } from "react";
import { logoDark, cup, Upload, nonlomba, next } from "../../../../assets";
import KegiatanLomba from "./KegiatanLomba";

import PertukaranMahasiswa from "./PertukaranMahasiswa";
import PengabdianMahasiswa from "./PengabdianMahasiswa";
import Formulir from "./Formulir";
import PembinaanMental from "./PembinaanMental";
import MahasiswaBerwiraUsaha from "./MahasiswaBerwiraUsaha";
import axios from "axios";
import Dashboard from "./Dashboard";

const SideBarBiro = () => {
  const [selectedMenu, setSelectedMenu] = useState("Dashboard");
  const [subMenuOpenMandiri, setSubMenuOpenMandiri] = useState(false);
  const [subMenuOpenNonLomba, setSubMenuOpenNonLomba] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    setSelectedMenu("Dashboard");
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
  const handleLogout = () => {};

  const toggleUserDropdown = () => {
    setUserDropdownOpen(!userDropdownOpen);
  };

  const renderSubMenuMandiri = () => {
    if (subMenuOpenMandiri) {
      return (
        <div className={`ml-5 submenu transition-all duration-300 ${subMenuOpenMandiri ? "block" : "hidden"}`}>
          <div className="flex items-center gap-3 mb-3 cursor-pointer sub-item" onClick={() => setSelectedMenu("Kegiatan Lomba")}>
            <img src={next} alt="Kegiatan Lomba" className={`w-4 `} />
            Kegiatan Lomba
          </div>
          <div className="flex items-center gap-3 mb-3 cursor-pointer sub-item" onClick={() => setSelectedMenu("Formulir")}>
            <img src={next} alt="Formulir" className={`w-4 `} />
            Formulir
          </div>
        </div>
      );
    }
    return null;
  };

  const renderSubMenuNonLomba = () => {
    if (subMenuOpenNonLomba) {
      return (
        <div className={`ml-4 submenu transition-all duration-300 ${subMenuOpenNonLomba ? "block" : "hidden"}`}>
          <div className="flex items-center gap-3 mb-3 cursor-pointer sub-item" onClick={() => setSelectedMenu("Pertukaran Mahasiswa")}>
            <img src={next} alt="Pertukaran Mahasiswa" className={`w-4 `} />
            Pertukaran Mahasiswa
          </div>
          <div className="flex items-center gap-3 mb-3 cursor-pointer sub-item" onClick={() => setSelectedMenu("Pengabdian Mahasiswa")}>
            <img src={next} alt="Pengabdian Mahasiswa" className={`w-4 `} />
            Pengabdian Mahasiswa
          </div>
          <div className="flex items-center gap-3 mb-3 cursor-pointer sub-item" onClick={() => setSelectedMenu("Pembinaan Mental Bangsa")}>
            <img src={next} alt="Pembinaan Mental Bangsa" className={`w-4 `} />
            Pembinaan Mental Bangsa
          </div>
          <div className="flex items-center gap-3 mb-3 cursor-pointer sub-item" onClick={() => setSelectedMenu("Mahasiswa Berwira Usaha")}>
            <img src={next} alt="Mahasiswa Berwira Usaha" className={`w-4 `} />
            Mahasiswa Berwira Usaha
          </div>
        </div>
      );
    }
    return null;
  };

  const renderContent = () => {
    switch (selectedMenu) {
      case "Dashboard":
        return <Dashboard />;
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
      <div className={` p-10 w-[325px] pt-11 relative`}>
        <div className="flex items-center mb-6 gap-x-4">
          <img src={logoDark} className={`cursor-pointer ml-3 duration-500`} />
          <h1 className={`text-black origin-left font-medium text-xl duration-200`}>Apresiasi</h1>
        </div>
        <ul className="pt-10">
          <li onClick={() => handleMenuClick("Dashboard")} className={`cursor-pointer mb-7 flex gap-3 items-center `}>
            <img src={Upload} alt="Icon1" className=" menu-icon w-7" />
            Dashboard
          </li>
          <li onClick={() => handleMenuClick("Kegiatan Mandiri")} className={`cursor-pointer mb-7 gap-3  flex items-center`}>
            <img src={nonlomba} alt="Icon2" className=" menu-icon w-7" />
            Kegiatan Mandiri
            <img src={next} alt="dropdown" className={`w-4 transform duration-300 ${subMenuOpenMandiri ? "rotate-90" : "rotate-0"}`} />
          </li>
          {renderSubMenuMandiri()}
          <li onClick={() => handleMenuClick("Kegiatan Non Lomba")} className={`cursor-pointer mb-7  gap-3 flex items-center`}>
            <img src={cup} alt="Icon1" className=" menu-icon w-7" />
            Kegiatan Non Lomba
            <img src={next} alt="dropdown" className={`w-4 duration-300 transform ${subMenuOpenNonLomba ? "rotate-90" : "rotate-0"}`} />
          </li>
          {renderSubMenuNonLomba()}
          <li className="relative mx-1 mt-64 rounded-lg">
            <div className="flex items-center cursor-pointer" onClick={toggleUserDropdown}>
              <img src={userData.profilePicture || "./src/assets/userSet.png"} alt="Profile" className="w-8 lg:w-10" />
              <span className={`pl-4 pt-2 duration-400`}>{userData.username || "Pak Herry"}</span>
              <ul className={`absolute left-0 ${userDropdownOpen ? "" : "hidden"} mt-2 bg-white border w-40 border-secondary rounded-lg z-10`}>
                <li className="cursor-pointer" onClick={handleLogout}>
                  <div className="flex items-center p-2 rounded-lg hover:bg-dimBlue hover:text-secondary">
                    <img src="./src/assets/logout.png" alt="" className="w-8 lg:w-8" />
                    <h1 className="lg:pl-3">Log Out</h1>
                  </div>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>

      <div className="flex-1 h-screen p-8 text-lg">{renderContent()}</div>
    </div>
  );
};

export default SideBarBiro;
