import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import config from "../config";

const auth = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        return res.status(401).json({ message: "Unauthorized!" });
      }

      const parts = authHeader.split(" ");
      const token =
        parts.length === 2 && parts[0] === "Bearer" ? parts[1] : authHeader;

      const decoded = jwt.verify(
        token!,
        config.jwtSecret as string
      ) as unknown as JwtPayload & { id: number; role: "admin" | "customer" };

      req.user = decoded;

      return next();
    } catch (err: any) {
      return res.status(401).json({
        success: false,
        message: err.message,
      });
    }
  };
};

export default auth;
