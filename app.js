const express = require('express');
require("dotenv").config({path : "./config/.env"});

const protagonistRoutes = require("./routes/protagonist");
const universeRoutes = require("./routes/universe");
const messageRoutes = require("./routes/message");
const userRoutes = require("./routes/user");
const talkRoutes = require("./routes/talk");


const app = express();
app.use(express.json());

app.use("/api/universes", universeRoutes);
app.use("/api/universes", protagonistRoutes);
app.use("/api/users", userRoutes);
app.use("/api/talks", messageRoutes);
app.use("/api/talks", talkRoutes);

module.exports = app;


