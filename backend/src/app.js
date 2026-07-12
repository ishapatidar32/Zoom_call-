
import express from "express";
import { createServer } from "node:http";

import { Server } from "socket.io";

import mongoose from "mongoose";
import { connectToSocket } from "./controllers/socketManager.js";

import cors from "cors";
import  helmet from "helmet";
import rateLimit from "express-rate-limit";
import userRoutes from "./routes/users.routes.js";
const app = express();
const server = createServer(app);
const io = connectToSocket(server);
app.use(helmet());



const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many attempts, try again later."
});

app.set("port", (process.env.PORT || 8000))
app.use(cors());
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/users/login", authLimiter);
app.use("/api/v1/users/register", authLimiter);

const start = async () => {
     app.set("mongo_user")
    const connectionDb = await mongoose.connect("mongodb+srv://ishapatidar61_db_user:jJoF3tVMnVpzd4un@cluster0.trrocqk.mongodb.net/?appName=Cluster0");
    console.log(`MONGO Connected DB HOst: ${connectionDb.connection.host}`)
    server.listen(app.get("port"), () => {
        console.log("LISTENIN ON PORT 8000")
    });

}

start();