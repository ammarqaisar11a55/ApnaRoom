"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth-store";
import { BarChart, Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, PieChart, Pie, Cell } from "recharts";
import { BedDouble, Building2, CalendarCheck, CreditCard, Users } from "lucide-react";
import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { PageHeader } from "@/components/dashboard/dashboard-shell";
import { MetricCard } from "@/components/dashboard/metric-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const fallback = {
  metrics: {
    totalHostels: 0,
    publishedHostels: 0,
    totalBookings: 0,
    pendingBookings: 0,
    activeTenants: 0,
    occupancyRate: 0,
    availableRooms: 0,
    monthlyRevenueTotal: 0,
    mostBookedHostel: "No bookings yet",
  },
  monthlyRevenue: [
    { month: "2026-01", revenue: 180000, bookings: 8 },
    { month: "2026-02", revenue: 224000, bookings: 10 },
    { month: "2026-03", revenue: 260000, bookings: 12 },
    { month: "2026-04", revenue: 318000, bookings: 14 },
    { month: "2026-05", revenue: 286000, bookings: 11 },
  ],
  roomStats: [
    { name: "Available", value: 14 },
    { name: "Full", value: 22 },
    { name: "Maintenance", value: 3 },
  ],
};

export default function DashboardPage() {
  const [data, setData] = useState(fallback);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === "admin") {
      navigate("/dashboard/admin/hostels", { replace: true });
      return;
    }

    api.get("/hostels/analytics/summary")
      .then((response) => setData(response.data))
      .catch(() => setData(fallback))
      .finally(() => setLoading(false));
  }, [user, navigate]);

  if (loading) {
    return (
      <div>
        <PageHeader title="Dashboard Overview" description="Loading current hostel performance..." />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-32" />)}
        </div>
      </div>
    );
  }

  const colors = ["rgb(37, 99, 235)", "rgb(30, 64, 175)", "rgb(217, 119, 6)"];

  return (
    <div>
      <PageHeader title="Dashboard Overview" description="Track bookings, rooms, revenue, tenants, and owner actions from one workspace." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Monthly revenue" value={formatCurrency(data.metrics.monthlyRevenueTotal)} helper="Paid and partial bookings" icon={CreditCard} />
        <MetricCard title="Occupancy rate" value={`${data.metrics.occupancyRate}%`} helper={`${data.metrics.availableRooms} rooms available`} icon={BedDouble} />
        <MetricCard title="Total bookings" value={data.metrics.totalBookings} helper={`${data.metrics.pendingBookings} pending requests`} icon={CalendarCheck} />
        <MetricCard title="Active tenants" value={data.metrics.activeTenants} helper={data.metrics.mostBookedHostel} icon={Users} />
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[1.4fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>Monthly revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Bar dataKey="revenue" fill="rgb(37, 99, 235)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Available rooms statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data.roomStats} dataKey="value" nameKey="name" innerRadius={65} outerRadius={105} paddingAngle={4}>
                    {data.roomStats.map((_, index) => <Cell key={index} fill={colors[index % colors.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs font-semibold text-slate-600 dark:text-slate-400">
              {data.roomStats.map((item) => <span key={item.name}>{item.name}: {item.value}</span>)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Owner checklist</CardTitle></CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {["Publish at least one hostel", "Add room-level pricing", "Reply to pending reviews", "Review unpaid bookings"].map((item) => (
              <div key={item} className="rounded-xl border border-slate-200 p-4 text-sm font-semibold dark:border-slate-800">{item}</div>
            ))}
          </CardContent>
        </Card>
        <MetricCard title="Published hostels" value={`${data.metrics.publishedHostels}/${data.metrics.totalHostels}`} helper="Listing visibility" icon={Building2} />
      </div>
    </div>
  );
}
