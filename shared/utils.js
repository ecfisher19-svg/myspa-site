/**
 * Small shared utilities used across MySpa pages.
 */

/**
 * Escape untrusted text for safe interpolation into an HTML template.
 *
 * Prefer `element.textContent = value` over template literals whenever possible;
 * use this helper when you really need to build HTML strings from user input.
 */
export function escapeHtml(value) {
  if (value == null) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Minimal email validation: one local@domain.tld, no whitespace.
 * Not exhaustive (nothing is) but rejects obvious garbage like "a@" or "@b.com".
 */
export function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const trimmed = email.trim();
  if (trimmed.length > 254) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
}

/**
 * Sanitize a comma-separated list of short strings (e.g. service areas).
 * Trims, drops empties, caps item length, and filters junk characters.
 */
export function parseCsvList(raw, { maxItems = 20, maxLen = 80 } = {}) {
  if (!raw) return [];
  return String(raw)
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
    .filter(s => s.length <= maxLen)
    .filter(s => /^[\p{L}\p{N}\s,.'\-&]+$/u.test(s))
    .slice(0, maxItems);
}

/**
 * Show a transient toast. Requires an element with id="toast".
 */
export function toast(msg, { duration = 2500 } = {}) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(el._timer);
  el._timer = setTimeout(() => el.classList.remove('show'), duration);
}

/**
 * Run an async operation while showing a busy label on a button.
 * Always restores the button label and disabled state, even on throw.
 */
export async function withLoading(btn, busyLabel, fn) {
  if (!btn) return fn();
  const prevLabel = btn.textContent;
  const prevDisabled = btn.disabled;
  btn.disabled = true;
  btn.textContent = busyLabel;
  try {
    return await fn();
  } finally {
    btn.disabled = prevDisabled;
    btn.textContent = prevLabel;
  }
}

/**
 * Strip any URL fragment/hash from the current address bar without reloading.
 * Used after consuming single-use auth tokens so they don't linger in history.
 */
export function scrubUrlHash() {
  if (window.location.hash) {
    history.replaceState(null, '', window.location.pathname + window.location.search);
  }
}

/**
 * Get the initials for a display name, e.g. "Ada Lovelace" -> "AL".
 */
export function initialsFor(name) {
  if (!name) return '?';
  return String(name)
    .split(' ')
    .filter(Boolean)
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}
