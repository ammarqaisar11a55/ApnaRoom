"use client";

import { Button } from "@/components/ui/button";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 dark:bg-slate-950">
      <div className="max-w-lg rounded-2xl border border-red-200 bg-white p-6 shadow-card dark:border-red-900 dark:bg-slate-950">
        <p className="text-sm font-semibold text-red-600">Something broke</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">We could not load this view.</h1>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">{error.message}</p>
        <Button onClick={reset} className="mt-5">Try again</Button>
      </div>
    </main>
  );
}
