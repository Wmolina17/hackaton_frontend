import { Link } from "react-router-dom";
import "./Layout.css";

interface HeaderProps {
  title?: string;
}

export function Header({ title = "Hackaton" }: HeaderProps) {
  return (
    <header className="layout__header">
      <Link to="/">
        <h1>{title}</h1>
      </Link>
    </header>
  );
}
