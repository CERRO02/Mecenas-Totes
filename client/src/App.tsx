import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Products from "@/pages/products";
import ProductDetail from "@/pages/product-detail-static";
import Artists from "@/pages/artists";
import Header from "@/components/layout/header-static";
import Footer from "@/components/layout/footer-static";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/products" component={Products} />
      <Route path="/products/:id" component={ProductDetail} />
      <Route path="/artists" component={Artists} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <TooltipProvider>
      <div className="min-h-screen bg-canvasco-secondary">
        <Header />
        <main>
          <Router />
        </main>
        <Footer />
        <Toaster />
      </div>
    </TooltipProvider>
  );
}

export default App;
