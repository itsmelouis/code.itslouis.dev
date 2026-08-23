import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from "lz-string";

import { BACKGROUNDS, LANGUAGES, THEMES, createDefaultState } from "~/constants/editor";
import type { EditorState, FrameStyle } from "~/types/editor";

const HASH_PREFIX = "#s=";
const MAX_HASH_LENGTH = 24_000;
const MAX_CODE_LENGTH = 30_000;
const MAX_JSON_LENGTH = 42_000;
const FRAMES = new Set<FrameStyle>(["dots", "minimal", "windows"]);
const LANGUAGE_VALUES = new Set<string>(LANGUAGES);
const THEME_VALUES = new Set(THEMES.map(({ value }) => value));
const BACKGROUND_VALUES = new Set<string>(BACKGROUNDS.map(({ id }) => id));

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function safeString(value: unknown, fallback: string, maxLength: number): string {
  return typeof value === "string" ? value.slice(0, maxLength) : fallback;
}

function safeNumber(value: unknown, fallback: number, min: number, max: number): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, value));
}

export function sanitizeEditorState(value: unknown): EditorState {
  const defaults = createDefaultState();
  if (!isRecord(value)) return defaults;

  const language = safeString(value.language, defaults.language, 24);
  const theme = safeString(value.theme, defaults.theme, 32);
  const background = safeString(value.background, defaults.background, 24);
  const frame = safeString(value.frame, defaults.frame, 16);

  return {
    code: safeString(value.code, defaults.code, MAX_CODE_LENGTH),
    title: safeString(value.title, defaults.title, 80),
    language: LANGUAGE_VALUES.has(language) ? language : defaults.language,
    theme: THEME_VALUES.has(theme) ? theme : defaults.theme,
    background: BACKGROUND_VALUES.has(background)
      ? (background as EditorState["background"])
      : defaults.background,
    frame: FRAMES.has(frame as FrameStyle) ? (frame as FrameStyle) : defaults.frame,
    padding: safeNumber(value.padding, defaults.padding, 24, 120),
    backgroundScale: safeNumber(value.backgroundScale, defaults.backgroundScale, 1, 1.6),
    blur: safeNumber(value.blur, defaults.blur, 0, 40),
    panelOpacity: safeNumber(value.panelOpacity, defaults.panelOpacity, 0.45, 1),
    fontSize: safeNumber(value.fontSize, defaults.fontSize, 12, 24),
    lineNumbers: typeof value.lineNumbers === "boolean" ? value.lineNumbers : defaults.lineNumbers,
  };
}

export function encodeEditorState(state: EditorState): string {
  const safeState = sanitizeEditorState(state);
  const encoded = compressToEncodedURIComponent(JSON.stringify(safeState));
  if (encoded.length > MAX_HASH_LENGTH) {
    throw new Error("This snippet is too large to fit safely in a shareable URL.");
  }
  return `${HASH_PREFIX}${encoded}`;
}

export function decodeEditorState(hash: string): EditorState | null {
  if (!hash.startsWith(HASH_PREFIX) || hash.length > MAX_HASH_LENGTH + HASH_PREFIX.length) {
    return null;
  }

  const encoded = hash.slice(HASH_PREFIX.length);
  if (!encoded || !/^[A-Za-z0-9+\-$]+$/.test(encoded)) return null;

  try {
    const json = decompressFromEncodedURIComponent(encoded);
    if (!json || json.length > MAX_JSON_LENGTH) return null;
    return sanitizeEditorState(JSON.parse(json) as unknown);
  } catch {
    return null;
  }
}

export function getShareUrl(state: EditorState): string {
  const url = new URL(window.location.href);
  url.hash = encodeEditorState(state);
  return url.toString();
}
