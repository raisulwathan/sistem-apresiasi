import React from "react";
import styles from "../../style";
import { logoApresiasi, robot } from "../../assets";
import Button from "../LandingPage/Button";
const Login = () => {
  return (
    <section className={`flex md:flex-row flex-col lg:py-[171px] py-[127px] overflow-hidden h-[100%]`}>
      <div className={`flex-1 ${styles.flexStart} flex-col xl:px-0 sm:px-16 `}>
        <div className={`py-24 lg:px-16 border-opacity-40 shadow-secondary border border-x-secondary border-y-secondary rounded-lg shadow-lg ml-5 lg:ml-48 ${styles.backgroundColor}`}>
          <form className="lg:w-96 lg:h-96">
            <div className="mb-4 text-center">
              <img src={logoApresiasi} alt="logo Apresiasi" className="mx-auto w-[50px] h-[50px]" />
              <h2 className={`text-2xl font-bold text-white pt-8 font-poppins `}>Login</h2>
            </div>
            {/* Form login */}
            <div className="pt-8">
              <label htmlFor="username" className={`block text-sm font-medium ${styles.textColor}`}>
                Username:
              </label>
              <input type="text" id="username" placeholder="NPM/NIP" className="p-2 ml-6 bg-transparent border rounded-lg lg:ml-1 w-80 lg:w-full border-x-secondary focus:ring focus:ring-primary" />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className={`block text-sm font-medium ${styles.textColor}`}>
                Password:
              </label>
              <input type="password" id="password" placeholder="Password" className="p-2 ml-6 bg-transparent border rounded-lg lg:ml-1 w-80 lg:w-full border-x-secondary focus:ring focus:ring-primary" />
            </div>
            <div className="px-[140px] py-7 lg:mr-16 sm:flex">
              <Button text="Login" to="/mahasiswa" />
            </div>
          </form>
        </div>
      </div>

      <div className={`flex-1 flex ${styles.flexCenter} md:my-0 my-10 relative`}>
        <div className="relative">
          {/* Menggunakan media query untuk menyembunyikan gambar pada layar mobile dan tablet */}
          <img src={robot} alt="billing" className="w-[531px] h-[603px] relative z-[5] hidden md:block" />

          {/* gradient start */}
          <div className="absolute z-[0] w-[40%] h-[35%] top-0 pink__gradient" />
          <div className="absolute z-[1] w-[80%] h-[80%] rounded-full white__gradient bottom-40" />
          <div className="absolute z-[0] w-[50%] h-[50%] right-20 bottom-20 blue__gradient" />
          {/* gradient end */}
        </div>
      </div>
    </section>
  );
};

export default Login;
