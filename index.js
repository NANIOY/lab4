const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const app = express();
const port = 3000;

// enable cors
const cors = require("cors");
app.use(cors());

// connect to mongodb
mongoose.connect(process.env.MONGODB);

// console log .env MONGODB
console.log(process.env.MONGODB);

// check if connection works
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

// import routes
const messagesRouter = require("./routes/api/v1/messages");
app.use(express.json());

// use routes
app.use("/api/v1/messages", messagesRouter);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
