import { AppError } from "../error/appError.error";

export default errorHandler = (err, req, res, next) => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            status: "error",
            message: err.message,
            stack: err.stack
        });
    }

    console.error("UNEXPECTED ERROR:", err);

    return res.status(500).json({
        status: "error",
        message: "Something went wrong",
    });
};