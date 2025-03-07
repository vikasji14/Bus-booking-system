import React, { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { axiosInstance } from "../helpers/axiosInstance";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import Bus from "../components/Bus";
import { Row, Col, message } from "antd";
import { Helmet } from "react-helmet";
import axios from "axios";
function Home() {
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
        <title>Home</title>
      </Helmet>
      <div className="overflow-x-hidden">
        <div className="full  my-5 mx-2 p-2 px-2 py-3 flex justify-center">
          <Row gutter={10} align="center">
            <Col lg={12} sm={24}>
              <select
                className="mb-5 select select-primary bg-gray-50 border text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-white dark:text-white"
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
                className="mb-5 select select-primary bg-gray-50 border text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-white dark:text-white "
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
                className="mb-5 input input-primary bg-gray-50 border text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-white dark:text-white "
                min={new Date().toISOString().split("T")[0]}
                type="date"
                placeholder="Select Date"
                onChange={(e) => {
                  setFilters({ ...filters, journeyDate: e.target.value });
                }}
              />
            </Col>
            <Col lg={8} sm={24}>
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
                  <span className="relative w-full text-left text-black transition-colors duration-200 ease-in-out group-hover:text-white">
                    Search
                  </span>
                  <span className="absolute inset-0 border-2 border-blue-600 rounded-full"></span>
                </button>
              </div>

            </Col>

          </Row>

        </div>
        {status && buses.length === 0 && (
          <div className="flex justify-center w-full pb-4 items-center">
            <div className="font-bold text-red-800">***No any Bus Available plz try another date or change your destination</div>
          </div>
        )}

        <Row gutter={[15, 15]}>
            <div className="flex flex-wrap gap-4 md:gap-10 justify-center w-full">
              {buses.map((bus, index) => {
                return (
                  <Col key={index} lg={10} sm={10}>
                    <Bus bus={bus} />
                  </Col>
                );
              })}
            </div>

          {buses.length === 0 && (
            <div className="flex flex-wrap gap-4 md:gap-10 justify-center w-full">
              {allBuses.map((bus, index) => {
                return (
                  <Col key={index} lg={10} sm={10}>
                    <Bus bus={bus} />
                  </Col>
                );
              })}
            </div>
          )}
        </Row>
      </div>
    </>
  );
}

export default Home;
