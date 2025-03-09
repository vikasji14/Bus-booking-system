import React, { useEffect, useRef, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { axiosInstance } from "../helpers/axiosInstance";
import { message, Table, Modal, Input, Space, Button, Tooltip } from "antd";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import PageTitle from "../components/PageTitle";
import moment from "moment";
import { useReactToPrint } from "react-to-print";
import logo from "../assets/img/logo.png";
import { Helmet } from "react-helmet";
import QRCode from "react-qr-code";
import { SearchOutlined, UserOutlined, CarOutlined } from "@ant-design/icons";
import html2pdf from 'html2pdf.js';
import { FaLocationDot } from "react-icons/fa6";
import { MdModeStandby } from "react-icons/md";
import Footer from "../components/Footer";

function Bookings() {
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const getBookings = useCallback(async () => {
    try {
      setLoading(true);
      dispatch(ShowLoading());
      const response = await axiosInstance.get(
        `${process.env.REACT_APP_SERVER_URL}/api/bookings/${localStorage.getItem("user_id")}`,
        {}
      );
      dispatch(HideLoading());
      if (response.data.success) {
        const mappedData = response.data.data
          .map((booking) => ({
            ...booking,
            ...booking.bus,
            key: booking._id,
            user: booking.user.name,
            createdAt: booking.createdAt,
          }))
          .reverse();
        setBookings(mappedData);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => confirm()}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => confirm()}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
            className="bg-blue-500"
          >
            Search
          </Button>
          <Button onClick={() => clearFilters()} size="small" style={{ width: 90 }}>
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : "",
  });

  const columns = [
    {
      title: "Booking Time",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => moment(createdAt).format("DD/MM/YYYY HH:mm"),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      align: "center",
      width: 150,
    },
    {
      title: "Bus Name",
      dataIndex: "name",
      key: "bus",
      ...getColumnSearchProps("name"),
      sorter: (a, b) => a.name.localeCompare(b.name),
      align: "center",
      width: 150,
    },
    {
      title: "Full Name",
      dataIndex: "user",
      key: "user",
      ...getColumnSearchProps("user"),
      sorter: (a, b) => a.user.localeCompare(b.user),
      align: "center",
      width: 150,
    },
    {
      title: "Bus Number",
      dataIndex: "busNumber",
      key: "bus",
      ...getColumnSearchProps("busNumber"),
      sorter: (a, b) => a.busNumber.localeCompare(b.busNumber),
      align: "center",
      width: 120,
    },
    {
      title: "Journey Date",
      dataIndex: "journeyDate",
      render: (journeyDate) => moment(journeyDate).format("DD/MM/YYYY"),
      sorter: (a, b) => new Date(a.journeyDate) - new Date(b.journeyDate),
      align: "center",
      width: 150,
    },
    {
      title: "Journey Time",
      dataIndex: "departure",
      render: (departure) => moment(departure, "HH:mm").format("hh:mm A"),
      sorter: (a, b) => a.departure.localeCompare(b.departure),
      align: "center",
      width: 150,
    },
    {
      title: "Seats",
      dataIndex: "seats",
      render: (seats) => (
        <div>
          {seats.length > 3 ? (
            <Tooltip title={seats.join(', ')}>
              <span>
                {seats.slice(0, 3).join(', ')}
                <button className="text-blue-500 hover:text-blue-700 ml-1">See more</button>
              </span>
            </Tooltip>
          ) : (
            seats.join(', ')
          )}
        </div>
      ),
      align: "center",
      width: 120,
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      width: 150,
      render: (text, record) => (
        <div className="flex gap-3 justify-center">
          <Tooltip title="View Tickets">
            <button
              className="text-blue-500 hover:text-blue-700 transition-colors"
              onClick={() => {
                setSelectedBooking(record);
                setShowPrintModal(true);
              }}
            >
              <i className="ri-eye-line text-xl"></i>
            </button>
          </Tooltip>
          <Tooltip title="Cancel Ticket">
            <button
              className="text-red-500 hover:text-red-700 transition-colors"
              onClick={() => CancelBooking()}
            >
              <i className="ri-delete-bin-line text-xl"></i>
            </button>
          </Tooltip>
        </div>
      ),
    },
  ];

  console.log("selectBooking", selectedBooking)

  const CancelBooking = async () => {
    try {
      setLoading(true);
      dispatch(ShowLoading());
      const res = await axiosInstance.get(
        `${process.env.REACT_APP_SERVER_URL}/api/bookings/${localStorage.getItem("user_id")}`
      );
      const bus_id = res.data.data[0].bus._id;
      const user_id = res.data.data[0].user._id;
      const booking_id = res.data.data[0]._id;
      const response = await axiosInstance.delete(
        `${process.env.REACT_APP_SERVER_URL}/api/bookings/${booking_id}/${user_id}/${bus_id}`,
        {}
      );
      dispatch(HideLoading());
      if (response.data.success) {
        message.success(response.data.message);
        getBookings();
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBookings();
  }, [getBookings]);

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <>
      <Helmet>
        <title>Bookings</title>
      </Helmet>

      <div className="p-4">
        <PageTitle title="Ticket Bookings" />
        <div className="bg-white rounded-lg shadow">
          <Table
            columns={columns}
            dataSource={bookings}
            rowKey="_id"
            scroll={{ x: 800 }}
            loading={loading}
            className="hover:bg-gray-50 transition-colors"
            bordered
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              pageSizeOptions: ["10", "20", "50"],
              showTotal: (total) => `Total ${total} items`,
            }}
          />
        </div>
        {showPrintModal && (
          <Modal
            width={800}
            title={null}
            onCancel={() => {
              setShowPrintModal(false);
              setSelectedBooking(null);
            }}
            open={showPrintModal}
            className="animate-fade-in"
            footer={[
              <Button key="print" type="primary" className="hover:scale-105 transition-transform" onClick={handlePrint}>
                Print
              </Button>,
              <Button
                key="download"
                type="default"
                className="hover:scale-105 transition-transform"
                onClick={() => {
                  const element = document.getElementById('ticket-content');
                  const opt = {
                    margin: 10,
                    filename: `invoice-${selectedBooking?.transactionId}.pdf`,
                    image: { type: 'jpeg', quality: 0.98 },
                    html2canvas: { scale: 2 },
                    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
                  };
                  html2pdf().from(element).set(opt).save();
                }}
              >
                Download PDF
              </Button>,
            ]}
          >
            <div id="ticket-content" className="p-8 bg-white rounded-lg shadow-xl border border-gray-100">
              <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-t-lg -m-8 mb-8 p-8">
                <div className="text-center">
                  <img src={logo} alt="Logo" className="w-24 mx-auto mb-4" />
                  <h1 className="text-3xl font-bold text-white">Booking Invoice</h1>
                  <p className="text-gray-200">Transaction ID: {selectedBooking?.transactionId}</p>
                  <p className="text-gray-200">Date: {moment().format('DD/MM/YYYY hh:mm A')}</p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute left-2 top-1/2 w-[calc(100%-1rem)] h-0.5 bg-gradient-to-r from-blue-500 to-green-500 transform -translate-y-1/2 animate-pulse"></div>
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 animate-[rightMove_4s_linear_infinite] group">
                  <div className="relative -top-2">
                    <svg className="w-7 h-7 text-blue-600 dark:text-blue-400 transform -scale-x-100 drop-shadow-lg group-hover:text-blue-700 transition-colors duration-200 hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]" viewBox="0 0 24 24" fill="currentColor">
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
                        <span className="group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-200">{selectedBooking?.from}</span>
                      </span>
                      <span className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 w-0 group-hover:w-full transition-all duration-300"></span>
                    </button>
                    <p className="text-xs font-medium text-blue-600/90 dark:text-blue-400/90 mt-2">
                      {moment(selectedBooking?.departure, "HH:mm").format("hh:mm A")}
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
                        <span className="group-hover:text-green-700 dark:group-hover:text-green-300 transition-colors duration-200">{selectedBooking?.to}</span>
                      </span>
                      <span className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-green-500 to-green-600 w-0 group-hover:w-full transition-all duration-300"></span>
                    </button>
                    <p className="text-xs font-medium text-green-600/90 dark:text-green-400/90 mt-2">
                      {moment(selectedBooking?.arrival, "HH:mm").format("hh:mm A")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 pt-4 gap-8 mb-8">
                <div className="border-r border-gray-200 pr-8">
                  <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
                    <UserOutlined className="mr-2 text-blue-600" />
                    Passenger Details
                  </h2>
                  <div className="space-y-2">
                    <p className="text-gray-600"><span className="font-medium">Name:</span> {selectedBooking?.user}</p>
                    <p className="text-gray-600"><span className="font-medium">Seats:</span> {selectedBooking?.seats.join(', ')}</p>
                  </div>
                </div>
                <div className="">
                  <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
                    <CarOutlined className="mr-2 text-purple-600" />
                    Journey Details
                  </h2>
                  <div className="space-y-2">
                    <p className="text-gray-600"><span className="font-medium">Bus:</span> {selectedBooking?.name}</p>
                    <p className="text-gray-600"><span className="font-medium">Bus Number:</span> {selectedBooking?.busNumber}</p>
                    <p className="text-gray-600"><span className="font-medium">Date:</span> {moment(selectedBooking?.journeyDate).format('DD/MM/YYYY')}</p>
                    <p className="text-gray-600"><span className="font-medium">Time:</span> {moment(selectedBooking?.departure, 'HH:mm').format('hh:mm A')}</p>
                  </div>
                </div>
              </div>

              <div className="text-center my-8">
                <div className="inline-block p-4 bg-gray-50 rounded-lg shadow-md border border-gray-100">
                  <QRCode value={JSON.stringify({
                    transactionId: selectedBooking?.transactionId,
                    busName: selectedBooking?.name,
                    busNumber: selectedBooking?.busNumber,
                    date: selectedBooking?.journeyDate,
                    time: selectedBooking?.departure,
                    seats: selectedBooking?.seats,
                    price: selectedBooking?.price * selectedBooking?.seats.length
                  })} size={150} className="mx-auto mb-4" />
                  <p className="text-gray-500 text-sm">Scan this QR code for verification</p>
                </div>
              </div>

              <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-lg hover:shadow-lg transition-shadow">
                <p className="text-2xl font-bold text-white">Total Amount: ₹{selectedBooking?.price * selectedBooking?.seats.length}</p>
              </div>

              <div className="mt-8 text-center text-gray-500 text-sm space-y-1">
                <p className="font-medium">Thank you for choosing our service!</p>
                <p>For any queries, contact us at <span className="text-blue-600">support@busbooking.com</span></p>
              </div>
            </div>
          </Modal>
        )}
      </div>
      <Footer/>
    </>
  );
}

export default Bookings;
