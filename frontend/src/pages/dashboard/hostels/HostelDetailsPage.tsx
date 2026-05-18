import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BedDouble, Edit, MapPin, Phone } from "lucide-react";
import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import type { Hostel } from "@/types/domain";
import { PageHeader } from "@/components/dashboard/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function HostelDetailsPage() {
  const { id } = useParams();
  const [hostel, setHostel] = useState<Hostel | null>(null);

  useEffect(() => {
    api.get(`/hostels/${id}`).then((response) => setHostel(response.data.item));
  }, [id]);

  if (!hostel) return <Skeleton className="h-[520px]" />;

  return (
    <div>
      <PageHeader
        title={hostel.name}
        description={`${hostel.city} · ${hostel.type} hostel`}
        action={<Button asChild><Link to={`/dashboard/hostels/${hostel._id}/edit`}><Edit className="h-4 w-4" /> Edit listing</Link></Button>}
      />
      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          {hostel.thumbnail?.url && <img src={hostel.thumbnail.url} alt={hostel.thumbnail.alt || hostel.name} className="h-72 w-full rounded-t-lg object-cover" />}
          <CardContent className="p-5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge>{hostel.status}</Badge>
              {hostel.facilities.slice(0, 6).map((facility) => <Badge key={facility}>{facility}</Badge>)}
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-700 dark:text-slate-300">{hostel.description}</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-blue-50 p-3 dark:bg-slate-900"><p className="text-xs text-slate-500">Monthly rent</p><p className="font-bold text-primary-800 dark:text-white">{formatCurrency(hostel.pricing.monthlyRent)}</p></div>
              <div className="rounded-xl bg-blue-50 p-3 dark:bg-slate-900"><p className="text-xs text-slate-500">Rooms</p><p className="font-bold text-primary-800 dark:text-white">{hostel.availableRooms}/{hostel.totalRooms}</p></div>
              <div className="rounded-xl bg-blue-50 p-3 dark:bg-slate-900"><p className="text-xs text-slate-500">Views</p><p className="font-bold text-primary-800 dark:text-white">{hostel.analytics?.views || 0}</p></div>
            </div>
          </CardContent>
        </Card>
        <div className="grid gap-4">
          <Card>
            <CardHeader><CardTitle>Contact and location</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p className="flex gap-2"><MapPin className="h-4 w-4 text-blue-600" /> {hostel.address}</p>
              <p className="flex gap-2"><Phone className="h-4 w-4 text-blue-600" /> {hostel.contact.phone}</p>
              <p className="flex gap-2"><BedDouble className="h-4 w-4 text-blue-600" /> {hostel.roomTypes.join(", ")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Rules and policies</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
              {hostel.rules.length ? hostel.rules.map((rule) => <p key={rule}>- {rule}</p>) : <p>No rules added.</p>}
              {hostel.policies && <p className="rounded-xl bg-blue-50 p-3 dark:bg-slate-900">{hostel.policies}</p>}
            </CardContent>
          </Card>
        </div>
      </div>
      {Boolean(hostel.images?.length) && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {hostel.images?.map((image) => <img key={image.url} src={image.url} alt={image.alt || hostel.name} className="h-44 w-full rounded-2xl object-cover" />)}
        </div>
      )}
    </div>
  );
}
