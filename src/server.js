import express from "express";
import cors from "cors";
import listEndpoints from "express-list-endpoints";
import {
  genericErrorHandler,
  notFoundHandler,
  badRequestHandler,
  unauthorizedHandler,
  forbiddenErrorHandler,
} from "./errorHandlers.js";
import mongoose from "mongoose";
import chatsRouter from "./chats/index.js";

const server = express();
const port = process.env.PORT;

server.use(cors());
server.use(express.json());

// ..................ENDPOINTS..................

server.use("/chats", chatsRouter);

// ..................ERROR HANDLERS............

server.use(badRequestHandler); // 400
server.use(unauthorizedHandler); // 401
server.use(forbiddenErrorHandler); //403
server.use(notFoundHandler); // 404
server.use(genericErrorHandler); // 500

mongoose.connect(process.env.MONGODB_URL);

mongoose.connection.on("connected", () => {
  console.log("Connection established to Mongo");
  server.listen(port, () => {
    console.table(listEndpoints(server));
    console.log("Server listening on port " + port);
  });
});
