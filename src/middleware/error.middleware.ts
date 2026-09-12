import { Request, Response, NextFunction } from "express";

// Bạn có thể mở rộng class Error này để chứa thêm statusCode
export class CustomError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    // Đảm bảo tên class được giữ đúng
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}

// Global Error Handler Middleware
export function errorHandler(
  err: Error | CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error("🔥 [Error Handler]:", err);

  const statusCode = err instanceof CustomError ? err.statusCode : 500;
  const message = err.message || "Đã có lỗi xảy ra trên server";

  res.status(statusCode).json({
    success: false,
    message: message,
    // Chỉ trả về stack trace khi đang ở môi trường development
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
}
