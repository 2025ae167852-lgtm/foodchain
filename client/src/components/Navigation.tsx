import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { 
  LayoutDashboard, 
  Tractor, 
  Sprout, 
  LogOut, 
  Menu,
  X,
  ScanLine
} from "lucide-react";
import { useState } from "react";
import { clsx } from "clsx";
import { motion, AnimatePresence } from "framer-motion";

export function Navigation() {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  const links = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/farms", label: "My Farms", icon: Tractor },
    // In a real app, these would link to real pages
    { href: "/crops", label: "Crops Database", icon: Sprout },
    { href: "/traceability-demo", label: "Traceability Demo", icon: ScanLine },
  ];

  const NavContent = () => (
    <>
      <div className="flex items-center gap-3 px-2 py-4 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
          UF
        </div>
        <div>
          <h1 className="font-display font-bold text-lg leading-none">Unified Farm</h1>
          <p className="text-xs text-muted-foreground mt-1">Intelligence Platform</p>
        </div>
      </div>

      <nav className="space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location === link.href || location.startsWith(link.href + "/");
          
          return (
            <Link key={link.href} href={link.href} className={clsx(
              "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
              isActive 
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}>
              <Icon size={18} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-border">
        <div className="flex items-center gap-3 px-4 py-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold text-xs border border-accent-foreground/10">
            {user.firstName?.[0] || user.email?.[0] || "U"}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium truncate">{user.firstName || "User"}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
        </div>
        <button
          onClick={() => logout()}
          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-background border-b border-border z-40 flex items-center justify-between px-4">
        <div className="font-display font-bold text-lg">Unified Farm</div>
        <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-foreground">
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", bounce: 0, duration: 0.3 }}
            className="md:hidden fixed inset-0 z-30 bg-background pt-20 px-4"
          >
            <NavContent />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 fixed inset-y-0 left-0 border-r border-border bg-card px-4 py-6 z-40">
        <NavContent />
      </aside>

      {/* Main Content Padding for Desktop */}
      <div className="md:pl-64 pt-16 md:pt-0 min-h-screen bg-background">
        {/* Content injected by parent layout */}
      </div>
    </>
  );
}

export function PageLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  // If public route (no user), just render children
  if (!user) return <>{children}</>;

  return (
    <div className="min-h-screen bg-background font-sans">
      <Navigation />
      <main className="md:pl-64 p-4 md:p-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
