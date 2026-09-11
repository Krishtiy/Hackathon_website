import React from 'react';
import Button from './Button';

const Modal = ({ message, type, onClose }) => {
  if (!message) return null;

  // color style based on success/error
  const colors = {
    success: {
      border: "border-[#00ff7f]",
      glow: "shadow-[0_0_20px_rgba(0,255,127,0.4)]",
      text: "text-[#baffdd]",
    },
    error: {
      border: "border-[#ff5757]",
      glow: "shadow-[0_0_20px_rgba(255,87,87,0.4)]",
      text: "text-[#ffb3b3]",
    },
  };

  const theme = type === "success" ? colors.success : colors.error;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">

      {/* Scanline overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(0deg, rgba(0,255,127,0.15) 1px, transparent 1px)",
          backgroundSize: "100% 4px",
        }}
      />

      <div
        className={`
          relative max-w-sm w-full p-6 
          bg-[#001614]/90 border rounded-xl
          ${theme.border} ${theme.glow}
          transform-gpu animate-[cyberPop_0.35s_ease-out]
        `}
      >

        {/* Glitch aura */}
        <div className="absolute inset-0 rounded-xl bg-[#00ff7f]/10 blur-xl opacity-40 pointer-events-none"></div>

        {/* Content */}
        <p className={`relative z-10 text-lg font-medium ${theme.text} mb-4`}>
          {message}
        </p>

        <Button
          onClick={onClose}
          className="relative z-10 w-full 
                     bg-gradient-to-r from-[#00ff7f] to-[#00e5ff] text-black 
                     font-semibold shadow-[0_0_15px_rgba(0,255,127,0.4)]
                     hover:shadow-[0_0_25px_rgba(0,255,127,0.7)]
                     transition-all"
        >
          Close
        </Button>
      </div>

      {/* Keyframes for cyber pop */}
      <style>
        {`
          @keyframes cyberPop {
            0% { transform: scale(0.7) rotateX(25deg) skewX(5deg); opacity: 0; }
            100% { transform: scale(1) rotateX(0deg) skewX(0); opacity: 1; }
          }
        `}
      </style>
    </div>
  );
};

export default Modal;
