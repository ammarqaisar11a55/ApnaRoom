"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { BedDouble, Edit, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import type { Hostel, Paginated, Room } from "@/types/domain";
import { PageHeader } from "@/components/dashboard/dashboard-shell";
import { DataTable } from "@/components/dashboard/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

const emptyRoom = {
  hostel: "",
  roomNumber: "",
  roomType: "Single" as Room["roomType"],
  capacity: 1,
  occupiedBeds: 0,
  pricePerBed: 0,
  attachedBathroom: false,
  airConditioned: false,
  status: "Available" as Room["status"],
};

export default function RoomsPage() {
  const [data, setData] = useState<Paginated<Room> | null>(null);
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [editing, setEditing] = useState<Room | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyRoom);
  const [files, setFiles] = useState<FileList | null>(null);

  const hostelMap = useMemo(() => Object.fromEntries(hostels.map((hostel) => [hostel._id, hostel.name])), [hostels]);

  async function load() {
    const [roomsResponse, hostelsResponse] = await Promise.all([
      api.get("/rooms", { params: { limit: 30 } }),
      api.get("/hostels", { params: { limit: 50 } }),
    ]);
    setData(roomsResponse.data);
    setHostels(hostelsResponse.data.items);
  }

  useEffect(() => {
    load().catch(() => setData({ items: [], pagination: { page: 1, limit: 30, total: 0, pages: 1 } }));
  }, []);

  function startEdit(room?: Room) {
    setEditing(room || null);
    setShowForm(true);
    setForm(room ? {
      hostel: typeof room.hostel === "string" ? room.hostel : room.hostel._id,
      roomNumber: room.roomNumber,
      roomType: room.roomType,
      capacity: room.capacity,
      occupiedBeds: room.occupiedBeds,
      pricePerBed: room.pricePerBed,
      attachedBathroom: room.attachedBathroom,
      airConditioned: room.airConditioned,
      status: room.status,
    } : { ...emptyRoom, hostel: hostels[0]?._id || "" });
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    try {
      const payload = new FormData();
      Object.entries(form).forEach(([key, value]) => payload.append(key, String(value)));
      Array.from(files || []).forEach((file) => payload.append("roomImages", file));

      if (editing) {
        await api.put(`/rooms/${editing._id}`, payload, { headers: { "Content-Type": "multipart/form-data" } });
        toast.success("Room updated");
      } else {
        await api.post("/rooms", payload, { headers: { "Content-Type": "multipart/form-data" } });
        toast.success("Room added");
      }
      setShowForm(false);
      setEditing(null);
      setFiles(null);
      load();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Could not save room");
    }
  }

  async function removeRoom(room: Room) {
    if (!confirm(`Delete room ${room.roomNumber}?`)) return;
    try {
      await api.delete(`/rooms/${room._id}`);
      toast.success("Room deleted");
      load();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Could not delete room");
    }
  }

  return (
    <div>
      <PageHeader
        title="Room Management"
        description="Add rooms, edit capacity, update pricing, and change availability."
        action={<Button onClick={() => startEdit()}><Plus className="h-4 w-4" /> Add room</Button>}
      />

      {showForm && (
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{editing ? "Edit room" : "Add room"}</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setShowForm(false)} aria-label="Close room form"><X className="h-4 w-4" /></Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="grid gap-4 md:grid-cols-3">
              <label><span className="mb-2 block text-sm font-semibold">Hostel</span><Select value={form.hostel} onChange={(event) => setForm((prev) => ({ ...prev, hostel: event.target.value }))} required>{hostels.map((hostel) => <option key={hostel._id} value={hostel._id}>{hostel.name}</option>)}</Select></label>
              <label><span className="mb-2 block text-sm font-semibold">Room number</span><Input value={form.roomNumber} onChange={(event) => setForm((prev) => ({ ...prev, roomNumber: event.target.value }))} required /></label>
              <label><span className="mb-2 block text-sm font-semibold">Room type</span><Select value={form.roomType} onChange={(event) => setForm((prev) => ({ ...prev, roomType: event.target.value as Room["roomType"] }))}>{["Single", "Double", "Triple", "Shared"].map((type) => <option key={type}>{type}</option>)}</Select></label>
              <label><span className="mb-2 block text-sm font-semibold">Capacity</span><Input type="number" value={form.capacity} onChange={(event) => setForm((prev) => ({ ...prev, capacity: Number(event.target.value) }))} min={1} /></label>
              <label><span className="mb-2 block text-sm font-semibold">Occupied beds</span><Input type="number" value={form.occupiedBeds} onChange={(event) => setForm((prev) => ({ ...prev, occupiedBeds: Number(event.target.value) }))} min={0} /></label>
              <label><span className="mb-2 block text-sm font-semibold">Price per bed</span><Input type="number" value={form.pricePerBed} onChange={(event) => setForm((prev) => ({ ...prev, pricePerBed: Number(event.target.value) }))} min={0} /></label>
              <label><span className="mb-2 block text-sm font-semibold">Status</span><Select value={form.status} onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value as Room["status"] }))}>{["Available", "Full", "Maintenance"].map((status) => <option key={status}>{status}</option>)}</Select></label>
              <label><span className="mb-2 block text-sm font-semibold">Room images</span><Input type="file" accept="image/png,image/jpeg,image/webp" multiple onChange={(event) => setFiles(event.target.files)} /></label>
              <div className="flex items-end gap-4">
                <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={form.airConditioned} onChange={(event) => setForm((prev) => ({ ...prev, airConditioned: event.target.checked }))} /> AC</label>
                <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={form.attachedBathroom} onChange={(event) => setForm((prev) => ({ ...prev, attachedBathroom: event.target.checked }))} /> Attached bath</label>
              </div>
              <Button className="md:col-span-3">{editing ? "Update room" : "Add room"}</Button>
            </form>
          </CardContent>
        </Card>
      )}

      {!data ? <Skeleton className="h-80" /> : (
        <DataTable
          columns={["Room", "Hostel", "Type", "Capacity", "Available", "Price per bed", "Attributes", "Status", "Actions"]}
          empty="No rooms yet. Create rooms from your hostel inventory."
          rows={data.items.map((room) => [
            <span key="room" className="flex items-center gap-2 font-semibold"><BedDouble className="h-4 w-4 text-blue-600" /> {room.roomNumber}</span>,
            typeof room.hostel === "string" ? hostelMap[room.hostel] || room.hostel : room.hostel.name,
            room.roomType,
            room.capacity,
            room.availableBeds,
            formatCurrency(room.pricePerBed),
            `${room.attachedBathroom ? "Attached bath" : "Shared bath"} · ${room.airConditioned ? "AC" : "Non-AC"}`,
            <Badge key="status">{room.status}</Badge>,
            <div key="actions" className="flex gap-2"><Button size="sm" variant="outline" onClick={() => startEdit(room)}><Edit className="h-4 w-4" /> Edit</Button><Button size="sm" variant="destructive" onClick={() => removeRoom(room)}><Trash2 className="h-4 w-4" /> Delete</Button></div>,
          ])}
        />
      )}
    </div>
  );
}
