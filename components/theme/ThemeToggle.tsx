"use client";

import { useTheme, type Theme } from "./ThemeProvider";

const OPTIONS: { value: Theme; label: string }[] = [
  { value: "clair", label: "Clair" },
  { value: "sombre", label: "Sombre" },
];

export function ThemeToggle({ pleineLargeur = false }: { pleineLargeur?: boolean }) {
  const { theme, definirTheme } = useTheme();

  return (
    <div
      className={`flex border border-filet ${pleineLargeur ? "w-full" : ""}`}
      role="group"
      aria-label="Thème"
    >
      {OPTIONS.map((option) => {
        const actif = theme === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => definirTheme(option.value)}
            aria-pressed={actif}
            className={`px-3 py-2.5 text-[10px] tracking-[0.16em] uppercase transition-colors ${
              pleineLargeur ? "flex-1" : ""
            } ${actif ? "bg-accent text-fond" : "text-attenue hover:text-encre"}`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
