import { marked } from "marked";

marked.setOptions({ gfm: true, breaks: true });

export function markdownToHtml(value: string) {
  return marked.parse(value, { async: false }) as string;
}
