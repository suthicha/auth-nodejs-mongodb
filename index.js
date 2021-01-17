const express = require("express");
const app = express();
const dotenv = require("dotenv");

dotenv.config();
const mongoose = require("mongoose");

// Connect to DB
mongoose.connect(
  process.env.DB_CONNECT,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log("connect to db!")
);

// Import routes
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");

// Middleware
app.use(express.json());
// Route Middleware
app.use("/api/user", authRoute);
app.use("/api/posts", postRoute);

app.listen(3000, () => console.log("Server listening on 3000"));
