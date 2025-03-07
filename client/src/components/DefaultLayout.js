import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/img/logo.png";

function DefaultLayout({ children }) {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.users);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const menuHandler = () => {
    setShowMobileMenu(!showMobileMenu);
    if (showDropdown) {
      setShowDropdown(false);
    }
    if (!showMobileMenu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  };

  useEffect(() => {
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setShowMobileMenu(false);
        document.body.style.overflow = 'unset';
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navigationContent = (
    <>
      <Link 
        to="/easy-booking"
        className="text-white hover:text-gray-300 flex items-center gap-2"
        onClick={() => setShowMobileMenu(false)}
      >
        <i className="ri-home-line text-xl"></i>
        <span className="md:inline">Home</span>
      </Link>
      
      {user?.isAdmin ? (
        <div className="flex md:flex-row flex-col md:items-center gap-4">
          <Link 
            to="/admin/buses"
            className="text-white hover:text-gray-300 flex items-center gap-2"
            onClick={() => setShowMobileMenu(false)}
          >
            <i className="ri-bus-line text-xl"></i>
            <span className="md:inline">Buses</span>
          </Link>
          <Link 
            to="/admin/users"
            className="text-white hover:text-gray-300 flex items-center gap-2"
            onClick={() => setShowMobileMenu(false)}
          >
            <i className="ri-user-line text-xl"></i>
            <span className="md:inline">Users</span>
          </Link>
          <Link 
            to="/admin/bookings"
            className="text-white hover:text-gray-300 flex items-center gap-2"
            onClick={() => setShowMobileMenu(false)}
          >
            <i className="ri-file-list-line text-xl"></i>
            <span className="md:inline">Bookings</span>
          </Link>
        </div>
      ) : (
        <Link 
          to="/bookings"
          className="text-white hover:text-gray-300 flex items-center gap-2"
          onClick={() => setShowMobileMenu(false)}
        >
          <i className="ri-file-list-line text-xl"></i>
          <span className="md:inline">Bookings</span>
        </Link>
      )}
      
      <Link 
        to="/"
        onClick={() => {
          localStorage.clear();
          setShowMobileMenu(false);
        }}
        className="text-white hover:text-gray-300 flex items-center gap-2"
      >
        <i className="ri-logout-box-line text-xl"></i>
        <span className="md:inline">Logout</span>
      </Link>
    </>
  );

  return (
    <div className="w-full flex-row">
      <div className="bg-gray-800 flex justify-between items-center py-2 px-4">
        <div className="flex items-center">
          <Link to="/">
            <img
              src={logo}
              alt="logo"
              className="w-20 h-20 rounded-full cursor-pointer"
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-10 items-center">
          {navigationContent}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white p-2"
          onClick={menuHandler}
        >
          <i className={`text-2xl ${showMobileMenu ? 'ri-close-line' : 'ri-menu-line'} transition-transform duration-300`}></i>
        </button>

        {/* User Info */}
        <div className="hidden md:flex text-white text-base items-center gap-2">
          <i className="ri-user-3-line text-xl"></i>
          <div>
            <div className="mt-1">{user?.name}</div>
            <div className="mt-1">{user?.email}</div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        ref={mobileMenuRef}
        className={`md:hidden fixed right-0 top-24 bg-gray-800 border-l border-gray-700 h-screen w-64 shadow-lg z-50 transition-transform duration-300 ease-in-out transform ${
          showMobileMenu ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col gap-4 p-4">
          {navigationContent}
          <div className="border-t border-gray-700 pt-4 mt-4">
            <div className="text-white text-base flex items-center gap-2">
              <i className="ri-user-3-line text-xl"></i>
              <div>
                <div className="mt-1">{user?.name}</div>
                <div className="mt-1">{user?.email}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile menu */}
      {showMobileMenu && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={menuHandler}
        ></div>
      )}

      <div className="content">{children}</div>
    </div>
  );
}

export default DefaultLayout;
