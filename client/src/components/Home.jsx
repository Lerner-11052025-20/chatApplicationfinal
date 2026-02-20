import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MessageCircle, Heart } from "lucide-react";
import Navbar from "./layout/Navbar";
import Hero from "./home/Hero";
import Features from "./home/Features";
import Pricing from "./home/Pricing";
import Testimonials from "./home/Testimonials";
import Team from "./home/Team";
import Stats from "./home/Stats";
import FAQ from "./home/FAQ";
import CallToAction from "./home/CallToAction";

import Footer from "./layout/Footer";

function Home() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  return (
    <div className="bg-dark-bg min-h-screen font-sans selection:bg-blue-500/30 overflow-x-hidden">
      <Navbar />

      <main className="relative z-10">
        <div id="hero"><Hero /></div>
        <Stats />
        <Features />
        <Pricing />
        <Testimonials />
        <Team />
        <FAQ />
        <div id="contact"><CallToAction /></div>
      </main>

      <Footer />
    </div>
  );
}

export default Home;
