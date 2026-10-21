"use client";

import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { Markdown, type Alignment } from "@/components/Markdown";
import { inputClass } from "./ui";

/**
 * Markdown textarea with a formatting toolbar and a preview tab that uses the exact renderer of the
 * public site. Toolbar edits go through the browser's own text insertion, so Ctrl+Z still undoes them.
 */
export function MarkdownEditor({
  id,
  value,
  onChange,
  dir,
  rows = 18,
  error,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  dir: "rtl" | "ltr";
  rows?: number;
  error?: string;
}) {
  const [preview, setPreview] = useState(false);
  const ref = useRef<HTMLTextAreaElement>(null);
  const ar = dir === "rtl";

  /** Replaces [start, end) with text and then selects [selStart, selEnd) (absolute positions). */
  function replace(start: number, end: number, text: string, selStart: number, selEnd: number) {
    const ta = ref.current;
    if (!ta) return;
    ta.focus();
    ta.setSelectionRange(start, end);
    const inserted = typeof document.execCommand === "function" && document.execCommand("insertText", false, text);
    if (!inserted) {
      ta.setRangeText(text, start, end, "end");
      onChange(ta.value);
    }
    requestAnimationFrame(() => ta.setSelectionRange(selStart, selEnd));
  }

  /** The full lines touched by the current selection. */
  function selectedLines() {
    const ta = ref.current!;
    const text = ta.value;
    const { selectionStart: s, selectionEnd: e } = ta;
    const start = text.lastIndexOf("\n", s - 1) + 1;
    // A selection that ends right after a line break doesn't include the next line.
    const anchor = e > s && text[e - 1] === "\n" ? e - 1 : e;
    let end = text.indexOf("\n", anchor);
    if (end === -1) end = text.length;
    return { start, end, lines: text.slice(start, end).split("\n") };
  }

  function heading(level: 2 | 3 | 4) {
    const { start, end, lines } = selectedLines();
    const prefix = "#".repeat(level) + " ";
    const allSame = lines.every((l) => l.startsWith(prefix));
    const next = lines.map((l) => {
      const bare = l.replace(/^#{1,6}\s+/, "");
      return allSame ? bare : prefix + bare;
    });
    const text = next.join("\n");
    replace(start, end, text, start, start + text.length);
  }

  function list(kind: "bullet" | "number") {
    const { start, end, lines } = selectedLines();
    const isBullet = (l: string) => /^\s*[-*]\s+/.test(l);
    const isNumber = (l: string) => /^\s*\d+[.)]\s+/.test(l);
    const already = lines.filter((l) => l.trim()).every(kind === "bullet" ? isBullet : isNumber);
    let n = 0;
    const next = lines.map((l) => {
      const bare = l.replace(/^\s*([-*]|\d+[.)])\s+/, "");
      if (already || !l.trim()) return already ? bare : l;
      n += 1;
      return (kind === "bullet" ? "- " : `${n}. `) + bare;
    });
    const text = next.join("\n");
    replace(start, end, text, start, start + text.length);
  }

  function align(to: Alignment) {
    const { start, end, lines } = selectedLines();
    const ta = ref.current!;
    const before = ta.value.slice(0, start);
    const after = ta.value.slice(end);

    // Already inside a block of this kind right around the selection → remove the markers.
    const openLine = before.replace(/\n$/, "").split("\n").pop() ?? "";
    const closeLine = after.replace(/^\n/, "").split("\n")[0] ?? "";
    if (/^:::(right|center|left)\s*$/.test(openLine.trim()) && /^:::\s*$/.test(closeLine.trim())) {
      const blockStart = start - openLine.length - 1;
      const blockEnd = end + 1 + closeLine.length;
      const inner = lines.join("\n");
      const replaced = openLine.trim() === `:::${to}` ? inner : `:::${to}\n${inner}\n:::`;
      replace(Math.max(0, blockStart), blockEnd, replaced, Math.max(0, blockStart), Math.max(0, blockStart) + replaced.length);
      return;
    }

    const inner = lines.join("\n") || (ar ? "النص هنا" : "Your text here");
    const lead = start > 0 && !before.endsWith("\n\n") ? (before.endsWith("\n") ? "\n" : "\n\n") : "";
    const trail = after.startsWith("\n\n") || after === "" ? "" : after.startsWith("\n") ? "\n" : "\n\n";
    const text = `${lead}:::${to}\n${inner}\n:::${trail}`;
    const innerStart = start + lead.length + `:::${to}\n`.length;
    replace(start, end, text, innerStart, innerStart + inner.length);
  }

  function wrap(marker: string, placeholder: string) {
    const ta = ref.current!;
    const { selectionStart: s, selectionEnd: e } = ta;
    const selected = ta.value.slice(s, e) || placeholder;
    const text = `${marker}${selected}${marker}`;
    replace(s, e, text, s + marker.length, s + marker.length + selected.length);
  }

  function link() {
    const ta = ref.current!;
    const { selectionStart: s, selectionEnd: e } = ta;
    const entered = window.prompt(ar ? "عنوان الرابط (URL):" : "Link address (URL):", "https://");
    if (!entered || entered.trim() === "https://") return;

    let url = entered.trim();
    if (!/^(https?:\/\/|\/|#|mailto:)/i.test(url)) url = `https://${url}`;
    if (/[\s()]/.test(url)) url = encodeURI(url).replace(/\(/g, "%28").replace(/\)/g, "%29");

    const label = ta.value.slice(s, e) || (ar ? "نص الرابط" : "link text");
    const text = `[${label}](${url})`;
    replace(s, e, text, s + 1, s + 1 + label.length);
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (!(e.ctrlKey || e.metaKey)) return;
    const key = e.key.toLowerCase();
    if (key === "b") {
      e.preventDefault();
      wrap("**", ar ? "نص عريض" : "bold text");
    } else if (key === "k") {
      e.preventDefault();
      link();
    }
  }

  const tools: { label: string; title: string; run: () => void; icon: ReactNode; sep?: boolean }[] = [
    { label: "H2", title: ar ? "عنوان رئيسي (H2)" : "Heading (H2)", run: () => heading(2), icon: <Text>H2</Text> },
    { label: "H3", title: ar ? "عنوان فرعي (H3)" : "Subheading (H3)", run: () => heading(3), icon: <Text>H3</Text> },
    { label: "H4", title: ar ? "عنوان صغير (H4)" : "Small heading (H4)", run: () => heading(4), icon: <Text>H4</Text>, sep: true },
    { label: "B", title: ar ? "عريض (Ctrl+B)" : "Bold (Ctrl+B)", run: () => wrap("**", ar ? "نص عريض" : "bold text"), icon: <Text bold>B</Text> },
    { label: "link", title: ar ? "رابط (Ctrl+K)" : "Link (Ctrl+K)", run: link, icon: <LinkIcon />, sep: true },
    { label: "ul", title: ar ? "قائمة نقطية" : "Bulleted list", run: () => list("bullet"), icon: <BulletIcon /> },
    { label: "ol", title: ar ? "قائمة مرقّمة" : "Numbered list", run: () => list("number"), icon: <NumberIcon />, sep: true },
    { label: "right", title: ar ? "محاذاة لليمين" : "Align right", run: () => align("right"), icon: <AlignIcon to="right" /> },
    { label: "center", title: ar ? "توسيط" : "Center", run: () => align("center"), icon: <AlignIcon to="center" /> },
    { label: "left", title: ar ? "محاذاة لليسار" : "Align left", run: () => align("left"), icon: <AlignIcon to="left" /> },
  ];

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div role="tablist" className="flex gap-1 text-sm">
          {[
            { key: false, label: ar ? "كتابة" : "Write" },
            { key: true, label: ar ? "معاينة" : "Preview" },
          ].map((tab) => (
            <button
              key={String(tab.key)}
              type="button"
              role="tab"
              aria-selected={preview === tab.key}
              onClick={() => setPreview(tab.key)}
              className={`rounded px-3 py-1 ${preview === tab.key ? "bg-accent/15 text-accent" : "text-slate hover:text-ink"}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {!preview && (
          <div role="toolbar" aria-label={ar ? "أدوات التنسيق" : "Formatting"} aria-controls={id} className="flex flex-wrap items-center gap-0.5" dir="ltr">
            {tools.map((tool) => (
              <span key={tool.label} className="flex items-center">
                <button
                  type="button"
                  title={tool.title}
                  aria-label={tool.title}
                  onMouseDown={(e) => e.preventDefault()} // keep the textarea selection
                  onClick={tool.run}
                  className="grid h-8 min-w-8 place-items-center rounded px-1.5 text-slate transition-colors hover:bg-ink/10 hover:text-ink"
                >
                  {tool.icon}
                </button>
                {tool.sep && <span aria-hidden className="mx-1 h-5 w-px bg-line" />}
              </span>
            ))}
          </div>
        )}
      </div>

      {preview ? (
        <div dir={dir} className="min-h-40 rounded-md border border-line bg-surface p-4">
          {value.trim() ? <Markdown source={value} /> : <p className="text-slate">{ar ? "لا يوجد محتوى للمعاينة." : "Nothing to preview."}</p>}
        </div>
      ) : (
        <textarea
          ref={ref}
          id={id}
          dir={dir}
          rows={rows}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          spellCheck
          className={`${inputClass(error)} text-sm leading-relaxed ${dir === "ltr" ? "font-mono" : ""}`}
        />
      )}
    </div>
  );
}

function Text({ children, bold }: { children: ReactNode; bold?: boolean }) {
  return <span className={`text-[0.8rem] leading-none ${bold ? "font-bold" : "font-semibold"}`}>{children}</span>;
}

const svg = { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, "aria-hidden": true };

function LinkIcon() {
  return (
    <svg {...svg}>
      <path d="M6.5 9.5l3-3" />
      <path d="M7 4.5l1.2-1.2a2.6 2.6 0 013.7 3.7L10.7 8.2" />
      <path d="M9 11.5l-1.2 1.2a2.6 2.6 0 01-3.7-3.7L5.3 7.8" />
    </svg>
  );
}

function BulletIcon() {
  return (
    <svg {...svg}>
      <circle cx="3" cy="4" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="3" cy="8" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="3" cy="12" r="0.9" fill="currentColor" stroke="none" />
      <path d="M6 4h8M6 8h8M6 12h8" />
    </svg>
  );
}

function NumberIcon() {
  return (
    <svg {...svg}>
      <path d="M2.5 3h1v3M2.3 6h1.6" strokeWidth={1.2} />
      <path d="M2.2 9.6c.3-.5 1.7-.6 1.7.3 0 .7-1.7 1.4-1.7 2.1h1.8" strokeWidth={1.2} />
      <path d="M6.5 4.5h7.5M6.5 11h7.5" />
    </svg>
  );
}

function AlignIcon({ to }: { to: Alignment }) {
  const short = to === "right" ? "M6 7.5h8" : to === "left" ? "M2 7.5h8" : "M4 7.5h8";
  const shortB = to === "right" ? "M6 13.5h8" : to === "left" ? "M2 13.5h8" : "M4 13.5h8";
  return (
    <svg {...svg}>
      <path d="M2 4.5h12" />
      <path d={short} />
      <path d="M2 10.5h12" />
      <path d={shortB} />
    </svg>
  );
}
