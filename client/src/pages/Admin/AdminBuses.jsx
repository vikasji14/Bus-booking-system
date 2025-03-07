import React, { useEffect, useState, useCallback } from "react";
import BusForm from "../../components/BusForm";
import PageTitle from "../../components/PageTitle";
import { HideLoading, ShowLoading } from "../../redux/alertsSlice";
import { useDispatch } from "react-redux";
import { axiosInstance } from "../../helpers/axiosInstance";
import { message, Table, Input, Button, Space } from "antd";
import { Helmet } from "react-helmet";
import { SearchOutlined } from "@ant-design/icons";

function AdminBuses() {
  const dispatch = useDispatch();
  const [showBusForm, setShowBusForm] = useState(false);
  const [buses, setBuses] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);

  const getBuses = useCallback(async () => {
    try {
      setLoading(true);
      dispatch(ShowLoading());
      const response = await axiosInstance.post(`${process.env.REACT_APP_SERVER_URL}/api/buses/get-all-buses`, {}, { withCredentials: true });
      dispatch(HideLoading());
      if (response.data.success) {
        setBuses(response.data.data);
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

  const deleteBus = async (_id) => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.delete(`${process.env.REACT_APP_SERVER_URL}/api/buses/${_id}`, {});

      dispatch(HideLoading());
      if (response.data.success) {
        message.success(response.data.message);
        getBuses();
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
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
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : '',
  });

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      ...getColumnSearchProps('name'),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Bus Number",
      dataIndex: "busNumber",
      ...getColumnSearchProps('busNumber'),
    },
    {
      title: "From",
      dataIndex: "from",
      ...getColumnSearchProps('from'),
      sorter: (a, b) => a.from.localeCompare(b.from),
    },
    {
      title: "To",
      dataIndex: "to",
      ...getColumnSearchProps('to'),
      sorter: (a, b) => a.to.localeCompare(b.to),
    },
    {
      title: "Journey Date",
      dataIndex: "journeyDate",
      sorter: (a, b) => new Date(a.journeyDate) - new Date(b.journeyDate),
    },
    {
      title: "Status",
      dataIndex: "status",
      filters: [
        { text: 'Completed', value: 'Completed' },
        { text: 'Running', value: 'running' },
        { text: 'Pending', value: 'Pending' },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => {
        let className = '';
        switch(status) {
          case 'Completed':
            className = 'text-red-500 bg-red-100 px-2 py-1 rounded';
            break;
          case 'running':
            className = 'text-yellow-500 bg-yellow-100 px-2 py-1 rounded';
            break;
          default:
            className = 'text-green-500 bg-green-100 px-2 py-1 rounded';
        }
        return <span className={className}>{status}</span>;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div className="flex gap-3">
          <button
            className="text-red-500 hover:text-red-700 transition-colors"
            onClick={() => deleteBus(record._id)}
          >
            <i className="ri-delete-bin-line text-xl"></i>
          </button>
          <button
            className="text-blue-500 hover:text-blue-700 transition-colors"
            onClick={() => {
              setSelectedBus(record);
              setShowBusForm(true);
            }}
          >
            <i className="ri-pencil-line text-xl"></i>
          </button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    getBuses();
  }, [getBuses]);

  return (
    <>
      <Helmet>
        <title>Buses</title>
      </Helmet>
      <div className="p-4">
        <div className="flex justify-between w-360 items-center mb-6">
          <PageTitle title="Buses" />
          <button
            type="button"
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors duration-300 flex items-center gap-2"
            onClick={() => setShowBusForm(true)}
          >
            <i className="ri-add-line"></i>
            Add Bus
          </button>
        </div>

        <div className="bg-white rounded-lg shadow">
          <Table
            columns={columns}
            dataSource={buses}
            rowKey="_id"
            loading={loading}
            pagination={{
              pageSize: 6,
              showSizeChanger: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
            }}
            className="custom-table"
            scroll={{ x: true }}
          />
        </div>

        {showBusForm && (
          <BusForm
            showBusForm={showBusForm}
            setShowBusForm={setShowBusForm}
            type={selectedBus ? "edit" : "add"}
            selectedBus={selectedBus}
            setSelectedBus={setSelectedBus}
            getData={getBuses}
          />
        )}
      </div>
    </>
  );
}

export default AdminBuses;
