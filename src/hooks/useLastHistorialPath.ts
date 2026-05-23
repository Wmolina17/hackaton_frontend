import { useEffect, useState } from "react";
import { getLastHistorialPath } from "@/utils/session";

export function useLastHistorialPath(): string {
  const [path, setPath] = useState(() => getLastHistorialPath());

  useEffect(() => {
    const refresh = () => setPath(getLastHistorialPath());
    window.addEventListener("medinote:session", refresh);
    return () => window.removeEventListener("medinote:session", refresh);
  }, []);

  return path;
}
