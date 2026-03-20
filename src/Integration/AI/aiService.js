import axios from "axios";
import { AI_BASE_URL } from "../../common/config/env.config.js";
import { BadRequestError } from "../../common/error/httpError.error.js";

export async function sendMessageToAI(question, userId) {

  try {
    const response = await axios.post(`${AI_BASE_URL}/ask`,
      {
        question
      },
      {
        timeout: 17000,
      }
    );
    
    return {
      answer: response.data.answer,
    };
  } catch (error) {
    console.error("Error sending message to AI:", error.message);
    throw new BadRequestError('AI service not available')
  }
};