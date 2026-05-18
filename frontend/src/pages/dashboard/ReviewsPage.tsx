"use client";

import { useEffect, useState } from "react";
import { MessageSquareReply, Star } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import type { Paginated, Review } from "@/types/domain";
import { PageHeader } from "@/components/dashboard/dashboard-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function ReviewsPage() {
  const [data, setData] = useState<Paginated<Review> | null>(null);
  const [replying, setReplying] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  async function load() {
    const response = await api.get("/reviews", { params: { limit: 20 } });
    setData(response.data);
  }

  useEffect(() => {
    load().catch(() => setData({ items: [], pagination: { page: 1, limit: 20, total: 0, pages: 1 } }));
  }, []);

  async function saveReply(reviewId: string) {
    try {
      await api.post("/reviews/reply", { reviewId, message });
      toast.success("Reply saved");
      setReplying(null);
      setMessage("");
      load();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Could not save reply");
    }
  }

  async function moderate(reviewId: string, status: Review["status"]) {
    try {
      await api.put(`/reviews/${reviewId}/moderate`, { status });
      toast.success("Review updated");
      load();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Could not moderate review");
    }
  }

  return (
    <div>
      <PageHeader title="Reviews" description="Moderate tenant reviews, view star ratings, and reply professionally." />
      {!data ? <Skeleton className="h-80" /> : data.items.length === 0 ? (
        <Card><CardContent className="p-8 text-center text-sm text-slate-600 dark:text-slate-400">No reviews yet.</CardContent></Card>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {data.items.map((review) => (
            <Card key={review._id}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-bold">{review.authorName}</p>
                    <p className="text-sm text-slate-500">{review.hostel?.name}</p>
                  </div>
                  <Badge>{review.status}</Badge>
                </div>
                <div className="mt-3 flex gap-1 text-amber-500">{Array.from({ length: review.rating }).map((_, index) => <Star key={index} className="h-4 w-4 fill-current" />)}</div>
                <p className="mt-3 text-sm text-slate-700 dark:text-slate-300">{review.comment}</p>
                {review.reply?.message && <p className="mt-3 rounded-xl bg-slate-50 p-3 text-sm dark:bg-slate-900">Reply: {review.reply.message}</p>}
                {replying === review._id && (
                  <div className="mt-4 space-y-2">
                    <textarea className="min-h-24 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm dark:border-slate-800 dark:bg-slate-950" value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Write a professional owner reply..." />
                    <Button size="sm" onClick={() => saveReply(review._id)}>Save reply</Button>
                  </div>
                )}
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={() => { setReplying(review._id); setMessage(review.reply?.message || ""); }}><MessageSquareReply className="h-4 w-4" /> Reply</Button>
                  <Button size="sm" variant="secondary" onClick={() => moderate(review._id, "Published")}>Publish</Button>
                  <Button size="sm" variant="outline" onClick={() => moderate(review._id, "Hidden")}>Hide</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
