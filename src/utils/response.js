// src/utils/response.js
export function sendSuccess(res, statusCode, message, data = {}) {
    return res.status(statusCode).json({
      success: true,
      message,
      ...data,
    });
  }
  
  export function sendError(res, statusCode, errorMessage) {
    return res.status(statusCode).json({
      success: false,
      error: errorMessage,
    });
  }
  