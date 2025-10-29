// Backup of the full application entry. This file is kept as a reference
// and will not be used in the lightweight dev mode.

import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import CreateProfile from "@/pages/CreateProfile";
import GenerateProfile from "@/pages/GenerateProfile";
import BrowseProfiles from "@/pages/BrowseProfiles";
import ProfileDetail from "@/pages/ProfileDetail";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/create" component={CreateProfile} />
      <Route path="/generate" component={GenerateProfile} />
      <Route path="/browse" component={BrowseProfiles} />
      <Route path="/profile/:id" component={ProfileDetail} />
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
