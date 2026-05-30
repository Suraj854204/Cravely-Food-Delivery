
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User, { IUser } from "../model/User.js";

export interface AuthenticatedRequest extends Request {
  user?: IUser | null;
}

export const isAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      res.status(401).json({ message: "Please login — no auth header" });
      return;
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      res.status(401).json({ message: "Please login — token missing" });
      return;
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SEC as string
    ) as JwtPayload;

    // All tokens are signed with { userId }, so look that up
    if (!decoded?.userId) {
      res.status(401).json({ message: "Invalid token" });
      return;
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      res.status(401).json({ message: "User not found" });
      return;
    }

    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: "Please login — invalid token" });
  }
};