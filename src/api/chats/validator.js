import { checkSchema, validationResult } from "express-validator";

const chatSchema = {
  users: {
    in: ["body"],
    isArray: {
      errorMessage:
        "Users is a mandatory field and must be an array of usersId",
    },
  },
  messages: {
    in: ["body"],
    isArray: {
      errorMessage:
        "Messages is a mandatory field and must be an array of messagesId",
    },
  },
};

export const checksChatsSchema = checkSchema(chatSchema);

export const triggerBadRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    next(
      createHttpError(400, "Errors during chat validation", {
        errorsList: errors.array(),
      })
    );
  } else {
    next();
  }
};
