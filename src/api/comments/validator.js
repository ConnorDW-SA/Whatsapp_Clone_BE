import { checkSchema, validationResult } from "express-validator";
import createError from "http-errors";

const messageSchema = {
  text: {
    in: ["body"],
    isString: {
      errorMessage: "text must be a string"
    }
  }
};

export const validateMessage = checkSchema(messageSchema);

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      createError(400, "Validation Error", { errorList: errors.array() })
    );
  }
  next();
};
