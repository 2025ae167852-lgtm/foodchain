import React from 'react';
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import Farms from "@/pages/Farms";
import FarmDetails from "@/pages/FarmDetails";
import Traceability from "@/pages/Traceability";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary w-8 h-8" /></div>;
  }

  if (!user) {
    // Redirect to login handled by use-auth logic or show landing
    // But typically we'd redirect. Here we just show Landing for simplicity if not caught
    return <Landing />;
  }

  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      
      {/* Protected Routes */}
      <Route path="/dashboard">
        <ProtectedRoute component={Dashboard} />
      </Route>
      <Route path="/farms">
        <ProtectedRoute component={Farms} />
      </Route>
      <Route path="/farms/:id">
        <ProtectedRoute component={FarmDetails} />
      </Route>

      {/* Public Routes */}
      <Route path="/traceability" component={Traceability} />
      <Route path="/traceability/:batchId" component={Traceability} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
