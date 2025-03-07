import React from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { FaLocationDot } from "react-icons/fa6";
import { MdModeStandby } from "react-icons/md";


function Bus({ bus }) {
  const navigate = useNavigate();
  return (
    <div className="relative p-6 bg-white  rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 max-w-lg min-w-[350px] w-full">
      {/* Journey Date */}
      <div className="absolute -top-3 left-6">
        <span className="px-4 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full dark:bg-blue-900/30 dark:text-blue-300 border border-blue-100 dark:border-blue-800">
          {moment(bus.journeyDate).format("DD MMM, YYYY")}
        </span>
      </div>

      {/* Bus Status Badge */}
      <div className="absolute -top-3 right-6">
        <span className={`px-4 py-1 rounded-full text-sm font-medium ${
          bus.status === "Yet To Start" 
            ? "bg-green-50 text-green-700 border border-green-100 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800"
            : "bg-red-50 text-red-700 border border-red-100 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800"
        }`}>
          {bus.status}
        </span>
      </div>

      {/* Bus Info */}
      <div className="space-y-6 pt-4">
        {/* Bus Name and Type */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">{bus.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Bus No: {bus.busNumber}</p>
          </div>
          <div className="flex items-center space-x-1 bg-gray-50 px-2 py-1 rounded-lg dark:bg-gray-700">
            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{bus.type}</span>
          </div>
        </div>

        {/* Journey Details */}
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="relative">
              {/* Journey Path Visual */}
              <div className="absolute left-2 top-1/2 w-[calc(100%-1rem)] h-0.5 bg-gradient-to-r from-blue-500 to-green-500 transform -translate-y-1/2"></div>
              {/* Animated Bus Icon */}
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 animate-[rightMove_4s_linear_infinite] group">
                <div className="relative -top-2">
                  <svg className="w-7 h-7 text-blue-600 dark:text-blue-400 transform -scale-x-100 drop-shadow-lg group-hover:text-blue-700 transition-colors duration-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 10a1 1 0 100 2 1 1 0 000-2m8 0a1 1 0 100 2 1 1 0 000-2m-2.5-4h-3a.5.5 0 000 1h3a.5.5 0 000-1M21 11.5V9c0-3.5-3.6-4-8-4s-8 .5-8 4v2.5c0 .3-.2.5-.5.5h-1c-.3 0-.5.2-.5.5v2c0 .3.2.5.5.5H4c.3 0 .5-.2.5-.5V12c0-.3.2-.5.5-.5h14c.3 0 .5.2.5.5v2.5c0 .3.2.5.5.5h.5c.3 0 .5-.2.5-.5v-2c0-.3-.2-.5-.5-.5h-1c-.3 0-.5-.2-.5-.5M7 6.7c-.2-.2-.3-.4-.3-.7 0-.5.4-1 1-1h8.6c.6 0 1 .4 1 1 0 .3-.1.5-.3.7-.2.2-.4.3-.7.3H7.7c-.3 0-.5-.1-.7-.3m.8 10.2C6.8 17 6 16.2 6 15.2s.8-1.8 1.8-1.8 1.8.8 1.8 1.8-.9 1.7-1.8 1.7m8.5 0c-1 0-1.8-.8-1.8-1.8s.8-1.8 1.8-1.8 1.8.8 1.8 1.8-.9 1.7-1.8 1.7"/>
                  </svg>
                </div>
              </div>

              <div className="relative flex justify-between">
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <FaLocationDot size={20} className="text-blue-600 dark:text-blue-400" />
                    <div className="absolute -inset-1 bg-blue-400 rounded-full animate-ping opacity-20"></div>
                  </div>
                  <button className="mt-2 px-4 py-2 text-sm font-medium bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300/50 dark:border-gray-600/50 rounded-lg shadow-sm hover:shadow-blue-200 dark:hover:shadow-blue-900/30 hover:scale-105 hover:-translate-y-0.5 active:scale-95 transition-all duration-200 hover:border-blue-500/50 dark:hover:border-blue-400/50 group relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-blue-600/10 dark:from-blue-500/5 dark:to-blue-600/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    <div className="absolute inset-0 bg-blue-50 dark:bg-blue-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                    <span className="relative inline-flex items-center gap-1.5">
                      <span className="text-blue-600/80 dark:text-blue-400/80 group-hover:scale-110 transition-transform duration-200">📍</span>
                      <span className="group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-200">{bus.from}</span>
                    </span>
                    <span className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 w-0 group-hover:w-full transition-all duration-300"></span>
                  </button>
                  <p className="text-xs font-medium text-blue-600/90 dark:text-blue-400/90 mt-2">
                    {moment(bus.departure, "HH:mm").format("hh:mm A")}
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <MdModeStandby size={20} className="text-green-600 dark:text-green-400" />
                    <div className="absolute -inset-1 bg-green-400 rounded-full animate-ping opacity-20"></div>
                  </div>
                  <button className="mt-2 px-4 py-2 text-sm font-medium bg-gradient-to-br from-green-50 via-white to-green-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300/50 dark:border-gray-600/50 rounded-lg shadow-sm hover:shadow-green-200 dark:hover:shadow-green-900/30 hover:scale-105 hover:-translate-y-0.5 active:scale-95 transition-all duration-200 hover:border-green-500/50 dark:hover:border-green-400/50 group relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-green-600/10 dark:from-green-500/5 dark:to-green-600/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    <div className="absolute inset-0 bg-green-50 dark:bg-green-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                    <span className="relative inline-flex items-center gap-1.5">
                      <span className="text-green-600/80 dark:text-green-400/80 group-hover:scale-110 transition-transform duration-200">🏁</span>
                      <span className="group-hover:text-green-700 dark:group-hover:text-green-300 transition-colors duration-200">{bus.to}</span>
                    </span>
                    <span className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-green-500 to-green-600 w-0 group-hover:w-full transition-all duration-300"></span>
                  </button>
                  <p className="text-xs font-medium text-green-600/90 dark:text-green-400/90 mt-2">
                    {moment(bus.arrival, "HH:mm").format("hh:mm A")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features and Price */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1 bg-gray-50 px-2 py-1 rounded-lg dark:bg-gray-700">
              <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{bus.capacity} seats</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">₹{bus.price}</p>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">per seat</p>
          </div>
        </div>

        {/* Book Now Button */}
        <button
          className="w-full px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700"
          onClick={() => {
            if (localStorage.getItem("user_id")) {
              navigate(`/book-now/${bus._id}`);
            } else {
              navigate(`/login`);
            }
            localStorage.removeItem("idTrip");
            localStorage.setItem("idTrip", bus._id);
          }}
        >
          Book Now
        </button>
      </div>
    </div>
  );
}

export default Bus;
