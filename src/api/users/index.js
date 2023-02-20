import express from "express";
import UserModel from "../users/model.js";
import createHttpError from "http-errors";
import { JWTAuthMiddleware } from "../lib/auth/jwtAuth.js";
import { createAccessToken } from "../lib/auth/tools.js";

const userRouter = express.Router();

userRouter.post("/", async (req, res, next) => {
  try {
    const users = new UserModel(req.body);
    const { _id } = await users.save();
    res.send({ _id });
  } catch (error) {
    next(error);
  }
});
userRouter.get("/", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const users = await UserModel.find();
    res.send(users);
  } catch (error) {
    next(error);
  }
});
userRouter.get("/:userId", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.params.userId);
    if (user) {
      res.send(user);
    } else {
      next(createHttpError(404, `user with id ${req.params.userId} not found`));
    }
  } catch (error) {
    next(error);
  }
});
userRouter.put("/:userId", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const updateUser = await UserModel.findByIdAndUpdate(
      req.params.userId,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (updateUser) {
      res.send(updateUser);
    } else {
      next(createHttpError(404, `user with id ${req.params.userId} not found`));
    }
  } catch (error) {
    next(error);
  }
});
userRouter.delete("/:userId", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const deleteUser = await UserModel.findByIdAndDelete(req.params.userId);
    if (deleteUser) {
      res.status().send();
    } else {
      console.log("no user with id find");
    }
  } catch (error) {
    next(createHttpError(404, `user with id ${req.params.userId} not found`));
  }
});

export default userRouter;
