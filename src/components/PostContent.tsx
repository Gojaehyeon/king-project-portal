import { Fragment } from "react";

export function PostContent({ markdown }: { markdown: string }) {
  const blocks = markdown.split(/\n\n+/);

  return (
    <div className="space-y-5 text-sm leading-relaxed text-zinc-300 sm:text-base">
      {blocks.map((raw, i) => {
        const block = raw.trim();
        if (!block) return null;

        if (block.startsWith("## ")) {
          return (
            <h2 key={i} className="mt-8 text-xl font-semibold text-zinc-100 sm:text-2xl">
              {block.slice(3)}
            </h2>
          );
        }

        if (block.startsWith("- ")) {
          const items = block.split("\n").map((line) => line.replace(/^- /, ""));
          return (
            <ul key={i} className="list-inside list-disc space-y-1.5 text-zinc-300">
              {items.map((it, j) => (
                <li key={j}>{renderInline(it)}</li>
              ))}
            </ul>
          );
        }

        return (
          <p key={i} className="whitespace-pre-line text-zinc-300">
            {renderInline(block)}
          </p>
        );
      })}
    </div>
  );
}

function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-zinc-100">
          {p.slice(2, -2)}
        </strong>
      );
    }
    return <Fragment key={i}>{p}</Fragment>;
  });
}
