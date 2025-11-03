// const express = require('express');
// const app = express();
// require('dotenv').config();

// const PORT = process.env.PORT ||3000;
// console.log(process.env);
// console.log(process.env.NODE_ENV);
// const studentRoutes = require('./routes');
// app.use(express.json());
// app.use('/', studentRoutes);

// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// server.ts

import express from "express";
//import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import router from "./routes";


dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use("/", router);
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
