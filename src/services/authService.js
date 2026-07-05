import { getState, setState, updateState } from "../store/store.js";
import { todayIso, uid } from "../utils/format.js";

export function currentUser() {
  return getState().users.find((user) => user.id === getState().sessionUserId) || null;
}

export function login(email, password) {
  const user = getState().users.find((item) => item.email.toLowerCase() === email.toLowerCase() && item.password === password);
  if (!user) throw new Error("Wrong email or password");
  if (user.blocked) throw new Error("User is blocked");
  setState({ sessionUserId: user.id, language: user.language || getState().language || "he" });
  return user;
}

export function register(payload) {
  if (payload.password !== payload.confirm) throw new Error("Passwords do not match");
  if (payload.password.length < 6) throw new Error("Password must be at least 6 characters");
  if (getState().users.some((user) => user.email.toLowerCase() === payload.email.toLowerCase())) {
    throw new Error("A user with this email already exists");
  }

  const user = {
    id: uid("u"),
    name: payload.name,
    email: payload.email,
    password: payload.password,
    role: "user",
    language: getState().language || localStorage.getItem("lechtop-language") || "he",
    blocked: false,
    createdAt: todayIso()
  };

  updateState((draft) => {
    draft.users.push(user);
    draft.sessionUserId = user.id;
    draft.language = user.language;
  });
  return user;
}

export function logout() {
  setState({ sessionUserId: null });
}

export function updateProfile(payload) {
  const user = currentUser();
  if (!user) return;
  updateState((draft) => {
    const target = draft.users.find((item) => item.id === user.id);
    Object.assign(target, payload);
    if (payload.language) draft.language = payload.language;
  });
}

export function updateUser(id, patch) {
  updateState((draft) => {
    const user = draft.users.find((item) => item.id === id);
    Object.assign(user, patch);
  });
}
