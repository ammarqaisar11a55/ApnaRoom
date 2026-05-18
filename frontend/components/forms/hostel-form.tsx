"use client";

import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Bath,
  Camera,
  Car,
  Check,
  ChefHat,
  Clock,
  Dumbbell,
  Fan,
  Flame,
  Home,
  Loader2,
  MapPin,
  Shield,
  Shirt,
  Snowflake,
  Utensils,
  Wifi,
  Zap,
} from "lucide-react";
import { api } from "@/lib/api";
import { hostelSchema, type HostelFormValues } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Hostel } from "@/types/domain";

const facilities = [
  { label: "WiFi", icon: Wifi },
  { label: "Laundry", icon: Shirt },
  { label: "Mess", icon: Utensils },
  { label: "Air Conditioning", icon: Snowflake },
  { label: "Attached Bathroom", icon: Bath },
  { label: "Parking", icon: Car },
  { label: "CCTV", icon: Camera },
  { label: "Security Guard", icon: Shield },
  { label: "Generator", icon: Zap },
  { label: "Water Cooler", icon: Fan },
  { label: "Study Room", icon: Home },
  { label: "Kitchen", icon: ChefHat },
  { label: "Furnished Rooms", icon: Dumbbell },
  { label: "Geyser", icon: Flame },
  { label: "Elevator", icon: Clock },
];

const roomTypes = ["Single", "Double", "Triple", "Shared"];

