import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const ACCESS_SECRET = process.env.JWT_SECRET || "default_access_secret";

// Mở rộng kiểu Request của Express để chứa thông tin user sau khi decode
export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

export function authenticateToken(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"];
  
  // Header gửi lên dạng: "Bearer <token>"
  const token = authHeader && authHeader.startsWith("Bearer ") 
    ? authHeader.split(" ")[1] 
    : null;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Yêu cầu đăng nhập (Không tìm thấy Access Token)",
    });
  }

  try {
    const decoded = jwt.verify(token, ACCESS_SECRET) as JwtPayload & {
      userId: string;
      role: string;
    };

    // Gắn thông tin đã giải mã vào req để các controller phía sau sử dụng
    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch (error: unknown) {
    // Phân biệt lỗi hết hạn và lỗi token sai định dạng
    let isExpired = false;
    
    if (error instanceof jwt.TokenExpiredError) {
      isExpired = true;
    } else if (error instanceof Error && error.name === "TokenExpiredError") {
       isExpired = true;
    }

    return res.status(403).json({
      success: false,
      message: isExpired
        ? "Access Token đã hết hạn, vui lòng refresh token"
        : "Access Token không hợp lệ",
    });
  }
}