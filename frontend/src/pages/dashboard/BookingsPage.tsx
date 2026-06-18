"use client";

import { FormEvent, useEffect, useState } from "react";
import { Check, Filter, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import type { Booking, Hostel, Paginated, Room } from "@/types/domain";
import { PageHeader } from "@/components/dashboard/dashboard-shell";
import { DataTable } from "@/components/dashboard/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

const today = new Date().toISOString().slice(0, 10);

export default function BookingsPage() {
  const [data, setData] = useState<Paginated<Booking> | null>(null);
  const [status, setStatusFilter] = useState("");
  const [paymentStatus, setPaymentStatusFilter] = useState("");
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createForm, setCreateForm] = useState({
    hostel: "",
    room: "",
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    guestUniversity: "",
    checkInDate: today,
    checkOutDate: "",
    numberOfBeds: 1,
    amount: 0,
  });

  async function load() {
    const response = await api.get("/bookings", { params: { limit: 30, status: status || undefined, paymentStatus: paymentStatus || undefined } });
    setData(response.data);
  }

  async function loadHostelsAndRooms() {
    const [hostelsResponse, roomsResponse] = await Promise.all([
      api.get("/hostels", { params: { limit: 50 } }),
      api.get("/rooms", { params: { limit: 100 } }),
    ]);
    setHostels(hostelsResponse.data.items);
    setRooms(roomsResponse.data.items);
  }

  useEffect(() => {
    load().catch(() => setData({ items: [], pagination: { page: 1, limit: 30, total: 0, pages: 1 } }));
  }, [status, paymentStatus]);

  useEffect(() => {
    loadHostelsAndRooms();
  }, []);

  async function submitCreateBooking(event: FormEvent) {
    event.preventDefault();
    try {
      await api.post("/bookings", {
        hostel: createForm.hostel,
        room: createForm.room || undefined,
        guest: {
          name: createForm.guestName,
          email: createForm.guestEmail,
          phone: createForm.guestPhone,
          university: createForm.guestUniversity || undefined,
        },
        requestedMoveIn: createForm.checkInDate ? new Date(createForm.checkInDate) : undefined,
        bedsRequested: createForm.numberOfBeds,
        amount: createForm.amount,
      });
      toast.success("Booking created");
      setShowCreateForm(false);
      setCreateForm({
        hostel: "",
        room: "",
        guestName: "",
        guestEmail: "",
        guestPhone: "",
        guestUniversity: "",
        checkInDate: today,
        checkOutDate: "",
        numberOfBeds: 1,
        amount: 0,
      });
      load();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Could not create booking");
    }
  }

  async function updateBooking(id: string, payload: Partial<Pick<Booking, "status" | "paymentStatus">>) {
    try {
      await api.put(`/bookings/${id}/status`, payload);
      toast.success("Booking updated");
      load();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Could not update booking");
    }
  }

  const roomOptions = rooms.filter((room) => !createForm.hostel || (typeof room.hostel === "string" ? room.hostel : room.hostel._id) === createForm.hostel);

  return (
    <div>
      <PageHeader title="Bookings" description="Review booking requests, accept or reject applicants, and mark payment state." action={<Button onClick={() => setShowCreateForm(true)}><Plus className="h-4 w-4" /> Create booking</Button>} />
      {showCreateForm && (
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Create new booking</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setShowCreateForm(false)} aria-label="Close booking form"><X className="h-4 w-4" /></Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={submitCreateBooking} className="grid gap-4 md:grid-cols-3">
              <label><span className="mb-2 block text-sm font-semibold">Hostel</span><Select value={createForm.hostel} onChange={(event) => setCreateForm((prev) => ({ ...prev, hostel: event.target.value, room: "" }))} required><option value="">Select hostel</option>{hostels.map((hostel) => <option key={hostel._id} value={hostel._id}>{hostel.name}</option>)}</Select></label>
              <label><span className="mb-2 block text-sm font-semibold">Room (optional)</span><Select value={createForm.room} onChange={(event) => setCreateForm((prev) => ({ ...prev, room: event.target.value }))}><option value="">Any room</option>{roomOptions.map((room) => <option key={room._id} value={room._id}>{room.roomNumber} · {room.availableBeds} available</option>)}</Select></label>
              <label><span className="mb-2 block text-sm font-semibold">Number of beds</span><Input type="number" min="1" value={createForm.numberOfBeds} onChange={(event) => setCreateForm((prev) => ({ ...prev, numberOfBeds: Number(event.target.value) }))} required /></label>
              <label><span className="mb-2 block text-sm font-semibold">Guest name</span><Input value={createForm.guestName} onChange={(event) => setCreateForm((prev) => ({ ...prev, guestName: event.target.value }))} required /></label>
              <label><span className="mb-2 block text-sm font-semibold">Guest email</span><Input type="email" value={createForm.guestEmail} onChange={(event) => setCreateForm((prev) => ({ ...prev, guestEmail: event.target.value }))} required /></label>
              <label><span className="mb-2 block text-sm font-semibold">Guest phone</span><Input value={createForm.guestPhone} onChange={(event) => setCreateForm((prev) => ({ ...prev, guestPhone: event.target.value }))} required /></label>
              <label><span className="mb-2 block text-sm font-semibold">University (optional)</span><Input value={createForm.guestUniversity} onChange={(event) => setCreateForm((prev) => ({ ...prev, guestUniversity: event.target.value }))} /></label>
              <label><span className="mb-2 block text-sm font-semibold">Check-in date</span><Input type="date" value={createForm.checkInDate} onChange={(event) => setCreateForm((prev) => ({ ...prev, checkInDate: event.target.value }))} required /></label>
              <label><span className="mb-2 block text-sm font-semibold">Check-out date (optional)</span><Input type="date" value={createForm.checkOutDate} onChange={(event) => setCreateForm((prev) => ({ ...prev, checkOutDate: event.target.value }))} /></label>
              <label><span className="mb-2 block text-sm font-semibold">Amount</span><Input type="number" min="0" step="100" value={createForm.amount} onChange={(event) => setCreateForm((prev) => ({ ...prev, amount: Number(event.target.value) }))} required /></label>
              <Button className="md:col-span-3">Create booking</Button>
            </form>
          </CardContent>
        </Card>
      )}
      <div className="mb-4 flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-950 sm:flex-row">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300"><Filter className="h-4 w-4" /> Filters</div>
        <select className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm dark:border-slate-800 dark:bg-slate-950" value={status} onChange={(event) => setStatusFilter(event.target.value)}>
          <option value="">All booking statuses</option>
          {["Pending", "Approved", "Rejected", "Completed"].map((item) => <option key={item}>{item}</option>)}
        </select>
        <select className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm dark:border-slate-800 dark:bg-slate-950" value={paymentStatus} onChange={(event) => setPaymentStatusFilter(event.target.value)}>
          <option value="">All payment statuses</option>
          {["Paid", "Unpaid", "Partial"].map((item) => <option key={item}>{item}</option>)}
        </select>
      </div>
      {!data ? <Skeleton className="h-80" /> : (
        <DataTable
          columns={["Guest", "Hostel", "Beds", "Move-in", "Amount", "Booking status", "Payment", "Actions"]}
          empty="No booking requests yet."
          rows={data.items.map((booking) => [
            <div key="guest" className="space-y-0.5">
              <p className="font-semibold">{booking.guest.name}</p>
              <p className="text-xs text-slate-500">{booking.guest.email}</p>
              <p className="text-xs text-slate-500">{booking.guest.phone}</p>
              {booking.guest.university && <p className="text-xs text-blue-600 font-medium">🎓 {booking.guest.university}</p>}
            </div>,
            booking.hostel?.name || "Hostel",
            booking.bedsRequested,
            booking.requestedMoveIn ? new Date(booking.requestedMoveIn).toLocaleDateString() : "—",
            formatCurrency(booking.amount),
            <Badge key="status">{booking.status}</Badge>,
            <Badge key="payment">{booking.paymentStatus}</Badge>,
            <div key="actions" className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={() => updateBooking(booking._id, { status: "Approved" })}><Check className="h-4 w-4" /> Accept</Button>
              <Button size="sm" variant="destructive" onClick={() => updateBooking(booking._id, { status: "Rejected" })}>Reject</Button>
              <select className="h-9 rounded-xl border border-slate-200 bg-white px-2 text-xs font-semibold dark:border-slate-800 dark:bg-slate-950" value={booking.paymentStatus} onChange={(event) => updateBooking(booking._id, { paymentStatus: event.target.value as Booking["paymentStatus"] })}>
                {["Paid", "Unpaid", "Partial"].map((item) => <option key={item}>{item}</option>)}
              </select>
              {booking.status === "Approved" && <Button size="sm" variant="secondary" onClick={() => updateBooking(booking._id, { status: "Completed" })}>Complete</Button>}
            </div>,
          ])}
        />
      )}
    </div>
  );
}
