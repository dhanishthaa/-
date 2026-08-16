// Quiet Atelier style reminder: routes preserve the slow landing ritual, clear storefront escape, and private admin room.
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import About from "./pages/About";
import Landing from "./pages/Landing";
import Admin from "./pages/Admin";
import MotionRoot from "./components/MotionRoot";

function Router() {
  return <Switch>
    <Route path="/" component={Landing} />
    <Route path="/home" component={Home} />
    <Route path="/about" component={About} />
    <Route path="/admin" component={Admin} />
    <Route path="/404" component={NotFound} />
    <Route component={NotFound} />
  </Switch>;
}

export default function App() {
  return <ErrorBoundary><ThemeProvider defaultTheme="light"><TooltipProvider><MotionRoot><Toaster /><Router /></MotionRoot></TooltipProvider></ThemeProvider></ErrorBoundary>;
}
