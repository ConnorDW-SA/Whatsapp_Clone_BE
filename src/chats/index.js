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
      const { users, name, avatar, messages } = req.body;
      const userCombination = [req.user._id, ...users];
      const existingChat = await ChatsModel.findOne({
        users: { $all: userCombination },
      });

      let chatAvatar = avatar; // default to provided avatar
      if (users.length === 1) {
        // for one-to-one chat, we use the avatars of the users in FE
        chatAvatar = ""; // or some other placeholder value for FE to fill in
      } else if (!avatar) {
        // for group chat, we use a default URL if no avatar is provided
        chatAvatar =
          "https://icon-library.com/images/group-chat-icon/group-chat-icon-16.jpg";
      }

      if (!existingChat) {
        const newChat = new ChatsModel({
          users: [...userCombination],
          name,
          avatar: chatAvatar,
          messages,
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
