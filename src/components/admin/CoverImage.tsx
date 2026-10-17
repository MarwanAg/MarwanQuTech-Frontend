"use client";

import { useRef, useState } from "react";
import { api } from "@/lib/admin/client";
import { errorMessage, fieldErrors } from "@/lib/admin/messages";
import { mediaUrl } from "@/lib/urls";
import { Button } from "./ui";

export const ACCEPTED_IMAGES = "image/jpeg,image/png,image/webp,image/gif";

/** Cover image of a project or article: upload / replace / remove. Converted to WebP by the API. */
export function CoverImage({
  endpoint,
  url,
  onChange,
  onMessage,
}: {
  endpoint: string; // e.g. /api/admin/projects/5/cover
  url: string | null;
  onChange: (url: string | null) => void;
  onMessage: (kind: "ok" | "error", text: string) => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const src = mediaUrl(url);

  async function upload(file: File) {
    setBusy(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const result = await api.upload<{ url: string }>(endpoint, form, "PUT");
      onChange(result.url);
      onMessage("ok", "تم رفع صورة الغلاف.");
    } catch (error) {
      onMessage("error", fieldErrors(error).Image ?? errorMessage(error));
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  }

  async function remove() {
    if (!confirm("حذف صورة الغلاف؟")) return;
    setBusy(true);
    try {
      await api.del(endpoint);
      onChange(null);
      onMessage("ok", "حُذفت صورة الغلاف.");
    } catch (error) {
      onMessage("error", errorMessage(error));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-5">
      <div className="aspect-[16/10] w-56 overflow-hidden rounded-md border border-line bg-code">
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt="" className="size-full object-cover" />
        ) : (
          <div className="flex size-full items-center justify-center text-sm text-slate">بلا غلاف</div>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        <input
          ref={input}
          type="file"
          accept={ACCEPTED_IMAGES}
          className="hidden"
          onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
        />
        <Button onClick={() => input.current?.click()} disabled={busy}>
          {busy ? "جارٍ الرفع…" : src ? "تغيير الغلاف" : "رفع غلاف"}
        </Button>
        {src && (
          <Button variant="danger" onClick={remove} disabled={busy}>
            حذف الغلاف
          </Button>
        )}
      </div>
      <p className="w-full text-sm text-slate">JPG أو PNG أو WebP، حتى 5 ميغابايت. تُحوَّل تلقائياً إلى WebP.</p>
    </div>
  );
}
