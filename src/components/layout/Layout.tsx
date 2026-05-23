import { Outlet } from "react-router-dom";
import { BackgroundScene } from "@/components/layout/BackgroundScene";
import { Header } from "./Header";
import "./Layout.css";

export function Layout() {
  return (
    <div className="layout">
      <BackgroundScene />
      <Header />
      <main className="layout__main">
        <Outlet />
      </main>
    </div>
  );
}
