import React from "react";
import { FaWhatsapp } from "react-icons/fa";

const FloatingWhatsApp = () => {
  return (
    <a
      href="https://wa.me/1234567890"
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-8 right-8 z-50 bg-green-500 p-2 rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 transform hover:scale-110"
    >
      <FaWhatsapp className="text-white text-3xl rotating-icon" />

      {/* Inline Tailwind Keyframes for Rotation */}
      <style>
        {`
          @keyframes rotate360 {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          .rotating-icon {
            animation: rotate360 3s linear infinite;
          }
        `}
      </style>
    </a>
  );
};

export default FloatingWhatsApp;
