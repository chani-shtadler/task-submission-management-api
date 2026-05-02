import jwt from "jsonwebtoken";

const SECRET_KEY = "hello_github";

export class AuthService {

  generateToken(userId: string, role : string): string {

    const payload = { userId, role };

    return jwt.sign(payload, SECRET_KEY, { expiresIn: "1y" });
  }

  verifyToken(token: string): any {
        return jwt.verify(token, SECRET_KEY);
  }
}

