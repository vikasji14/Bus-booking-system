const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const port = process.env.PORT || 5000;
const dbConfig = require("./config/dbConfig");
const bodyParser = require("body-parser");



app.use(cors({
  origin: 'https://bus-booking-system-1bk7.vercel.app', // Your frontend URL
  methods: 'GET,POST,PUT,DELETE,OPTIONS',
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Enable if you're using cookies or authentication
}));

app.options("*", cors());

app.use(express.json());
app.use(bodyParser.json());



app.get("/", (req, res) => {
  res.send("Server is running...");
});
app.use("/api/users", require("./routes/usersRoutes"));
app.use("/api/buses", require("./routes/busesRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/bookings", require("./routes/bookingsRoutes"));
app.use("/api/cities", require("./routes/citiesRoutes"));

// listen to port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
