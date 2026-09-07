"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Theme = "sombre" | "clair";

const CLE_STOCKAGE = "deo-theme";

const ThemeContext = createContext<{
  theme: Theme;
  definirTheme: (theme: Theme) => void;
}>({
  theme: "sombre",
  definirTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("sombre");

  // Relit le choix mémorisé après l'hydratation. Le serveur rend
  // toujours le mode sombre : c'est la valeur de `:root`, donc aucun
  // décalage de rendu tant que l'attribut n'a pas été posé.
  useEffect(() => {
    const enregistre = window.localStorage.getItem(CLE_STOCKAGE);
    if (enregistre === "clair" || enregistre === "sombre") {
      setTheme(enregistre);
    }
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  function definirTheme(suivant: Theme) {
    setTheme(suivant);
    try {
      window.localStorage.setItem(CLE_STOCKAGE, suivant);
    } catch {
      // Navigation privée : le thème reste valable pour la session.
    }
  }

  return (
    <ThemeContext.Provider value={{ theme, definirTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
