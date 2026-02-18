import { AppError } from "../error/appError.error.js";

const errorHandler = (err, req, res, next) => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            status: "error",
            message: err.message,
            stack: process.env.NODE_ENV === "development" ? err.stack : undefined
        });
    }
    
    console.error("UNEXPECTED ERROR:", err);

    return res.status(500).json({
        status: "error",
        message: "Something went wrong",
    });
};

export default errorHandler;
