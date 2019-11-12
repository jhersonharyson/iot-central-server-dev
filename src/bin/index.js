"use strict";
import "core-js/stable";
import "regenerator-runtime/runtime";
import express from "express";
import { urlencoded, json } from "body-parser";
import { connect } from "mongoose";
import morgan from "morgan";
import cors from "cors";

import auth from "./middleware/auth";
import socket from "./middleware/socket";
//import cors from "./middleware/cors";

import constants from "./../config/constants";
import scheduler from "../scheduler";

global.constants = constants;
const { mongoDB: mongoUrlConnection } = constants;

const app = express();
const http = require("http").Server(app);
const port = process.env.PORT || 3001;
const io = require("socket.io")(http);

// mongoDB connection
connect(mongoUrlConnection, { useNewUrlParser: true, useCreateIndex: true });

//socket.io
app.use(socket(io));

// request and response middleware
app.use(urlencoded({ extended: false }));
app.use(json());

// debug request morgan middleware
app.use(morgan("dev"));

// CORS middleware
// cors(app);
app.use(cors());

// Authorization middleware
app.use(auth);

// apply routes
require("../routes").default(app);
//scheduler();

// server
http.listen(port, () => console.log(`Server listening on port ${port}`));
