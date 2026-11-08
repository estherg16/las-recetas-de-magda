"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function BotonModoOscuro() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [montado, setMontado] = useState(false);

  useEffect(() => setMontado(true), []);
  if (!montado) return null;

  const temaActual = theme === "system" ? systemTheme : theme;

  return (
    <button
      onClick={() => setTheme(temaActual === "dark" ? "light" : "dark")}
      className="p-2 rounded-full bg-accent/20 text-primary hover:bg-accent/50 transition-colors"
      aria-label="Alternar tema"
    >
      {temaActual === "dark" ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}