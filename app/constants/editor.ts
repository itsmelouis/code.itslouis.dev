import type { ShjTheme } from "rangi";
import {
  atomDark,
  catppuccinMocha,
  dracula,
  githubDark,
  githubDim,
  gruvboxDark,
  monokai,
  nightOwl,
  nord,
  tokyoNight,
  vesper,
  visualStudioDark,
  vscodeDarkModern,
} from "rangi/themes";

import type { BackgroundOption, EditorState, ThemeOption } from "~/types/editor";

export const DEFAULT_CODE = `import { codeToHtml } from 'rangi'
import { tokyoNight } from 'rangi/themes'

const frame = codeToHtml(
  'console.log("hello, night city")',
  { lang: 'ts', theme: tokyoNight },
)

document.querySelector('#app')!.innerHTML = frame`;

export const LANGUAGES = [
  "plain",
  "ts",
  "tsx",
  "js",
  "jsx",
  "vue",
  "html",
  "css",
  "scss",
  "json",
  "md",
  "bash",
  "py",
  "go",
  "rs",
  "java",
  "cpp",
  "c",
  "cs",
  "php",
  "rb",
  "sql",
  "yaml",
  "toml",
  "docker",
  "graphql",
  "swift",
  "kt",
  "lua",
  "dart",
  "astro",
  "svelte",
] as const;

export const THEMES: ThemeOption[] = [
  { label: "Tokyo Night", value: "tokyo-night" },
  { label: "Catppuccin Mocha", value: "catppuccin-mocha" },
  { label: "GitHub Dark", value: "github-dark" },
  { label: "GitHub Dimmed", value: "github-dim" },
  { label: "Night Owl", value: "night-owl" },
  { label: "Vesper", value: "vesper" },
  { label: "Nord", value: "nord" },
  { label: "Dracula", value: "dracula" },
  { label: "Monokai", value: "monokai" },
  { label: "Gruvbox Dark", value: "gruvbox-dark" },
  { label: "Atom Dark", value: "atom-dark" },
  { label: "VS Code Modern", value: "vscode-dark-modern" },
  { label: "Visual Studio Dark", value: "visual-studio-dark" },
];

export const THEME_MAP: Record<string, ShjTheme> = {
  "atom-dark": atomDark,
  "catppuccin-mocha": catppuccinMocha,
  dracula,
  "github-dark": githubDark,
  "github-dim": githubDim,
  "gruvbox-dark": gruvboxDark,
  monokai,
  "night-owl": nightOwl,
  nord,
  "tokyo-night": tokyoNight,
  vesper,
  "visual-studio-dark": visualStudioDark,
  "vscode-dark-modern": vscodeDarkModern,
};

export const BACKGROUNDS: BackgroundOption[] = [
  {
    id: "night-train",
    label: "Night train",
    src: "/backgrounds/night-train.svg",
    color: "#334f9d",
  },
  {
    id: "signal-glow",
    label: "Signal glow",
    src: "/backgrounds/signal-glow.svg",
    color: "#d9676a",
  },
  {
    id: "blue-hour",
    label: "Blue hour",
    src: "/backgrounds/blue-hour.svg",
    color: "#4f7891",
  },
];

export function createDefaultState(): EditorState {
  return {
    code: DEFAULT_CODE,
    title: "code.itslouis.dev",
    language: "ts",
    theme: "catppuccin-mocha",
    background: "night-train",
    frame: "minimal",
    padding: 58,
    backgroundScale: 1.08,
    blur: 18,
    panelOpacity: 0.84,
    fontSize: 16,
    lineNumbers: true,
  };
}
