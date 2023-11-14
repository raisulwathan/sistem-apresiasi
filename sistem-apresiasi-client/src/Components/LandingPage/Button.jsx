import React from "react";
import { Link } from "react-router-dom";

const Button = ({ styles, to, text }) => (
  <Link to={to} type="button" className={`py-2 px-9 font-poppins font-medium text-[18px] text-primary bg-blue-gradient rounded-[10px] outline-none ${styles}`}>
    {text}
  </Link>
);

export default Button;
