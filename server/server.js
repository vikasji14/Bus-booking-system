const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const port = process.env.PORT || 5000;
const dbConfig = require("./config/dbConfig");
const bodyParser = require("body-parser");

app.use(
  cors({
    origin: ["http://localhost:3000", "https://bus-booking-system-1bk7.vercel.app"], // ✅ Allow frontend origins
    credentials: true, // ✅ Allow cookies/tokens
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

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
