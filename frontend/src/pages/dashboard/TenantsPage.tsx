"use client";

import { FormEvent, useEffect, useState } from "react";
import { Edit, Plus, UserMinus, X } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import type { Hostel, Paginated, Room, Tenant } from "@/types/domain";
import { PageHeader } from "@/components/dashboard/dashboard-shell";
import { DataTable } from "@/components/dashboard/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

const today = new Date().toISOString().slice(0, 10);

export default function TenantsPage() {
  const [data, setData] = useState<Paginated<Tenant> | null>(null);
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
  const [form, setForm] = useState({
    hostel: "",
    room: "",
    name: "",
    email: "",
    phone: "",
    university: "",
    guardianName: "",
    guardianPhone: "",
    moveInDate: today,
    status: "Active" as Tenant["status"],
    paymentMonth: new Date().toISOString().slice(0, 7),
    paymentAmount: 0,
    paymentStatus: "Unpaid" as "Paid" | "Unpaid" | "Partial",
  });

  async function load() {
    const [tenantsResponse, hostelsResponse, roomsResponse] = await Promise.all([
      api.get("/tenants", { params: { limit: 30 } }),
      api.get("/hostels", { params: { limit: 50 } }),
      api.get("/rooms", { params: { limit: 100, status: "Available" } }),
    ]);
    setData(tenantsResponse.data);
    setHostels(hostelsResponse.data.items);
    setRooms(roomsResponse.data.items);
  }

  useEffect(() => {
    load().catch(() => setData({ items: [], pagination: { page: 1, limit: 30, total: 0, pages: 1 } }));
  }, []);

  function resetForm() {
    setForm({
      hostel: "",
      room: "",
      name: "",
      email: "",
      phone: "",
      university: "",
      guardianName: "",
      guardianPhone: "",
      moveInDate: today,
      status: "Active" as Tenant["status"],
      paymentMonth: new Date().toISOString().slice(0, 7),
      paymentAmount: 0,
      paymentStatus: "Unpaid" as "Paid" | "Unpaid" | "Partial",
    });
    setEditingTenant(null);
  }

  function openEditForm(tenant: Tenant) {
    setEditingTenant(tenant);
    const hostelId = typeof tenant.hostel === "string" ? tenant.hostel : tenant.hostel._id;
    const roomId = tenant.room?._id || "";
    setForm({
      hostel: hostelId,
      room: roomId,
      name: tenant.name,
      email: tenant.email || "",
      phone: tenant.phone,
      university: tenant.university || "",
      guardianName: "",
      guardianPhone: "",
      moveInDate: new Date(tenant.moveInDate).toISOString().slice(0, 10),
      status: tenant.status,
      paymentMonth: new Date().toISOString().slice(0, 7),
      paymentAmount: 0,
      paymentStatus: "Unpaid" as "Paid" | "Unpaid" | "Partial",
    });
    setShowForm(true);
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    try {
      if (editingTenant) {
        // Edit existing tenant
        await api.put(`/tenants/${editingTenant._id}`, {
          name: form.name,
          email: form.email,
          phone: form.phone,
          room: form.room || undefined,
          status: form.status,
          university: form.university,
        });
        toast.success("Tenant updated");
      } else {
        // Create new tenant
        await api.post("/tenants", {
          ...form,
          paymentRecords: form.paymentAmount ? [{ month: form.paymentMonth, amount: form.paymentAmount, status: form.paymentStatus }] : [],
        });
        toast.success("Tenant added");
      }
      setShowForm(false);
      resetForm();
      load();
    } catch (error: any) {
      toast.error(error.response?.data?.error || (editingTenant ? "Could not update tenant" : "Could not add tenant"));
    }
  }

  async function removeTenant(id: string) {
    if (!confirm("Remove this tenant and free their room?")) return;
    try {
      await api.delete(`/tenants/${id}`);
      toast.success("Tenant removed");
      load();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Could not remove tenant");
    }
  }

  const roomOptions = rooms.filter((room) => !form.hostel || (typeof room.hostel === "string" ? room.hostel : room.hostel._id) === form.hostel);

  return (
    <div>
      <PageHeader title="Tenants" description="View profiles, room assignments, stay duration, and payment records." action={<Button onClick={() => { setEditingTenant(null); resetForm(); setShowForm(true); }}><Plus className="h-4 w-4" /> Add tenant</Button>} />
      {showForm && (
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{editingTenant ? "Edit tenant" : "Assign tenant"}</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => { setShowForm(false); resetForm(); }} aria-label="Close tenant form"><X className="h-4 w-4" /></Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="grid gap-4 md:grid-cols-3">
              {!editingTenant && (
                <>
                  <label><span className="mb-2 block text-sm font-semibold">Hostel</span><Select value={form.hostel} onChange={(event) => setForm((prev) => ({ ...prev, hostel: event.target.value, room: "" }))} required><option value="">Select hostel</option>{hostels.map((hostel) => <option key={hostel._id} value={hostel._id}>{hostel.name}</option>)}</Select></label>
                  <label><span className="mb-2 block text-sm font-semibold">Room</span><Select value={form.room} onChange={(event) => setForm((prev) => ({ ...prev, room: event.target.value }))}><option value="">Unassigned</option>{roomOptions.map((room) => <option key={room._id} value={room._id}>{room.roomNumber} · {room.availableBeds} beds</option>)}</Select></label>
                  <label><span className="mb-2 block text-sm font-semibold">Move-in date</span><Input type="date" value={form.moveInDate} onChange={(event) => setForm((prev) => ({ ...prev, moveInDate: event.target.value }))} required /></label>
                </>
              )}
              <label><span className="mb-2 block text-sm font-semibold">Tenant name</span><Input value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} required /></label>
              <label><span className="mb-2 block text-sm font-semibold">Phone</span><Input value={form.phone} onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))} required /></label>
              <label><span className="mb-2 block text-sm font-semibold">Email</span><Input type="email" value={form.email} onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))} /></label>
              <label><span className="mb-2 block text-sm font-semibold">University</span><Input value={form.university} onChange={(event) => setForm((prev) => ({ ...prev, university: event.target.value }))} /></label>
              <label><span className="mb-2 block text-sm font-semibold">Guardian name</span><Input value={form.guardianName} onChange={(event) => setForm((prev) => ({ ...prev, guardianName: event.target.value }))} /></label>
              <label><span className="mb-2 block text-sm font-semibold">Guardian phone</span><Input value={form.guardianPhone} onChange={(event) => setForm((prev) => ({ ...prev, guardianPhone: event.target.value }))} /></label>
              {!editingTenant && (
                <>
                  <label><span className="mb-2 block text-sm font-semibold">Payment month</span><Input value={form.paymentMonth} onChange={(event) => setForm((prev) => ({ ...prev, paymentMonth: event.target.value }))} /></label>
                  <label><span className="mb-2 block text-sm font-semibold">Payment amount</span><Input type="number" value={form.paymentAmount} onChange={(event) => setForm((prev) => ({ ...prev, paymentAmount: Number(event.target.value) }))} /></label>
                  <label><span className="mb-2 block text-sm font-semibold">Payment status</span><Select value={form.paymentStatus} onChange={(event) => setForm((prev) => ({ ...prev, paymentStatus: event.target.value as "Paid" | "Unpaid" | "Partial" }))}>{["Paid", "Unpaid", "Partial"].map((status) => <option key={status}>{status}</option>)}</Select></label>
                </>
              )}
              <Button className="md:col-span-3">{editingTenant ? "Update tenant" : "Add tenant"}</Button>
            </form>
          </CardContent>
        </Card>
      )}
      {!data ? <Skeleton className="h-80" /> : (
        <DataTable
          columns={["Tenant", "Hostel", "Room", "Move-in", "Latest payment", "Stay", "Status", "Actions"]}
          empty="No active tenants yet."
          rows={data.items.map((tenant) => {
            const latest = tenant.paymentRecords?.[tenant.paymentRecords.length - 1];
            const days = Math.max(Math.ceil((Date.now() - new Date(tenant.moveInDate).getTime()) / 86400000), 0);
            return [
              <div key="tenant"><p className="font-semibold">{tenant.name}</p><p className="text-xs text-slate-500">{tenant.phone}</p></div>,
              typeof tenant.hostel === "string" ? "Hostel" : tenant.hostel.name,
              tenant.room?.roomNumber || "Unassigned",
              new Date(tenant.moveInDate).toLocaleDateString(),
              latest ? `${latest.status} · ${formatCurrency(latest.amount)}` : "No records",
              `${days} days`,
              <Badge key="status">{tenant.status}</Badge>,
              <div key="actions" className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={() => openEditForm(tenant)}><Edit className="h-4 w-4" /> Edit</Button>
                <Button size="sm" variant="outline" onClick={() => removeTenant(tenant._id)}><UserMinus className="h-4 w-4" /> Remove</Button>
              </div>,
            ];
          })}
        />
      )}
    </div>
  );
}
