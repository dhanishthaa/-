// Quiet Atelier style reminder: routes preserve the slow landing ritual, clear storefront escape, and private admin room.
import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Landing from "./pages/Landing";
import MotionRoot from "./components/MotionRoot";

const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Admin = lazy(() => import("./pages/Admin"));

function Router() {
  return <Suspense fallback={<main className="route-loading" aria-live="polite" aria-label="Loading isth" />}><Switch>
    <Route path="/" component={Landing} />
    <Route path="/home" component={Home} />
    <Route path="/about" component={About} />
    <Route path="/isth/frag/minda" component={Admin} />
    <Route path="/404" component={NotFound} />
    <Route component={NotFound} />
  </Switch></Suspense>;
}

export default function App() {
  return <ErrorBoundary><ThemeProvider defaultTheme="light"><TooltipProvider><MotionRoot><Toaster /><Router /></MotionRoot></TooltipProvider></ThemeProvider></ErrorBoundary>;
}
