const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const path = require('path');
const app = express();
const port = 3000;

// enable cors
const cors = require("cors");
app.use(cors());

mongoose.connect(process.env.MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// console log .env MONGODB
console.log(process.env.MONGODB);

// check if connection works
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

// configure Pug
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views")); // create "views" directory

// import routes
const messagesRouter = require("./routes/api/v1/messages");
app.use(express.json());

// use routes
app.use("/api/v1/messages", messagesRouter);

// define route to render Pug template
app.get('/', async (req, res) => {
    try {
        const response = await fetch('https://nodejs-messages.onrender.com/api/v1/messages');
        const data = await response.json();
        const messages = data[0].messages;
        res.render('index', { messages });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});