"use client";

import { useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";
import { PageHeader } from "@/components/dashboard/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const user = useAuthStore((state) => state.user);
  const setSession = useAuthStore((state) => state.setSession);
  const token = useAuthStore((state) => state.token);
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [city, setCity] = useState(user?.city || "");
  const [hostelName, setHostelName] = useState(user?.hostelName || "");
  const [notificationPreferences, setNotificationPreferences] = useState({
    bookings: user?.notificationPreferences?.bookings ?? true,
    payments: user?.notificationPreferences?.payments ?? true,
    reviews: user?.notificationPreferences?.reviews ?? true,
    marketing: user?.notificationPreferences?.marketing ?? false,
  });
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "" });

  async function saveProfile() {
    try {
      const { data } = await api.put("/auth/profile", { name, phone, city, hostelName, notificationPreferences });
      if (token) setSession(token, data.user);
      toast.success("Profile updated");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Profile update failed");
    }
  }

  async function changePassword(event: React.FormEvent) {
    event.preventDefault();
    try {
      await api.put("/auth/change-password", passwords);
      toast.success("Password changed");
      setPasswords({ currentPassword: "", newPassword: "" });
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Password change failed");
    }
  }

  return (
    <div>
      <PageHeader title="Settings" description="Update profile, change password, hostel policies, and notification preferences." />
      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Owner profile</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <label className="block"><span className="mb-2 block text-sm font-semibold">Name</span><Input value={name} onChange={(event) => setName(event.target.value)} /></label>
            <label className="block"><span className="mb-2 block text-sm font-semibold">Phone</span><Input value={phone} onChange={(event) => setPhone(event.target.value)} /></label>
            <label className="block"><span className="mb-2 block text-sm font-semibold">City</span><Input value={city} onChange={(event) => setCity(event.target.value)} /></label>
            <label className="block"><span className="mb-2 block text-sm font-semibold">Default hostel name</span><Input value={hostelName} onChange={(event) => setHostelName(event.target.value)} /></label>
            <Button onClick={saveProfile}>Save profile</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Change password</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={changePassword} className="space-y-4">
              <label className="block"><span className="mb-2 block text-sm font-semibold">Current password</span><Input type="password" value={passwords.currentPassword} onChange={(event) => setPasswords((prev) => ({ ...prev, currentPassword: event.target.value }))} /></label>
              <label className="block"><span className="mb-2 block text-sm font-semibold">New password</span><Input type="password" value={passwords.newPassword} onChange={(event) => setPasswords((prev) => ({ ...prev, newPassword: event.target.value }))} /></label>
              <Button>Change password</Button>
            </form>
          </CardContent>
        </Card>
        <Card className="xl:col-span-2">
          <CardHeader><CardTitle>Notification preferences</CardTitle></CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["bookings", "Booking requests"],
              ["payments", "Payment updates"],
              ["reviews", "Reviews"],
              ["marketing", "Product news"],
            ].map(([key, label]) => (
              <label key={key} className="flex min-h-12 cursor-pointer items-center justify-between rounded-xl border border-slate-200 px-4 text-sm font-semibold dark:border-slate-800">
                {label}
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-blue-600"
                  checked={notificationPreferences[key as keyof typeof notificationPreferences]}
                  onChange={(event) => setNotificationPreferences((prev) => ({ ...prev, [key]: event.target.checked }))}
                />
              </label>
            ))}
            <div className="sm:col-span-2 lg:col-span-4"><Button onClick={saveProfile}>Save preferences</Button></div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
