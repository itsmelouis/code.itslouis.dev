<script setup lang="ts">
import { BACKGROUNDS, LANGUAGES, THEMES } from "~/constants/editor";
import type { EditorState, FrameStyle } from "~/types/editor";

const state = defineModel<EditorState>({ required: true });
const {
  hasCustomBackground = false,
  busy = null,
  copied = false,
} = defineProps<{
  hasCustomBackground?: boolean;
  busy?: "png" | "svg" | "clipboard" | "share" | null;
  copied?: boolean;
}>();
const emit = defineEmits<{
  clearCustomBackground: [];
  copyImage: [];
  export: [format: "png" | "svg"];
  reset: [];
  share: [];
  upload: [];
}>();

const frames: Array<{ value: FrameStyle; label: string }> = [
  { value: "dots", label: "Mac" },
  { value: "minimal", label: "None" },
  { value: "windows", label: "Win" },
];

function chooseBackground(id: EditorState["background"]) {
  state.value.background = id;
  emit("clearCustomBackground");
}

function setNumber(
  key: "padding" | "backgroundScale" | "blur" | "panelOpacity" | "fontSize",
  event: Event,
  min: number,
  max: number,
) {
  const value = Number.parseFloat((event.currentTarget as HTMLInputElement).value);
  if (Number.isFinite(value)) state.value[key] = Math.min(max, Math.max(min, value));
}
</script>

<template>
  <aside class="toolbar" aria-label="Editor tools">
    <div class="background-picker" aria-label="Background">
      <Icon name="lucide:image" class="size-4.25" />
      <button
        v-for="item in BACKGROUNDS"
        :key="item.id"
        class="background-swatch"
        :class="{ active: !hasCustomBackground && state.background === item.id }"
        type="button"
        :aria-label="item.label"
        @click="chooseBackground(item.id)"
      >
        <img :src="item.src" alt="" />
      </button>
      <button
        class="background-swatch upload-swatch"
        :class="{ active: hasCustomBackground }"
        type="button"
        aria-label="Upload background"
        @click="emit('upload')"
      >
        <Icon name="lucide:upload" class="size-3.75" />
      </button>
    </div>

    <span class="tool-separator" />

    <label class="compact-field">
      <span>Scale</span>
      <input
        :value="state.backgroundScale"
        type="number"
        min="1"
        max="1.6"
        step="0.05"
        @input="setNumber('backgroundScale', $event, 1, 1.6)"
      />
    </label>
    <label class="compact-field">
      <span>Spacing</span>
      <input
        :value="state.padding"
        type="number"
        min="24"
        max="120"
        step="2"
        @input="setNumber('padding', $event, 24, 120)"
      />
    </label>
    <label class="compact-field">
      <span>Blur</span>
      <input
        :value="state.blur"
        type="number"
        min="0"
        max="40"
        step="1"
        @input="setNumber('blur', $event, 0, 40)"
      />
    </label>
    <label class="compact-field opacity-field">
      <span>Opacity</span>
      <input
        :value="state.panelOpacity"
        type="range"
        min="0.45"
        max="1"
        step="0.01"
        @input="setNumber('panelOpacity', $event, 0.45, 1)"
      />
    </label>
    <label class="compact-field">
      <span>Size</span>
      <input
        :value="state.fontSize"
        type="number"
        min="12"
        max="24"
        step="1"
        @input="setNumber('fontSize', $event, 12, 24)"
      />
    </label>

    <div class="frame-picker" aria-label="Window frame">
      <span>Layout</span>
      <div>
        <button
          v-for="frame in frames"
          :key="frame.value"
          type="button"
          :class="{ active: state.frame === frame.value }"
          :aria-pressed="state.frame === frame.value"
          @click="state.frame = frame.value"
        >
          {{ frame.label }}
        </button>
      </div>
    </div>

    <button
      class="tool-icon"
      :class="{ active: state.lineNumbers }"
      type="button"
      title="Toggle line numbers"
      :aria-pressed="state.lineNumbers"
      @click="state.lineNumbers = !state.lineNumbers"
    >
      <Icon name="lucide:hash" class="size-4.5" />
    </button>

    <label class="compact-field select-field">
      <span>Language</span>
      <select v-model="state.language">
        <option v-for="language in LANGUAGES" :key="language" :value="language">
          {{ language.toUpperCase() }}
        </option>
      </select>
    </label>
    <label class="compact-field select-field theme-field">
      <span>Theme</span>
      <select v-model="state.theme">
        <option v-for="theme in THEMES" :key="theme.value" :value="theme.value">
          {{ theme.label }}
        </option>
      </select>
    </label>

    <span class="tool-separator" />

    <button
      class="tool-icon"
      type="button"
      title="Reset"
      aria-label="Reset editor"
      @click="emit('reset')"
    >
      <Icon name="lucide:rotate-ccw" class="size-4.5" />
    </button>
    <button
      class="tool-icon"
      type="button"
      :disabled="Boolean(busy)"
      title="Share"
      aria-label="Copy share link"
      @click="emit('share')"
    >
      <Icon v-if="busy === 'share'" name="lucide:loader-circle" class="spin size-4.5" />
      <Icon v-else-if="copied" name="lucide:check" class="size-4.5" />
      <Icon v-else name="lucide:share-2" class="size-4.5" />
    </button>
    <button
      class="tool-icon"
      type="button"
      :disabled="Boolean(busy)"
      title="Copy image"
      aria-label="Copy image"
      @click="emit('copyImage')"
    >
      <Icon v-if="busy === 'clipboard'" name="lucide:loader-circle" class="spin size-4.5" />
      <Icon v-else name="lucide:clipboard" class="size-4.5" />
    </button>

    <button
      class="export-button"
      type="button"
      :disabled="Boolean(busy)"
      @click="emit('export', 'png')"
    >
      <Icon v-if="busy === 'png'" name="lucide:loader-circle" class="spin size-4.25" />
      <Icon v-else name="lucide:download" class="size-4.25" />
      PNG
    </button>
    <button
      class="export-button"
      type="button"
      :disabled="Boolean(busy)"
      @click="emit('export', 'svg')"
    >
      <Icon v-if="busy === 'svg'" name="lucide:loader-circle" class="spin size-4.25" />
      <Icon v-else name="lucide:download" class="size-4.25" />
      SVG
    </button>
  </aside>
</template>
