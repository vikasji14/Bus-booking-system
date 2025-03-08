const Bus = require("../models/busModel");

// Add a new bus
const AddBus = async (req, res) => {
  try {
    const { offers } = req.body;
    const bus = new Bus({
      ...req.body,
      offers: offers || [],
    });
    if (req.body.discountPercentage && (req.body.discountPercentage < 0 || req.body.discountPercentage > 100)) {
      return res.status(400).send({ success: false, message: "Discount percentage must be between 0 and 100" });
    }
    const existingBus = await Bus.findOne({ busNumber: req.body.busNumber });
    existingBus
      ? res.send({ message: "Bus already exists", success: false, data: null })
      : await bus.save();

    res.status(200).send({
      message: "Bus created successfully",
      success: true,
      data: bus,
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

// get all buses and if the journeyDate is passed 1 hour ago , make the status of the bus to "Completed"
const GetAllBuses = async (req, res) => {
  try {
    const buses = await Bus.find();
    buses.forEach(async (bus) => {
      const journey = new Date(bus.journeyDate);

      const departure = new Date(
        `${journey.getFullYear()}-${
          journey.getMonth() + 1
        }-${journey.getDate()} ${bus.departure}`
      );

      if (departure.getTime() - new Date().getTime() < 3600000) {
        await Bus.findByIdAndUpdate(bus._id, { status: "Completed" });
      }
      // console.log("departure time is : ", departure);
    });

    const orderedBuses = buses.sort((a, b) => {
      if (a.status === "Completed" && b.status !== "Completed") {
        return 1;
      } else if (a.status !== "Completed" && b.status === "Completed") {
        return -1;
      } else {
        return new Date(a.journeyDate) - new Date(b.journeyDate);
      }
    });

    res.status(200).send({
      message: "Buses fetched successfully",
      success: true,
      data: orderedBuses,
    });
  } catch (error) {
    res.status(500).send({
      message: "No Buses Found",
      success: false,
      data: error,
    });
  }
};

// get all buses by from and to
const GetBusesByFromAndTo = async (req, res) => {
  try {
    const buses = await Bus.find({
      from: req.query.from,
      to: req.query.to,
      journeyDate: req.query.journeyDate,
    });

    buses.forEach(async (bus) => {
      const journey = new Date(bus.journeyDate);
      const departure = new Date(
        `${journey.getFullYear()}-${
          journey.getMonth() + 1
        }-${journey.getDate()} ${bus.departure}`
      );

      if (departure.getTime() - new Date().getTime() < 3600000) {
        await Bus.findByIdAndUpdate(bus._id, { status: "Completed" });
      }
    });

    const filteredBuses = buses.filter(
      (bus) => bus.status !== "Completed" && bus.status !== "Running"
    );
    res.status(200).send({
      message: "Buses fetched successfully",
      success: true,
      data: filteredBuses,
    });
  } catch (error) {
    res.status(500).send({
      message: "No Buses Found",
      success: false,
      data: error,
    });
  }
};

// update a bus
const UpdateBus = async (req, res) => {
  try {
    const { offers } = req.body;
    if (req.body.discountPercentage && (req.body.discountPercentage < 0 || req.body.discountPercentage > 100)) {
      return res.status(400).send({ success: false, message: "Discount percentage must be between 0 and 100" });
    }
    const bus = await Bus.findById(req.params.id);
    if (bus.status === "Completed") {
      res.status(400).send({
        message: "You can't update a completed bus",
        success: false,
      });
    } else {
      const updatedBus = await Bus.findByIdAndUpdate(
        req.params.id,
        {
          ...req.body,
          offers: offers || [],
        },
        { new: true }
      );
      res.status(200).send({
        success: true,
        message: "Bus updated successfully",
        data: updatedBus,
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Bus not found",
      success: false,
      data: error,
    });
  }
};

// delete a bus
const DeleteBus = async (req, res) => {
  try {
    await Bus.findByIdAndDelete(req.params.id);
    res.status(200).send({
      message: "Bus deleted successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

// get bus by id
const GetBusById = async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id);
    res.status(200).send({
      message: "Bus fetched successfully",
      success: true,
      data: bus,
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

// all bus list
const allBusList = async (req, res) => {
  try {
    const buses = await Bus.find();
    res.status(200).json({
      message: "Buses fetched successfully",
      success: true,
      data: buses,
    });
  } catch (error) {
    res.status(500).json({ success: false, message:"error" });
  }
};

module.exports = {
  AddBus,
  GetAllBuses,
  UpdateBus,
  DeleteBus,
  GetBusById,
  GetBusesByFromAndTo,
  allBusList,
};
