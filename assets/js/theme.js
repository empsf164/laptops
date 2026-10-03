/**
 * NOVA LAPTOPS - Theme Engine (Dark / Light Mode)
 * Supports system preference detection & localStorage persistence
 */

(function () {
  const THEME_KEY = "nova_theme_preference";

  function getPreferredTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) return saved;
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
    updateThemeIcons(theme);
  }

  function updateThemeIcons(theme) {
    const toggleBtns = document.querySelectorAll(".theme-toggle-btn");
    toggleBtns.forEach((btn) => {
      btn.innerHTML =
        theme === "light"
          ? '<i data-lucide="moon" style="width: 18px; height: 18px;"></i>'
          : '<i data-lucide="sun" style="width: 18px; height: 18px;"></i>';
    });
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  // Apply on immediate execution to prevent flash of wrong theme
  const initialTheme = getPreferredTheme();
  document.documentElement.setAttribute("data-theme", initialTheme);

  document.addEventListener("DOMContentLoaded", () => {
    updateThemeIcons(document.documentElement.getAttribute("data-theme") || "dark");

    document.querySelectorAll(".theme-toggle-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
        const newTheme = currentTheme === "dark" ? "light" : "dark";
        applyTheme(newTheme);
        if (window.showToast) {
          window.showToast(`Switched to ${newTheme} mode`, "info");
        }
      });
    });
  });

  window.novaTheme = {
    getTheme: () => document.documentElement.getAttribute("data-theme") || "dark",
    setTheme: applyTheme
  };
})();
