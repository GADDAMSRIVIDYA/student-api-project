"use strict";
// const express = require('express');
// const app = express();
// require('dotenv').config();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const PORT = process.env.PORT ||3000;
// console.log(process.env);
// console.log(process.env.NODE_ENV);
// const studentRoutes = require('./routes');
// app.use(express.json());
// app.use('/', studentRoutes);
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// server.ts
const express_1 = __importDefault(require("express"));
//import jwt from "jsonwebtoken";
const dotenv_1 = __importDefault(require("dotenv"));
const routes_1 = __importDefault(require("./routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use(express_1.default.json());
app.use("/", routes_1.default);
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
