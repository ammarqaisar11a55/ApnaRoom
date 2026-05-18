"use client";

import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Edit, Eye, Plus, Search, Trash2, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import type { Hostel, Paginated } from "@/types/domain";
import { PageHeader } from "@/components/dashboard/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

export default function HostelsPage() {
  const [data, setData] = useState<Paginated<Hostel> | null>(null);
  const [search, setSearch] = useState("");

  async function loadHostels(query = "") {
    const response = await api.get("/hostels", { params: { search: query || undefined, limit: 20 } });
    setData(response.data);
  }

  useEffect(() => {
    loadHostels().catch(() => setData({ items: [], pagination: { page: 1, limit: 20, total: 0, pages: 1 } }));
  }, []);

  async function removeHostel(id: string) {
    if (!confirm("Delete this hostel and related operational records?")) return;
    try {
      await api.delete(`/hostels/${id}`);
      toast.success("Hostel deleted");
      loadHostels(search);
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Delete failed");
    }
  }

  async function setStatus(hostel: Hostel) {
    const nextStatus = hostel.status === "published" ? "unpublished" : "published";
    try {
      await api.put(`/hostels/${hostel._id}`, {
        ...hostel,
        status: nextStatus,
        monthlyRent: hostel.pricing.monthlyRent,
        securityDeposit: hostel.pricing.securityDeposit,
        electricityCharges: hostel.pricing.electricityCharges,
        internetCharges: hostel.pricing.internetCharges,
        messCharges: hostel.pricing.messCharges,
        phone: hostel.contact.phone,
        whatsapp: hostel.contact.whatsapp,
        emergency: hostel.contact.emergency,
        checkIn: hostel.timings.checkIn,
        checkOut: hostel.timings.checkOut,
      });
      toast.success(nextStatus === "published" ? "Hostel published" : "Hostel unpublished");
      loadHostels(search);
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Status update failed");
    }
  }

  return (
    <div>
      <PageHeader
        title="My Hostels"
        description="Publish, unpublish, edit, and monitor all owner listings."
        action={<Button asChild><Link to="/dashboard/hostels/new"><Plus className="h-4 w-4" /> Add hostel</Link></Button>}
      />
      <div className="mb-4 flex gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input className="pl-9" placeholder="Search by name, city, address..." value={search} onChange={(event) => setSearch(event.target.value)} />
        </div>
        <Button variant="outline" onClick={() => loadHostels(search)}>Search</Button>
      </div>
      {!data ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-64" />)}</div>
      ) : data.items.length === 0 ? (
        <Card><CardContent className="p-8 text-center text-slate-600 dark:text-slate-400">No hostels yet. Add your first listing to start receiving booking requests.</CardContent></Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {data.items.map((hostel) => (
            <Card key={hostel._id}>
              {hostel.thumbnail?.url && <img src={hostel.thumbnail.url} alt={hostel.thumbnail.alt || hostel.name} className="h-40 w-full rounded-t-2xl object-cover" />}
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-display text-lg font-bold text-primary-800 dark:text-white">{hostel.name}</h2>
                    <p className="mt-1 text-sm text-slate-500">{hostel.city} · {hostel.type}</p>
                  </div>
                  <Badge className={hostel.status === "published" ? "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300" : ""}>{hostel.status}</Badge>
                </div>
                <p className="mt-4 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">{hostel.description}</p>
                <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
                  <div className="rounded-xl bg-blue-50 p-3 dark:bg-slate-900"><p className="text-slate-500">Rent</p><p className="font-bold text-primary-800 dark:text-white">{formatCurrency(hostel.pricing.monthlyRent)}</p></div>
                  <div className="rounded-xl bg-blue-50 p-3 dark:bg-slate-900"><p className="text-slate-500">Rooms</p><p className="font-bold text-primary-800 dark:text-white">{hostel.availableRooms}/{hostel.totalRooms}</p></div>
                  <div className="rounded-xl bg-blue-50 p-3 dark:bg-slate-900"><p className="text-slate-500">Views</p><p className="font-bold text-primary-800 dark:text-white">{hostel.analytics?.views || 0}</p></div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" asChild><Link to={`/dashboard/hostels/${hostel._id}`}><Eye className="h-4 w-4" /> View</Link></Button>
                  <Button size="sm" variant="secondary" asChild><Link to={`/dashboard/hostels/${hostel._id}/edit`}><Edit className="h-4 w-4" /> Edit</Link></Button>
                  <Button size="sm" variant="outline" onClick={() => setStatus(hostel)}><UploadCloud className="h-4 w-4" /> {hostel.status === "published" ? "Unpublish" : "Publish"}</Button>
                  <Button size="sm" variant="destructive" onClick={() => removeHostel(hostel._id)}><Trash2 className="h-4 w-4" /> Delete</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
