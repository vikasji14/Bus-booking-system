import React, { useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { axiosInstance } from "../../helpers/axiosInstance";
import { message, Table, Input, Space, Button, Tooltip } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { HideLoading, ShowLoading } from "../../redux/alertsSlice";
import PageTitle from "../../components/PageTitle";
import moment from "moment";
import { Helmet } from "react-helmet";

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();


  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => confirm()}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
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
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : '',
  });

  const getBookings = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `${process.env.REACT_APP_SERVER_URL}/api/bookings/get-all-bookings`,
        {}
      );
      setLoading(false);
      if (response.data.success) {
        const mappedData = response.data.data.map((booking) => {
          return {
            ...booking,
            ...booking.bus,
            key: booking._id,
            createdAt: booking.createdAt,
            transactionId: booking.transactionId,
          };
        }).reverse();
        setBookings(mappedData);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      setLoading(false);
      message.error(error.message);
    }
  }, [dispatch]);

  const columns = [
    
    {
      title: 'Booking Time',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt) => moment(createdAt).format('DD/MM/YYYY HH:mm'),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      align: 'center',
      width: 150,
    },
    {
      title: 'Bus Name',
      dataIndex: 'name',
      key: 'bus',
      ...getColumnSearchProps('name'),
      sorter: (a, b) => a.name.localeCompare(b.name),
      align: 'center',
      width: 150,
    },
    {
      title: 'Bus Number',
      dataIndex: 'busNumber',
      key: 'bus',
      ...getColumnSearchProps('busNumber'),
      sorter: (a, b) => a.busNumber.localeCompare(b.busNumber),
      align: 'center',
      width: 120,
    },{
      title: "Journey Date",
      dataIndex: "seats",
      render: (seats) => {
        if (!seats?.length) return "N/A";
        return moment(seats[0]?.date, "DD-MMM-YYYY").format("DD/MM/YYYY");
      },
      sorter: (a, b) =>
        new Date(a.seats?.[0]?.date) - new Date(b.seats?.[0]?.date),
      align: "center",
      width: 150,
    },
    {
      title: 'Journey Time',
      dataIndex: 'departure',
      render: (departure) => moment(departure, 'HH:mm').format('hh:mm A'),
      sorter: (a, b) => a.departure.localeCompare(b.departure),
      align: 'center',
      width: 150,
    },
    {
      title: 'Full Name',
      dataIndex: 'user',
      render: (user) => `${user.name}`,
      ...getColumnSearchProps('user'),
      sorter: (a, b) => a.user.name.localeCompare(b.user.name),
      align: 'center',
      width: 150,
    },
    {
      title: 'Mobile',
      dataIndex: 'mobile',
      align: 'center',
      render: (mobile) => `${mobile}`,
      ...getColumnSearchProps('mobile'),
      sorter: (a, b) => a.mobile.localeCompare(b.mobile),
      width: 120,
    },
    {
      title: 'Address',
      dataIndex: 'address',
    },
    {
      title: "Seats",
      dataIndex: "seats",
      render: (seats) => {
        if (!seats?.length) return "N/A";
    
        const visibleSeats = seats[0]?.seatNumbers?.slice(0, 3).join(", ");
        const hiddenSeats = seats[0]?.seatNumbers?.slice(3).join(", ");
        return (
          <div>
            {seats[0]?.seatNumbers?.length > 3 ? (
              <Tooltip title={hiddenSeats}>
                <span>
                  {visibleSeats}
                  <button className="text-blue-500 hover:text-blue-700 ml-1">
                    See more
                  </button>
                </span>
              </Tooltip>
            ) : (
              visibleSeats
            )}
          </div>
        );
      },
      align: "center",
      width: 120,
    },
    {
      title: 'Transaction ID',
      dataIndex: 'transactionId',
      key: 'transactionId',
      ...getColumnSearchProps('transactionId'),
      align: 'center',
      width: 200,
    },
  ];

  useEffect(() => {
    getBookings();
  }, [getBookings]);

  return (
    <>
      <Helmet>
        <title>User Bookings</title>
      </Helmet>
      <div className="p-4">
        <PageTitle title="Passenger Bookings Chart" />
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
              pageSizeOptions: ['10', '20', '50'],
              showTotal: (total) => `Total ${total} items`,
            }}
          />
        </div>
      </div>
    </>
  );
}

export default AdminBookings;
