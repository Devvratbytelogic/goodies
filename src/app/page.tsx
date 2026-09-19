export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-xl space-y-6 text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-zinc-500">
          Next.js + Tailwind CSS
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-5xl">
          Goodies
        </h1>
        <p className="text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          A simple Next.js App Router project with Tailwind CSS v4 ready to go.
          Edit{" "}
          <code className="rounded-md bg-zinc-100 px-1.5 py-0.5 font-mono text-sm text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100">
            src/app/page.tsx
          </code>{" "}
          to get started.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <span className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900">
            Next.js 16
          </span>
          <span className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 dark:border-zinc-700 dark:text-zinc-300">
            Tailwind CSS v4
          </span>
          <span className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 dark:border-zinc-700 dark:text-zinc-300">
            TypeScript
          </span>
        </div>
      </div>
    </main>
  );
}
