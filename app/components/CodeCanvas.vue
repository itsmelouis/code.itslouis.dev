<script setup lang="ts">
import { tokenize } from "rangi";

import { BACKGROUNDS, THEME_MAP } from "~/constants/editor";
import type { EditorState } from "~/types/editor";

const code = defineModel<string>("code", { required: true });
const title = defineModel<string>("title", { required: true });
const {
  language,
  theme,
  background,
  frame,
  padding,
  backgroundScale,
  blur,
  panelOpacity,
  fontSize,
  lineNumbers,
  customBackground = null,
} = defineProps<Omit<EditorState, "code" | "title"> & { customBackground?: string | null }>();
const emit = defineEmits<{ ready: [node: HTMLElement] }>();

const artboard = useTemplateRef<HTMLElement>("artboard");
const highlightScroll = useTemplateRef<HTMLElement>("highlight-scroll");

const selectedTheme = computed(() => THEME_MAP[theme] ?? THEME_MAP["tokyo-night"]!);
const highlightedTokens = computed(() => tokenize(code.value, { lang: language }));
const lines = computed(() => Array.from({ length: Math.max(1, code.value.split("\n").length) }));
const editorHeight = computed(() => {
  const lineHeight = fontSize * 1.7;
  return Math.min(680, Math.max(250, lines.value.length * lineHeight + 48));
});
const selectedBackground = computed(
  () => BACKGROUNDS.find(({ id }) => id === background) ?? BACKGROUNDS[0]!,
);
const backgroundUrl = computed(() => customBackground ?? selectedBackground.value.src);
const backgroundStyle = computed(() => ({
  backgroundImage: `url("${backgroundUrl.value}")`,
  transform: `scale(${backgroundScale})`,
}));
const artboardStyle = computed(() => ({
  padding: `${padding}px`,
  minHeight: `${editorHeight.value + padding * 2 + (frame === "minimal" ? 0 : 42)}px`,
}));
const panelStyle = computed(() => ({
  "--code-bg": selectedTheme.value.bg,
  "--code-fg": selectedTheme.value.fg,
  "--panel-opacity": panelOpacity,
  "--glass-blur": `${blur}px`,
  "--editor-font-size": `${fontSize}px`,
}));
const inputStyle = computed(() => ({
  height: `${editorHeight.value}px`,
  paddingLeft: lineNumbers ? "74px" : "24px",
}));

function tokenStyle(type?: string) {
  return type
    ? { color: selectedTheme.value.tokens[type as keyof typeof selectedTheme.value.tokens] }
    : undefined;
}

function syncScroll(event: Event) {
  const textarea = event.currentTarget as HTMLTextAreaElement;
  if (!highlightScroll.value) return;
  highlightScroll.value.scrollLeft = textarea.scrollLeft;
  highlightScroll.value.scrollTop = textarea.scrollTop;
}

function insertTab(event: KeyboardEvent) {
  if (event.key !== "Tab") return;
  event.preventDefault();
  const target = event.currentTarget as HTMLTextAreaElement;
  const start = target.selectionStart;
  const end = target.selectionEnd;
  code.value = `${target.value.slice(0, start)}  ${target.value.slice(end)}`;
  nextTick(() => {
    target.selectionStart = target.selectionEnd = start + 2;
  });
}

onMounted(() => {
  if (artboard.value) emit("ready", artboard.value);
});
</script>

<template>
  <section class="canvas-shell" aria-label="Editable code preview">
    <div ref="artboard" class="artboard" :style="artboardStyle">
      <div class="scene" :style="backgroundStyle" aria-hidden="true" />
      <div class="scene-vignette" aria-hidden="true" />

      <article class="code-window" :class="`frame-${frame}`" :style="panelStyle">
        <div class="panel-glass" />

        <header v-if="frame !== 'minimal'" class="window-bar">
          <div v-if="frame === 'dots'" class="traffic-lights" aria-hidden="true">
            <i class="traffic-red" />
            <i class="traffic-yellow" />
            <i class="traffic-green" />
          </div>
          <span class="title-mirror">{{ title || "untitled" }}</span>
          <input
            v-model="title"
            class="title-input"
            aria-label="Frame title"
            maxlength="80"
            autocomplete="off"
            spellcheck="false"
          />
          <div v-if="frame === 'windows'" class="window-actions" aria-hidden="true">
            <i />
            <i class="square" />
            <i class="close" />
          </div>
        </header>

        <div class="editor-body" :style="{ height: `${editorHeight}px` }">
          <div
            ref="highlight-scroll"
            class="highlight-scroll"
            :class="{ 'without-line-numbers': !lineNumbers }"
            aria-hidden="true"
          >
            <div v-if="lineNumbers" class="line-numbers">
              <span v-for="(_, index) in lines" :key="index">{{ index + 1 }}</span>
            </div>
            <pre class="highlight-code"><code><span
              v-for="(token, index) in highlightedTokens"
              :key="index"
              :class="{ comment: token.type === 'cmnt' }"
              :style="tokenStyle(token.type)"
            >{{ token.text }}</span></code></pre>
          </div>
          <textarea
            v-model="code"
            class="code-input"
            :style="inputStyle"
            aria-label="Code editor"
            autocapitalize="off"
            autocomplete="off"
            spellcheck="false"
            wrap="off"
            @keydown="insertTab"
            @scroll="syncScroll"
          />
        </div>
      </article>
    </div>
  </section>
</template>
