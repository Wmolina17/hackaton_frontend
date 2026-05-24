import { Outlet, useLocation } from "react-router-dom";
import { BackgroundScene } from "@/components/layout/BackgroundScene";
import { Header } from "./Header";
import "./Layout.css";

export function Layout() {
  const location = useLocation();
  const isChatFullscreen = location.pathname === "/agendar";

  return (
    <div className={`layout${isChatFullscreen ? " layout--fullscreen" : ""}`}>
      {!isChatFullscreen && <BackgroundScene />}
      {!isChatFullscreen && <Header />}
      <main className={`layout__main${isChatFullscreen ? " layout__main--fullscreen" : ""}`}>
        <Outlet />
      </main>
    </div>
  );
}
