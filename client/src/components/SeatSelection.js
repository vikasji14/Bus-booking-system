import React from "react";

function SeatSelection({ selectedSeats, setSelectedSeats, bus }) {
  const capacity = bus.capacity;
  const discountedPrice = bus.price * (1 - (bus.discountPercentage || 0) / 100);
  const totalPrice = selectedSeats.length * discountedPrice;

  const selectOrUnselectSeats = (seatNumber) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter((seat) => seat !== seatNumber));
    } else {
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  return (
    <div className="mx-auto">
      {/* Price Display */}
      <div className="mb-6 text-center">
        {bus.discountPercentage > 0 && (
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-sm line-through text-gray-500 dark:text-gray-400">
              ₹{bus.price * selectedSeats.length}
            </span>
            <span className="px-2 py-1 bg-red-50 text-red-700 text-xs font-medium rounded-full dark:bg-red-900/30 dark:text-red-300">
              {bus.discountPercentage}% off
            </span>
          </div>
        )}
        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          ₹{totalPrice.toFixed(2)}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Total for {selectedSeats.length} seat{selectedSeats.length !== 1 && 's'}
        </p>
      </div>

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
                    className={`w-full h-12 rounded-lg ${seatClass} transition-all duration-200 disabled:opacity-50 flex items-center justify-center transform hover:scale-105 active:scale-95 relative overflow-hidden`}
                    onClick={() => selectOrUnselectSeats(seatNumber + 1)}
                    disabled={bus.seatsBooked.includes(seatNumber + 1)}
                  >
                    {/* Seat Icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="w-10 h-10 text-current opacity-30" viewBox="0 0 24 24" fill="none">
                        {/* Seat Back */}
                        <path d="M5 18V11C5 7.68629 7.68629 5 11 5H13C16.3137 5 19 7.68629 19 11V18" 
                          stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        {/* Seat Base */}
                        <path d="M4 17H20V19C20 20.1046 19.1046 21 18 21H6C4.89543 21 4 20.1046 4 19V17Z" 
                          fill="currentColor"/>
                        {/* Headrest */}
                        <path d="M9 5.5C9 4.11929 10.1193 3 11.5 3H12.5C13.8807 3 15 4.11929 15 5.5V6H9V5.5Z" 
                          fill="currentColor"/>
                        {/* Seat Pattern */}
                        <path d="M8 12H16M8 15H16" 
                          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <span className="font-medium text-sm relative z-10">{seatNumber + 1}</span>
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
