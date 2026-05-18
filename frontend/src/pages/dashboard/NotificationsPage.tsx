"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import type { NotificationItem, Paginated } from "@/types/domain";
import { PageHeader } from "@/components/dashboard/dashboard-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function NotificationsPage() {
  const [data, setData] = useState<Paginated<NotificationItem> | null>(null);

  async function load() {
    const response = await api.get("/notifications", { params: { limit: 30 } });
    setData(response.data);
  }

  useEffect(() => {
    load().catch(() => setData({ items: [], pagination: { page: 1, limit: 30, total: 0, pages: 1 } }));
  }, []);

  async function markAllRead() {
    if (!data?.items.length) return;
    try {
      await api.put("/notifications/read", { ids: data.items.filter((item) => !item.read).map((item) => item._id) });
      toast.success("Notifications marked as read");
      load();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Could not update notifications");
    }
  }

  return (
    <div>
      <PageHeader title="Notifications" description="New bookings, cancellations, payment receipts, reviews, and platform alerts." action={<Button variant="outline" onClick={markAllRead}>Mark all read</Button>} />
      {!data ? <Skeleton className="h-80" /> : (
        <div className="grid gap-3">
          {data.items.length === 0 && <Card><CardContent className="p-8 text-center text-sm text-slate-600 dark:text-slate-400">No notifications yet.</CardContent></Card>}
          {data.items.map((item) => (
            <Card key={item._id}>
              <CardContent className="flex items-start gap-4 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-700 dark:bg-primary-900 dark:text-primary-300"><Bell className="h-4 w-4" /></div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2"><p className="font-bold">{item.title}</p><Badge>{item.read ? "Read" : "Unread"}</Badge></div>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{item.message}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
