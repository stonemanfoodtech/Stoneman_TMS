/** Saves a Blob as a file in the browser. */
export function saveBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function filenameFromDisposition(header, fallback) {
  const match = /filename="?([^"]+)"?/i.exec(header || '');
  return match ? match[1] : fallback;
}
