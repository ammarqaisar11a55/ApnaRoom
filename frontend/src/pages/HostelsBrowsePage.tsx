import { useEffect, useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Search,
  MapPin,
  Wifi,
  Shield,
  Coffee,
  Phone,
  X,
  SlidersHorizontal,
  Building,
  School,
  Sparkles,
  Heart,
  ChevronRight,
  Info,
  Calendar,
  MessageCircle,
  AlertCircle,
  HelpCircle,
  Maximize2,
  Bookmark,
  CheckCircle2,
  Users,
  Compass
} from "lucide-react";
import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import type { Hostel, Paginated } from "@/types/domain";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";


// Utility for facility icons
const FACILITY_ICONS: Record<string, any> = {
  WiFi: Wifi,
  Laundry: Sparkles,
  Mess: Coffee,
  CCTV: Shield,
  "Security Guard": Shield,
  Parking: Compass,
  "Air Conditioning": Sparkles,
  "Attached Bathroom": Building,
  Generator: AlertCircle,
  "Water Cooler": Info,
  "Study Room": School,
  Kitchen: Coffee,
  "Furnished Rooms": Building,
  Geyser: Sparkles,
  Elevator: Compass,
};

const POPULAR_UNIVERSITIES = [
  "NUST",
  "LUMS",
  "FAST-NUCES",
  "COMSATS",
  "Punjab University",
  "IBA Karachi",
  "UET Lahore"
];

const CITIES = [
  "All",
  "Lahore",
  "Islamabad",
  "Karachi",
  "Peshawar",
  "Faisalabad",
  "Multan"
];

