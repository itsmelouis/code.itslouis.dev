type ExportFormat = "png" | "svg";

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export async function renderImage(node: HTMLElement, format: ExportFormat): Promise<Blob> {
  const { toBlob, toSvg } = await import("html-to-image");
  const options = {
    cacheBust: true,
    pixelRatio: format === "png" ? 3 : 1,
    backgroundColor: "#0b0c12",
  };

  if (format === "png") {
    const blob = await toBlob(node, options);
    if (!blob) throw new Error("Could not prepare the image.");
    return blob;
  }

  const prefix = "data:image/svg+xml;charset=utf-8,";
  const dataUrl = await toSvg(node, options);
  if (!dataUrl.startsWith(prefix)) throw new Error("Could not prepare the image.");
  return new Blob([decodeURIComponent(dataUrl.slice(prefix.length))], {
    type: "image/svg+xml;charset=utf-8",
  });
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
