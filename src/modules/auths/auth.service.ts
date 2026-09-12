import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { eq, or } from "drizzle-orm";
import { db } from "./../../db";
import { users } from "../users/user.schema";
import { refreshTokens } from "../refreshTokens/refreshToken.schema";

const ACCESS_SECRET = process.env.JWT_SECRET || "default_access_secret";
const REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || "default_refresh_secret";

async function generateAuthTokens(userId: string, role: string) {
  const accessToken = jwt.sign(
    { userId, role },
    ACCESS_SECRET,
    { expiresIn: "15m" }, // Hết hạn sau 15 phút
  );

  const refreshToken = jwt.sign(
    { userId, role },
    REFRESH_SECRET,
    { expiresIn: "7d" }, // Hết hạn sau 7 ngày
  );

  // Tính ngày hết hạn (7 ngày sau)
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  // Lưu refresh token vào bảng refresh_tokens
  await db.insert(refreshTokens).values({
    userId,
    token: refreshToken,
    expiryTime: expiresAt,
  });

  return { accessToken, refreshToken };
}

// 1. CHỨC NĂNG REGISTER
export async function registerService(input: {
  email: string;
  username: string;
  password: string;
  fullName?: string;
}) {
  const { email, username, password, fullName } = input;

  // 1. Kiểm tra email hoặc username đã tồn tại chưa
  const existingUser = await db.query.users.findFirst({
    where: or(eq(users.email, email), eq(users.username, username)),
  });

  if (existingUser) {
    if (existingUser.email === email) {
      throw new Error("Email này đã được đăng ký");
    }
    throw new Error("Tên đăng nhập (username) đã được sử dụng");
  }

  // 2. Hash mật khẩu
  const passwordHash = await bcrypt.hash(password, 10);

  // 3. Tạo mã userCode ngẫu nhiên (ví dụ: USR-829104)
  const userCode = `USR-${Math.floor(100000 + Math.random() * 900000)}`;

  // 4. Tạo người dùng mới trong DB
  const [newUser] = await db
    .insert(users)
    .values({
      email,
      username,
      passwordHash,
      fullName: fullName || null,
      userCode,
      role: "Customer",
    })
    .returning({
      id: users.userID,
      email: users.email,
      username: users.username,
      fullName: users.fullName,
      role: users.role,
      userCode: users.userCode,
    });

  // 5. Cấp cặp token để đăng nhập luôn sau khi đăng ký
  const tokens = await generateAuthTokens(newUser.id, newUser.role || "Customer");

  return {
    user: newUser,
    ...tokens,
  };
}

// ---------------------------------------------
// 2. CHỨC NĂNG LOGIN
// ---------------------------------------------
export async function loginService(input: {
  identifier: string; // Cho phép đăng nhập bằng email hoặc username
  password: string;
}) {
  const { identifier, password } = input;

  // 1. Tìm tài khoản bằng email HOẶC username
  const user = await db.query.users.findFirst({
    where: or(eq(users.email, identifier), eq(users.username, identifier)),
  });

  if (!user) {
    throw new Error("Tài khoản hoặc mật khẩu không chính xác");
  }

  // 2. Kiểm tra nếu tài khoản bị khóa
  if (user.isBlocked) {
    throw new Error("Tài khoản này đã bị tạm khóa");
  }

  // 3. Tài khoản đăng nhập bằng Google nhưng chưa set password
  if (!user.passwordHash) {
    throw new Error(
      "Tài khoản này được đăng ký qua Google, vui lòng đăng nhập bằng Google",
    );
  }

  // 4. So khớp mật khẩu với hash trong DB
  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    throw new Error("Tài khoản hoặc mật khẩu không chính xác");
  }

  // 5. Cập nhật lastOnline
  await db
    .update(users)
    .set({ lastOnline: new Date() })
    .where(eq(users.userID, user.userID));

  // 6. Cấp cặp token mới (mỗi lần đăng nhập ở thiết bị mới sẽ lưu thêm 1 refresh token)
  const tokens = await generateAuthTokens(user.userID, user.role || "Customer");

  return {
    user: {
      id: user.userID,
      email: user.email,
      username: user.username,
      fullName: user.fullName,
      avatarUrl: user.avatarURL,
      role: user.role,
      userCode: user.userCode,
      isPremium: user.isPremium,
    },
    ...tokens,
  };
}
