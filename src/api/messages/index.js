import express from "express";
import MessageModel from "./model.js";
import ChatModel from "../chats/model.js";
import createHttpError from "http-errors";

const messagesRouter = express.Router();

messagesRouter.post("/", async (req, res, next) => {
  try {
    const newMessage = new MessageModel(req.body);
    const savedMessage = await newMessage.save();
    console.log(savedMessage);
    const updatedChat = await ChatModel.findByIdAndUpdate(
      req.body.chat,
      { $push: { messages: savedMessage } },
      { new: true, runValidators: true }
    );
    if (updatedChat) {
      res.send(updatedChat);
    } else {
      next(createHttpError(404, `Chat with id ${req.body.chat} was not found`));
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

messagesRouter.delete("/:chatId/:messageId", async (req, res, next) => {
  try {
    const updatedChat = await ChatModel.findByIdAndUpdate(
      req.params.chatId,
      { $pull: { messages: { _id: req.params.messageId } } },
      { new: true, runValidators: true }
    );
    if (updatedChat) {
      res.send(updatedChat);
    } else {
      next(
        createHttpError(404, `Chat with id ${req.params.chatId} was not found`)
      );
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

export default messagesRouter;
