export type FrameStyle = "dots" | "minimal" | "windows";
export type BackgroundId = "night-train" | "signal-glow" | "blue-hour";

export interface EditorState {
  code: string;
  title: string;
  language: string;
  theme: string;
  background: BackgroundId;
  frame: FrameStyle;
  padding: number;
  backgroundScale: number;
  blur: number;
  panelOpacity: number;
  fontSize: number;
  lineNumbers: boolean;
}

export interface ThemeOption {
  label: string;
  value: string;
}

export interface BackgroundOption {
  id: BackgroundId;
  label: string;
  src: string;
  color: string;
}
