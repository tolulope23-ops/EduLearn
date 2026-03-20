import { sendMessageToAI } from "./aiService.js";
import { BadRequestError } from "../../common/error/httpError.error.js";

export const AIController = {
  async chat(req, res, next) {

    try {
      const { question } = req.body;

      if (!question) {
        throw new BadRequestError("Question is required");
      };

      const reply = await sendMessageToAI(question);

      return res.status(200).json({
        status: "success",
        answer: reply.answer,
      });
    } catch (err) {
      next(err);
    }
  }
};