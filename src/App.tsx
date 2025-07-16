import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, HashRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ClientManagement from "./pages/ClientManagement";
import ClientTarotReading from "./pages/ClientTarotReading";
import NotFound from "./pages/NotFound";

// 优化QueryClient配置
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// 根据部署平台选择路由类型
const Router = process.env.VERCEL ? BrowserRouter : HashRouter;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/clients" element={<ClientManagement />} />
          <Route path="/tarot-reading/:shareId" element={<ClientTarotReading />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
