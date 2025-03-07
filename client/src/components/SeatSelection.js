import React from "react";

function SeatSelection({ selectedSeats, setSelectedSeats, bus }) {
  const capacity = bus.capacity;

  const selectOrUnselectSeats = (seatNumber) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter((seat) => seat !== seatNumber));
    } else {
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  return (
    <div className="mx-auto">
      {/* Seat Selection Legend */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-400 shadow-inner">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-400 to-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/30">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-red-400 to-red-500 text-white flex items-center justify-center shadow-lg shadow-red-500/30">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Booked</span>
        </div>
      </div>

      {/* Bus Layout */}
      <div className="relative max-w-sm mx-auto">
        {/* Driver's Seat */}
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
          <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-800 dark:from-gray-600 dark:to-gray-700 rounded-full flex items-center justify-center shadow-xl">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <span className="text-[10px] font-medium text-gray-600 dark:text-gray-400 mt-1">Driver</span>
        </div>

        {/* Steering Wheel */}
        <div className="absolute -top-14 left-1/2 transform -translate-x-1/2">
          <div className="w-16 h-6 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-t-full"></div>
        </div>

        {/* Seats Grid */}
        <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          <div className="grid grid-cols-4 gap-2 p-4 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-inner border border-gray-100 dark:border-gray-700">
            {Array.from(Array(capacity).keys()).map((seatNumber) => {
              let seatClass = bus.seatsBooked.includes(seatNumber + 1)
                ? "bg-gradient-to-br from-red-400 to-red-500 text-white shadow-lg shadow-red-500/30"
                : selectedSeats.includes(seatNumber + 1)
                ? "bg-gradient-to-br from-blue-400 to-blue-500 text-white shadow-lg shadow-blue-500/30 hover:from-blue-500 hover:to-blue-600"
                : "bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-300 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-500 shadow-inner";

              return (
                <div
                  key={seatNumber + 1}
                  className={`relative group ${
                    bus.seatsBooked.includes(seatNumber + 1) ? "cursor-not-allowed" : "cursor-pointer"
                  }`}
                >
                  <button
                    className={`w-full h-10 rounded-lg ${seatClass} transition-all duration-200 disabled:opacity-50 flex items-center justify-center transform hover:scale-105 active:scale-95`}
                    onClick={() => selectOrUnselectSeats(seatNumber + 1)}
                    disabled={bus.seatsBooked.includes(seatNumber + 1)}
                  >
                    <span className="font-medium text-sm">{seatNumber + 1}</span>
                  </button>
                  {/* Tooltip */}
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                    <div className="bg-gray-900 text-white text-[10px] py-1 px-2 rounded-lg shadow-lg whitespace-nowrap">
                      Seat {seatNumber + 1}
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-1.5 h-1.5 bg-gray-900"></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Info */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Click on a seat to select/unselect it
          </p>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
        @media (prefers-color-scheme: dark) {
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #1f2937;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #4b5563;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #6b7280;
          }
        }
      `}</style>
    </div>
  );
}

export default SeatSelection;
