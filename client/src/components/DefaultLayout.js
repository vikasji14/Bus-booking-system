import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/img/logo.png";

function DefaultLayout({ children }) {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.users);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const menuHandler = () => {
    setShowMobileMenu(!showMobileMenu);


    // if (showDropdown) {
    //   setShowDropdown(false);
    // }
    // if (!showMobileMenu) {
    //   document.body.style.overflow = 'hidden';
    // } else {
    //   document.body.style.overflow = 'unset';
    // }
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
      >
        <i className="ri-ticket-line  text-xl"></i>
        <span className="md:inline">Booking</span>
      </Link>

      {user?.isAdmin ? (
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="relative inline-flex items-center justify-start px-6 py-2 overflow-hidden font-bold rounded-full group"
          >
            <span className="w-32 h-32 rotate-45 translate-x-12 -translate-y-2 absolute left-0 top-0 bg-white opacity-[3%]"></span>
            <span className="absolute top-0 left-0 w-48 h-48 -mt-1 transition-all duration-500 ease-in-out rotate-45 -translate-x-56 -translate-y-24 bg-blue-600 opacity-100 group-hover:-translate-x-8"></span>
            <span className="relative flex items-center gap-2 text-white">
              <i className="ri-admin-line"></i>
              Admin
              <i className={`ri-arrow-down-s-line transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`}></i>
            </span>
            <span className="absolute inset-0 border-2 border-blue-600 rounded-full"></span>
          </button>
          {showDropdown && (
            <>
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl border border-gray-700 overflow-hidden z-50">
                <Link
                  to="/admin/buses"
                  className="flex items-center px-4 py-3 text-white hover:bg-gray-700 transition-colors"
                  onClick={() => setShowDropdown(false)}
                >
                  <i className="ri-bus-line mr-3"></i>
                  Manage Buses
                </Link>
                <Link
                  to="/admin/users"
                  className="flex items-center px-4 py-3 text-white hover:bg-gray-700 transition-colors"
                  onClick={() => setShowDropdown(false)}
                >
                  <i className="ri-user-settings-line mr-3"></i>
                  Manage Users
                </Link>
                <Link
                  to="/admin/bookings"
                  className="flex items-center px-4 py-3 text-white hover:bg-gray-700 transition-colors"
                  onClick={() => setShowDropdown(false)}
                >
                  <i className="ri-file-list-line mr-3"></i>
                  View Bookings
                </Link>
              </div>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowDropdown(false)}
              ></div>
            </>
          )}
        </div>
      ) : (
        <Link
          to="/bookings"
          className="relative inline-flex items-center justify-start px-6 py-2 overflow-hidden font-bold rounded-full group"
        >
          <span className="w-32 h-32 rotate-45 translate-x-12 -translate-y-2 absolute left-0 top-0 bg-white opacity-[3%]"></span>
          <span className="absolute top-0 left-0 w-48 h-48 -mt-1 transition-all duration-500 ease-in-out rotate-45 -translate-x-56 -translate-y-24 bg-blue-600 opacity-100 group-hover:-translate-x-8"></span>
          <span className="relative flex items-center gap-2 text-white">
            <i className="ri-ticket-2-line"></i>
            Bookings
          </span>
          <span className="absolute inset-0 border-2 border-blue-600 rounded-full"></span>
        </Link>
      )}

      <Link
        to="/"
        onClick={() => {
          localStorage.clear();
          setShowMobileMenu(false);
        }}
        className="text-white md:hidden  hover:text-gray-300 flex items-center gap-2"
      >
        <i className="ri-logout-box-line text-xl"></i>
        <span className="md:inline">Logout</span>
      </Link>
    </>
  );

  return (
    <div className="w-full flex-row">
      <div className="bg-gray-800 flex fixed top-0 z-50 w-full justify-between items-center py-2 px-4">
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
          <div className="relative">
            {/* User Icon */}
            <div
              className="w-14 h-14 flex items-center justify-center bg-slate-300 rounded-full cursor-pointer"
              onClick={() => setShowDetails(!showDetails)}
            >
              <i className="ri-user-3-line text-xl text-gray-800"></i>
            </div>


            {showDetails && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 text-white rounded-lg shadow-lg p-3">
                <div className="flex flex-col gap-4">
                  <div>
                    <div className="font-semibold">{user?.name}</div>
                    <div className="text-sm text-gray-600">{user?.email}</div>
                  </div>
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
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        ref={mobileMenuRef}
        className={`md:hidden fixed right-0 top-24 bg-gray-800 border-l border-gray-700 h-screen w-64 shadow-lg z-50 transition-transform duration-300 ease-in-out transform ${showMobileMenu ? 'translate-x-0' : 'translate-x-full'
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

      <div className="content pt-24">{children}</div>
    </div>
  );
}

export default DefaultLayout;
