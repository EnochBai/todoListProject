import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ children, disabled = false }) => {
  return (
    <button
      disabled={disabled}
      className="inline-block rounded-full bg-blue-500 px-4 py-3 font-semibold uppercase tracking-wide text-stone-800 transition-colors duration-300 hover:bg-cyan-500 focus:bg-cyan-600 focus:outline-none focus:ring focus:ring-cyan-300 focus:ring-offset-2 active:bg-slate-400 disabled:cursor-not-allowed sm:px-6 sm:py-4"
    >
      {children}
    </button>
  );
};

export default Button;