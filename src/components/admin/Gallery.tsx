"use client";

import { useRef, useState } from "react";
import { api } from "@/lib/admin/client";
import { errorMessage, fieldErrors } from "@/lib/admin/messages";
import type { ProjectImage } from "@/lib/admin/types";
import { mediaUrl } from "@/lib/urls";
import { ACCEPTED_IMAGES } from "./CoverImage";
import { Button, inputClass } from "./ui";

const MAX_IMAGES = 20;

/** Project gallery: upload several images, edit alt text, reorder, delete. */
export function Gallery({
  projectId,
  images,
  onChange,
  onMessage,
}: {
  projectId: number;
  images: ProjectImage[];
  onChange: (images: ProjectImage[]) => void;
  onMessage: (kind: "ok" | "error", text: string) => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const base = `/api/admin/projects/${projectId}/images`;
  const sorted = [...images].sort((a, b) => a.displayOrder - b.displayOrder);

  async function upload(files: FileList) {
    let current = sorted;
    const room = MAX_IMAGES - current.length;
    const list = Array.from(files).slice(0, room);
    let failed = false;
    for (const [index, file] of list.entries()) {
      setBusy(`جارٍ رفع ${index + 1} من ${list.length}…`);
      try {
        const form = new FormData();
        form.append("file", file);
        const image = await api.upload<ProjectImage>(base, form);
        current = [...current, image];
        onChange(current);
      } catch (error) {
        onMessage("error", `${file.name}: ${fieldErrors(error).Image ?? errorMessage(error)}`);
        failed = true;
        break;
      }
    }
    if (!failed) {
      if (files.length > room) onMessage("error", `الحد الأقصى ${MAX_IMAGES} صورة؛ لم تُرفع ${files.length - room} صورة.`);
      else onMessage("ok", list.length === 1 ? "تم رفع الصورة." : `تم رفع ${list.length} صور.`);
    }
    setBusy(null);
    if (input.current) input.current.value = "";
  }

  async function move(index: number, delta: number) {
    const next = [...sorted];
    const [item] = next.splice(index, 1);
    next.splice(index + delta, 0, item);
    const reordered = next.map((img, i) => ({ ...img, displayOrder: i }));
    onChange(reordered);
    try {
      await api.put(`${base}/order`, { orderedImageIds: reordered.map((i) => i.id) });
    } catch (error) {
      onChange(sorted);
      onMessage("error", errorMessage(error));
    }
  }

  async function remove(image: ProjectImage) {
    if (!confirm("حذف هذه الصورة نهائياً؟")) return;
    try {
      await api.del(`${base}/${image.id}`);
      onChange(sorted.filter((i) => i.id !== image.id).map((img, i) => ({ ...img, displayOrder: i })));
      onMessage("ok", "حُذفت الصورة.");
    } catch (error) {
      onMessage("error", errorMessage(error));
    }
  }

  async function saveAlt(image: ProjectImage, altAr: string, altEn: string) {
    try {
      await api.put(`${base}/${image.id}/alt`, { altAr, altEn });
      onChange(sorted.map((i) => (i.id === image.id ? { ...i, altAr, altEn } : i)));
      onMessage("ok", "حُفظ النص البديل.");
    } catch (error) {
      onMessage("error", errorMessage(error));
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <input
          ref={input}
          type="file"
          multiple
          accept={ACCEPTED_IMAGES}
          className="hidden"
          onChange={(e) => e.target.files?.length && upload(e.target.files)}
        />
        <Button onClick={() => input.current?.click()} disabled={!!busy || sorted.length >= MAX_IMAGES}>
          إضافة صور
        </Button>
        <span className="text-sm text-slate">
          {busy ?? `${sorted.length} من ${MAX_IMAGES}`}
        </span>
      </div>

      {sorted.length > 0 && (
        <ol className="mt-5 grid gap-4">
          {sorted.map((image, index) => (
            <GalleryItem
              key={image.id}
              image={image}
              first={index === 0}
              last={index === sorted.length - 1}
              onUp={() => move(index, -1)}
              onDown={() => move(index, 1)}
              onDelete={() => remove(image)}
              onSaveAlt={(ar, en) => saveAlt(image, ar, en)}
            />
          ))}
        </ol>
      )}
    </div>
  );
}

function GalleryItem({
  image,
  first,
  last,
  onUp,
  onDown,
  onDelete,
  onSaveAlt,
}: {
  image: ProjectImage;
  first: boolean;
  last: boolean;
  onUp: () => void;
  onDown: () => void;
  onDelete: () => void;
  onSaveAlt: (ar: string, en: string) => void;
}) {
  const [altAr, setAltAr] = useState(image.altAr);
  const [altEn, setAltEn] = useState(image.altEn);
  const dirty = altAr !== image.altAr || altEn !== image.altEn;

  return (
    <li className="grid gap-4 rounded-lg border border-line bg-surface p-3 sm:grid-cols-[10rem_1fr_auto]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={mediaUrl(image.url) ?? ""} alt="" className="aspect-[16/10] w-full rounded object-cover sm:w-40" />
      <div className="grid gap-2">
        <input value={altAr} onChange={(e) => setAltAr(e.target.value)} maxLength={250} placeholder="وصف الصورة بالعربية" aria-label="النص البديل بالعربية" className={inputClass()} />
        <input value={altEn} onChange={(e) => setAltEn(e.target.value)} maxLength={250} dir="ltr" placeholder="Image description in English" aria-label="English alt text" className={inputClass()} />
        {dirty && (
          <Button onClick={() => onSaveAlt(altAr, altEn)} className="justify-self-start">
            حفظ النص البديل
          </Button>
        )}
      </div>
      <div className="flex gap-2 sm:flex-col">
        <Button onClick={onUp} disabled={first} aria-label="تقديم">↑</Button>
        <Button onClick={onDown} disabled={last} aria-label="تأخير">↓</Button>
        <Button variant="danger" onClick={onDelete} aria-label="حذف">حذف</Button>
      </div>
    </li>
  );
}
