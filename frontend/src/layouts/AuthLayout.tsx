import { Building2 } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      <div className="min-h-screen">
        <section className="flex items-center justify-center bg-slate-50 px-5 py-10 text-slate-950 dark:bg-slate-950 dark:text-white">
          {children}
        </section>
      </div>
    </main>
  );
}
