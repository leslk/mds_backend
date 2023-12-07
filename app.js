const express = require('express');
require("dotenv").config({path : "./config/.env"});
const path = require("path");

const protagonistRoutes = require("./routes/protagonist");
const universeRoutes = require("./routes/universe");
const messageRoutes = require("./routes/message");
const userRoutes = require("./routes/user");
const talkRoutes = require("./routes/talk");


const app = express();
app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api/universes", universeRoutes);
app.use("/api/universes", protagonistRoutes);
app.use("/api/users", userRoutes);
app.use("/api/talks", messageRoutes);
app.use("/api/talks", talkRoutes);

module.exports = app;


