/**
 * Serializes structured data for a <script type="application/ld+json"> tag.
 * JSON.stringify alone leaves "<" as is, so a title containing "</script>" would end the tag early
 * and let the rest run as HTML. Escaping <, > and & keeps every value inside the JSON.
 */
export function toJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}
