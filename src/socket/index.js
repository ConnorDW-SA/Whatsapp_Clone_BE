let onlineUsers = [];

export const newConnectionHandler = (newClient) => {
  console.log("NEW CONNECTION: ", newClient.id);
  // 1. We emit a welcome event to the client to make sure connection is on
  newClient.emit("welcome", {
    message: `Welcome to Whatsapp, ${newClient.id}`,
  });
  // 2. Listen for an event setUsername so that we know when a user connects
  newClient.on("setUsername", (payload) => {
    console.log(payload);
    onlineUsers.push({ username: payload.username, socketId: newClient.id });
    // 2.1. Emit a message that a new user has logged in (both for all Users, and for onlineUser)
    newClient.emit("loggedIn", onlineUsers);
    newClient.broadcast.emit("updateOnlineUsersList", onlineUsers); //emit to everybody but the current user
  });
  // 3. Listen to sendMessage event so that we handle the new message that is sent by the client
  newClient.on("sendMessage", (message) => {
    console.log("NEW MESSAGE: ", message);
    newClient.broadcast.emit("newMessage", message);
  });
  // 4. Listen to an event called disconnect (this is a reserved keyword)
  //   newClient.on("disconnect", (onlineUsers) => {
  //     // 4.1 Update the list of online users (from the array)
  //     onlineUsers =
  //       onlineUsers.length !== 0 &&
  //       onlineUsers.filter((user) => user.socketId !== newClient.id);
  //     //4.2 Broadcast the updated list to other online users
  //     newClient.broadcast.emit("updateOnlineUsersList", onlineUsers);
  //   });
};
