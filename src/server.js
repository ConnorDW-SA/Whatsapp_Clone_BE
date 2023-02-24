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

import chatsRouter from "./api/chats/index.js";
import messagesRouter from "./api/messages/index.js";
import userRouter from "./api/users/index.js";
import { Server } from "socket.io";
import { createServer } from "http";
import { newConnectionHandler } from "./socket/index.js";

const server = express();
const port = process.env.PORT;

server.use(cors());
server.use(express.json());

//...................SOCKET IO..................
const httpServer = createServer(server);
const io = new Server(httpServer); // new Server() expects an HTTP server, not an express server. we create this above

io.on("connection", newConnectionHandler); // connection is a reserved keyword for socket

// ..................ENDPOINTS..................

server.use("/chats", chatsRouter);
server.use("/messages", messagesRouter);
server.use("/users", userRouter);

// ..................ERROR HANDLERS............

server.use(badRequestHandler); // 400
server.use(unauthorizedHandler); // 401
server.use(forbiddenErrorHandler); //403
server.use(notFoundHandler); // 404
server.use(genericErrorHandler); // 500

mongoose.connect(process.env.MONGODB_URL);

mongoose.connection.on("connected", () => {
  console.log("Connection established to Mongo");
  httpServer.listen(port, () => {
    // here we MUST listen with the http server!!!
    console.table(listEndpoints(server));
    console.log("Server listening on port " + port);
  });
});
