type ExportFormat = "png" | "svg";

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

async function dataUrlToBlob(dataUrl: string): Promise<Blob> {
  const response = await fetch(dataUrl);
  if (!response.ok) throw new Error("Could not prepare the image.");
  return response.blob();
}

export async function renderImage(node: HTMLElement, format: ExportFormat): Promise<Blob> {
  const { toPng, toSvg } = await import("html-to-image");
  const options = {
    cacheBust: true,
    pixelRatio: format === "png" ? 3 : 1,
    backgroundColor: "#0b0c12",
  };
  const dataUrl = format === "png" ? await toPng(node, options) : await toSvg(node, options);
  return dataUrlToBlob(dataUrl);
}

export async function downloadImage(node: HTMLElement, format: ExportFormat) {
  const blob = await renderImage(node, format);
  downloadBlob(blob, `code-frame.${format}`);
}

export async function copyImage(node: HTMLElement) {
  if (!navigator.clipboard || typeof ClipboardItem === "undefined") {
    throw new Error("Image clipboard access is not supported by this browser.");
  }

  const blob = await renderImage(node, "png");
  await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
}
