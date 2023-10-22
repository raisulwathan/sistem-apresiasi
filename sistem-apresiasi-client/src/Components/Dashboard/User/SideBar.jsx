import { useState } from "react";
import { logoDark } from "../../../assets";
import Profile from "./Profile";
import Upload from "./Upload";
import Transkrip from "./Transkrip";
import History from "./History";

const SideBar = () => {
  const [open, setOpen] = useState(true);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const Menus = [
    { title: "Profile", src: "Profile", content: <Profile /> },
    { title: "Upload Kegiatan", src: "Upload", content: <Upload /> },
    { title: "Transkrip SKPI", src: "Transkrip", content: <Transkrip /> },
    { title: "Riwayat", src: "History", content: <History /> },
  ];

  const [selectedMenu, setSelectedMenu] = useState(Menus[0]);

  const handleMenuClick = (menu) => {
    setSelectedMenu(menu);
  };

  const handleLogout = () => {};

  const toggleUserDropdown = () => {
    setUserDropdownOpen(!userDropdownOpen);
  };

  return (
    <div className="flex h-screen p-4 bg-white">
      <div className={`${open ? "w-80" : "w-28"} lg:m-4 rounded-lg lg:shadow-xl lg:p-8 pt-8 relative duration-300`}>
        <img src="./src/assets/control.png" className={`absolute cursor-pointer -right-2 top-9 w-8 border-dark-purple border-2 rounded-full ${!open && "rotate-180"}`} onClick={() => setOpen(!open)} />
        <div className="flex items-center gap-x-4">
          <img src={logoDark} className={`cursor-pointer ml-3 duration-500 ${open && "rotate-[360deg]"}`} />
          <h1 className={`text-black origin-left font-medium text-xl duration-200 ${!open && "scale-0"}`}>Apresiasi</h1>
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
              <span className={`${!open && "hidden"} origin-left duration-200`}>{Menu.title}</span>
            </li>
          ))}
          <li className="relative mx-1 mt-64 rounded-lg hover:bg-dimBlue ">
            <div className="flex items-center cursor-pointer" onClick={toggleUserDropdown}>
              <img src="./src/assets/userSet.png" className="w-8 lg:w-10" />
              <span className={`${!open && "hidden"} origin-left pl-4 pt-2 duration-400`}>Raisulwathan</span>
              <ul className={`absolute left-0 ${userDropdownOpen ? "" : "hidden"} mt-[180px] bg-white border w-40 border-secondary rounded-lg`}>
                <li className="cursor-pointer " onClick={() => handleMenuClick(Menus[0])}>
                  <div className="flex items-center p-2 rounded-lg hover:bg-dimBlue hover:text-secondary">
                    {" "}
                    <img src="./src/assets/toProfile.png" alt="" className="w-8 lg:w-8" />
                    <h1 className="lg:pl-3">Profile</h1>
                  </div>
                </li>
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

export default SideBar;
