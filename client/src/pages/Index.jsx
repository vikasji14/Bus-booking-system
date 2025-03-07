import logo from "../assets/img/logo.png";
import { Helmet } from "react-helmet";
import React, { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { axiosInstance } from "../helpers/axiosInstance";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import Bus from "../components/Bus";
import { Row, Col, message } from "antd";
import { Link } from "react-router-dom";
import axios from "axios";
function Index() {
  const dispatch = useDispatch();
  const [buses, setBuses] = useState([]);
  const [cities, setCities] = useState([]);
  const [filters, setFilters] = useState({});
  const [allBuses, setAllBuses] = useState([]);
  const [status, setStatus] = useState(false);
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
      setCities(response.data.data);
    });
  }, []);
  useEffect(() => {
    const fetchBuses = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/api/buses/1/allbuses`
        );
        setAllBuses(response.data.data);
        console.log("All Buses:", response.data.data);
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

        <div className="flex flex-col-reverse md:flex-row bg-gray-900">

          <div
            className="hero lg:flex w-full lg:w-3/4"
            style={{
              backgroundImage: `url("https://cdn.dribbble.com/users/1976094/screenshots/4687414/buss_trvl.gif")`,
              backgroundSize: "cover",
              backgroundPosition: "center center",
            }}
          >

            <div className="flex items-center h-full w-full">

              <div className="h-screen overflow-auto overflow-x-hidden">

                <div className="bg-opacity-80">
                  <Row gutter={[15, 15]}>
                    {/* {
                      buses.length != 0 && (
                        <div className="flex opacity-80 justify-center mx-auto mt-2 items-center">
                          <p className="text-black font-bold text-2xl underline"> {filters.from}  <span>{buses.length!=0 && "To" }</span> {filters.to}  {filters.journeyDate}</p>
                        </div>
                      )
                    } */}

                    {buses.map((bus, index) => {
                      return (
                        <div key={index} className="w-screen p-10 ">
                          <Bus bus={bus} />
                        </div>
                      );
                    })}
                  </Row>
                </div>
              </div>
            </div>
          </div>

          <div className="hero-content text-center text-neutral-content">
            <div className="max-w-md ">
              <div className="flex justify-center">
                <img
                  className=" text-center w-20 h-20 rounded-full"
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
              <div className="w-full text-black my-5 mx-2 p-2 px-2 py-3 flex justify-center">
                <div className="w-full" gutter={10} align="center">
                  <Col lg={12} sm={24}>
                    <select
                      className="mb-5 select select-primary w-full max-w-xs"
                      onChange={(e) => {
                        setFilters({ ...filters, from: e.target.value });
                      }}
                    >
                      <option value="">Your Location</option>
                      {cities.map((data, index) => {
                        return (
                          <option key={index} value={data.ville}>
                            {data.ville}
                          </option>
                        );
                      })}
                    </select>
                  </Col>
                  <Col lg={12} sm={24}>
                    <select
                      className="mb-5 select select-primary w-full max-w-xs"
                      onChange={(e) => {
                        setFilters({ ...filters, to: e.target.value });
                      }}
                    >
                      <option value="">Destination</option>
                      {cities.map((data, index) => {
                        return (
                          <option key={index} value={data.ville}>
                            {data.ville}
                          </option>
                        );
                      })}
                    </select>
                  </Col>
                  <Col lg={24} sm={24}>
                    <input
                      className="mb-5 input input-bordered input-primary w-full max-w-xs"
                      min={new Date().toISOString().split("T")[0]}
                      type="date"
                      placeholder="Date"
                      onChange={(e) => {
                        setFilters({
                          ...filters,
                          journeyDate: e.target.value,
                        });
                      }}
                    />
                  </Col>
                  <Col lg={24} sm={24}>
                    <div className="flex justify-center gap-4">
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
                  </Col>
                  <div className="flex justify-center gap-4 mt-5 w-full">
                    {buses.length === 0 && !status && (
                      <div className="text-center text-white text-2xl">
                        Make your search now
                      </div>
                    )}
                    {
                      (status && buses.length === 0) && (
                        <div className="flex justify-center mx-auto mt-2 items-center">
                          <p className="text-red-800 font-bold"> **No Bus Avaliable You Can try another Destination</p>
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
            {allBuses.map((bus, index) => {
              return (
                <div key={index} className="w-full md:w-2/4 p-10 ">
                  <Bus bus={bus} />
                </div>
              );
            })}
          </Row>
        </div>

      </div>
    </>
  );
}

export default Index;
