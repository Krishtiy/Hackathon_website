import React from 'react';

const Card = ({ children, className = '' }) => {
  return (
    <div
      className={`
        relative rounded-xl overflow-hidden 
        bg-[#041217]/80 backdrop-blur-md
        border border-[#00ff7f22]
        shadow-[0_0_18px_rgba(0,255,127,0.08)]
        transition-all duration-300 transform-gpu

        hover:shadow-[0_0_30px_rgba(0,255,127,0.25)]
        hover:border-[#00ff7f]
        hover:-translate-y-1

        ${className}
      `}
    >
      {/* Hologram glow layer */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(0,255,127,0.1) 1px, transparent 1px), linear-gradient(0deg, rgba(0,255,127,0.1) 1px, transparent 1px)",
          backgroundSize: "55px 55px",
        }}
      />

      {/* Inner content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default Card;
