import { useEffect, useState, useCallback } from "react";
import IntroAnimation from "./components/IntroAnimation";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "lenis/dist/lenis.css";
import Index from "./pages/Index";
import Links from "./pages/Links";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/AuthContext";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminRouteGuard from "./components/admin/AdminRouteGuard";

gsap.registerPlugin(ScrollTrigger);

const queryClient = new QueryClient();

const App = () => {
  // A intro só roda na página inicial (/)
  const [showIntro, setShowIntro] = useState<boolean>(() => {
    const isHome = window.location.pathname === "/";
    if (!isHome) return false;

    // Desabilita a restauração nativa de scroll do browser (sobrescreveria o scrollTo abaixo)
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    // Executa sincronamente antes do primeiro render:
    // trava scroll e vai ao topo antes de qualquer paint
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    window.scrollTo(0, 0);
    // Sinaliza globalmente para que o Hero aguarde o evento 'intro:complete'
    (window as any).__introActive = true;
    return true;
  });

  const handleIntroComplete = useCallback(() => {
    (window as any).__introActive = false;
    // Libera scroll ao terminar
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
    // Retoma o Lenis se estiver inicializado
    const lenis = (window as any).__lenis;
    if (lenis) lenis.start();
    setShowIntro(false);
  }, []);

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.045,
      wheelMultiplier: 1.2,
      smoothWheel: true,
      syncTouch: true,
      syncTouchLerp: 0.05,
      autoRaf: true,
      anchors: true,
      respectReducedMotion: false,
    });

    (window as any).__lenis = lenis;

    // Se a intro estiver rodando, para o Lenis até ela terminar
    if ((window as any).__introActive) {
      lenis.stop();
    }

    lenis.on("scroll", () => {
      ScrollTrigger.update();
    });

    gsap.ticker.lagSmoothing(0);

    const handleResize = () => {
      lenis.resize();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      lenis.destroy();
    };
  }, []);

  return (
    <>
      {showIntro && <IntroAnimation onComplete={handleIntroComplete} />}
      {/* visibility:hidden mantém o layout intacto mas esconde o conteúdo durante a intro */}
      <div style={{ visibility: showIntro ? 'hidden' : 'visible' }}>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <AuthProvider>
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/links" element={<Links />} />

                  {/* Rotas Administrativas */}
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route
                    path="/admin"
                    element={
                      <AdminRouteGuard>
                        <AdminDashboard />
                      </AdminRouteGuard>
                    }
                  />

                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </AuthProvider>
          </TooltipProvider>
        </QueryClientProvider>
      </div>
    </>
  );
};

export default App;
