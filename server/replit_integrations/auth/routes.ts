import type { Express } from "express";
import { authStorage } from "./storage";
import { isAuthenticated } from "./replitAuth";

// Register auth-specific routes
import { UserRole, ALL_ROLES } from "@shared/roles";
import { requireRole } from "../../../server/middleware/rbac";

export function registerAuthRoutes(app: Express): void {
  // Get current authenticated user
  app.get("/api/auth/user", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await authStorage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Admin: Set user role
  app.patch(
    "/api/auth/user/:id/role",
    isAuthenticated,
    requireRole([UserRole.Regulator]), // Only Regulator (admin) can assign roles
    async (req: any, res) => {
      const { id } = req.params;
      const { role } = req.body;
      if (!ALL_ROLES.includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }
      try {
        const user = await authStorage.getUser(id);
        if (!user) return res.status(404).json({ message: "User not found" });
        await authStorage.upsertUser({ ...user, role });
        res.json({ message: "Role updated", userId: id, role });
      } catch (error) {
        console.error("Error updating user role:", error);
        res.status(500).json({ message: "Failed to update user role" });
      }
    }
  );
}
