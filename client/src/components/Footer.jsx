import React from "react";

const Footer = () => {
  return (
    <footer className="relative bg-[#000a0a] text-[#9AE6C7] border-t border-[#00ff7f22] mt-20">

      {/* Cyberpunk Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(0,255,127,0.12) 1px, transparent 1px), linear-gradient(0deg, rgba(0,255,127,0.12) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Neon Glow Top Border */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#00ff7f55] to-[#00e5ff55]"></div>

      <div className="relative z-10 max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-sm tracking-wide font-semibold drop-shadow-[0_0_6px_rgba(0,255,127,0.4)]">
          &copy; {new Date().getFullYear()} NIT Silchar. All rights reserved.
        </p>
        <p className="text-xs mt-1 text-[#7faea0]">
          CS 304 • Software Engineering Project
        </p>

        {/* Hacker Accent Bar */}
        <div className="mx-auto mt-4 w-32 h-[2px] bg-gradient-to-r from-[#00ff7f] to-[#00e5ff] shadow-[0_0_10px_rgba(0,255,127,0.7)]"></div>
      </div>
    </footer>
  );
};

export default Footer;
