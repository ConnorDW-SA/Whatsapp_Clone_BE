import express from "express";
import { checksChatsSchema, triggerBadRequest } from "./validator.js";
import ChatsModel from "./model.js";
import createHttpError from "http-errors";

const chatsRouter = express.Router();

chatsRouter.post(
  "/",
  checksChatsSchema,
  triggerBadRequest,
  async (req, res, next) => {
    try {
      const { users, name } = req.body;
      const userCombination = [req.user._id, ...users];
      const existingChat = ChatsModel.find({
        users: { $all: userCombination },
      });
      if (!existingChat) {
        const newChat = new ChatsModel({
          ...req.body,
          users: userCombination,
          name,
        });
        const { _id } = await newChat.save();
        res.status(201).send(`Chat with id ${_id} was created successfully`);
      } else {
        res.status(200).send(existingChat);
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

chatsRouter.get("/", async (req, res, next) => {
  try {
    const myChats = await ChatsModel.find({ users: { $all: req.user._id } });
    res.send(myChats);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

chatsRouter.get("/:chatId", async (req, res, next) => {
  try {
    const chat = await ChatsModel.findById(req.params.chatId);
    if (chat) {
      res.send(chat);
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

chatsRouter.put(
  "/:chatId",
  checksChatsSchema,
  triggerBadRequest,
  async (req, res, next) => {
    try {
      const updatedChat = await ChatsModel.findByIdAndUpdate(
        req.params.chatId,
        ...req.body,
        { new: true, runValidators: true }
      );
      if (updatedChat) {
        res.send(updatedChat);
      } else {
        next(
          createHttpError(
            404,
            `Chat with id ${req.params.chatId} was not found`
          )
        );
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

chatsRouter.delete("/:chatId", async (req, res, next) => {
  try {
    const deletedChat = await ChatsModel.findByIdAndDelete(req.params.chatId);
    if (deletedChat) {
      res.status(204).send();
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

export default chatsRouter;
