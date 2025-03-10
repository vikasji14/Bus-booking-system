const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    bus: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "buses",
      require: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      require: true,
    },
    seats: [
      {
        date: {
          type: String, // Store date in "YYYY-MM-DD" format
          required: true,
        },
        seatNumbers: {
          type: [Number], // Store seat numbers as an array
          required: true,
        },
      },
    ],
    transactionId: {
      type: String,
      require: true,
    },
    mobile: {
      type: String,
      required: [true, 'Mobile number is required'],
      validate: {
        validator: function(v) {
          return /^[6-9]\d{9}$/.test(v);
        },
        message: props => `${props.value} is not a valid Indian mobile number!`
      }
    },
    address: {
      type: String,
      trim: true,
      maxlength: [200, 'Address cannot be more than 200 characters']
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("bookings", bookingSchema);
