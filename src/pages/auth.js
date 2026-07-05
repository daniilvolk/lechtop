import { login, register } from "../services/authService.js";
import { input } from "../components/forms.js";
import { toast } from "../components/ui.js";
import { t } from "../services/languageService.js";

export function loginPage() {
  return `
    <section class="auth-page">
      <form class="panel auth-card" id="loginForm">
        <span class="kicker">Auth</span>
        <h1>${t("login")}</h1>
        ${input("email", t("email"), "admin@lechtop.dev", "email", "required")}
        ${input("password", "Password", "admin123", "password", "required")}
        <button class="primary wide">${t("login")}</button>
        <p>Admin: admin@lechtop.dev / admin123<br />User: user@lechtop.dev / user123</p>
        <a href="#/register">Create account</a>
      </form>
    </section>
  `;
}

export function registerPage() {
  return `
    <section class="auth-page">
      <form class="panel auth-card" id="registerForm">
        <span class="kicker">Auth</span>
        <h1>Create account</h1>
        ${input("name", t("name"), "", "text", "required")}
        ${input("email", t("email"), "", "email", "required")}
        ${input("password", "Password", "", "password", "required minlength='6'")}
        ${input("confirm", "Repeat password", "", "password", "required minlength='6'")}
        <button class="primary wide">Create account</button>
        <a href="#/login">${t("login")}</a>
      </form>
    </section>
  `;
}

export function bindAuth() {
  document.querySelector("#loginForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    try {
      const user = login(data.get("email"), data.get("password"));
      toast(`${t("welcome")}, ${user.name}`);
      location.hash = user.role === "admin" ? "#/admin" : "#/account";
    } catch (error) {
      toast(error.message, "bad");
    }
  });

  document.querySelector("#registerForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    try {
      register(Object.fromEntries(data.entries()));
      toast(t("accountCreated"));
      location.hash = "#/account";
    } catch (error) {
      toast(error.message, "bad");
    }
  });
}
