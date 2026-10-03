/**
 * NOVA LAPTOPS - Theme Engine (Dark Mode Default)
 */

(function () {
  const THEME_KEY = "nova_theme_preference";

  function getPreferredTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) return saved;
    return "dark"; // Default is dark mode
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
  }

  // Always enforce dark theme as default
  const initialTheme = getPreferredTheme();
  document.documentElement.setAttribute("data-theme", initialTheme || "dark");

  window.novaTheme = {
    getTheme: () => document.documentElement.getAttribute("data-theme") || "dark",
    setTheme: applyTheme
  };
})();
