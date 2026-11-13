import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "./useAuthStore";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/hooks/useToast";
import { Orbit, Lock, Mail, User, ArrowRight, AlertCircle } from "lucide-react";

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { register, isLoading, error, clearError } = useAuthStore();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setFormError("");

    if (!name.trim()) {
      setFormError("Name must be at least 2 characters.");
      return;
    }

    if (password.length < 6) {
      setFormError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }

    try {
      await register({ name, email, password });
      toast.success("Account Created", "Welcome to GeoAstra. Workstation ready.");
      navigate("/dashboard", { replace: true });
    } catch (err: any) {
      toast.error("Registration Failed", err.message || "Failed to create account.");
    }
  };

  return (
    <div className="min-h-screen w-screen flex flex-col items-center justify-center bg-surface-main bg-tech-grid p-4 sm:p-6 select-none relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent-secondary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md z-10 space-y-4">
        {/* Header */}
        <div className="text-center space-y-2 mb-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-accent-primary to-accent-secondary shadow-glow mb-2">
            <Orbit className="w-7 h-7 text-surface-main" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
            GeoAstra
            <span className="text-2xs font-mono font-semibold px-1.5 py-0.5 rounded bg-surface-elevated text-accent-primary border border-border-subtle">
              ENROLL
            </span>
          </h1>
          <p className="text-xs font-mono text-content-muted tracking-wide uppercase">
            Hyperspectral Remote Sensing Registration
          </p>
        </div>

        {/* Register Card */}
        <Card variant="elevated" className="border-border-strong/80 shadow-modal">
          <CardHeader className="space-y-1 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Create Analyst Account</CardTitle>
              <Badge variant="secondary" size="sm">
                JWT Auth
              </Badge>
            </div>
            <CardDescription>
              Register your credentials to define AOIs and dispatch scientific jobs.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {(error || formError) && (
              <div className="mb-4 p-3 rounded bg-status-danger/10 border border-status-danger/30 flex items-start gap-2.5 text-xs text-status-danger animate-fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="flex-1 leading-relaxed">
                  {formError || error}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <Input
                label="Full Name"
                type="text"
                placeholder="Dr. Elena Rostova"
                value={name}
                onChange={(e) => setName(e.target.value)}
                leftIcon={<User className="w-4 h-4" />}
                required
              />

              <Input
                label="Official Email"
                type="email"
                placeholder="elena.rostova@geosensing.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="w-4 h-4" />}
                required
              />

              <Input
                label="Password (min 6 characters)"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4" />}
                required
              />

              <Input
                label="Confirm Password"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4" />}
                required
              />

              <Button
                type="submit"
                variant="primary"
                className="w-full mt-4"
                size="md"
                isLoading={isLoading}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Create Analyst Profile
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex items-center justify-between text-xs text-content-muted pt-3 pb-4">
            <span>Already enrolled?</span>
            <Link
              to="/login"
              className="text-accent-primary hover:underline font-medium inline-flex items-center gap-1"
            >
              Sign in to workstation
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

