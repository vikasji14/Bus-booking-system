const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const port = process.env.PORT || 5000;
const dbConfig = require("./config/dbConfig");
const bodyParser = require("body-parser");


// ✅ Enable CORS
app.use(cors({
  origin: "*",  // Allow all origins (Use specific origin in production)
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed methods
  allowedHeaders: ["Content-Type", "Authorization"] // Allowed headers
}));

// ✅ Handle Preflight (OPTIONS) Requests
app.options("*", cors());


app.use(express.json());
app.use(bodyParser.json());



app.use("/api/users", require("./routes/usersRoutes"));
app.use("/api/buses", require("./routes/busesRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/bookings", require("./routes/bookingsRoutes"));
app.use("/api/cities", require("./routes/citiesRoutes"));

// listen to port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
