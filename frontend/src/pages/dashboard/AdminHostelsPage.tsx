"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Check,
  X,
  Search,
  Building,
  User,
  MapPin,
  Calendar,
  Layers,
  Sparkles,
  DollarSign,
  AlertCircle,
  Eye,
  Info,
  ShieldAlert,
  Compass,
  Smile
} from "lucide-react";
import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { PageHeader } from "@/components/dashboard/dashboard-shell";
import { MetricCard } from "@/components/dashboard/metric-card";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Owner {
  _id: string;
  name: string;
  email: string;
  phone: string;
}

interface Hostel {
  _id: string;
  name: string;
  description: string;
  type: string;
  address: string;
  city: string;
  nearbyUniversities: string[];
  pricing: {
    monthlyRent: number;
    securityDeposit: number;
    electricityCharges: number;
    internetCharges: number;
    messCharges: number;
  };
  floors: number;
  totalRooms: number;
  availableRooms: number;
  roomTypes: string[];
  facilities: string[];
  rules: string[];
  contact: {
    phone: string;
    whatsapp?: string;
  };
  timings?: {
    checkIn?: string;
    checkOut?: string;
  };
  thumbnail?: {
    url: string;
  };
  status: "pending" | "approved" | "rejected" | "draft" | "published" | "unpublished";
  createdAt: string;
  owner: Owner;
}

