"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/auth/forgot-password", { email });
      toast.success(data.message);
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Could not start reset");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-900">
      <h1 className="font-display text-2xl font-bold text-primary-800 dark:text-white">Reset password</h1>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Enter your owner email to generate reset instructions.</p>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold">Email</span>
          <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </label>
        <Button className="w-full" disabled={loading}>{loading ? "Sending..." : "Send reset link"}</Button>
      </form>
      <Link to="/login" className="mt-5 block text-center text-sm font-semibold text-primary-700 dark:text-primary-300">Back to sign in</Link>
    </div>
  );
}
