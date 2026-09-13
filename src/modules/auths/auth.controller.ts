import { Request, Response } from "express";
import { z } from "zod";
import { registerService, loginService, refreshService, logoutService } from "./auth.service";

// --- ZOD SCHEMAS ---
const registerSchema = z.object({
  email: z.string().email("Email không đúng định dạng"),
  username: z.string().min(3, "Username phải có ít nhất 3 ký tự"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  fullName: z.string().optional(),
});

const loginSchema = z.object({
  identifier: z.string().min(1, "Vui lòng nhập tài khoản (email/username)"),
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
});

export async function registerController(req: Request, res: Response) {
  try {
    // 1. Validate toàn bộ body bằng Zod
    const { email, username, password, fullName } = registerSchema.parse(req.body);

    const data = await registerService({ email, username, password, fullName });

    // 2. Tách refreshToken ra khỏi response
    const { refreshToken, ...responseData } = data;

    // 3. Set refreshToken vào httpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", 
      sameSite: "strict", 
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    });

    return res.status(201).json({
      success: true,
      message: "Đăng ký tài khoản thành công",
      data: responseData,
    });
  } catch (error: unknown) {
    let errorMessage = "Đăng ký thất bại";
    
    // Bắt lỗi từ Zod và lấy thông báo lỗi đầu tiên
    if (error instanceof z.ZodError) {
      errorMessage = error.issues[0].message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return res.status(400).json({
      success: false,
      message: errorMessage,
    });
  }
}

export async function loginController(req: Request, res: Response) {
  try {
    // 1. Validate bằng Zod
    const { identifier, password } = loginSchema.parse(req.body);

    const data = await loginService({ identifier, password });

    // 2. Tách refreshToken ra khỏi response
    const { refreshToken, ...responseData } = data;

    // 3. Set refreshToken vào httpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    });

    return res.status(200).json({
      success: true,
      message: "Đăng nhập thành công",
      data: responseData,
    });
  } catch (error: unknown) {
    let errorMessage = "Đăng nhập thất bại";
    
    // Bắt lỗi từ Zod
    if (error instanceof z.ZodError) {
      errorMessage = error.issues[0].message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    return res.status(401).json({
      success: false,
      message: errorMessage,
    });
  }
}

export async function refreshController(req: Request, res: Response) {
  try {
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Không tìm thấy refresh token. Vui lòng đăng nhập lại.",
      });
    }

    const data = await refreshService(refreshToken);

    // Tách refreshToken ra khỏi response, dat refresh token thanh newRefreshToken de set vao cookie
    const { refreshToken: newRefreshToken, ...responseData } = data;

    // Set refreshToken mới vào httpOnly cookie
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    });

    return res.status(200).json({
      success: true,
      message: "Làm mới token thành công",
      data: responseData,
    });
  } catch (error: unknown) {
    let errorMessage = "Làm mới token thất bại";
    
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return res.status(401).json({
      success: false,
      message: errorMessage,
    });
  }
}

export async function logoutController(req: Request, res: Response) {
  try {
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

    if (refreshToken) {
      // Xóa token khỏi database
      await logoutService(refreshToken);
    }

    // Xóa cookie
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({
      success: true,
      message: "Đăng xuất thành công",
    });
  } catch (error: unknown) {
    return res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi khi đăng xuất",
    });
  }
}