export default function HostelsBrowsePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const initialCity = searchParams.get("city") || "All";

  // Search & Filter State
  const [search, setSearch] = useState(initialSearch);
  const [selectedCity, setSelectedCity] = useState(initialCity);
  const [selectedType, setSelectedType] = useState<string>("All");
  const [maxRent, setMaxRent] = useState<number>(35000);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("createdAt-desc");
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(false);

  // Data State
  const [data, setData] = useState<Paginated<Hostel> | null>(null);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedHostel, setSelectedHostel] = useState<Hostel | null>(null);
  const [activeTab, setActiveTab] = useState<"about" | "facilities" | "contact">("about");

  // Load Hostels function
  async function loadHostels() {
    setLoading(true);
    try {
      const params: Record<string, any> = {
        limit: 50,
      };

      if (search) params.search = search;
      if (selectedCity && selectedCity !== "All") params.city = selectedCity;
      if (selectedType && selectedType !== "All") params.type = selectedType;
      if (maxRent) params.maxRent = maxRent;

      // Handle custom sorting keys for backend
      if (sortBy === "price-asc") params.sort = "price-asc";
      else if (sortBy === "price-desc") params.sort = "price-desc";
      else if (sortBy === "views-desc") params.sort = "views-desc";

      const response = await api.get("/hostels/public", { params });
      let items = response.data.items || [];

      // Client-side filtering for available rooms and amenities if backend filter isn't perfect
      if (onlyAvailable) {
        items = items.filter((h: Hostel) => h.availableRooms > 0);
      }
      if (selectedAmenities.length > 0) {
        items = items.filter((h: Hostel) =>
          selectedAmenities.every((amenity) => h.facilities.includes(amenity))
        );
      }

      setData({
        items,
        pagination: response.data.pagination || { page: 1, limit: 50, total: items.length, pages: 1 },
      });
    } catch (error) {
      console.error("Failed to load hostels", error);
      setData({ items: [], pagination: { page: 1, limit: 50, total: 0, pages: 1 } });
    } finally {
      setLoading(false);
    }
  }

  // Reload when filters change
  useEffect(() => {
    loadHostels();
  }, [selectedCity, selectedType, maxRent, sortBy, onlyAvailable, selectedAmenities]);

  // Handle manual search trigger
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ search, city: selectedCity });
    loadHostels();
  };

  // Click suggestion tag
  const handleSuggestionClick = (uniName: string) => {
    setSearch(uniName);
    setSearchParams({ search: uniName, city: selectedCity });
    // Execute search
    setTimeout(() => loadHostels(), 50);
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const resetFilters = () => {
    setSearch("");
    setSelectedCity("All");
    setSelectedType("All");
    setMaxRent(35000);
    setSelectedAmenities([]);
    setSortBy("createdAt-desc");
    setOnlyAvailable(false);
    setSearchParams({});
  };

  // Increment views and open quick view modal
  const openQuickView = async (hostel: Hostel) => {
    setSelectedHostel(hostel);
    setActiveTab("about");
    try {
      // Fetch fresh details with view increment trigger
      const res = await api.get(`/hostels/public/${hostel._id}`);
      if (res.data.item) {
        setSelectedHostel(res.data.item);
      }
    } catch (e) {
      console.error("Failed to increment views", e);
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-50/50 pb-12 font-body text-slate-800">
      {/* Floating Header */}
      <Navbar scrolled={true} />

      {/* Spacing for floating navbar */}
      <div className="h-24"></div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Banner Hero */}
        <div className="relative mb-10 overflow-hidden rounded-3xl bg-gradient-to-br from-primary-800 via-primary-700 to-slate-900 px-6 py-12 text-white shadow-lg md:px-12 md:py-16">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl"></div>
          <div className="absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-primary-500/10 blur-3xl"></div>
          
          <div className="relative z-10 max-w-3xl space-y-6">
            <Badge className="border-blue-400/30 bg-blue-500/10 text-blue-300 font-semibold px-3 py-1">
              <Sparkles className="mr-1 h-3.5 w-3.5 text-blue-300" /> Student Spaces Made Easy
            </Badge>
            <h1 className="font-display text-4xl font-extrabold tracking-tight md:text-5xl">
              Find Your Perfect Safe Haven
            </h1>
            <p className="text-lg text-slate-300">
              Browse fully verified hostels, secure rooms, and student spaces close to major universities in Pakistan.
            </p>

            {/* Premium Search Bar */}
            <form onSubmit={handleSearchSubmit} className="flex flex-col gap-3 sm:flex-row max-w-2xl bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-300" />
                <Input
                  className="w-full border-none bg-transparent pl-10 pr-4 text-white placeholder-slate-300 outline-none focus-visible:ring-0 focus-visible:ring-offset-0 h-11"
                  placeholder="Enter university, city, or hostel name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Button type="submit" size="default" className="h-11 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md active:scale-95 transition-all">
                Search Room
              </Button>
            </form>

            {/* Popular Universities suggestions */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-sm font-medium text-slate-300">Popular Universities:</span>
              {POPULAR_UNIVERSITIES.map((uni) => (
                <button
                  key={uni}
                  type="button"
                  onClick={() => handleSuggestionClick(uni)}
                  className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs font-semibold text-white transition hover:bg-white/15"
                >
                  {uni}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Filters and List Grid */}
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* Filters Sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-28 lg:h-[calc(100vh-140px)] lg:overflow-y-auto lg:pr-2 scrollbar-thin">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="flex items-center gap-2 font-display text-lg font-bold text-primary-800">
                  <SlidersHorizontal className="h-4.5 w-4.5 text-blue-600" />
                  Filters
                </h3>
                <button
                  onClick={resetFilters}
                  className="text-xs font-semibold text-blue-600 transition hover:text-blue-800 hover:underline"
                >
                  Reset All
                </button>
              </div>

              {/* City Selection */}
              <div className="mb-6 space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">City</label>
                <div className="flex flex-wrap gap-1.5">
                  {CITIES.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setSelectedCity(c)}
                      className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
                        selectedCity === c
                          ? "bg-blue-600 text-white shadow-sm"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hostel Type */}
              <div className="mb-6 space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Gender Specific</label>
                <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl">
                  {["All", "Boys", "Girls"].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setSelectedType(t)}
                      className={`rounded-lg py-1.5 text-xs font-bold text-center transition-all ${
                        selectedType === t
                          ? "bg-white text-primary-800 shadow-sm"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rent Limit */}
              <div className="mb-6 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
                  <span>Max Monthly Rent</span>
                  <span className="text-blue-600 lowercase font-semibold">{formatCurrency(maxRent)}</span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="50000"
                  step="1000"
                  value={maxRent}
                  onChange={(e) => setMaxRent(Number(e.target.value))}
                  className="h-1.5 w-full cursor-pointer rounded-lg bg-slate-200 accent-blue-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                  <span>PKR 5,000</span>
                  <span>PKR 50,000</span>
                </div>
              </div>

              {/* Only Available Toggle */}
              <div className="mb-6 flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-600">Only Available Rooms</span>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={onlyAvailable}
                    onChange={(e) => setOnlyAvailable(e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                </label>
              </div>

              {/* Popular Amenities Checklist */}
              <div className="space-y-3 border-t border-slate-100 pt-5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Amenities</label>
                <div className="grid gap-2 pt-1">
                  {Object.keys(FACILITY_ICONS).slice(0, 10).map((amenity) => {
                    const IconComponent = FACILITY_ICONS[amenity];
                    return (
                      <label key={amenity} className="flex cursor-pointer items-center gap-3 group">
                        <input
                          type="checkbox"
                          checked={selectedAmenities.includes(amenity)}
                          onChange={() => toggleAmenity(amenity)}
                          className="h-4 w-4 rounded border-slate-300 text-blue-600 accent-blue-600"
                        />
                        <span className="flex items-center gap-2 text-sm text-slate-600 transition group-hover:text-slate-800">
                          {IconComponent && <IconComponent className="h-3.5 w-3.5 text-slate-400" />}
                          {amenity}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          </aside>

          {/* Listings Container */}
          <main className="space-y-6">
            {/* Sorting & Stats Top Bar */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="text-sm font-semibold text-slate-600">
                {loading ? (
                  <span>Searching matching hostels...</span>
                ) : (
                  <span>Found <span className="text-blue-600 font-extrabold">{data?.items.length || 0}</span> student hostels</span>
                )}
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <span className="text-xs font-bold text-slate-400 uppercase">Sort By</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 outline-none focus:border-blue-300"
                >
                  <option value="createdAt-desc">Recently Added</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="views-desc">Popular (Views)</option>
                </select>
              </div>
            </div>

            {/* List Grid */}
            {loading ? (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <Skeleton className="h-48 w-full" />
                    <CardContent className="p-5 space-y-3">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <div className="grid grid-cols-2 gap-2 pt-2">
                        <Skeleton className="h-10 rounded-xl" />
                        <Skeleton className="h-10 rounded-xl" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : data?.items.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-16 text-center shadow-sm">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <Building className="h-8 w-8" />
                </div>
                <h3 className="mt-6 font-display text-xl font-bold text-slate-800">No matching verified hostels</h3>
                <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
                  Try adjusting your search criteria, widening your rent limit, or clearing a few amenity filters to explore more options.
                </p>
                <Button onClick={resetFilters} className="mt-6">
                  Clear All Filters
                </Button>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {data?.items.map((hostel) => {
                  const isFavorited = favorites.includes(hostel._id);
                  const genderTheme =
                    hostel.type === "Girls"
                      ? "bg-rose-50 text-rose-600 border-rose-100"
                      : hostel.type === "Boys"
                      ? "bg-blue-50 text-blue-600 border-blue-100"
                      : "bg-amber-50 text-amber-600 border-amber-100";

                  return (
                    <Card
                      key={hostel._id}
                      className="group flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg cursor-pointer"
                      onClick={() => openQuickView(hostel)}
                    >
                      {/* Image & Badges wrapper */}
                      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                        {hostel.thumbnail?.url ? (
                          <img
                            src={hostel.thumbnail.url}
                            alt={hostel.thumbnail.alt || hostel.name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-blue-50/50 text-blue-600/40">
                            <Building className="h-12 w-12" />
                          </div>
                        )}

                        {/* Top bar floating elements */}
                        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3.5 z-10">
                          <Badge className={`border font-extrabold shadow-sm ${genderTheme}`}>
                            {hostel.type === "Mixed" ? "Coeducation" : `${hostel.type} Only`}
                          </Badge>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(hostel._id);
                            }}
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm transition hover:bg-white active:scale-90"
                            aria-label="Add to favorites"
                          >
                            <Heart
                              className={`h-5 w-5 transition-colors ${
                                isFavorited ? "fill-rose-500 text-rose-500" : "text-slate-400"
                              }`}
                            />
                          </button>
                        </div>

                        {/* Rent float tag */}
                        <div className="absolute bottom-3 left-3 bg-slate-900/85 backdrop-blur-sm rounded-lg px-2.5 py-1 text-xs font-bold text-white shadow-sm">
                          {formatCurrency(hostel.pricing.monthlyRent)}/mo
                        </div>
                      </div>

                      {/* Content Body */}
                      <CardContent className="flex-1 p-5 flex flex-col justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                            <MapPin className="h-3.5 w-3.5 shrink-0 text-blue-500" />
                            <span className="truncate">{hostel.city}</span>
                            <span>•</span>
                            <span className="truncate">{hostel.address}</span>
                          </div>

                          <h4 className="font-display text-base font-bold text-primary-800 group-hover:text-blue-600 transition-colors line-clamp-1">
                            {hostel.name}
                          </h4>

                          {/* Nearby Universities Tags */}
                          {hostel.nearbyUniversities && hostel.nearbyUniversities.length > 0 && (
                            <div className="flex flex-wrap gap-1 pt-1.5">
                              {hostel.nearbyUniversities.slice(0, 2).map((uni, idx) => (
                                <Badge key={idx} className="text-[10px] py-0 px-2 font-bold text-slate-600 border-slate-200">
                                  {uni}
                                </Badge>
                              ))}
                              {hostel.nearbyUniversities.length > 2 && (
                                <span className="text-[10px] font-bold text-slate-400">+{hostel.nearbyUniversities.length - 2} more</span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Card Footer (Facilities + CTA) */}
                        <div className="mt-5 border-t border-slate-100 pt-4 flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            {hostel.facilities.slice(0, 3).map((facility) => {
                              const FacilityIcon = FACILITY_ICONS[facility];
                              return FacilityIcon ? (
                                <div
                                  key={facility}
                                  title={facility}
                                  className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-600"
                                >
                                  <FacilityIcon className="h-4 w-4" />
                                </div>
                              ) : null;
                            })}
                            {hostel.facilities.length > 3 && (
                              <span className="text-xs font-bold text-slate-400">+{hostel.facilities.length - 3}</span>
                            )}
                          </div>

                          <button
                            type="button"
                            className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 transition"
                          >
                            Quick View <ChevronRight className="h-3 w-3" />
                          </button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* QUICK VIEW MODAL (WITH PREMIUM SMOOTH SCALE TRANSITIONS) */}
      {selectedHostel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
          <div
            className="relative w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl transition-all duration-300 scale-100 max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Image */}
            <div className="relative h-60 w-full bg-slate-100">
              {selectedHostel.thumbnail?.url ? (
                <img
                  src={selectedHostel.thumbnail.url}
                  alt={selectedHostel.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-blue-50 text-blue-600">
                  <Building className="h-16 w-16" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent"></div>

              {/* Close Button */}
              <button
                onClick={() => setSelectedHostel(null)}
                className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition hover:bg-white/35 active:scale-95"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Floating Hostel Info on image */}
              <div className="absolute bottom-5 left-6 right-6 text-white space-y-1">
                <div className="flex items-center gap-2">
                  <Badge className="bg-blue-600 text-white font-extrabold border-none shadow-sm">
                    {selectedHostel.type} Only
                  </Badge>
                  <Badge className="bg-emerald-500 text-white font-extrabold border-none shadow-sm flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Verified Listing
                  </Badge>
                </div>
                <h2 className="font-display text-2xl font-black md:text-3xl leading-tight">
                  {selectedHostel.name}
                </h2>
                <div className="flex items-center gap-1.5 text-slate-200 text-sm font-semibold">
                  <MapPin className="h-4.5 w-4.5 text-blue-400" />
                  <span>{selectedHostel.address}, {selectedHostel.city}</span>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-100 bg-slate-50 px-6 pt-2 shrink-0">
              {(["about", "facilities", "contact"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`border-b-2 px-4 py-3 text-sm font-bold uppercase tracking-wider transition-all ${
                    activeTab === tab
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Modal Scroll Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
              {activeTab === "about" && (
                <div className="space-y-6">
                  {/* Monthly pricing highlighted */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-blue-50/50 border border-blue-100 p-4 rounded-2xl">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase">Monthly Rent</p>
                      <p className="font-display text-lg font-black text-blue-600">{formatCurrency(selectedHostel.pricing.monthlyRent)}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase">Security Deposit</p>
                      <p className="font-display text-lg font-black text-primary-800">
                        {selectedHostel.pricing.securityDeposit ? formatCurrency(selectedHostel.pricing.securityDeposit) : "None"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase">Capacity</p>
                      <p className="font-display text-lg font-black text-primary-800">{selectedHostel.availableRooms} / {selectedHostel.totalRooms} Rooms</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase">Views Counter</p>
                      <p className="font-display text-lg font-black text-primary-800">{selectedHostel.analytics?.views || 0} visits</p>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-primary-800 font-display">Overview</h3>
                    <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                      {selectedHostel.description}
                    </p>
                  </div>

                  {/* Nearby Landmarks / Universities */}
                  {selectedHostel.nearbyUniversities && selectedHostel.nearbyUniversities.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-base font-bold text-primary-800 font-display flex items-center gap-2">
                        <School className="h-4.5 w-4.5 text-blue-600" />
                        Close To Universities
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedHostel.nearbyUniversities.map((uni, idx) => (
                          <div
                            key={idx}
                            className="rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 flex items-center gap-1.5"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                            {uni}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Room types capacity detail */}
                  {selectedHostel.roomTypes && selectedHostel.roomTypes.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-base font-bold text-primary-800 font-display flex items-center gap-2">
                        <Building className="h-4.5 w-4.5 text-blue-600" />
                        Available Sharing Categories
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedHostel.roomTypes.map((type) => (
                          <Badge key={type} className="bg-slate-100 text-slate-700 hover:bg-slate-200 border-none font-bold px-3 py-1.5 rounded-lg text-xs">
                            {type} Sharing
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "facilities" && (
                <div className="space-y-6">
                  {/* Facilities Grid */}
                  <div className="space-y-3">
                    <h3 className="text-base font-bold text-primary-800 font-display">Standard Amenities Provided</h3>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {selectedHostel.facilities.map((facility) => {
                        const FacilityIcon = FACILITY_ICONS[facility];
                        return (
                          <div
                            key={facility}
                            className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/50 p-3.5"
                          >
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 shadow-sm">
                              {FacilityIcon ? <FacilityIcon className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
                            </div>
                            <span className="text-sm font-semibold text-slate-700">{facility}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Rules list */}
                  {selectedHostel.rules && selectedHostel.rules.length > 0 && (
                    <div className="space-y-3 border-t border-slate-100 pt-5">
                      <h3 className="text-base font-bold text-primary-800 font-display flex items-center gap-2">
                        <AlertCircle className="h-4.5 w-4.5 text-amber-500" />
                        Hostel Rules & Policies
                      </h3>
                      <ul className="grid gap-2.5">
                        {selectedHostel.rules.map((rule, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-600">
                            <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-amber-50 text-[10px] font-bold text-amber-600 border border-amber-200">
                              {idx + 1}
                            </span>
                            <span>{rule}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Timings */}
                  <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-5 text-sm">
                    <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                      <p className="text-xs font-bold text-slate-400 uppercase">Check-in Timings</p>
                      <p className="mt-1 font-bold text-slate-700">{selectedHostel.timings?.checkIn || "14:00"}</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                      <p className="text-xs font-bold text-slate-400 uppercase">Check-out Timings</p>
                      <p className="mt-1 font-bold text-slate-700">{selectedHostel.timings?.checkOut || "11:00"}</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "contact" && (
                <div className="space-y-6">
                  <div className="text-center p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-600 shadow-inner">
                      <Users className="h-7 w-7" />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-lg text-primary-800">Direct Contact Details</h4>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                        Connect immediately with the hostel administrator to query room availability, timings, or arrange a physical site visit.
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {/* Call Owner */}
                    <a
                      href={`tel:${selectedHostel.contact.phone}`}
                      className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-blue-300 hover:shadow-md transition group"
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:scale-105">
                        <Phone className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase">Phone Call</p>
                        <p className="text-sm font-bold text-slate-700 mt-0.5">{selectedHostel.contact.phone}</p>
                      </div>
                    </a>

                    {/* WhatsApp Direct Chat */}
                    {selectedHostel.contact.whatsapp && (
                      <a
                        href={`https://wa.me/${selectedHostel.contact.whatsapp}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-4 rounded-2xl border border-emerald-200 bg-emerald-50/20 p-5 shadow-sm hover:border-emerald-400 hover:shadow-md transition group"
                      >
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500 text-white transition group-hover:scale-105">
                          <MessageCircle className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-emerald-600 uppercase">WhatsApp Direct</p>
                          <p className="text-sm font-bold text-emerald-800 mt-0.5">{selectedHostel.contact.whatsapp}</p>
                        </div>
                      </a>
                    )}
                  </div>

                  {/* Emergency Numbers */}
                  {selectedHostel.contact.emergency && (
                    <div className="rounded-2xl border border-red-100 bg-red-50/50 p-4 flex items-center gap-3 text-red-700 text-sm">
                      <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
                      <span>
                        <strong>Emergency backup contact:</strong> {selectedHostel.contact.emergency}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Actions Footer */}
            <div className="border-t border-slate-100 p-6 flex flex-col sm:flex-row gap-3 bg-slate-50 shrink-0">
              <a
                href={`tel:${selectedHostel.contact.phone}`}
                className="flex-1 text-center py-3 px-6 rounded-xl bg-gradient-to-r from-primary-700 to-primary-500 hover:from-primary-800 hover:to-primary-600 text-white font-bold shadow-md active:scale-[0.98] transition"
              >
                Inquire & Book Now
              </a>
              <Button
                variant="outline"
                className="h-12 border-slate-200 bg-white hover:bg-slate-100"
                onClick={() => setSelectedHostel(null)}
              >
                Close Quick View
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <div className="mt-20">
        <Footer onNavigate={() => {}} />
      </div>

    </div>
  );
}
