import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "@/lib/api";
import type { Hostel } from "@/types/domain";
import { PageHeader } from "@/components/dashboard/dashboard-shell";
import { HostelForm } from "@/components/forms/hostel-form";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditHostelPage() {
  const { id } = useParams();
  const [hostel, setHostel] = useState<Hostel | null>(null);

  useEffect(() => {
    api.get(`/hostels/${id}`).then((response) => setHostel(response.data.item));
  }, [id]);

  return (
    <div>
      <PageHeader title="Edit Hostel" description="Update listing details, images, facilities, pricing, and publishing status." />
      {!hostel ? <Skeleton className="h-[520px]" /> : <HostelForm hostel={hostel} mode="edit" />}
    </div>
  );
}
