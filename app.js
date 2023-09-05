require("dotenv").config();
const express = require("express");
const app = express();
const fileupload = require("express-fileupload");
const connectDB = require("./db/db");
const notesRoute = require("./Routes/notes");
const multer = require("multer");
const bodyParser = require("body-parser");
var cors = require("cors");
const authRoute = require("./Routes/auth");

app.use(cors());
app.use(fileupload({ useTempFiles: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("./public"));
app.use("/api/v1/", notesRoute);
app.use("/api/v1/auth/", authRoute);
const start = () => {
  try {
    connectDB(process.env.MONGO_URI);
    console.log("Connected..");
  } catch (error) {
    console.log(error);
  }
};

app.listen(8000, () => {
  start();
});
