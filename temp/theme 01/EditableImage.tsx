"use client";

import { ImageIcon, Link2, Upload } from "lucide-react";
import { ChangeEvent, useEffect, useId, useState } from "react";
import { cn } from "@/lib/utils";

export function EditableImage({
  src,
  label,
  aspectRatio = "16 / 10",
  placeholderText = "Paste an image URL or upload a file",
  className,
}: {
  src?: string;
  label: string;
  aspectRatio?: string;
  placeholderText?: string;
  className?: string;
}) {
  const [preview, setPreview] = useState(src ?? "");
  const [urlInput, setUrlInput] = useState(src ?? "");
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [objectUrl]);

  const inputId = useId();

  function handleUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (objectUrl) URL.revokeObjectURL(objectUrl);
    const nextUrl = URL.createObjectURL(file);
    setObjectUrl(nextUrl);
    setPreview(nextUrl);
    setUrlInput("");
  }

  function applyUrl() {
    const nextUrl = urlInput.trim();
    if (!nextUrl) return;
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
      setObjectUrl(null);
    }
    setPreview(nextUrl);
  }

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-[24px] border border-[#E5E5E5] bg-[#F8F8F7] premium-shadow",
        className,
      )}
      style={{ aspectRatio }}
    >
      {preview ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={preview} alt={label} className="h-full w-full object-cover" />
      ) : (
        <div className="soft-grid flex h-full w-full flex-col items-center justify-center px-6 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#E5E5E5] bg-white shadow-sm">
            <ImageIcon className="h-6 w-6 text-[#111111]" aria-hidden="true" />
          </div>
          <p className="text-sm font-semibold text-[#111111]">{label}</p>
          <p className="mt-2 max-w-xs text-sm leading-6 text-[#666666]">{placeholderText}</p>
        </div>
      )}

      <div className="absolute inset-x-3 bottom-3 rounded-[18px] border border-white/70 bg-white/92 p-3 shadow-lg backdrop-blur transition duration-300 sm:translate-y-2 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100">
        <label className="mb-2 block text-xs font-semibold text-[#111111]" htmlFor={`${inputId}-url`}>
          {label}
        </label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative min-w-0 flex-1">
            <Link2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#666666]" />
            <input
              id={`${inputId}-url`}
              value={urlInput}
              onChange={(event) => setUrlInput(event.target.value)}
              onBlur={applyUrl}
              onKeyDown={(event) => {
                if (event.key === "Enter") applyUrl();
              }}
              placeholder="Paste image URL"
              className="h-10 w-full rounded-xl border border-[#E5E5E5] bg-white pl-9 pr-3 text-sm text-[#111111] outline-none transition focus:border-[#0A66C2]"
            />
          </div>
          <label
            htmlFor={inputId}
            className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#111111] px-4 text-sm font-semibold text-white transition hover:bg-[#0A66C2]"
          >
            <Upload className="h-4 w-4" aria-hidden="true" />
            Upload
          </label>
          <input id={inputId} type="file" accept="image/*" onChange={handleUpload} className="sr-only" />
        </div>
      </div>
    </div>
  );
}
