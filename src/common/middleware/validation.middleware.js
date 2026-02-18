import { ZodError } from "zod";
import { BadRequestError } from "../error/httpError.error.js";

const validateRequest = (schema) => { return (req, res, next) => {
  try {
    // Parse and validate request body
    const validated = schema.parse(req.body);
    req.body = validated;

    next();
  } catch (err) {
    if (err instanceof ZodError) {
      console.log(err);

      const flattened = err.flatten();
      const messages = [
        ...flattened.formErrors,
        ...Object.values(flattened.fieldErrors).flat(),
      ].join(", ");

      return next(new BadRequestError(messages));
    }
      next(err);
    }
  };
};

export default validateRequest;