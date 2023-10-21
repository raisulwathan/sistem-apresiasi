import { useState } from "react";
import { logoDark } from "../../../assets";
import Profile from "./Profile";
import Upload from "./Upload";
import Transkrip from "./Transkrip";
import History from "./History";

const SideBar = () => {
  const [open, setOpen] = useState(true);
  const Menus = [
    { title: "Profile", src: "Profile", content: <Profile /> },
    { title: "Upload Kegiatan", src: "Upload", content: <Upload /> },
    { title: "Transkrip SKPI", src: "Transkrip", content: <Transkrip /> },
    { title: "Riwayat ", src: "History", content: <History /> },
  ];

  const [selectedMenu, setSelectedMenu] = useState(Menus[0]);

  const handleMenuClick = (menu) => {
    setSelectedMenu(menu);
  };

  return (
    <div className="flex h-screen p-4 bg-white">
      <div className={`${open ? " w-80 " : " w-28 "} lg:m-4 rounded-lg  lg:shadow-xl lg:p-8  pt-8 relative duration-300`}>
        <img
          src="./src/assets/control.png"
          className={`absolute cursor-pointer -right-2 top-9 w-8 border-dark-purple
           border-2 rounded-full ] ${!open && "rotate-180"}`}
          onClick={() => setOpen(!open)}
        />
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
              ${Menu.gap ? "mt-9" : "mt-6"} ${index === 0 && "bg-light-white"} `}
            >
              <img src={`./src/assets/${Menu.src}.png`} className={`w-6 lg:w-8 `} />
              <span className={`${!open && "hidden"} origin-left duration-200`}>{Menu.title}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex-1 h-screen text-lg">{selectedMenu.content}</div>
    </div>
  );
};

export default SideBar;
