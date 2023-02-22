import mongoose from "mongoose";

const { Schema, model } = mongoose;

const chatSchema = new Schema(
  {
    users: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    messages: [],
    name: { type: String },
    avatar: {
      type: String,
    },
  },
  { timestamps: true }
);

export default model("Chat", chatSchema);
