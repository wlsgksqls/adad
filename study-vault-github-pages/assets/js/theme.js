const root = document.documentElement;
const savedTheme = localStorage.getItem("study-vault-theme");
if (savedTheme) root.dataset.theme = savedTheme;

export function setupThemeToggle() {
  const button = document.querySelector("#themeToggle");
  if (!button) return;

  button.addEventListener("click", () => {
    const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = nextTheme;
    localStorage.setItem("study-vault-theme", nextTheme);
  });
}
