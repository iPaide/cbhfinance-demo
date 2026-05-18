
if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Service worker registration is optional and should not block the app.
    });
  });
}

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AdminPanel, LandingPage, LegalPage, LoginPage, UserPortal } from "./pages/CBHFinanceApp";

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/login">{() => <LoginPage role="user" />}</Route>
      <Route path="/portal" component={UserPortal} />
      <Route path="/secure-admin" component={AdminPanel} />
      <Route path="/terms">{() => <LegalPage type="terms" />}</Route>
      <Route path="/privacy">{() => <LegalPage type="privacy" />}</Route>
      <Route path="/contact">{() => <LegalPage type="contact" />}</Route>
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light" switchable>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
