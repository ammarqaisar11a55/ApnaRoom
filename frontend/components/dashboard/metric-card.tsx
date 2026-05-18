import { ArrowUpRight, LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function MetricCard({ title, value, helper, icon: Icon }: { title: string; value: string | number; helper: string; icon: LucideIcon }) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
            <p className="mt-2 font-display text-2xl font-bold text-primary-800 dark:text-white">{value}</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-700 dark:bg-primary-900 dark:text-primary-300">
            <Icon className="h-5 w-5" />
          </div>
        </div>
        <p className="mt-4 flex items-center gap-1 text-xs font-semibold text-primary-700 dark:text-primary-300">
          <ArrowUpRight className="h-3.5 w-3.5" />
          {helper}
        </p>
      </CardContent>
    </Card>
  );
}
