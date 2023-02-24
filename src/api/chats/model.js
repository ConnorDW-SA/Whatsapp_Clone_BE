import mongoose from "mongoose";
import { MessageSchema } from "../messages/model.js";

const { Schema, model } = mongoose;

const chatSchema = new Schema(
  {
    users: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    messages: [MessageSchema],
    name: { type: String },
    avatar: {
      type: String,
    },
  },
  { timestamps: true }
);

export default model("Chat", chatSchema);
