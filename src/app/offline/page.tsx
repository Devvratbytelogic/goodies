import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Offline",
  description: "You are offline. Reconnect to continue shopping.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function OfflinePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-xl space-y-6 text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-zinc-500">
          No connection
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-5xl">
          You’re offline
        </h1>
        <p className="text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          Goodies can’t reach the network right now. Check your connection and
          try again.
        </p>
        <a
          href="/"
          className="inline-flex rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
        >
          Try again
        </a>
      </div>
    </main>
  );
}
