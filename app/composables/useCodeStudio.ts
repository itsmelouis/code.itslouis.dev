import { createDefaultState } from "~/constants/editor";
import { decodeEditorState, sanitizeEditorState } from "~/utils/share-state";

const STORAGE_KEY = "code.itslouis.dev:editor:v1";

export function useCodeStudio() {
  const state = reactive(createDefaultState());
  const customBackground = ref<string | null>(null);
  const ready = ref(false);
  let saveTimer: ReturnType<typeof setTimeout> | undefined;

  function reset() {
    Object.assign(state, createDefaultState());
    customBackground.value = null;
  }

  function hydrate() {
    const sharedState = decodeEditorState(window.location.hash);
    if (sharedState) {
      Object.assign(state, sharedState);
      ready.value = true;
      return;
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        Object.assign(state, sanitizeEditorState(JSON.parse(stored) as unknown));
      }
    } catch {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // Storage can be unavailable in hardened browser contexts.
      }
    }
    ready.value = true;
  }

  onMounted(hydrate);

  watch(
    state,
    (value) => {
      if (!ready.value) return;
      clearTimeout(saveTimer);
      saveTimer = setTimeout(() => {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitizeEditorState(value)));
        } catch {
          // The editor remains fully usable when storage is blocked or full.
        }
      }, 250);
    },
    { deep: true },
  );

  onBeforeUnmount(() => clearTimeout(saveTimer));

  return {
    state,
    customBackground,
    ready: readonly(ready),
    reset,
  };
}
