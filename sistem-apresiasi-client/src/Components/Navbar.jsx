import logo from "../assets/logoApresiasi.png";
import React, { useState, useEffect } from "react";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hamburger = document.querySelector("#hamburger");
    const navMenu = document.querySelector("#nav-menu");

    const toggleHamburger = () => {
      hamburger.classList.toggle("hamburger-active");
      navMenu.classList.toggle("hidden");
    };

    hamburger.addEventListener("click", toggleHamburger);

    return () => {
      hamburger.removeEventListener("click", toggleHamburger);
    };
  }, []);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector("header");
      const fixNav = header.offsetTop;

      if (window.pageYOffset > fixNav) {
        header.classList.add("navbar-fixed"); // Tambahkan kelas "navbar-fixed" saat menggulir
      } else {
        header.classList.remove("navbar-fixed"); // Hapus kelas "navbar-fixed" saat tidak menggulir
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header className="absolute top-0 left-0 z-10 flex items-center w-full bg-transparent">
      <div className="container">
        <div className="relative flex items-center justify-between">
          <div className="flex px-10 py-4 lg:px-24">
            <img src={logo} alt="" className=" w-14 h-14" />
            <a href="#Beranda" className="pt-4 pl-2 font-bold text-[20px]">
              Apresiasi
            </a>
          </div>
          <div className="flex items-center px-4">
            <button id="hamburger" name="hamburger" type="button" className="absolute block right-9 lg:hidden">
              <span className="transition duration-300 ease-in-out origin-top-left hamburger-line"></span>
              <span className=" w-[20px] h-[2px] my-2 block bg-black transition duration-300 ease-in-out"></span>
              <span className="transition duration-300 ease-in-out origin-bottom-left hamburger-line"></span>
            </button>
            <nav id="nav-menu" className="hidden absolute py-5 bg-white shadow-lg rounded-lg max-w-[250px] w-full right-4 top-full lg:block lg:static lg:bg-transparent lg:max-w-full lg:shadow-none lg:rounded-none ">
              <ul className="block lg:flex ">
                <li className=" f">
                  <a href="#beranda" className="flex py-2 mx-8 text-base text-black hover:text-teal-500 lg:pr-10">
                    Beranda
                  </a>
                </li>
                <li className=" group">
                  <a href="#panduan" className="flex py-2 mx-8 text-base text-black hover:text-teal-500 lg:pr-10">
                    Panduan pengguna
                  </a>
                </li>
                <li className=" group">
                  <a href="#syarat" className="flex py-2 mx-8 text-base text-black hover:text-teal-500 lg:pr-10 ">
                    Syarat & ketentuan
                  </a>
                </li>
                <li className=" group">
                  <a href="#prestasi" className="flex py-2 mx-8 text-base text-black hover:text-teal-500 lg:pr-20">
                    Prestasi
                  </a>
                </li>
                <li className="rounded-lg lg:bg-teal-500 group">
                  <a href="#login" className="flex py-2 mx-8 text-base lg:text-white lg:hover:text-black hover:text-teal-500">
                    Login
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
