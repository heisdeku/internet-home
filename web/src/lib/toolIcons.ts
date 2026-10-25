import * as icons from "simple-icons";

const ALIASES: Record<string, string> = {
  "react native": "react",
  "node & express": "nodedotjs",
  node: "nodedotjs",
  "node.js": "nodedotjs",
  "next.js": "nextdotjs",
  nextjs: "nextdotjs",
  vue: "vuedotjs",
  "vue.js": "vuedotjs",
  nuxt: "nuxt",
  scss: "sass",
  gsap: "greensock",
  tailwind: "tailwindcss",
  "tailwind css": "tailwindcss",
  postgres: "postgresql",
  express: "express",
};

export function toolIcon(name: string): { path: string } | null {
  const key = name.trim().toLowerCase();
  const slug =
    ALIASES[key] ?? key.replace(/\.js$/, "dotjs").replace(/[^a-z0-9]/g, "");
  const exportName = `si${slug.charAt(0).toUpperCase()}${slug.slice(1)}`;
  const icon = (icons as Record<string, unknown>)[exportName] as
    | { path: string }
    | undefined;
  return icon ? { path: icon.path } : null;
}
