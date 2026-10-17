import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import { mediaUrl } from "@/lib/urls";

/**
 * Renders article / case-study Markdown. Raw HTML in the source is ignored (react-markdown's default),
 * so content can never inject scripts. External links open in a new tab.
 */
export function Markdown({ source }: { source: string }) {
  return (
    <div className="prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[[rehypeHighlight, { detect: true, ignoreMissing: true }]]}
        components={{
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
        }}
      >
        {source}
      </ReactMarkdown>
    </div>
  );
}
