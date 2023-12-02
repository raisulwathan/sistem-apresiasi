import { useState, useEffect } from "react";
import { logoDark } from "../../../../assets";
import KegiatanMahasiswa from "./KegiatanMahasiswa";
import Prestasi from "./Prestasi";
import axios from "axios";

const SideBarWd3 = () => {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [userData, setUserData] = useState({});

  const Menus = [
    { title: "Kegiatan Mahasiswa", src: "Upload", content: <KegiatanMahasiswa /> },
    { title: "Prestasi", src: "cup", content: <Prestasi /> },
  ];

  const [selectedMenu, setSelectedMenu] = useState(Menus[0]);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get("URL_GET_USER_DATA");
      if (response.status === 200) {
        setUserData(response.data);
      } else {
        console.error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleMenuClick = (menu) => {
    setSelectedMenu(menu);
  };

  const handleLogout = () => {};

  const toggleUserDropdown = () => {
    setUserDropdownOpen(!userDropdownOpen);
  };

  return (
    <div className="flex h-screen bg-white ">
      <div className={` lg:p-8 pt-8 relative `}>
        <div className="flex items-center gap-x-4">
          <img src={logoDark} className={`cursor-pointer ml-3 duration-500 `} />
          <h1 className={`text-black origin-left font-medium text-xl duration-200 `}>Apresiasi</h1>
        </div>
        <ul className="pt-6">
          {Menus.map((Menu, index) => (
            <li
              key={index}
              onClick={() => handleMenuClick(Menu)}
              className={`flex rounded-md p-2 cursor-pointer hover:bg-dimBlue hover:text-secondary text-base items-center gap-x-4 
              ${Menu.gap ? "mt-9" : "mt-6"} ${index === 0 && "bg-light-white"}`}
            >
              <img src={`./src/assets/${Menu.src}.png`} className="w-6 lg:w-8" />
              <span className={` origin-left duration-200`}>{Menu.title}</span>
            </li>
          ))}
          <li className="relative mx-1 mt-64 rounded-lg hover:bg-dimBlue ">
            <div className="flex items-center cursor-pointer" onClick={toggleUserDropdown}>
              <img src={userData.profilePicture || "./src/assets/userSet.png"} alt="Profile" className="w-8 lg:w-10" />
              <span className={` pl-4 pt-2 duration-400`}>{userData.username || "Ilham Maulana"}</span>
              <ul className={`absolute left-0 ${userDropdownOpen ? "" : "hidden"} mt-[180px] bg-white border w-40 border-secondary rounded-lg`}>
                <li className="cursor-pointer " onClick={handleLogout}>
                  <div className="flex items-center p-2 rounded-lg hover:bg-dimBlue hover:text-secondary">
                    {" "}
                    <img src="./src/assets/logout.png" alt="" className="w-8 lg:w-8" />
                    <h1 className="lg:pl-3">Log Out</h1>
                  </div>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
      <div className="flex-1 h-screen text-lg">{selectedMenu.content}</div>
    </div>
  );
};

export default SideBarWd3;