export default function AdminHostelsPage() {
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"All" | "Pending" | "Approved" | "Rejected">("All");
  const [selectedHostel, setSelectedHostel] = useState<Hostel | null>(null);

  const fetchHostels = async () => {
    setLoading(true);
    try {
      // Calls the new secure Super Admin endpoint
      const response = await api.get("/admin/hostels");
      setHostels(response.data.items || []);
    } catch (error: any) {
      const errMsg = error.response?.data?.error || "Failed to retrieve listings";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHostels();
  }, []);

  const handleApprove = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await api.put(`/admin/hostels/${id}/approve`);
      toast.success(response.data.message || "Hostel approved successfully!");
      
      // Update local state smoothly
      setHostels((prev) =>
        prev.map((h) => (h._id === id ? { ...h, status: "approved" } : h))
      );
      if (selectedHostel?._id === id) {
        setSelectedHostel((prev) => prev ? { ...prev, status: "approved" } : null);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Approval request failed");
    }
  };

  const handleReject = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await api.put(`/admin/hostels/${id}/reject`);
      toast.success(response.data.message || "Hostel listing rejected.");
      
      // Update local state smoothly
      setHostels((prev) =>
        prev.map((h) => (h._id === id ? { ...h, status: "rejected" } : h))
      );
      if (selectedHostel?._id === id) {
        setSelectedHostel((prev) => prev ? { ...prev, status: "rejected" } : null);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Rejection request failed");
    }
  };

  // Stats computation
  const stats = useMemo(() => {
    const total = hostels.length;
    const pending = hostels.filter((h) => h.status === "pending" || h.status === "draft").length;
    const approved = hostels.filter((h) => h.status === "approved" || h.status === "published").length;
    const rejected = hostels.filter((h) => h.status === "rejected" || h.status === "unpublished").length;
    return { total, pending, approved, rejected };
  }, [hostels]);

  // Filtering hostels based on search query and tab selection
  const filteredHostels = useMemo(() => {
    return hostels.filter((hostel) => {
      // Tab matching
      if (activeTab === "Pending" && hostel.status !== "pending" && hostel.status !== "draft") return false;
      if (activeTab === "Approved" && hostel.status !== "approved" && hostel.status !== "published") return false;
      if (activeTab === "Rejected" && hostel.status !== "rejected" && hostel.status !== "unpublished") return false;

      // Query matching
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = hostel.name.toLowerCase().includes(query);
        const matchesCity = hostel.city.toLowerCase().includes(query);
        const matchesAddress = hostel.address.toLowerCase().includes(query);
        const matchesOwner = hostel.owner?.name?.toLowerCase().includes(query);
        return matchesName || matchesCity || matchesAddress || matchesOwner;
      }

      return true;
    });
  }, [hostels, activeTab, searchQuery]);

  return (
    <div className="space-y-6 text-slate-800 dark:text-slate-200">
      <PageHeader
        title="Super Admin Dashboard"
        description="Verify, approve, or reject student hostel listings to manage public marketplace search listings."
      />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Total Submissions"
          value={stats.total}
          helper="All registered hostels"
          icon={Building}
        />
        <MetricCard
          title="Pending Approval"
          value={stats.pending}
          helper="Needs immediate review"
          icon={AlertCircle}
          className="border-amber-200 bg-amber-50/20 text-amber-700 dark:border-amber-900/50"
        />
        <MetricCard
          title="Approved Listings"
          value={stats.approved}
          helper="Live on public student page"
          icon={Compass}
          className="border-emerald-200 bg-emerald-50/20 text-emerald-700 dark:border-emerald-900/50"
        />
        <MetricCard
          title="Rejected Listings"
          value={stats.rejected}
          helper="Hidden from marketplace search"
          icon={ShieldAlert}
          className="border-rose-200 bg-rose-50/20 text-rose-700 dark:border-rose-900/50"
        />
      </div>

      {/* Controls Container */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-850 p-1 rounded-xl w-fit">
          {(["All", "Pending", "Approved", "Rejected"] as const).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-lg px-4 py-2 text-xs font-bold transition ${
                  isActive
                    ? "bg-white dark:bg-slate-800 text-primary-800 dark:text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            className="pl-9 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus-visible:ring-blue-500"
            placeholder="Search by hostel, city, or owner..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Hostels List Table / Cards */}
      {loading ? (
        <div className="flex flex-col items-center justify-center p-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
          <Building className="h-10 w-10 text-blue-500 animate-bounce" />
          <p className="mt-4 text-sm font-semibold text-slate-500">Loading submitted hostels...</p>
        </div>
      ) : filteredHostels.length === 0 ? (
        <div className="text-center p-16 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 shadow-sm">
          <Smile className="mx-auto h-12 w-12 text-slate-400" />
          <h3 className="mt-4 text-base font-bold text-slate-800 dark:text-slate-200">No hostels found</h3>
          <p className="mt-2 text-sm text-slate-500 max-w-sm mx-auto">
            We couldn't find any hostels matching the current active filter tab or search terms.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredHostels.map((hostel) => {
            const statusThemes = {
              pending: "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30",
              draft: "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30",
              approved: "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30",
              published: "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30",
              rejected: "bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/30",
              unpublished: "bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/30",
            };

            const statusLabel =
              hostel.status === "pending" || hostel.status === "draft"
                ? "Pending Review"
                : hostel.status === "approved" || hostel.status === "published"
                ? "Approved"
                : "Rejected";

            return (
              <Card
                key={hostel._id}
                onClick={() => setSelectedHostel(hostel)}
                className="group overflow-hidden cursor-pointer hover:border-blue-400 dark:hover:border-blue-700 hover:shadow-md transition-all duration-300 border border-slate-200 dark:border-slate-800"
              >
                <div className="grid md:grid-cols-[200px_1fr] min-h-[160px]">
                  {/* Thumbnail */}
                  <div className="relative bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    {hostel.thumbnail?.url ? (
                      <img
                        src={hostel.thumbnail.url}
                        alt={hostel.name}
                        className="h-full w-full object-cover group-hover:scale-102 transition duration-300"
                      />
                    ) : (
                      <Building className="h-12 w-12 text-slate-300 dark:text-slate-600" />
                    )}
                    <Badge className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-sm border-none text-white text-[10px]">
                      {hostel.type}
                    </Badge>
                  </div>

                  {/* Body */}
                  <div className="p-5 flex flex-col justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="font-display font-bold text-lg text-primary-800 dark:text-white group-hover:text-blue-600 transition-colors">
                          {hostel.name}
                        </h3>
                        <Badge className={`border px-2.5 py-0.5 text-xs font-bold ${statusThemes[hostel.status]}`}>
                          {statusLabel}
                        </Badge>
                      </div>

                      {/* Location & Details */}
                      <div className="grid gap-x-6 gap-y-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 sm:grid-cols-2 md:grid-cols-3">
                        <span className="flex items-center gap-1.5 truncate">
                          <MapPin className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                          {hostel.address}, {hostel.city}
                        </span>
                        <span className="flex items-center gap-1.5 truncate">
                          <User className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          Owner: {hostel.owner?.name || "Unassigned"}
                        </span>
                        <span className="flex items-center gap-1.5 shrink-0">
                          <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          Submitted: {new Date(hostel.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Bottom strip */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-slate-100 dark:border-slate-800 pt-4 text-xs font-bold text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-4">
                        <span>
                          Monthly Rent: <span className="text-blue-600 text-sm font-black">{formatCurrency(hostel.pricing.monthlyRent)}</span>
                        </span>
                        <span className="hidden sm:inline">•</span>
                        <span>
                          Deposit: <span className="text-slate-800 dark:text-slate-200">{formatCurrency(hostel.pricing.securityDeposit)}</span>
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-8 gap-1 border-slate-200 dark:border-slate-850 hover:bg-blue-50 dark:hover:bg-blue-950/20"
                        >
                          <Eye className="h-3.5 w-3.5 text-blue-500" /> Details
                        </Button>

                        {(hostel.status === "pending" || hostel.status === "draft" || hostel.status === "rejected" || hostel.status === "unpublished") && (
                          <Button
                            type="button"
                            size="sm"
                            onClick={(e) => handleApprove(hostel._id, e)}
                            className="h-8 gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                          >
                            <Check className="h-3.5 w-3.5" /> Approve
                          </Button>
                        )}

                        {(hostel.status === "pending" || hostel.status === "draft" || hostel.status === "approved" || hostel.status === "published") && (
                          <Button
                            type="button"
                            size="sm"
                            onClick={(e) => handleReject(hostel._id, e)}
                            className="h-8 gap-1 bg-rose-600 hover:bg-rose-700 text-white font-bold"
                          >
                            <X className="h-3.5 w-3.5" /> Reject
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* DETAIL DIALOG MODAL */}
      {selectedHostel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div
            className="relative w-full max-w-3xl overflow-hidden rounded-3xl bg-white dark:bg-slate-900 shadow-2xl transition-all max-h-[90vh] flex flex-col border border-slate-200 dark:border-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header info bar */}
            <div className="relative h-48 bg-slate-100 dark:bg-slate-800 shrink-0">
              {selectedHostel.thumbnail?.url ? (
                <img src={selectedHostel.thumbnail.url} alt={selectedHostel.name} className="w-full h-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-slate-300"><Building className="h-16 w-16" /></div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 to-transparent"></div>
              
              <button
                onClick={() => setSelectedHostel(null)}
                className="absolute right-4 top-4 h-8 w-8 flex items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition"
              >
                <X className="h-4.5 w-4.5" />
              </button>

              <div className="absolute bottom-4 left-6 text-white space-y-1">
                <Badge className="bg-blue-600 border-none text-white font-extrabold">{selectedHostel.type} Only</Badge>
                <h2 className="font-display text-xl font-bold">{selectedHostel.name}</h2>
                <p className="text-xs text-slate-200 font-medium flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-blue-400" /> {selectedHostel.address}, {selectedHostel.city}
                </p>
              </div>
            </div>

            {/* Scrollable details contents */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin text-sm leading-relaxed text-slate-600 dark:text-slate-350">
              
              {/* Owner card */}
              <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-3">
                <h3 className="font-display font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                  <User className="h-4.5 w-4.5 text-blue-500" /> Owner Registration Info
                </h3>
                <div className="grid gap-3 font-semibold text-xs text-slate-500 dark:text-slate-400 sm:grid-cols-3">
                  <span>Name: <span className="text-slate-750 dark:text-slate-200">{selectedHostel.owner?.name || "N/A"}</span></span>
                  <span>Email: <span className="text-slate-750 dark:text-slate-200">{selectedHostel.owner?.email || "N/A"}</span></span>
                  <span>Phone: <span className="text-slate-750 dark:text-slate-200">{selectedHostel.owner?.phone || "N/A"}</span></span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h4 className="font-display font-bold text-slate-800 dark:text-white">Listing Description</h4>
                <p className="whitespace-pre-line text-xs leading-relaxed">{selectedHostel.description}</p>
              </div>

              {/* Pricing breakdown */}
              <div className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-5">
                <h4 className="font-display font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                  <DollarSign className="h-4.5 w-4.5 text-blue-500" /> Pricing Structure
                </h4>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 font-semibold text-xs text-center">
                  <div className="bg-blue-50/40 border border-blue-100 p-3 rounded-xl">
                    <span className="text-slate-400 uppercase text-[10px]">Monthly Rent</span>
                    <p className="font-black text-blue-600 mt-0.5">{formatCurrency(selectedHostel.pricing.monthlyRent)}</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400 uppercase text-[10px]">Deposit</span>
                    <p className="font-black text-slate-700 dark:text-slate-200 mt-0.5">{formatCurrency(selectedHostel.pricing.securityDeposit)}</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400 uppercase text-[10px]">Mess Charges</span>
                    <p className="font-black text-slate-700 dark:text-slate-200 mt-0.5">{formatCurrency(selectedHostel.pricing.messCharges)}/mo</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400 uppercase text-[10px]">Internet</span>
                    <p className="font-black text-slate-700 dark:text-slate-200 mt-0.5">{formatCurrency(selectedHostel.pricing.internetCharges)}/mo</p>
                  </div>
                </div>
              </div>

              {/* Infrastructure */}
              <div className="grid gap-4 sm:grid-cols-2 border-t border-slate-100 dark:border-slate-800 pt-5">
                <div className="space-y-2">
                  <h4 className="font-display font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                    <Layers className="h-4.5 w-4.5 text-blue-500" /> Setup & Rooms
                  </h4>
                  <ul className="text-xs space-y-1.5 font-semibold text-slate-500">
                    <li>Floors Count: <span className="text-slate-800 dark:text-slate-200">{selectedHostel.floors} floors</span></li>
                    <li>Total Rooms capacity: <span className="text-slate-800 dark:text-slate-200">{selectedHostel.totalRooms} rooms</span></li>
                    <li>Available Rooms left: <span className="text-slate-800 dark:text-slate-200">{selectedHostel.availableRooms} rooms</span></li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-display font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                    <Sparkles className="h-4.5 w-4.5 text-blue-500" /> Share Categories
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedHostel.roomTypes?.map((r) => (
                      <Badge key={r} className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 font-bold border-none text-[10px]">
                        {r} Room
                      </Badge>
                    )) || <span className="text-xs text-slate-400">None specified</span>}
                  </div>
                </div>
              </div>

              {/* Facilities */}
              <div className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-5">
                <h4 className="font-display font-bold text-slate-800 dark:text-white">Provided Amenities</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedHostel.facilities.map((fac) => (
                    <Badge key={fac} className="bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-300 border-blue-100/50 dark:border-blue-900/30 text-xs px-3 py-1 font-bold">
                      {fac}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Regulations */}
              {selectedHostel.rules && selectedHostel.rules.length > 0 && (
                <div className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-5">
                  <h4 className="font-display font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                    <AlertCircle className="h-4.5 w-4.5 text-amber-500" /> Hostel Rules
                  </h4>
                  <ul className="grid gap-2 text-xs">
                    {selectedHostel.rules.map((rule, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-650 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                          {idx + 1}
                        </span>
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Modal Bottom Actions */}
            <div className="border-t border-slate-100 dark:border-slate-800 p-5 bg-slate-50 dark:bg-slate-950 shrink-0 flex items-center justify-between">
              <div className="text-xs font-semibold text-slate-500">
                Current status:{" "}
                <Badge className="capitalize bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-350 border-none font-bold">
                  {selectedHostel.status}
                </Badge>
              </div>

              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setSelectedHostel(null)}>
                  Close
                </Button>

                {(selectedHostel.status === "pending" || selectedHostel.status === "draft" || selectedHostel.status === "rejected" || selectedHostel.status === "unpublished") && (
                  <Button
                    type="button"
                    size="sm"
                    onClick={(e) => handleApprove(selectedHostel._id, e)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                  >
                    Approve Listing
                  </Button>
                )}

                {(selectedHostel.status === "pending" || selectedHostel.status === "draft" || selectedHostel.status === "approved" || selectedHostel.status === "published") && (
                  <Button
                    type="button"
                    size="sm"
                    onClick={(e) => handleReject(selectedHostel._id, e)}
                    className="bg-rose-600 hover:bg-rose-700 text-white font-bold"
                  >
                    Reject Listing
                  </Button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
