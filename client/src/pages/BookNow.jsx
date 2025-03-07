import React, { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { axiosInstance } from "../helpers/axiosInstance";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import { Row, Col, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import SeatSelection from "../components/SeatSelection";
import StripeCheckout from "react-stripe-checkout";
import { Helmet } from "react-helmet";
import moment from "moment";

function BookNow() {
  const navigate = useNavigate();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const params = useParams();
  const dispatch = useDispatch();
  const [bus, setBus] = useState(null);

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

  const onToken = async (token) => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.post(`${process.env.REACT_APP_SERVER_URL}/api/bookings/make-payment`, {
        token,
        amount: selectedSeats.length * bus.price,
      });

      dispatch(HideLoading());
      if (response.data.success) {
        message.success(response.data.message);
        bookNow(response.data.data.transactionId);
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
          <div className="max-w-7xl mx-auto p-4">
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
                      <div className="mt-2 flex items-center gap-3">
                        <span className="text-xl text-gray-700 dark:text-gray-300">{bus.from}</span>
                        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                        <span className="text-xl text-gray-700 dark:text-gray-300">{bus.to}</span>
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
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Journey Date</p>
                          <p className="text-lg font-medium text-gray-900 dark:text-gray-100">{bus.journeyDate}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-50 dark:bg-green-900/30 rounded-lg">
                          <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="flex gap-6">
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Departure</p>
                            <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                              {moment(bus.departure, "HH:mm").format("hh:mm A")}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Arrival</p>
                            <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                              {moment(bus.arrival, "HH:mm").format("hh:mm A")}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                          <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Price per seat</p>
                          <p className="text-lg font-medium text-gray-900 dark:text-gray-100">DH {bus.price}</p>
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

                    {/* Selected Seats & Payment */}
                    <div className="space-y-4">
                      <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg">
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Selected Seats</p>
                            <div className="mt-1 flex flex-wrap gap-2">
                              {selectedSeats.length > 0 ? (
                                selectedSeats.map((seat) => (
                                  <span key={seat} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                                    Seat {seat}
                                  </span>
                                ))
                              ) : (
                                <span className="text-gray-400 dark:text-gray-500 italic">No seats selected</span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-end justify-between border-t dark:border-gray-700 pt-4">
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Total Amount</p>
                              <div className="mt-1 flex items-baseline">
                                <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">DH {bus.price * selectedSeats.length}</span>
                                <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">/ {selectedSeats.length} seats</span>
                              </div>
                            </div>
                            
                            <StripeCheckout
                              billingAddress
                              disabled={selectedSeats.length === 0}
                              token={onToken}
                              amount={bus.price * selectedSeats.length * 100}
                              currency="MAD"
                              stripeKey="pk_test_ZT7RmqCIjI0PqcpDF9jzOqAS"
                            >
                              <button
                                className={`relative px-6 py-3 rounded-xl font-medium text-white transition-all duration-200 ${
                                  selectedSeats.length === 0
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg hover:shadow-blue-500/30 transform hover:-translate-y-0.5 active:translate-y-0"
                                }`}
                                disabled={selectedSeats.length === 0}
                              >
                                <span className="flex items-center gap-2">
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                  </svg>
                                  Pay Now
                                </span>
                              </button>
                            </StripeCheckout>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
                <Col lg={12} xs={24} sm={24}>
                  <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Select Your Seats</h2>
                    <SeatSelection
                      selectedSeats={selectedSeats}
                      setSelectedSeats={setSelectedSeats}
                      bus={bus}
                    />
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
