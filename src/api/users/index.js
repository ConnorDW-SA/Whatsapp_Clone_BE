import express from "express";
import createError from "http-errors";
import UserModel from "./model.js";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import q2m from "query-to-mongo";
import { JWTAuthMiddleware } from "../../auth/index.js";
import passport from "passport";
import { createAccessToken } from "../../auth/tools.js";

const cloudinaryUpload = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "database",
      format: "png"
    }
  })
}).single("avatar");

const usersRouter = express.Router();

usersRouter.get("/", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const query = q2m(req.query);
    const total = await UserModel.countDocuments(query.criteria);
    const users = await UserModel.find(query.criteria, query.options.fields)
      .skip(query.options.skip)
      .limit(query.options.limit)
      .sort(query.options.sort);
    res.send({ links: query.links("/users", total), total, users });
  } catch (error) {
    next(error);
  }
});

usersRouter.post("/register", async (req, res, next) => {
  try {
    const { username, password, email } = req.body;
    const newUser = new UserModel({ username, password, email });
    const { _id } = await newUser.save();
    res.status(201).send({ _id });
  } catch (error) {
    next(error);
  }
});

usersRouter.get("/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user._id);
    if (user) {
      res.send(user);
    } else {
      next(createError(404, `User with id ${req.user._id} not found!`));
    }
  } catch (error) {
    next(error);
  }
});
