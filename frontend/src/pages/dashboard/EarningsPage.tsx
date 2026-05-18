import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CreditCard, WalletCards } from "lucide-react";
import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { PageHeader } from "@/components/dashboard/dashboard-shell";
import { MetricCard } from "@/components/dashboard/metric-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type EarningsData = {
  metrics: {
    monthlyRevenueTotal: number;
    totalBookings: number;
    pendingBookings: number;
    occupancyRate: number;
  };
  monthlyRevenue: Array<{ month: string; revenue: number; bookings: number }>;
};

export default function EarningsPage() {
  const [data, setData] = useState<EarningsData | null>(null);

  useEffect(() => {
    api.get("/hostels/analytics/summary").then((response) => setData(response.data));
  }, []);

  if (!data) return <Skeleton className="h-96" />;

  return (
    <div>
      <PageHeader title="Earnings" description="Revenue, occupancy, paid bookings, partial payments, and cash flow summaries." />
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard title="Collected revenue" value={formatCurrency(data.metrics.monthlyRevenueTotal)} helper="Paid and partial booking value" icon={CreditCard} />
        <MetricCard title="Booking volume" value={data.metrics.totalBookings} helper={`${data.metrics.pendingBookings} pending requests`} icon={WalletCards} />
        <MetricCard title="Occupancy health" value={`${data.metrics.occupancyRate}%`} helper="Based on occupied beds" icon={CreditCard} />
      </div>
      <Card className="mt-6">
        <CardHeader><CardTitle>Monthly revenue trend</CardTitle></CardHeader>
        <CardContent>
          <div className="h-96">
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
    </div>
  );
}
