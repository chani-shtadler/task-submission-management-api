import { Request, Response, NextFunction } from "express";
import { AuthService } from "../Utils/Authentication";
import { logger } from "../Utils/Logger";

const authService = new AuthService();

export function authenticatUser(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];
  if (!token) {
    logger.warn("Missing token in request");
    return res.status(401).json({ error: "Missing token" });
  }
  try{
    const decoded  = authService.verifyToken(token); 
    (req as any).userId = decoded.userId;
    (req as any).role = decoded.role;
    logger.info(`Token verified for user ID: ${(req as any).userId}`);
    next();
  }
  catch (error)
  {
    logger.error(`Invalid token: ${error}`);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}