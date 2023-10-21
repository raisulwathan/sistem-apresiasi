import { useState } from "react";
import { close, logoApresiasi, menu } from "../assets";
import { navLinks } from "../constants";
import Button from "./LandingPage/Button";

const Navbar = () => {
  const [active, setActive] = useState("Home");
  const [toggle, setToggle] = useState(false);

  return (
    <nav className="fixed top-0 left-0 z-50 flex items-center justify-between w-full py-6">
      <div className="flex items-center">
        {" "}
        <img src={logoApresiasi} alt="Apresiasi" className="w-[40px] h-[40px] lg:ml-16" />
        <span className="ml-2 text-xl font-semibold text-white">Apresiasi</span>
      </div>

      <ul className="items-center justify-center flex-1 hidden list-none sm:flex">
        {" "}
        {navLinks.map((nav, index) => (
          <li key={nav.id} className={`font-poppins font-normal cursor-pointer text-[16px] ${active === nav.title ? "text-white" : "text-dimWhite"} ${index === navLinks.length - 1 ? "mr-0" : "mr-28"}`} onClick={() => setActive(nav.title)}>
            <a href={`#${nav.id}`}>{nav.title}</a>
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-end flex-1 sm:hidden">
        <img src={toggle ? close : menu} alt="menu" className="w-[28px] h-[28px] object-contain" onClick={() => setToggle(!toggle)} />

        <div className={`${!toggle ? "hidden" : "flex"} p-6 bg-black-gradient absolute top-20 right-0 mx-4 my-2 min-w-[140px] rounded-xl sidebar`}>
          <ul className="flex flex-col items-start justify-end flex-1 list-none">
            {navLinks.map((nav, index) => (
              <li
                key={nav.id}
                className={`font-poppins font-medium cursor-pointer text-[16px] ${active === nav.title ? "text-white" : "text-dimWhite"} ${index === navLinks.length - 1 ? "mb-0" : "mb-4"}`}
                onClick={() => setActive(nav.title)}
              >
                <a href={`#${nav.id}`}>{nav.title}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className=" lg:mr-16 sm:flex">
        <Button text="Login" to="/login" />
      </div>
    </nav>
  );
};

export default Navbar;
