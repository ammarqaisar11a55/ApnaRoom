import { PageHeader } from "@/components/dashboard/dashboard-shell";
import { HostelForm } from "@/components/forms/hostel-form";

export default function AddHostelPage() {
  return (
    <div>
      <PageHeader title="Add Hostel" description="Create a complete listing with pricing, room types, facilities, contacts, and rules." />
      <HostelForm />
    </div>
  );
}
