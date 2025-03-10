const mongoose = require("mongoose");

const busSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  busNumber: {
    type: Number,
    required: true,
  },
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  departure: {
    type: String,
    required: true,
  },
  arrival: {
    type: String,
    required: true,
  },
  
  capacity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  seatsBooked: {
    type: Array,
    default: [],
  },
  frequency: {
    type: [String],
    enum: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    default: []
  },
  discountPercentage: {
    type: Number,
    default: 0,
  },
  status: { 
    type: [String], 
    required: true, 
    enum: ["AC", "Non-AC"],
    default: ["Non-AC"]
  },
  offers: [
    {
      text: String,
      link: {
        type: String,
        validate: {
          validator: function(v) {
            return v === '' || /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/.test(v);
          },
          message: props => `${props.value} is not a valid URL!`
        }
      }
    }
  ],
});

module.exports = mongoose.model("buses", busSchema);
