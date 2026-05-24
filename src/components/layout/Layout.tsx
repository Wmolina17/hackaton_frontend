import { Outlet, useLocation } from "react-router-dom";
import { BackgroundScene } from "@/components/layout/BackgroundScene";
import { Header } from "./Header";
import "./Layout.css";

export function Layout() {
  const location = useLocation();
  const isChatPage = location.pathname === "/agendar";

  return (
    <div className="layout">
      <BackgroundScene />
      <Header />
      <main
        className={`layout__main${isChatPage ? " layout__main--chat" : ""}`}
      >
        <Outlet />
      </main>
    </div>
  );
}
