/**
 * Accessibility gate: runs axe-core against every page type of a running build,
 * on both themes, and fails on any WCAG 2.x A/AA or best-practice violation.
 *
 *   bun run build && HOST=127.0.0.1 PORT=4999 node dist/server/entry.mjs &
 *   bun run a11y            # or A11Y_BASE_URL=http://127.0.0.1:4321 bun run a11y
 */
import { AxeBuilder } from "@axe-core/playwright";
import { chromium } from "playwright";

const base = process.env.A11Y_BASE_URL ?? "http://127.0.0.1:4999";
// Every page type, including /intro: the one page on the blue theme.
const pages = [
  "/",
  "/work",
  "/work/opensylo-lender",
  "/experience",
  "/products",
  "/writing",
  "/writing/hello-world",
  "/intro",
  "/intro/reach-ai",
  "/404",
];
const tags = [
  "wcag2a",
  "wcag2aa",
  "wcag21a",
  "wcag21aa",
  "wcag22aa",
  "best-practice",
];

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1280, height: 900 },
});
const page = await context.newPage();
let failures = 0;

for (const path of pages) {
  const response = await page.goto(base + path, { waitUntil: "networkidle" });
  if (!response || (response.status() >= 400 && path !== "/404")) {
    console.log(`✖ ${path} responded ${response?.status()}`);
    failures++;
    continue;
  }
  // Reveal animations start content at opacity 0; axe must see the settled page, so
  // motion is switched off and content held back below the fold is released before measuring.
  await page.addStyleTag({
    content:
      "*, *::before, *::after { transition: none !important; animation: none !important; }",
  });
  await page.evaluate(() => {
    document
      .querySelectorAll(".is-pending")
      .forEach((el) => el.classList.remove("is-pending"));
  });
  await page.waitForTimeout(300);
  const { violations } = await new AxeBuilder({ page })
    .withTags(tags)
    .analyze();
  if (violations.length === 0) {
    console.log(`✔ ${path}`);
    continue;
  }
  failures++;
  console.log(`✖ ${path}`);
  for (const v of violations) {
    console.log(`  ${v.impact ?? "minor"} · ${v.id} · ${v.help}`);
    for (const node of v.nodes.slice(0, 5)) {
      const data = node.any[0]?.data;
      const detail = data?.contrastRatio
        ? ` (${data.fgColor} on ${data.bgColor}, ${data.contrastRatio}:1)`
        : "";
      console.log(`    ${node.target[0]}${detail}`);
    }
  }
}

await browser.close();
if (failures) {
  console.log(`\n${failures} page(s) with accessibility violations.`);
  process.exit(1);
}
console.log(`\nAll ${pages.length} pages pass.`);
