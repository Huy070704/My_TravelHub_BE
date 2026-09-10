// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
// import { eq, or } from 'drizzle-orm';
// import { db } from './../../db'; 
// import { users } from '../users/user.schema';
// import { refreshTokens } from '../refreshTokens/refreshToken.schema';

// const ACCESS_SECRET = process.env.JWT_SECRET || 'default_access_secret';
// const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'default_refresh_secret';

// async function generateAuthTokens(userId: string, role: string) {
//   const accessToken = jwt.sign(
//     { userId, role },
//     ACCESS_SECRET,
//     { expiresIn: '15m' } // Hết hạn sau 15 phút
//   );

//   const refreshToken = jwt.sign(
//     { userId, role },
//     REFRESH_SECRET,
//     { expiresIn: '7d' } // Hết hạn sau 7 ngày
//   );

//   // Tính ngày hết hạn (7 ngày sau)
//   const expiresAt = new Date();
//   expiresAt.setDate(expiresAt.getDate() + 7);

//   // Lưu refresh token vào bảng refresh_tokens
//   await db.insert(refreshTokens).values({
//     userId,
//     token: refreshToken,
//     expiresAt,
//   });

//   return { accessToken, refreshToken };
// }