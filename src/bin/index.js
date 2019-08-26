"use strict";
import express from "express";
import { urlencoded, json } from "body-parser";
import { connect } from "mongoose";
import morgan from "morgan";

import auth from "./middleware/auth";

import constants from "./../config/constants";

global.constants = constants;
const { mongoDB: mongoUrlConnection } = constants;

const app = express();
const port = process.env.PORT || 3000;

// mongoDB connection
connect(
  mongoUrlConnection,
  { useNewUrlParser: true }
);

// request and response middleware
app.use(urlencoded({ extended: false }));
app.use(json());

// debug request morgan middleware
app.use(morgan("dev"));

// CORS middleware
app.all("/*", function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

// Authorization middleware
app.use(auth);

// apply routes
require("../routes").default(app);

// server
app.listen(port, () => console.log(`Server listening on port ${port}`));
