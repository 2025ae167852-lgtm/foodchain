import { Request, Response, NextFunction } from "express";

export function auditLog(req: Request, res: Response, next: NextFunction) {
  const user = req.user ? req.user.id : "anonymous";
  console.log(`[AUDIT] ${new Date().toISOString()} | ${user} | ${req.method} ${req.originalUrl}`);
  next();
}
