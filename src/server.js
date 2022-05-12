import mongoose from "mongoose";
import {config} from "dotenv";
import cors from "cors";
import express from "express";
import { jwtVerify } from "./authentication/jwtVerify.js";
import { userRouter } from "./routes/user.js";

config();

const app = express();
app.use(cors());

const uri = process.env.MONGODB_URI;

const PORT = process.env.PORT || 3001;

mongoose.connect(uri, () => {
    app.use(express.json());

    app.use(jwtVerify);

    app.use("/users", userRouter);

    app.listen(PORT, () => {
        console.log("Connected");
    })
});