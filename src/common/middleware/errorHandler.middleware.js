import { mapToHttpError } from "../error/httpErrorMapper.error.js";

const isDevelopment = process.env.NODE_ENV === "development";

const errorHandler = (err, req, res, next) => {
  const httpError = mapToHttpError(err);

  const response = {
    status: "error",
    message: httpError.message,
  };

  // Only add detailed info in development
  if (isDevelopment) {
    response.originalError = err.message;
    response.stack = err.stack;
    response.path = req.originalUrl;
    response.method = req.method;
  }

  return res.status(httpError.statusCode).json(response);
};

export default errorHandler;