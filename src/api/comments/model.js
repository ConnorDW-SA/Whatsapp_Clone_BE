import mongoose from "mongoose";

const Schema = mongoose.Schema;

const MessageSchema = new Schema(
  {
    text: {
      type: String,
      required: true
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    chat: {
      type: Schema.Types.ObjectId,
      ref: "Chat",
      required: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Message", MessageSchema);
