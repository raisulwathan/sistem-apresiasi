import React from "react";
import logo from "../assets/logoApresiasi.png";

function Navbar() {
  const menuList = [
    {
      id: 1,
      title: "Beranda",
    },
    {
      id: 2,
      title: "Panduan Pengguna",
    },
    {
      id: 3,
      title: "Syarat & Ketentuan",
    },
    {
      id: 4,
      title: "Prestasi",
    },
  ];

  return (
    <div className="flex items-center p-2 text-black bg-tranparent justify-evenly">
      <div className="flex w-12 h-12">
        {" "}
        <img src={logo} alt="Apresiasi universitas syiah kuala" /> <div className="pt-2 pl-2 text-xl">Apresiasi</div>
      </div>

      <div className="flex space-x-4">
        {menuList.map((item) => (
          <div key={item.id}>
            <h2 className="pl-16 ">{item.title}</h2>
          </div>
        ))}
      </div>
      <div className="px-6 py-1 bg-teal-500 rounded-lg  button">
        {" "}
        <h2 className="text-[18px] text-white">Login</h2>{" "}
      </div>
    </div>
  );
}

export default Navbar;
