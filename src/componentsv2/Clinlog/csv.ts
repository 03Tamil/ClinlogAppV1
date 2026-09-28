/** Minimal, dependency-free CSV builder + browser download. */
const escapeCell = (value: unknown) => {
  if (value === null || value === undefined) return "";
  const text = Array.isArray(value) ? value.join("; ") : String(value);
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

export const toCsv = (headers: unknown[], rows: unknown[][]) =>
  [headers, ...rows].map((row) => row.map(escapeCell).join(",")).join("\r\n");

export const downloadCsv = (fileName: string, csv: string) => {
  // BOM so Excel opens UTF-8 (e.g. en dashes, accented names) correctly.
  const blob = new Blob(["﻿", csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

export const dateStamp = () => new Date().toISOString().slice(0, 10);
