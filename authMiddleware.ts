import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export default function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: "Access Denied. No token provided." });
  }
  if (typeof token !=="string" || token.split(".").length!==3){
    return res.status(400).json({message :"Invalid token format"});
  }

  try {
    const secret = process.env.JWT_SECRET as string;
    const decoded = jwt.verify(token, secret);
    (req as any).user = decoded; // store decoded user info for later use
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
}
