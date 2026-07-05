import { renderApp } from "./pages/app.js";
import { initStore } from "./store/store.js";
import { applyLanguageDocument } from "./services/languageService.js";

initStore();
applyLanguageDocument();
renderApp();
