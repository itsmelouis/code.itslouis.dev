<script setup lang="ts">
import { copyImage, downloadImage } from "~/utils/export-image";
import { getShareUrl } from "~/utils/share-state";

const { state, customBackground, ready, reset } = useCodeStudio();
const fileInput = useTemplateRef<HTMLInputElement>("file-input");
const captureNode = shallowRef<HTMLElement | null>(null);
const busy = ref<"png" | "svg" | "clipboard" | "share" | null>(null);
const copied = ref(false);
const toast = ref<{ message: string; tone: "success" | "error" } | null>(null);
let toastTimer: ReturnType<typeof setTimeout> | undefined;
let copiedTimer: ReturnType<typeof setTimeout> | undefined;

useHead({
  title: "Beautiful code frames",
  meta: [
    {
      name: "description",
      content: "Turn code into cinematic, shareable images directly in your browser.",
    },
    { name: "theme-color", content: "#0b0c12" },
  ],
});

function notify(message: string, tone: "success" | "error" = "success") {
  clearTimeout(toastTimer);
  toast.value = { message, tone };
  toastTimer = setTimeout(() => (toast.value = null), 3600);
}

async function runExport(format: "png" | "svg") {
  if (!captureNode.value) return;
  busy.value = format;
  try {
    await downloadImage(captureNode.value, format);
    notify(`${format.toUpperCase()} exported.`);
  } catch (error) {
    notify(error instanceof Error ? error.message : "The export failed.", "error");
  } finally {
    busy.value = null;
  }
}

async function copyRenderedImage() {
  if (!captureNode.value) return;
  busy.value = "clipboard";
  try {
    await copyImage(captureNode.value);
    notify("PNG bytes copied to your clipboard.");
  } catch (error) {
    notify(error instanceof Error ? error.message : "Could not copy the image.", "error");
  } finally {
    busy.value = null;
  }
}

async function share() {
  busy.value = "share";
  try {
    const url = getShareUrl(state);
    window.history.replaceState(null, "", url);
    await navigator.clipboard.writeText(url);
    copied.value = true;
    clearTimeout(copiedTimer);
    copiedTimer = setTimeout(() => (copied.value = false), 2200);
    notify(
      customBackground.value
        ? "Link copied. Custom uploads are replaced by the selected preset."
        : "Share link copied.",
    );
  } catch (error) {
    notify(error instanceof Error ? error.message : "Could not create the share link.", "error");
  } finally {
    busy.value = null;
  }
}

function openFilePicker() {
  fileInput.value?.click();
}

function hasValidImageSignature(bytes: Uint8Array, type: string) {
  if (type === "image/png") {
    return [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a].every(
      (byte, index) => bytes[index] === byte,
    );
  }
  if (type === "image/jpeg") {
    return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  }
  return (
    type === "image/webp" &&
    new TextDecoder().decode(bytes.slice(0, 4)) === "RIFF" &&
    new TextDecoder().decode(bytes.slice(8, 12)) === "WEBP"
  );
}

async function loadCustomBackground(event: Event) {
  const input = event.currentTarget as HTMLInputElement;
  const file = input.files?.[0];
  input.value = "";
  if (!file) return;

  const allowedTypes = new Set(["image/png", "image/jpeg", "image/webp"]);
  if (!allowedTypes.has(file.type) || file.size > 5 * 1024 * 1024) {
    notify("Choose a PNG, JPEG, or WebP image under 5 MB.", "error");
    return;
  }

  try {
    const signature = new Uint8Array(await file.slice(0, 12).arrayBuffer());
    if (!hasValidImageSignature(signature, file.type)) {
      throw new Error("The file content does not match its image type.");
    }

    const bitmap = await createImageBitmap(file);
    const pixelCount = bitmap.width * bitmap.height;
    bitmap.close();
    if (pixelCount > 32_000_000) {
      throw new Error("The image dimensions are too large.");
    }

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      if (
        typeof reader.result !== "string" ||
        !reader.result.startsWith(`data:${file.type};base64,`)
      ) {
        notify("The image could not be validated.", "error");
        return;
      }
      customBackground.value = reader.result;
      notify("Custom background loaded locally.");
    });
    reader.addEventListener("error", () => notify("The image could not be read.", "error"));
    reader.readAsDataURL(file);
  } catch (error) {
    notify(error instanceof Error ? error.message : "The image could not be validated.", "error");
  }
}

onBeforeUnmount(() => {
  clearTimeout(toastTimer);
  clearTimeout(copiedTimer);
});
</script>

<template>
  <div class="app-root" :class="{ ready }">
    <NuxtRouteAnnouncer />

    <main class="studio bg-graphite-50 dark:bg-graphite-950">
      <CodeCanvas
        v-model:code="state.code"
        v-model:title="state.title"
        :language="state.language"
        :theme="state.theme"
        :background="state.background"
        :frame="state.frame"
        :padding="state.padding"
        :background-scale="state.backgroundScale"
        :blur="state.blur"
        :panel-opacity="state.panelOpacity"
        :font-size="state.fontSize"
        :line-numbers="state.lineNumbers"
        :custom-background
        @ready="captureNode = $event"
      />
    </main>

    <EditorControls
      v-model="state"
      :has-custom-background="Boolean(customBackground)"
      :busy
      :copied
      @clear-custom-background="customBackground = null"
      @copy-image="copyRenderedImage"
      @export="runExport"
      @reset="reset"
      @share="share"
      @upload="openFilePicker"
    />

    <input
      ref="file-input"
      class="visually-hidden"
      type="file"
      accept="image/png,image/jpeg,image/webp"
      @change="loadCustomBackground"
    />

    <Transition name="toast">
      <div v-if="toast" class="toast" :class="toast.tone" role="status" aria-live="polite">
        {{ toast.message }}
      </div>
    </Transition>
  </div>
</template>
