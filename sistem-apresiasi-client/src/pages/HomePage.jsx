import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/LandingPage/Hero";
import { CTA, Footer, Panduan, Stats, Syarat } from "../components/LandingPage";

const HomePage = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <Stats />
      <Panduan />
      <Syarat />
      <CTA />
      <Footer />
    </>
  );
};

export default HomePage;
