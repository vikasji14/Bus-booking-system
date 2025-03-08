const Booking = require("../models/bookingsModel");
const Bus = require("../models/busModel");
const User = require("../models/usersModel");
const stripe = require("stripe")(process.env.stripe_key);
const { v4: uuidv4 } = require("uuid");
const nodemailer = require("nodemailer");
require("dotenv").config();
const moment = require("moment");
const Razorpay = require('razorpay');

const instance = new Razorpay({
  key_id: 'rzp_test_sy54SSBzD8tp1c',
  key_secret: 'HexTP4IDqL28rOQDlSU5t5oB'
});

// nodemailer transporter
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

// book seat and send email to user with the booking details
const BookSeat = async (req, res) => {
  try {
    const newBooking = new Booking({
      ...req.body, // spread operator to get all the data from the request body
      user: req.user.toString(),
    });
    const user = await User.findById(req.user.toString());
    // res.json(user._id)
    // await newBooking.save();  
    const bus = await Bus.findById(req.bus.toString()); // get the bus from the request body
    bus.seatsBooked = [...bus.seatsBooked, ...req.seats]; // add the booked seats to the bus seatsBooked array in the database

    await bus.save();
    // send email to user with the booking details
    let mailOptions = {
      from: process.env.EMAIL,
      to: user.email,
      subject: "🚍 Your Bus Booking Confirmation",
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px; padding: 20px; background-color: #f9f9f9; animation: fadeIn 2s ease-in-out;">
        
        <h2 style="color: #2c3e50; text-align: center;">🚌 Booking Confirmation</h2>
        
        <p>Hello <strong>${user.name}</strong>,</p>
        <p>Your booking details are as follows:</p>
    
        <div style="background: #fff; padding: 15px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); animation: scaleUp 1.5s ease-in-out;">
          <p style="margin: 5px 0; font-weight: bold; text-align: center; font-size: 24px;">${bus.name}</p>
          <p><strong>📅 Journey Date:</strong> ${bus.journeyDate}</p>
          <p><strong>⏰ Departure Time:</strong> ${moment(bus.departure, "HH:mm:ss").format("hh:mm A")}</p>
          <p><strong>🏁 Arrival Time:</strong> ${moment(bus.arrival, "HH:mm:ss").format("hh:mm A")}</p>
          <p><strong>🎟️ Seat(s):</strong> ${req.seats.join(", ")}</p>
        </div>
    
        <p style="text-align: center; margin-top: 15px;">Thank you for choosing us! 😊</p>
        
        <div style="text-align: center;">
          <a href="https://yourbookinglink.com" style="display: inline-block; padding: 10px 20px; background-color: #28a745; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; animation: pulse 2s infinite;">
            View Booking Details
          </a>
        </div>
    
        <p style="text-align: center; margin-top: 20px;"><strong>Happy Journey! 🚀</strong></p>
    
        <style>
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes scaleUp {
            from { transform: scale(0.9); }
            to { transform: scale(1); }
          }
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }
        </style>
    
      </div>
      `,
    };
    
    
    transporter.sendMail(mailOptions, (err, data) => {
      if (err) {
        console.log("Error Occurs", err);
      } else {
        console.log("Email sent!!!");
      }
    });
  } catch (error) {
    console.log(error);
  }
};

const GetAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("bus").populate("user");
    res.status(200).send({
      message: "All bookings",
      data: bookings,
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: "Failed to get bookings",
      data: error,
      success: false,
    });
  }
};

const GetAllBookingsByUser = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.params.user_Id }).populate([
      "bus",
      "user",
    ]);
    res.status(200).send({
      message: "Bookings fetched successfully",
      data: bookings,
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: "Bookings fetch failed",
      data: error,
      success: false,
    });
  }
};

// cancel booking by id and remove the seats from the bus seatsBooked array
const CancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.booking_id);
    const user = await User.findById(req.params.user_id);
    const bus = await Bus.findById(req.params.bus_id);
    if (!booking || !user || !bus) {
      res.status(404).send({
        message: "Booking not found",
        data: error,
        success: false,
      });
    }

    booking.remove();
    bus.seatsBooked = bus.seatsBooked.filter(
      (seat) => !booking.seats.includes(seat)
    );
    await bus.save();
    res.status(200).send({
      message: "Booking cancelled successfully",
      data: booking,
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: "Booking cancellation failed",
      data: error,
      success: false,
    });
  }
};
const PayWithStripe = async (req, res) => {
  try {
    const { token, amount } = req.body;
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });
    const payment = await stripe.charges.create(
      {
        amount: amount * 100,
        currency: "MAD",
        customer: customer.id,
        receipt_email: token.email,
      },
      {
        idempotencyKey: uuidv4(),
      }
    );

    if (payment) {
      res.status(200).send({
        message: "Payment successful",
        data: {
          transactionId: payment.source.id,
        },
        success: true,
        amount: payment.amount,
      });
    } else {
      res.status(500).send({
        message: "Payment failed",
        data: error,
        success: false,
        amount: payment.amount,
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Payment failed",
      data: error,
      success: false,
    });
  }
};

const createOrder = async (req, res) => {
  try {
    const options = {
      amount: req.body.amount,
      currency: 'INR',
      receipt: 'receipt_' + Date.now()
    };
    const order = await instance.orders.create(options);
    res.status(200).send(order);
  } catch (error) {
    res.status(500).send(error);
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { paymentId, bookingDetails } = req.body;
    const payment = await instance.payments.fetch(paymentId);

    if (payment.status === 'captured') {
      const newBooking = new Booking(bookingDetails);
      await newBooking.save();

      BookSeat(newBooking);
      res.status(200).send({
        message: 'Booking successful',
        data: newBooking,
        success: true
      });
    } else {
      res.status(400).send({
        message: 'Payment failed',
        success: false
      });
    }
  } catch (error) {
    res.status(500).send({
      message: error.message,
      success: false
    });
  }
};

module.exports = {
  BookSeat,
  GetAllBookings,
  GetAllBookingsByUser,
  CancelBooking,
  PayWithStripe,
  createOrder,
  verifyPayment,
};
