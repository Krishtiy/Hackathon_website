import React from 'react';

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  className = ''
}) => {
  
  const baseStyle =
    'px-4 py-2 rounded-lg font-semibold transition-all duration-300 ' +
    'focus:outline-none focus:ring-2 focus:ring-offset-2 transform-gpu';

  const variants = {
    // ⚡ CYBERPUNK PRIMARY — Neon Green → Cyan Gradient
    primary:
      'text-black bg-gradient-to-r from-[#00ff7f] to-[#00e5ff] ' +
      'shadow-[0_0_18px_rgba(0,255,127,0.35)] ' +
      'hover:shadow-[0_0_28px_rgba(0,255,127,0.6)] ' +
      'hover:-translate-y-[2px] active:translate-y-[1px] ' +
      'focus:ring-[#00ff7f]',

    // ⚡ CYBERPUNK SECONDARY — Transparent with Neon Border
    secondary:
      'text-[#00ffae] border border-[#00ff7f55] bg-[#001915]/40 ' +
      'hover:bg-[#003826] hover:border-[#00ff7f] ' +
      'shadow-[0_0_12px_rgba(0,255,127,0.15)] ' +
      'focus:ring-[#00ff7f]',

    // ⚡ OUTLINE — Minimal hacker terminal look
    outline:
      'text-[#00e5ff] border border-[#00e5ff55] bg-transparent ' +
      'hover:bg-[#001519] hover:border-[#00e5ff] ' +
      'shadow-[0_0_12px_rgba(0,229,255,0.25)] ' +
      'focus:ring-[#00e5ff]',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
