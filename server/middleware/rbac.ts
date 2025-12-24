import { Request, Response, NextFunction } from "express";
import { UserRole } from "@shared/roles";

export function requireRole(roles: UserRole[]) {
  return (req: any, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({ message: "Forbidden: insufficient role" });
    }
    next();
  };
}
