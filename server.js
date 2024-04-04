import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoute from "./routes/user.route.js";
import gigRoute from "./routes/gig.route.js";
import newuser from "./routes/newuser.route.js";
import authRoute from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import reqtutorrouter from "./routes/reqtutor.route.js";
import path from "path";
import fs from 'fs';
import https from 'https';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();
const clientApp = express();
const app = express();
const connect = async () => {
  try {
    await mongoose.connect('mongodb://0.0.0.0:27017/newtesting'); // attech cloud link here
    console.log("Connected to MongoDB!");
  } catch (error) {
    console.log(error);
  }
};

clientApp.use(express.static(path.join('build')));
clientApp.get('/*',(req,res)=>{
  res.sendFile(path.join(__dirname + '/build/index.html'));
})

app.use(cors({ origin: ["http://localhost:5173","http://localhost","http://91.108.104.25","http://grittytechtutor.com","https://grittytechtutor.com"], credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/gigs", gigRoute);
app.use("/api/reqtutors", reqtutorrouter);
app.use("/api/newuser", newuser);

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  return res.status(errorStatus).send(errorMessage);
});

const PORT = process.env.PORT || 8800;
const CLIENT_PORT = process.env.client_port || 80;

app.listen(PORT, '0.0.0.0', () => {
  connect();
  console.log(`Backend server is running on port ${PORT}!`);
});

// clientApp.listen(CLIENT_PORT,()=>{
//   console.log('Client app served on http://localhost');
// });
var privateKey = fs.readFileSync( './privkey.pem' );
var certificate = fs.readFileSync( './fullchain.pem' );

https.createServer({
    key: privateKey,
    cert: certificate
}, clientApp).listen(CLIENT_PORT,() => {
  console.log('frontend serving at - https://localhost:'+CLIENT_PORT);
});