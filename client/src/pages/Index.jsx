import logo from "../assets/img/logo.png";
import { Helmet } from "react-helmet";
import React, { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { axiosInstance } from "../helpers/axiosInstance";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import Bus from "../components/Bus";
import Footer from '../components/Footer';
import Partner from '../components/Partner';
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Row, message } from "antd";
import { Link } from "react-router-dom";
import axios from "axios";
function Index() {
  const dispatch = useDispatch();
  const [buses, setBuses] = useState([]);
  const [cities, setCities] = useState([]);
  const [filters, setFilters] = useState({});
  const [allBuses, setAllBuses] = useState([]);
  const [status, setStatus] = useState(false);
  const [visibleCount, setVisibleCount] = useState(3); // Show only 6 initially
  const [isMobile, setIsMobile] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  console.log(cities)
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 500); // lg breakpoint ke liye
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);
  const handleSeeMore = () => {
    setVisibleCount((prev) => prev + 6); // Load 6 more buses on click
  };
  const getBusesByFilter = useCallback(async () => {
    dispatch(ShowLoading());
    const from = filters.from;
    const to = filters.to;
    const journeyDate = filters.journeyDate;
    try {
      const { data } = await axiosInstance.post(
        `${process.env.REACT_APP_SERVER_URL}/api/buses/get?from=${from}&to=${to}&journeyDate=${journeyDate}`
      );
      setStatus(true);
      setBuses(data.data);
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.response.data.message);
    }
  }, [filters, dispatch]);

  useEffect(() => {
    axiosInstance.get(`${process.env.REACT_APP_SERVER_URL}/api/cities/get-all-cities`).then((response) => {
      const filteredCities = response.data.data
        .filter((city) => city.ville && city.ville.trim() !== "")
        .map((city) => ({ value: city.ville, label: city.ville })); // Format for react-select

      setCities(filteredCities);
    });
  }, []);
  useEffect(() => {
    const fetchBuses = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/api/buses/1/allbuses`
        );
        setAllBuses(response.data.data);
      } catch (error) {
        console.error("Error fetching buses:", error);
      }
    };

    fetchBuses();
  }, []);

  useCallback(() => {
    if (filters.from && filters.to && filters.journeyDate) {
      getBusesByFilter();
    }
  }, [filters.from, filters.to, filters.journeyDate, getBusesByFilter]);

  return (
    <>
      <Helmet>
        <title>Bus Booking</title>
      </Helmet>
      <div className="w-full overflow-x-hidden">

        <div className="flex flex-col-reverse  bg-gray-900">

          {(buses.length > 0) && (
            <div
              className="hero lg:flex w-full"
              style={{
                backgroundImage: `url("https://cdn.dribbble.com/users/1976094/screenshots/4687414/buss_trvl.gif")`,
                backgroundSize: "cover",
                backgroundPosition: "center center",
              }}
            >
              <div className="flex items-center h-full w-full">
                <div className="h-screen overflow-auto overflow-x-hidden">
                  <div className="bg-opacity-80">
                    <Row gutter={[10, 10]}>
                      {isMobile && buses.length !== 0 && (
                        <div className="flex  opacity-80 justify-center mx-auto mt-2 items-center">
                          <p className="text-black font-bold text-2xl">
                            {filters.from} <span>To</span> {filters.to} All Buses
                          </p>
                        </div>
                      )}

                      {buses.map((bus, index) => (
                        <div key={index} className="w-screen flex flex-row p-10  md:w-6/12 lg:w-4/12">
                          <Bus bus={bus} />
                        </div>
                      ))}
                    </Row>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className=" text-center text-neutral-content">
            <div className="w-full mx-auto flex items-center flex-col">
              <div className="flex justify-center mt-4">
                <img
                  className="text-center w-20 h-20 rounded-full"
                  src={logo}
                  alt="logo"
                />
              </div>

              <h1 className="mb-5 text-5xl text-white font-bold ">
                Bus Booking
              </h1>
              <p className="mb-5 text-xl text-white">
                Book online! Your journey begins with a click – secure seats, best prices, and stress-free travel.
              </p>
              <Link
                to="/login"
                className="relative inline-flex items-center justify-start
                px-10 py-3 overflow-hidden font-bold rounded-full
                group"
              >
                <span className="w-32 h-32 rotate-45 translate-x-12 -translate-y-2 absolute left-0 top-0 bg-white opacity-[3%]"></span>
                <span className="absolute top-0 left-0 w-48 h-48 -mt-1 transition-all duration-500 ease-in-out rotate-45 -translate-x-56 -translate-y-24 bg-blue-600 opacity-100 group-hover:translate-x-1"></span>
                <span className="relative w-full text-left text-white transition-colors duration-200 ease-in-out group-hover:text-white">
                  Check your tickets
                </span>
                <span className="absolute inset-0 border-2 border-blue-600 rounded-full"></span>
              </Link>
              <div>
                <div className="w-full flex text-black mt-4 flex-col" align="center">
                  <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-10 w-full">
                    <div className="w-[300px] font-semibold">
                      <Select
                        options={cities}
                        placeholder="Search your location..."
                        isSearchable={true} // Enables search functionality
                        onChange={(selectedOption) => {
                          setFilters((prevFilters) => ({
                            ...prevFilters,
                            from: selectedOption ? selectedOption.value : "",
                          }));
                        }}
                      />
                    </div>

                    <div className="w-[300px] font-semibold">
                      <Select
                        options={cities}
                        placeholder="Search Destination..."
                        isSearchable={true} // Enables search functionality
                        onChange={(selectedOption) => {
                          setFilters((prevFilters) => ({
                            ...prevFilters,
                            to: selectedOption ? selectedOption.value : "",
                          }));
                        }}
                      />
                    </div>

                    <div className="relative w-[300px] font-semibold">
                      <DatePicker
                        selected={selectedDate}
                        onChange={(date) => {
                          setSelectedDate(date);
                          setFilters({ ...filters, journeyDate: date.toISOString().split("T")[0] });
                        }}
                        minDate={new Date()} // Disable past dates
                        placeholderText="Select Journey Date" // Custom placeholder
                        className="w-full border border-gray-300 rounded-md p-2 pl-10 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex mt-4 justify-center gap-4">
                      <button
                        onClick={() => {
                          getBusesByFilter();

                        }}
                        className="relative inline-flex items-center justify-start
                    px-10 py-3 overflow-hidden font-bold rounded-full
                    group"
                      >
                        <span className="w-32 h-32 rotate-45 translate-x-12 -translate-y-2 absolute left-0 top-0 bg-white opacity-[3%]"></span>
                        <span className="absolute top-0 left-0 w-48 h-48 -mt-1 transition-all duration-500 ease-in-out rotate-45 -translate-x-56 -translate-y-24 bg-blue-600 opacity-100 group-hover:-translate-x-8"></span>
                        <span className="relative w-full text-left text-white transition-colors duration-200 ease-in-out group-hover:text-white">
                          Search
                        </span>
                        <span className="gap-5 absolute inset-0 border-2 border-blue-600 rounded-full"></span>
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-center gap-4 mt-5 w-full">
                    {buses.length === 0 && !status && (
                      <div className="text-center text-white text-2xl">
                        Make your search now
                      </div>
                    )}
                    {
                      (status && buses.length === 0) && (
                        <div className="flex justify-center mx-auto mt-2 items-center">
                          <p className="text-red-800 font-bold"> **No buses are available for the selected route and destination.</p>
                        </div>
                      )
                    }
                  </div>
                </div>
              </div>

            </div>
          </div>


        </div>

        <div className="bg-slate-900">
          <Row gutter={[15, 15]}>
            {allBuses.slice(0, visibleCount).map((bus, index) => (
              <div key={index} className="w-full p-10 md:w-4/12">
                <Bus bus={bus} />
              </div>
            ))}
          </Row>

          {/* "See More" Button - Only show if more buses are available */}
          {visibleCount < allBuses.length && (
            <div className="flex mt-4 mb-4 justify-center gap-4">
              <button
                onClick={handleSeeMore}
                className="relative inline-flex items-center justify-start
                    px-10 py-3 overflow-hidden font-bold rounded-full
                    group"
              >
                <span className="w-32 h-32 rotate-45 translate-x-12 -translate-y-2 absolute left-0 top-0 bg-white opacity-[3%]"></span>
                <span className="absolute top-0 left-0 w-48 h-48 -mt-1 transition-all duration-500 ease-in-out rotate-45 -translate-x-56 -translate-y-24 bg-blue-600 opacity-100 group-hover:-translate-x-8"></span>
                <span className="relative w-full text-left text-white transition-colors duration-200 ease-in-out group-hover:text-white">
                  See More Bus...
                </span>
                <span className="gap-5 absolute inset-0 border-2 border-blue-600 rounded-full"></span>
              </button>
            </div>
          )}
          <Partner />
        </div>

      </div>
      <Footer />
    </>
  );
}

export default Index;
