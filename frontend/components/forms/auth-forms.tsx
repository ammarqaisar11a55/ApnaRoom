"use client";

import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Building2, Loader2, Mail, Phone, Lock, UserRound } from "lucide-react";
import { api } from "@/lib/api";
import { loginSchema, signupSchema } from "@/lib/schemas";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { z } from "zod";

type LoginValues = z.infer<typeof loginSchema>;
type SignupValues = z.infer<typeof signupSchema>;

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs font-medium text-error-600">{message}</p>;
}

export function LoginForm() {
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);
  const form = useForm<LoginValues>({ resolver: zodResolver(loginSchema), defaultValues: { email: "", password: "" } });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const { data } = await api.post("/auth/login", values);
      setSession(data.token, data.user);
      toast.success("Welcome back to ApnaRoom.");
      navigate(data.user.role === 'student' ? '/hostels' : '/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Login failed");
    }
  });

  return (
    <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-6">
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-700 dark:bg-primary-900 dark:text-primary-300">
          <Building2 className="h-5 w-5" />
        </div>
        <h1 className="font-display text-2xl font-bold text-primary-800 dark:text-white">Owner sign in</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Access your hostel dashboard securely.</p>
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        <label className="block">
          <span className="mb-2 flex items-center gap-2 text-sm font-semibold"><Mail className="h-4 w-4" /> Email</span>
          <Input type="email" placeholder="owner@apnaroom.com" {...form.register("email")} />
          <FieldError message={form.formState.errors.email?.message} />
        </label>
        <label className="block">
          <span className="mb-2 flex items-center gap-2 text-sm font-semibold"><Lock className="h-4 w-4" /> Password</span>
          <Input type="password" placeholder="Minimum 8 characters" {...form.register("password")} />
          <FieldError message={form.formState.errors.password?.message} />
        </label>
        <div className="flex items-center justify-between text-sm">
          <label className="flex cursor-pointer items-center gap-2 text-slate-600 dark:text-slate-400">
            <input type="checkbox" className="h-4 w-4 rounded border-slate-300 accent-primary-600" />
            Remember me
          </label>
          <Link to="/forgot-password" className="font-semibold text-primary-700 hover:text-primary-800 dark:text-primary-300">Forgot password?</Link>
        </div>
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />} Sign in
        </Button>
      </form>
      <p className="mt-5 text-center text-sm text-slate-600 dark:text-slate-400">
        New owner? <Link className="font-semibold text-primary-700 dark:text-primary-300" to="/signup">Create account</Link>
      </p>
    </div>
  );
}

export function SignupForm() {
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);
  const form = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", phone: "", password: "", city: "", hostelName: "" },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const { data } = await api.post("/auth/register", { ...values, role: "owner" });
      setSession(data.token, data.user);
      toast.success("Owner account created.");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Signup failed");
    }
  });

  return (
    <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-900">
      <h1 className="font-display text-2xl font-bold text-primary-800 dark:text-white">Create owner account</h1>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Start managing your hostel listings, rooms, and bookings.</p>
      <form onSubmit={onSubmit} className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 flex items-center gap-2 text-sm font-semibold"><UserRound className="h-4 w-4" /> Full name</span>
          <Input {...form.register("name")} />
          <FieldError message={form.formState.errors.name?.message} />
        </label>
        <label className="block">
          <span className="mb-2 flex items-center gap-2 text-sm font-semibold"><Phone className="h-4 w-4" /> Phone</span>
          <Input {...form.register("phone")} />
          <FieldError message={form.formState.errors.phone?.message} />
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-2 flex items-center gap-2 text-sm font-semibold"><Mail className="h-4 w-4" /> Email</span>
          <Input type="email" {...form.register("email")} />
          <FieldError message={form.formState.errors.email?.message} />
        </label>
        <label className="block">
          <span className="mb-2 text-sm font-semibold">City</span>
          <Input {...form.register("city")} />
          <FieldError message={form.formState.errors.city?.message} />
        </label>
        <label className="block">
          <span className="mb-2 text-sm font-semibold">Hostel name</span>
          <Input {...form.register("hostelName")} />
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-2 flex items-center gap-2 text-sm font-semibold"><Lock className="h-4 w-4" /> Password</span>
          <Input type="password" {...form.register("password")} />
          <FieldError message={form.formState.errors.password?.message} />
        </label>
        <Button type="submit" className="sm:col-span-2" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />} Create account
        </Button>
      </form>
      <p className="mt-5 text-center text-sm text-slate-600 dark:text-slate-400">
        Already registered? <Link className="font-semibold text-primary-700 dark:text-primary-300" to="/login">Sign in</Link>
      </p>
    </div>
  );
}
