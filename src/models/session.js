import mongoose from "mongoose";

const session = new mongoose.Schema({
    user_id: String,
    exp: String,
})

export const Session = mongoose.model("Session", session);
