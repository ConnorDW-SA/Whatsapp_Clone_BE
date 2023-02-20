import mongoose from "mongoose";

const { Schema, model } = mongoose;

const chatSchema = new Schema({
  users: [{ type: Schema.Types.ObjectId, ref: "User" }],
  messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
  name: { type: String },
  avatar: { type: String },
});

export default model("Chat", chatSchema);
