import { mapToHttpError } from "../error/httpErrorMapper.error.js";

const errorHandler = (err, req, res, next) => {

  const httpError = mapToHttpError(err);

  return res.status(httpError.statusCode).json({
    status: "error",
    message: httpError.message,
    ...(process.env.NODE_ENV === "development" && {
      originalError: err.message,
      stack: err.stack,
      path: req.originalUrl,
      method: req.method,
    }),
  });
};

export default errorHandler;