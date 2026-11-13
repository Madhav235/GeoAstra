import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "./useAuthStore";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Divider } from "@/components/ui/Divider";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/hooks/useToast";
import { Orbit, Lock, Mail, ArrowRight, ShieldCheck, Terminal, AlertCircle } from "lucide-react";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const { login, loginDemo, isLoading, error, clearError } = useAuthStore();

  const [email, setEmail] = useState("alex.mercer@geoastra.io");
  const [password, setPassword] = useState("Password123!");
  const [formError, setFormError] = useState("");

  const from = (location.state as any)?.from?.pathname || "/dashboard";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setFormError("");

    if (!email || !password) {
      setFormError("Both email and password are required.");
      return;
    }

    try {
      await login({ email, password });
      toast.success("Welcome back", "Authenticated session active.");
      navigate(from, { replace: true });
    } catch (err: any) {
      toast.error("Sign In Failed", err.message || "Invalid email or password.");
    }
  };

  const handleDemoLogin = () => {
    loginDemo("Lead Remote Sensing Scientist");
    toast.success("Demo Mode Activated", "Signed in as Lead Analyst Alex Mercer.");
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen w-screen flex flex-col items-center justify-center bg-surface-main bg-tech-grid p-4 sm:p-6 select-none relative overflow-hidden">
      {/* Subtle radial ambient background light */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent-primary/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-md z-10 space-y-4">
        {/* Workstation Header */}
        <div className="text-center space-y-2 mb-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-accent-primary to-accent-secondary shadow-glow mb-2">
            <Orbit className="w-7 h-7 text-surface-main" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
            GeoAstra
            <span className="text-2xs font-mono font-semibold px-1.5 py-0.5 rounded bg-surface-elevated text-accent-primary border border-border-subtle">
              PRO
            </span>
          </h1>
          <p className="text-xs font-mono text-content-muted tracking-wide uppercase">
            Hyperspectral Intelligence & Geospatial Workstation
          </p>
        </div>

        {/* Login Card */}
        <Card variant="elevated" className="border-border-strong/80 shadow-modal">
          <CardHeader className="space-y-1 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Researcher Sign In</CardTitle>
              <Badge variant="primary" size="sm">
                EPSG:4326
              </Badge>
            </div>
            <CardDescription>
              Enter your credentials to access processing pipelines and scene catalogs.
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

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                placeholder="analyst@geoastra.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="w-4 h-4" />}
                required
              />

              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4" />}
                required
              />

              <Button
                type="submit"
                variant="primary"
                className="w-full mt-2"
                size="md"
                isLoading={isLoading}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Sign In to Workstation
              </Button>
            </form>

            <Divider label="OR QUICK ACCESS" />

            {/* Quick Demo Sign In Button */}
            <Button
              type="button"
              variant="outline"
              className="w-full text-xs font-mono border-border-strong hover:border-accent-primary/50"
              size="sm"
              leftIcon={<Terminal className="w-3.5 h-3.5 text-status-success" />}
              onClick={handleDemoLogin}
            >
              One-Click Demo Analyst Access
            </Button>
          </CardContent>

          <CardFooter className="flex items-center justify-between text-xs text-content-muted pt-3 pb-4">
            <span>Don't have an account?</span>
            <Link
              to="/register"
              className="text-accent-primary hover:underline font-medium inline-flex items-center gap-1"
            >
              Register here
            </Link>
          </CardFooter>
        </Card>

        {/* Telemetry Footer */}
        <div className="flex items-center justify-center gap-4 text-2xs font-mono text-content-muted/80">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-status-success" />
            Backend Port 5001
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3 h-3 text-accent-primary" />
            BullMQ Queue Active
          </span>
          <span>•</span>
          <span>FastAPI 8000</span>
        </div>
      </div>
    </div>
  );
};