function ErrorText({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs font-semibold text-red-600">{message}</p>;
}

type HostelFormProps = {
  hostel?: Hostel;
  mode?: "create" | "edit";
};

const toFormDefaults = (hostel?: Hostel): HostelFormValues => ({
  name: hostel?.name || "",
  description: hostel?.description || "",
  type: hostel?.type || "Boys",
  address: hostel?.address || "",
  city: hostel?.city || "",
  googleMapsLocation: hostel?.googleMapsLocation || "",
  nearbyUniversities: hostel?.nearbyUniversities?.join(", ") || "",
  monthlyRent: hostel?.pricing?.monthlyRent || 25000,
  securityDeposit: hostel?.pricing?.securityDeposit || 15000,
  electricityCharges: hostel?.pricing?.electricityCharges || 3000,
  internetCharges: hostel?.pricing?.internetCharges || 1000,
  messCharges: hostel?.pricing?.messCharges || 12000,
  floors: hostel?.floors || 1,
  totalRooms: hostel?.totalRooms || 0,
  availableRooms: hostel?.availableRooms || 0,
  roomTypes: hostel?.roomTypes?.length ? hostel.roomTypes : ["Single", "Double"],
  facilities: hostel?.facilities?.length ? hostel.facilities : ["WiFi", "CCTV", "Security Guard"],
  rules: hostel?.rules?.join("\n") || "",
  phone: hostel?.contact?.phone || "",
  whatsapp: hostel?.contact?.whatsapp || "",
  emergency: hostel?.contact?.emergency || "",
  checkIn: hostel?.timings?.checkIn || "13:00",
  checkOut: hostel?.timings?.checkOut || "12:00",
  policies: hostel?.policies || "",
  status: hostel?.status || "draft",
});

export function HostelForm({ hostel, mode = "create" }: HostelFormProps) {
  const navigate = useNavigate();
  const defaults = useMemo(() => toFormDefaults(hostel), [hostel]);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>(defaults.facilities);
  const [selectedRoomTypes, setSelectedRoomTypes] = useState<string[]>(defaults.roomTypes);
  const [thumbnail, setThumbnail] = useState<FileList | null>(null);
  const [images, setImages] = useState<FileList | null>(null);
  const form = useForm<HostelFormValues>({
    resolver: zodResolver(hostelSchema) as any,
    defaultValues: defaults,
  });

  function toggleItem(value: string, list: string[], setter: (next: string[]) => void, field: "facilities" | "roomTypes") {
    const next = list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
    setter(next);
    form.setValue(field, next, { shouldValidate: true });
  }

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const payload = {
        name: values.name,
        description: values.description,
        type: values.type,
        address: values.address,
        city: values.city,
        googleMapsLocation: values.googleMapsLocation || "",
        nearbyUniversities: values.nearbyUniversities?.split(",").map((item: string) => item.trim()).filter(Boolean) || [],
        pricing: {
          monthlyRent: values.monthlyRent,
          securityDeposit: values.securityDeposit,
          electricityCharges: values.electricityCharges,
          internetCharges: values.internetCharges,
          messCharges: values.messCharges,
        },
        floors: values.floors,
        totalRooms: values.totalRooms,
        availableRooms: values.availableRooms,
        roomTypes: values.roomTypes,
        facilities: values.facilities,
        rules: values.rules?.split("\n").map((item: string) => item.trim()).filter(Boolean) || [],
        contact: { phone: values.phone, whatsapp: values.whatsapp, emergency: values.emergency },
        timings: { checkIn: values.checkIn, checkOut: values.checkOut },
        policies: values.policies || "",
        status: values.status,
      };

      const data = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        data.append(key, typeof value === "object" ? JSON.stringify(value) : String(value));
      });
      if (thumbnail?.[0]) data.append("thumbnail", thumbnail[0]);
      Array.from(images || []).forEach((file) => data.append("images", file));

      if (mode === "edit" && hostel?._id) {
        await api.put(`/hostels/${hostel._id}`, data, { headers: { "Content-Type": "multipart/form-data" } });
      } else {
        await api.post("/hostels", data, { headers: { "Content-Type": "multipart/form-data" } });
      }
      toast.success(mode === "edit" ? "Hostel updated successfully." : "Hostel saved successfully.");
      navigate("/dashboard/hostels");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Could not save hostel");
    }
  });

  return (
    <form onSubmit={onSubmit} className="grid gap-6">
      <section className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-950 lg:grid-cols-2">
        <label>
          <span className="mb-2 block text-sm font-semibold">Hostel name</span>
          <Input {...form.register("name")} />
          <ErrorText message={form.formState.errors.name?.message} />
        </label>
        <label>
          <span className="mb-2 block text-sm font-semibold">Hostel type</span>
          <Select {...form.register("type")}>
            <option>Boys</option>
            <option>Girls</option>
            <option>Mixed</option>
          </Select>
        </label>
        <label className="lg:col-span-2">
          <span className="mb-2 block text-sm font-semibold">Description</span>
          <Textarea {...form.register("description")} />
          <ErrorText message={form.formState.errors.description?.message} />
        </label>
        <label>
          <span className="mb-2 flex items-center gap-2 text-sm font-semibold"><MapPin className="h-4 w-4" /> Address</span>
          <Input {...form.register("address")} />
          <ErrorText message={form.formState.errors.address?.message} />
        </label>
        <label>
          <span className="mb-2 block text-sm font-semibold">City</span>
          <Input {...form.register("city")} />
          <ErrorText message={form.formState.errors.city?.message} />
        </label>
        <label>
          <span className="mb-2 block text-sm font-semibold">Google Maps location</span>
          <Input {...form.register("googleMapsLocation")} placeholder="https://maps.google.com/..." />
        </label>
        <label>
          <span className="mb-2 block text-sm font-semibold">Nearby universities</span>
          <Input {...form.register("nearbyUniversities")} placeholder="UCP, UOL, Punjab University" />
        </label>
      </section>

      <section className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-950 lg:grid-cols-2">
        <div>
          <span className="mb-2 block text-sm font-semibold">Thumbnail image</span>
          <Input type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => setThumbnail(event.target.files)} />
          {hostel?.thumbnail?.url && <img src={hostel.thumbnail.url} alt={hostel.thumbnail.alt || hostel.name} className="mt-3 h-24 w-40 rounded-xl object-cover" />}
        </div>
        <div>
          <span className="mb-2 block text-sm font-semibold">Hostel gallery</span>
          <Input type="file" accept="image/png,image/jpeg,image/webp" multiple onChange={(event) => setImages(event.target.files)} />
          {Boolean(hostel?.images?.length) && (
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {hostel?.images?.slice(0, 5).map((image) => <img key={image.url} src={image.url} alt={image.alt || hostel.name} className="h-20 w-24 rounded-xl object-cover" />)}
            </div>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-950">
        <h2 className="text-base font-bold">Pricing and capacity</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {[
            ["Monthly rent", "monthlyRent"],
            ["Security deposit", "securityDeposit"],
            ["Electricity charges", "electricityCharges"],
            ["Internet charges", "internetCharges"],
            ["Mess charges", "messCharges"],
            ["Number of floors", "floors"],
            ["Total rooms", "totalRooms"],
            ["Available rooms", "availableRooms"],
          ].map(([label, name]) => (
            <label key={name}>
              <span className="mb-2 block text-sm font-semibold">{label}</span>
              <Input type="number" {...form.register(name as keyof HostelFormValues)} />
            </label>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-950">
        <h2 className="text-base font-bold">Room types</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {roomTypes.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => toggleItem(type, selectedRoomTypes, setSelectedRoomTypes, "roomTypes")}
              className={cn("min-h-10 cursor-pointer rounded-xl border px-4 text-sm font-semibold transition", selectedRoomTypes.includes(type) ? "border-blue-300 bg-blue-50 text-primary-800 dark:bg-blue-950 dark:text-blue-200" : "border-slate-200 text-slate-700 hover:bg-blue-50 dark:border-slate-800 dark:text-slate-300")}
            >
              {type}
            </button>
          ))}
        </div>
        <ErrorText message={form.formState.errors.roomTypes?.message} />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-950">
        <h2 className="text-base font-bold">Facilities</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {facilities.map((facility) => {
            const Icon = facility.icon;
            const active = selectedFacilities.includes(facility.label);
            return (
              <button
                key={facility.label}
                type="button"
                onClick={() => toggleItem(facility.label, selectedFacilities, setSelectedFacilities, "facilities")}
                className={cn("flex min-h-12 cursor-pointer items-center justify-between gap-3 rounded-xl border px-3 text-left text-sm font-semibold transition", active ? "border-blue-300 bg-blue-50 text-primary-800 dark:bg-blue-950 dark:text-blue-200" : "border-slate-200 text-slate-700 hover:bg-blue-50 dark:border-slate-800 dark:text-slate-300")}
              >
                <span className="flex items-center gap-2"><Icon className="h-4 w-4" /> {facility.label}</span>
                {active && <Check className="h-4 w-4" />}
              </button>
            );
          })}
        </div>
        <ErrorText message={form.formState.errors.facilities?.message} />
      </section>

      <section className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-950 lg:grid-cols-3">
        <label>
          <span className="mb-2 block text-sm font-semibold">Contact number</span>
          <Input {...form.register("phone")} />
          <ErrorText message={form.formState.errors.phone?.message} />
        </label>
        <label>
          <span className="mb-2 block text-sm font-semibold">WhatsApp number</span>
          <Input {...form.register("whatsapp")} />
        </label>
        <label>
          <span className="mb-2 block text-sm font-semibold">Emergency contact</span>
          <Input {...form.register("emergency")} />
        </label>
        <label>
          <span className="mb-2 block text-sm font-semibold">Check-in time</span>
          <Input type="time" {...form.register("checkIn")} />
        </label>
        <label>
          <span className="mb-2 block text-sm font-semibold">Check-out time</span>
          <Input type="time" {...form.register("checkOut")} />
        </label>
        <label>
          <span className="mb-2 block text-sm font-semibold">Publish status</span>
          <Select {...form.register("status")}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="unpublished">Unpublished</option>
          </Select>
        </label>
        <label className="lg:col-span-3">
          <span className="mb-2 block text-sm font-semibold">Rules and regulations</span>
          <Textarea {...form.register("rules")} placeholder="One rule per line" />
        </label>
        <label className="lg:col-span-3">
          <span className="mb-2 block text-sm font-semibold">Hostel policies</span>
          <Textarea {...form.register("policies")} placeholder="Refunds, quiet hours, visitor policy, payment cycle..." />
        </label>
      </section>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
        <Button disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {mode === "edit" ? "Update hostel" : "Save hostel"}
        </Button>
      </div>
    </form>
  );
}
