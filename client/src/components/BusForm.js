import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Modal, Row, Form, Col, message, Input, Button, DatePicker, Select, InputNumber, Space } from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { axiosInstance } from "../helpers/axiosInstance";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";

function BusForm({
  showBusForm,
  setShowBusForm,
  type = "add",
  getData,
  selectedBus,
  setSelectedBus,
}) {
  const dispatch = useDispatch();
  const [cities, setCities] = useState([]);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      dispatch(ShowLoading());
      let response = null;
      if (type === "add") {
        response = await axiosInstance.post(`${process.env.REACT_APP_SERVER_URL}/api/buses/add-bus`, values, { withCredentials: true });
      } else {
        response = await axiosInstance.put(
          `${process.env.REACT_APP_SERVER_URL}/api/buses/${selectedBus._id}`,
          values
        );
      }
      if (response.data.success) {
        message.success(response.data.message);
      } else {
        message.error(response.data.message);
      }
      getData();
      setShowBusForm(false);
      setSelectedBus(null);
      dispatch(HideLoading());
    } catch (error) {
      message.error(error.message);
      dispatch(HideLoading());
    }
  };

  useEffect(() => {
    axiosInstance.get(`${process.env.REACT_APP_SERVER_URL}/api/cities/get-all-cities`).then((response) => {
      setCities(response.data.data);
    });
  }, []);

  const OfferInput = ({ name, remove }) => (
    <Space key={name} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
      <Form.Item
        name={[name, 'text']}
        rules={[{ required: true, message: 'Please enter an offer' }]}
      >
        <Input placeholder="Enter offer (e.g., Get ₹200 off instantly)" />
      </Form.Item>
      <Form.Item
        name={[name, 'link']}
        rules={[
          {
            type: 'url',
            message: 'Please enter a valid URL',
          },
        ]}
      >
        <Input placeholder="Offer link (optional)" />
      </Form.Item>
      <MinusCircleOutlined onClick={() => remove(name)} />
    </Space>
  );

  return (
    <Modal
      width={800}
      className="bus-form-modal"
      title={
        <div className="text-xl font-semibold text-gray-800 pb-4 border-b">
          {type === "add" ? "Add New Bus" : "Update Bus Details"}
        </div>
      }
      visible={showBusForm}
      onCancel={() => {
        setSelectedBus(null);
        setShowBusForm(false);
      }}
      footer={false}
    >
      <Form 
        form={form}
        layout="vertical" 
        onFinish={onFinish} 
        initialValues={selectedBus || { offers: [] }}
        className="pt-4"
      >
        <Row gutter={[24, 0]}>
          <Col lg={24} xs={24}>
            <Form.Item
              label={<span className="text-gray-700 font-medium">Bus Name</span>}
              name="name"
              rules={[{ required: true, message: "Please enter bus name" }]}
            >
              <input
                type="text"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                placeholder="Enter bus name"
              />
            </Form.Item>
          </Col>

          <Col lg={12} xs={24}>
            <Form.Item
              label={<span className="text-gray-700 font-medium">Bus Number</span>}
              name="busNumber"
              rules={[{ required: true, message: "Please input bus number!" }]}
            >
              <input
                type="text"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                placeholder="Enter bus number"
              />
            </Form.Item>
          </Col>

          <Col lg={12} xs={24}>
            <Form.Item
              label={<span className="text-gray-700 font-medium">Capacity</span>}
              name="capacity"
              rules={[{ required: true, message: "Please input bus capacity!" }]}
            >
              <input
                type="number"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                placeholder="Enter capacity"
              />
            </Form.Item>
          </Col>

          <Col lg={12} xs={24}>
            <Form.Item
              label={<span className="text-gray-700 font-medium">From</span>}
              name="from"
              rules={[{ required: true, message: "Please select departure city" }]}
            >
              <select className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all appearance-none bg-white">
                <option value="">Select departure city</option>
                {cities.map((data, index) => (
                  <option key={index} value={data.ville}>
                    {data.ville}
                  </option>
                ))}
              </select>
            </Form.Item>
          </Col>

          <Col lg={12} xs={24}>
            <Form.Item
              label={<span className="text-gray-700 font-medium">To</span>}
              name="to"
              rules={[{ required: true, message: "Please select destination city" }]}
            >
              <select className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all appearance-none bg-white">
                <option value="">Select destination city</option>
                {cities.map((data, index) => (
                  <option key={index} value={data.ville}>
                    {data.ville}
                  </option>
                ))}
              </select>
            </Form.Item>
          </Col>

          <Col lg={8} xs={24}>
            <Form.Item
              label={<span className="text-gray-700 font-medium">Journey Date</span>}
              name="journeyDate"
              rules={[{ required: true, message: "Please select journey date!" }]}
            >
              <input
                min={new Date().toISOString().split("T")[0]}
                type="date"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
              />
            </Form.Item>
          </Col>

          <Col lg={8} xs={24}>
            <Form.Item
              label={<span className="text-gray-700 font-medium">Departure Time</span>}
              name="departure"
              rules={[{ required: true, message: "Please select departure time!" }]}
            >
              <input
                type="time"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
              />
            </Form.Item>
          </Col>

          <Col lg={8} xs={24}>
            <Form.Item
              label={<span className="text-gray-700 font-medium">Arrival Time</span>}
              name="arrival"
              rules={[{ required: true, message: "Please select arrival time!" }]}
            >
              <input
                type="time"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
              />
            </Form.Item>
          </Col>

          <Col lg={12} xs={24}>
            <Form.Item
              label={<span className="text-gray-700 font-medium">Price</span>}
              name="price"
              rules={[{ required: true, message: "Please input price!" }]}
            >
              <input
                type="number"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                placeholder="Enter price"
              />
            </Form.Item>
          </Col>

          <Col lg={12} xs={24}>
            <Form.Item
              label={<span className="text-gray-700 font-medium">Discount Percentage</span>}
              name="discountPercentage"
             
            >
              <input
                type="number"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                placeholder="Enter discount percentage (0-100)"
              />
            </Form.Item>
          </Col>

          <Col lg={12} xs={24}>
            <Form.Item
              label={<span className="text-gray-700 font-medium">Status</span>}
              name="status"
              rules={[{ required: true, message: "Please select status!" }]}
            >
              <select className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all appearance-none bg-white">
                <option value="">Select status</option>
                <option value="Yet To Start">Yet To Start</option>
                <option value="running">Running</option>
                <option value="Completed">Completed</option>
              </select>
            </Form.Item>
          </Col>

          <Col lg={24} xs={24}>
            <Form.Item label={<span className="text-gray-700 font-medium">Offers</span>}>
              <Form.List name="offers">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map((field) => (
                      <OfferInput key={field.key} {...field} remove={remove} />
                    ))}
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                      className="mt-2"
                    >
                      Add Offer
                    </Button>
                  </>
                )}
              </Form.List>
            </Form.Item>
          </Col>
        </Row>

        <div className="flex gap-4 justify-end mt-6">
          <button
            type="button"
            className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all"
            onClick={() => {
              setSelectedBus(null);
              setShowBusForm(false);
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-all"
          >
            {type === "add" ? "Add Bus" : "Update Bus"}
          </button>
        </div>
      </Form>
    </Modal>
  );
}

export default BusForm;
