import React from 'react';
import logo from "../assets/img/logo.png";
import { FaFacebookF, FaInstagram, FaYoutube, FaTwitter, FaWhatsapp } from "react-icons/fa";
import WhatsApp from '../components/WhatsApp';
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";

const Footer = () => {
  return (
    <>
      <WhatsApp />
      <footer className="bg-gray-800 text-white py-6 p-2 mt-[-20px]">
        <div className="mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-4 border border-gray-600 rounded-lg p-4">
          <div className=" border-gray-600 pr-4">
            <h3 className="text-xl text-white font-bold mb-4">Bus Booking System</h3>
            <img src={logo} alt="logo" className="w-[200px] h-[100px]" />
          </div>
          <div className=" border-gray-600 pr-4">
            <h3 className="text-xl text-white font-bold mb-4">Useful Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/bookings" className="text-gray-300 hover:text-blue transition-colors">
                  ➤ View Tickets
                </a>
              </li>
              <li>
                <a href="/easy-booking" className="text-gray-300 hover:text-blue transition-colors">
                  ➤ Book Tickets
                </a>
              </li>
              <li>
                <a href="/" className="text-gray-300 hover:text-blue transition-colors">
                  ➤ Search Bus
                </a>
              </li>
              <li>
                <a href="/register" className="text-gray-300 hover:text-blue transition-colors">
                  ➤ Register
                </a>
              </li>
              <li>
                <a href="/login" className="text-gray-300 hover:text-blue transition-colors">
                  ➤ Login
                </a>
              </li>
              <li>
                <a href="/forgot-password" className="text-gray-300 hover:text-blue transition-colors">
                  ➤ Forgot Password
                </a>
              </li>
            </ul>
          </div>
          <div className="pr-2 flex flex-col gap-2">
            <h3 className="text-xl text-white font-bold mb-4">Contact Us</h3>

            <div className="flex items-center mt-[-10px] gap-2 text-gray-400 text-sm">
              <FaMapMarkerAlt className="text-lg text-red-400" />
              <span className='mt-1'>84****, Patna, Bihar, India</span>
            </div>

            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <FaEnvelope className="text-lg text-blue-400" />
              <span className='mt-1'>busbooking@gmail.com</span>
            </div>

            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <FaPhoneAlt className="text-lg text-blue-400" />
              <span className='mt-1'>123-456-789</span>
            </div>
          </div>
          <div>
            <h3 className="text-xl text-white font-bold mb-4">Social Media</h3>
            <div className="flex space-x-6 mb-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 p-3 rounded-full text-white text-xl hover:bg-blue-700 transition-transform transform hover:scale-110 shadow-md"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-pink-500 p-3 rounded-full text-white text-xl hover:bg-pink-600 transition-transform transform hover:scale-110 shadow-md"
              >
                <FaInstagram />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-red-600 p-3 rounded-full text-white text-xl hover:bg-red-700 transition-transform transform hover:scale-110 shadow-md"
              >
                <FaYoutube />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-400 p-3 rounded-full text-white text-xl hover:bg-blue-500 transition-transform transform hover:scale-110 shadow-md"
              >
                <FaTwitter />
              </a>
            </div>
          </div>
        </div>
        <div>
          <div className="text-center mt-4 flex w-full flex-col">
            <span className="text-sm"> 2025 Bus Booking System. All rights reserved.</span>
            <span className="text-sm text-gray-400">Developed @vikas</span>
          </div>
        </div>

      </footer>
    </>
  );
};

export default Footer;
