const express = require('express');
require("dotenv").config({path : "./config/.env"});
const sql = require("mysql2/promise");


const characterRoutes = require("./routes/character");
const universeRoutes = require("./routes/universe");
const messageRoutes = require("./routes/message");
const userRoutes = require("./routes/user");
const talkRoutes = require("./routes/talk");


const app = express();
app.use(express.json());

// const helloWord = (req, res) => {
//     let string = req.body.message.split('').reverse().join('')
//     console.log(req.body.message);
//     res.json({headers: req.headers, type: req.method, url: req.url, message: string});
// }

// app.use((req, res) => {
//     helloWord(req, res);
// });

app.use("/api/universes", universeRoutes);
app.use("/api/universes", characterRoutes);
app.use("/api/users", userRoutes);
app.use("/api/talks", messageRoutes);
app.use("/api/talks", talkRoutes);

module.exports = app;


