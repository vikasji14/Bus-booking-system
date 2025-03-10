const Bus = require("../models/busModel");
const moment = require("moment");

// Add a new bus
// const AddBus = async (req, res) => {
//   try {
//     const { offers } = req.body;
//     const bus = new Bus({
//       ...req.body,
//       offers: offers || [],
//     });
//     if (req.body.discountPercentage && (req.body.discountPercentage < 0 || req.body.discountPercentage > 100)) {
//       return res.status(400).send({ success: false, message: "Discount percentage must be between 0 and 100" });
//     }
//     const existingBus = await Bus.findOne({ busNumber: req.body.busNumber });
//     existingBus
//       ? res.send({ message: "Bus already exists", success: false, data: null })
//       : await bus.save();

//     res.status(200).send({
//       message: "Bus created successfully",
//       success: true,
//       data: bus,
//     });
//   } catch (error) {
//     res.status(500).send({ success: false, message: error.message });
//   }
// };

const daysMap = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const AddBus = async (req, res) => {
  try {
    const { busNumber, discountPercentage, offers, frequency } = req.body;

    // Check if frequency contains only valid days
    if (frequency) {
      const isValidFrequency = frequency.every(day => daysMap.includes(day));
      if (!isValidFrequency) {
        return res.status(400).send({
          success: false,
          message: "Invalid frequency. Allowed values: Sun, Mon, Tue, Wed, Thu, Fri, Sat.",
        });
      }
    }

    // Validate discount percentage
    if (discountPercentage !== undefined && (discountPercentage < 0 || discountPercentage > 100)) {
      return res.status(400).send({
        success: false,
        message: "Discount percentage must be between 0 and 100.",
      });
    }

    // Check if a bus with the same busNumber already exists
    const existingBus = await Bus.findOne({ busNumber });
    if (existingBus) {
      return res.status(400).send({
        success: false,
        message: "Bus already exists.",
        data: null,
      });
    }

    // Create and save new bus entry
    const bus = new Bus({
      ...req.body,
      offers: offers || [],
    });

    await bus.save();

    res.status(201).send({
      success: true,
      message: "Bus added successfully.",
      data: bus,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Server error. Unable to add bus.",
      error: error.message,
    });
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

// // get all buses by from and to
// const GetBusesByFromAndTo = async (req, res) => {
//   try {
//     const buses = await Bus.find({
//       from: req.query.from,
//       to: req.query.to,
//       journeyDate: req.query.journeyDate,
//     });

//     buses.forEach(async (bus) => {
//       const journey = new Date(bus.journeyDate);
//       const departure = new Date(
//         `${journey.getFullYear()}-${
//           journey.getMonth() + 1
//         }-${journey.getDate()} ${bus.departure}`
//       );

//       if (departure.getTime() - new Date().getTime() < 3600000) {
//         await Bus.findByIdAndUpdate(bus._id, { status: "Completed" });
//       }
//     });

//     const filteredBuses = buses.filter(
//       (bus) => bus.status !== "Completed" && bus.status !== "Running"
//     );
//     res.status(200).send({
//       message: "Buses fetched successfully",
//       success: true,
//       data: filteredBuses,
//     });
//   } catch (error) {
//     res.status(500).send({
//       message: "No Buses Found",
//       success: false,
//       data: error,
//     });
//   }
// };


const GetBusesByFromAndTo = async (req, res) => {
  try {
    const { from, to, journeyDate } = req.query;

    // Validate query parameters
    if (!from || !to || !journeyDate) {
      return res.status(400).send({
        message: "Please provide 'from', 'to', and 'journeyDate'",
        success: false,
      });
    }

    const searchDate = new Date(journeyDate);
    const today = new Date();
    const twoMonthsLater = new Date();
    twoMonthsLater.setMonth(twoMonthsLater.getMonth() + 2);

    // Validate journey date (should be within the next 2 months)
    if (searchDate < today || searchDate > twoMonthsLater) {
      return res.status(400).send({
        message: "Journey date must be within the next 2 months.",
        success: false,
      });
    }

    const shortDay = daysMap[searchDate.getDay()]; // Convert date to weekday short form (e.g., Sun, Mon)

    // Fetch buses that run on the selected day's frequency
    let buses = await Bus.find({
      from,
      to,
      frequency: shortDay, // Only fetch buses running on this day
    });

    // Add journeyDate to each bus object
    buses = buses.map(bus => ({
      ...bus.toObject(), // Convert Mongoose object to plain JS object
      journeyDate,
    }));

    res.status(200).send({
      message: "Buses fetched successfully",
      success: true,
      data: buses,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Error fetching buses",
      success: false,
      error: error.message,
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
    const today = moment().format("ddd"); // Get today's day in short format (e.g., "Mon", "Tue")
    
    const buses = await Bus.find();
    
    // Filter buses that have today's day in their frequency array
    const filteredBuses = buses.filter(bus => bus.frequency.includes(today));
  
    res.status(200).json({
      message: "Buses fetched successfully",
      success: true,
      data: filteredBuses,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching buses" });
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
