const KEY = "intro-greeting";

/**
 * A visitor who lands on an intro page (or /intro?to=Acme) is greeted by name
 * in the header on every page for the rest of the browser session.
 */
export function startGreeting() {
  let greeting: string | null = null;
  try {
    const recipient = document.body.dataset.recipient;
    const to = new URLSearchParams(location.search).get("to");
    if (recipient) sessionStorage.setItem(KEY, `Hi ${recipient.split(" ")[0]}`);
    else if (to) sessionStorage.setItem(KEY, `Hi ${to} team`);
    greeting = sessionStorage.getItem(KEY);
  } catch {
    return;
  }
  if (!greeting) return;
  for (const slot of document.querySelectorAll<HTMLElement>(
    "[data-visitor-greeting]",
  )) {
    slot.textContent = greeting;
    slot.hidden = false;
  }
}
