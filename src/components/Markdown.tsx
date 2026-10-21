import type { ReactNode } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import { mediaUrl } from "@/lib/urls";

export type Alignment = "right" | "center" | "left";

/**
 * Renders article / case-study Markdown. Raw HTML in the source is ignored (react-markdown's default),
 * so content can never inject scripts. External links open in a new tab.
 *
 * Extras on top of Markdown:
 * - Alignment blocks written by the editor toolbar:
 *       :::center
 *       any Markdown…
 *       :::
 *   (also :::right and :::left).
 * - Every text block gets dir="auto", so an English paragraph inside an Arabic article (or the
 *   reverse) reads in its own direction.
 * - "# " inside content renders as <h2>: the page title is the only <h1> (one h1 per page for SEO).
 */
export function Markdown({ source }: { source: string }) {
  return (
    <div className="prose">
      {splitAlignedBlocks(source).map((block, index) =>
        block.align ? (
          <div key={index} className={`align-block align-${block.align}`}>
            <Render source={block.text} />
          </div>
        ) : (
          <Render key={index} source={block.text} />
        ),
      )}
    </div>
  );
}

function Render({ source }: { source: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[[rehypeHighlight, { detect: true, ignoreMissing: true }]]}
      components={components}
    >
      {source}
    </ReactMarkdown>
  );
}

const auto = (Tag: "p" | "h2" | "h3" | "h4" | "li" | "blockquote") =>
  function AutoDir({ children }: { children?: ReactNode }) {
    return <Tag dir="auto">{children}</Tag>;
  };

const components: Components = {
  h1: auto("h2"),
  h2: auto("h2"),
  h3: auto("h3"),
  h4: auto("h4"),
  p: auto("p"),
  li: auto("li"),
  blockquote: auto("blockquote"),
  a: ({ href, children }) => {
    const external = href?.startsWith("http");
    return (
      <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        {children}
      </a>
    );
  },
  img: ({ src, alt }) =>
    typeof src === "string" ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={mediaUrl(src) ?? src} alt={alt ?? ""} loading="lazy" />
    ) : null,
};

const OPEN = /^:::(right|center|left)\s*$/;
const CLOSE = /^:::\s*$/;
const FENCE = /^\s*(```|~~~)/;

/** Splits the source into plain and aligned blocks. Lines inside code fences are never treated as markers. */
export function splitAlignedBlocks(source: string): { align: Alignment | null; text: string }[] {
  const blocks: { align: Alignment | null; text: string }[] = [];
  let current: { align: Alignment | null; lines: string[] } = { align: null, lines: [] };
  let inFence = false;

  const flush = () => {
    const text = current.lines.join("\n");
    if (text.trim()) blocks.push({ align: current.align, text });
  };

  for (const line of source.split(/\r?\n/)) {
    if (FENCE.test(line)) inFence = !inFence;

    if (!inFence) {
      const open = current.align === null ? OPEN.exec(line.trim()) : null;
      if (open) {
        flush();
        current = { align: open[1] as Alignment, lines: [] };
        continue;
      }
      if (current.align !== null && CLOSE.test(line.trim())) {
        flush();
        current = { align: null, lines: [] };
        continue;
      }
    }
    current.lines.push(line);
  }
  flush();
  return blocks;
}
