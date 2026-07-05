export function formValue(form, key) {
  return new FormData(form).get(key)?.toString().trim() || "";
}

export function input(name, label, value = "", type = "text", attrs = "") {
  return `<label><span>${label}</span><input name="${name}" type="${type}" value="${escapeHtml(value)}" ${attrs} /></label>`;
}

export function textarea(name, label, value = "", attrs = "") {
  return `<label><span>${label}</span><textarea name="${name}" ${attrs}>${escapeHtml(value)}</textarea></label>`;
}

export function select(name, label, options, value = "") {
  return `<label><span>${label}</span><select name="${name}">${options.map((option) => {
    const val = typeof option === "string" ? option : option.value;
    const text = typeof option === "string" ? option : option.label;
    return `<option value="${val}" ${val === value ? "selected" : ""}>${text}</option>`;
  }).join("")}</select></label>`;
}

export function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
