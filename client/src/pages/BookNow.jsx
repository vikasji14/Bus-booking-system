import React, { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { axiosInstance } from "../helpers/axiosInstance";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import { Row, Col, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import SeatSelection from "../components/SeatSelection";
import { Helmet } from "react-helmet";
import moment from "moment";
import { FaLocationDot } from "react-icons/fa6";
import { MdModeStandby } from "react-icons/md";

function BookNow() {
  const navigate = useNavigate();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const params = useParams();
  const dispatch = useDispatch();
  const [bus, setBus] = useState(null);
  const [user, setUser] = useState((localStorage.getItem("user_id")));
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  const getBus = useCallback(async () => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.get(`${process.env.REACT_APP_SERVER_URL}/api/buses/${params.id}`);
      dispatch(HideLoading());
      if (response.data.success) {
        setBus(response.data.data);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  }, [dispatch, params.id]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    script.onerror = () => {
      console.error('Failed to load Razorpay script');
      message.error('Payment system failed to load. Please refresh the page.');
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async () => {
    if (!razorpayLoaded) {
      message.error('Payment system is still loading. Please wait...');
      return;
    }

    try {
      dispatch(ShowLoading());
      console.log('Initiating payment...');

      const response = await axiosInstance.post(`${process.env.REACT_APP_SERVER_URL}/api/bookings/create-order`, {
        amount: (bus.price * (1 - (bus.discountPercentage || 0) / 100) * selectedSeats.length) * 100
      });

      console.log('Order created:', response.data);

      const options = {
        key: 'rzp_test_sy54SSBzD8tp1c',
        amount: response.data.amount,
        currency: 'INR',
        name: 'Bus Booking System',
        description: 'Bus Ticket Booking',
        order_id: response.data.id,
        handler: async function(response) {
          try {
            await axiosInstance.post(`${process.env.REACT_APP_SERVER_URL}/api/bookings/verify-payment`, {
              paymentId: response.razorpay_payment_id,
              bookingDetails: {
                bus: bus._id,
                user: user,
                seats: selectedSeats,
                transactionId: response.razorpay_payment_id
              }
            });
            message.success('Booking successful!');
            navigate('/bookings');
          } catch (error) {
            console.error('Payment verification failed:', error);
            message.error('Payment verification failed');
          }
        },
        // prefill: {
        //   name: user.name,
        //   email: user.email
        // },
        theme: {
          color: '#2563eb'
        }
      };

      console.log('Opening Razorpay checkout...');
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment error:', error);
      message.error(error.message);
    } finally {
      dispatch(HideLoading());
    }
  };

  const bookNow = async (transactionId) => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.post(
        `${process.env.REACT_APP_SERVER_URL}/api/bookings/book-seat/${localStorage.getItem("user_id")}`,
        {
          bus: bus._id,
          seats: selectedSeats,
          transactionId,
        }
      );
      dispatch(HideLoading());
      if (response.data.success) {
        message.success(response.data.message);
        navigate("/bookings");
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  useEffect(() => {
    getBus();
  }, [getBus]);
  return (
    <>
      <Helmet>
        <title>Book Now</title>
      </Helmet>
      <div>
        {bus && (
          <div className="max-w-7xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">
              <Row gutter={[30, 30]}>
                <Col lg={12} xs={24} sm={24}>
                  {/* Bus Details Card */}
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="border-b dark:border-gray-700 pb-4">
                      <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                        {bus.name}
                      </h1>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Bus No: {bus.busNumber}</p>
                      <div className="flex items-center space-x-4">
                        <div className="flex-1">
                          <div className="relative">
                            {/* Journey Path Visual */}
                            <div className="absolute left-2 top-1/2 w-[calc(100%-1rem)] h-0.5 bg-gradient-to-r from-blue-500 to-green-500 transform -translate-y-1/2"></div>
                            {/* Animated Bus Icon */}
                            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 animate-[rightMove_4s_linear_infinite] group">
                              <div className="relative -top-2">
                                <svg className="w-7 h-7 text-blue-600 dark:text-blue-400 transform -scale-x-100 drop-shadow-lg group-hover:text-blue-700 transition-colors duration-2" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M8 10a1 1 0 100 2 1 1 0 000-2m8 0a1 1 0 100 2 1 1 0 000-2m-2.5-4h-3a.5.5 0 000 1h3a.5.5 0 000-1M21 11.5V9c0-3.5-3.6-4-8-4s-8 .5-8 4v2.5c0 .3-.2.5-.5.5h-1c-.3 0-.5.2-.5.5v2c0 .3.2.5.5.5H4c.3 0 .5-.2.5-.5V12c0-.3.2-.5.5-.5h14c.3 0 .5.2.5.5v2.5c0 .3.2.5.5.5h.5c.3 0 .5-.2.5-.5v-2c0-.3-.2-.5-.5-.5h-1c-.3 0-.5-.2-.5-.5M7 6.7c-.2-.2-.3-.4-.3-.7 0-.5.4-1 1-1h8.6c.6 0 1 .4 1 1 0 .3-.1.5-.3.7-.2.2-.4.3-.7.3H7.7c-.3 0-.5-.1-.7-.3m.8 10.2C6.8 17 6 16.2 6 15.2s.8-1.8 1.8-1.8 1.8.8 1.8 1.8-.9 1.7-1.8 1.7m8.5 0c-1 0-1.8-.8-1.8-1.8s.8-1.8 1.8-1.8 1.8.8 1.8 1.8-.9 1.7-1.8 1.7" />
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
                    </div>

                    {/* Journey Details */}
                    <div className="space-y-4 border-b dark:border-gray-700 pb-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                          <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div className="flex flex-col gap-1" >
                          <span className="text-sm text-gray-500 dark:text-gray-400">Journey Date</span>
                          <span className="text-lg font-medium text-gray-900 dark:text-gray-100">{bus.journeyDate}</span>
                        </div>
                      </div>

                      {/* <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-50 dark:bg-green-900/30 rounded-lg">
                          <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="flex gap-6">
                          <div className="flex flex-col gap-1">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Departure</span>
                            <span className="text-lg font-medium text-gray-900 dark:text-gray-100">
                              {moment(bus.departure, "HH:mm").format("hh:mm A")}
                            </span>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Arrival</span>
                            <span className="text-lg font-medium text-gray-900 dark:text-gray-100">
                              {moment(bus.arrival, "HH:mm").format("hh:mm A")}
                            </span>
                          </div>
                        </div>
                      </div> */}

                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                          <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-sm text-gray-500 dark:text-gray-400">Price per seat</span>
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-medium text-gray-900 dark:text-gray-100 line-through">₹{bus.price}</span>
                            <span className="text-lg font-medium text-green-600 dark:text-green-400">₹{(bus.price * (1 - (bus.discountPercentage || 0) / 100)).toFixed(2)}</span>
                            {bus.discountPercentage > 0 && (
                              <span className="px-2 py-1 bg-red-50 text-red-700 text-xs font-medium rounded-full dark:bg-red-900/30 dark:text-red-300">
                                {bus.discountPercentage}% off
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Capacity Info */}
                    <div className="grid grid-cols-2 gap-4 border-b dark:border-gray-700 pb-6">
                      <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-xl">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Total Capacity</p>
                        <p className="text-2xl font-semibold text-blue-600 dark:text-blue-400">{bus.capacity}</p>
                      </div>
                      <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-xl">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Seats Left</p>
                        <p className="text-2xl font-semibold text-green-600 dark:text-green-400">
                          {bus.capacity - bus.seatsBooked.length}
                        </p>
                      </div>
                    </div>

                    <Col lg={24} xs={24} sm={24}>
                      <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Choose Your Seats</h2>
                        <SeatSelection
                          selectedSeats={selectedSeats}
                          setSelectedSeats={setSelectedSeats}
                          bus={bus}
                        />
                      </div>
                    </Col>
                  </div>
                </Col>
                {/* Selected Seats & Payment */}
                <Col lg={12} xs={24} sm={24}>
                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg">
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Selected Seats</p>
                          <div className="mt-1 flex flex-wrap gap-2">
                            {selectedSeats.length > 0 ? (
                              selectedSeats.map((seat) => (
                                <span key={seat} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                                  Seat {seat}
                                </span>
                              ))
                            ) : (
                              <span className="text-gray-400 dark:text-gray-500 italic">No seats selected</span>
                            )}
                          </div>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Price Breakdown</p>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span>Original Price ({selectedSeats.length} seats):</span>
                              <span>₹{(bus.price * selectedSeats.length).toFixed(2)}</span>
                            </div>
                            {bus.discountPercentage > 0 && (
                              <div className="flex justify-between">
                                <span>Discount ({bus.discountPercentage}%):</span>
                                <span className="text-red-600">- ₹{(bus.price * selectedSeats.length * (bus.discountPercentage / 100)).toFixed(2)}</span>
                              </div>
                            )}
                            <div className="flex justify-between border-t pt-1">
                              <span className="font-medium">Total Amount:</span>
                              <span className="font-medium text-blue-600">₹{(bus.price * (1 - (bus.discountPercentage || 0) / 100) * selectedSeats.length).toFixed(2)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-end justify-between border-t dark:border-gray-700 pt-4">
                          <div>
                            <div className="mt-1 flex flex-col gap-1 items-baseline">
                              <span className="text-sm text-gray-500 dark:text-gray-400">Total Amount</span>

                              <span className="text-xl font-bold text-blue-600 dark:text-blue-400">₹ {(bus.price * (1 - (bus.discountPercentage || 0) / 100) * selectedSeats.length).toFixed(2)}</span>
                            </div>
                          </div>

                          <button
                            className={`relative px-6 py-3 rounded-xl font-medium text-white transition-all duration-200 ${selectedSeats.length === 0
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg hover:shadow-blue-500/30 transform hover:-translate-y-0.5 active:translate-y-0"
                              }`}
                            disabled={selectedSeats.length === 0}
                            onClick={handlePayment}
                          >
                            <span className="flex items-center gap-2">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                              Pay Now
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>

              </Row>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default BookNow;
