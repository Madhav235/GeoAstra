import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthLayout } from "../components/AuthLayout";
import { PasswordInput } from "../components/PasswordInput";
import { AuthDivider } from "../components/AuthDivider";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import {
  Mail,
  ArrowRight,
  AlertCircle,
  Sparkles,
  Info,
} from "lucide-react";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const { login, isAuthenticated, isSubmitting, error, clearError } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  // Field touch state for validation
  const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({});
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [forgotModalOpen, setForgotModalOpen] = useState(false);

  // Preserve redirect target from ProtectedRoute
  const from = (location.state as any)?.from?.pathname
    ? (location.state as any).from.pathname + ((location.state as any).from.search || "")
    : "/dashboard";

  // Validate single field
  const validateField = (name: "email" | "password", val: string): string | undefined => {
    if (name === "email") {
      const trimmed = val.trim();
      if (!trimmed) return "Email address is required.";
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmed)) return "Please enter a valid email address.";
    }
    if (name === "password") {
      if (!val) return "Password is required.";
    }
    return undefined;
  };

  // Revalidate on change if touched
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEmail(val);
    clearError();
    if (touched.email) {
      setFieldErrors((prev) => ({ ...prev, email: validateField("email", val) }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPassword(val);
    clearError();
    if (touched.password) {
      setFieldErrors((prev) => ({ ...prev, password: validateField("password", val) }));
    }
  };

  const handleBlur = (field: "email" | "password") => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const val = field === "email" ? email : password;
    setFieldErrors((prev) => ({ ...prev, [field]: validateField(field, val) }));
  };

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    // Mark all as touched
    setTouched({ email: true, password: true });

    const emailErr = validateField("email", email);
    const passErr = validateField("password", password);

    setFieldErrors({ email: emailErr, password: passErr });

    if (emailErr || passErr) {
      return;
    }

    try {
      const user = await login({ email, password, rememberMe });
      toast.success(
        "Authentication Successful",
        `Welcome back, ${user.name}. Workstation session verified.`
      );
      navigate(from, { replace: true });
    } catch {
      // Error message is displayed through the auth store error state
    }
  };

  // Quick fill default demo credentials
  const handleFillDemo = () => {
    setEmail("analyst@geoastra.demo");
    setPassword("GeoAstra@123");
    setFieldErrors({});
    clearError();
    toast.info("Demo Credentials Loaded", "Default analyst account autofilled.");
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    setForgotModalOpen(true);
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in with your analyst credentials to access calibrated datacubes and spectral processing pipelines."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Global Error Banner */}
        {error && (
          <div className="p-3 rounded-lg bg-status-danger/10 border border-status-danger/40 flex items-start gap-2.5 text-xs text-status-danger animate-fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-semibold block">Authentication Failed</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Quick Demo Credentials Pill / Helper */}
        <div className="p-3 rounded-lg bg-surface-secondary/60 border border-accent-primary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-2xs font-mono">
          <div className="space-y-0.5">
            <span className="text-accent-primary font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              DEMO ANALYST ACCOUNT
            </span>
            <span className="text-content-muted block">
              analyst@geoastra.demo • GeoAstra@123
            </span>
          </div>
          <button
            type="button"
            onClick={handleFillDemo}
            className="px-2.5 py-1 rounded bg-accent-primary/10 hover:bg-accent-primary/20 text-accent-primary border border-accent-primary/30 font-semibold transition-colors shrink-0 text-left sm:text-center"
          >
            Fill Demo Account
          </button>
        </div>

        {/* Email Field */}
        <Input
          label="Analyst Email Address"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="analyst@geoastra.demo"
          value={email}
          onChange={handleEmailChange}
          onBlur={() => handleBlur("email")}
          error={touched.email ? fieldErrors.email : undefined}
          leftIcon={<Mail className="w-4 h-4 text-content-muted" />}
          disabled={isSubmitting}
        />

        {/* Password Field */}
        <PasswordInput
          label="Workstation Password"
          name="password"
          autoComplete="current-password"
          placeholder="••••••••••••"
          value={password}
          onChange={handlePasswordChange}
          onBlur={() => handleBlur("password")}
          error={touched.password ? fieldErrors.password : undefined}
          disabled={isSubmitting}
        />

        {/* Remember Me & Forgot Password Row */}
        <div className="flex items-center justify-between pt-1">
          <Checkbox
            label={<span className="text-xs text-content-secondary">Remember me</span>}
            description="Persists session across browser restarts"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            disabled={isSubmitting}
          />

          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-xs text-accent-primary hover:underline font-medium transition-colors"
          >
            Forgot password?
          </button>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isSubmitting}
            disabled={isSubmitting}
            className="w-full justify-center"
            rightIcon={!isSubmitting ? <ArrowRight className="w-4 h-4" /> : undefined}
          >
            {isSubmitting ? "Authenticating Session..." : "Sign In to Workstation"}
          </Button>
        </div>

        <AuthDivider label="OR" />

        {/* Register Link */}
        <div className="text-center text-xs text-content-secondary">
          <span>Need a workstation account? </span>
          <Link
            to="/register"
            className="text-accent-primary font-semibold hover:underline transition-colors"
          >
            Register new analyst
          </Link>
        </div>
      </form>

      {/* Forgot Password Informational Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 bg-surface-main/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-lg bg-surface-elevated border border-border-strong p-5 shadow-2xl space-y-4 animate-scale-up text-left">
            <div className="flex items-center gap-2.5 text-accent-primary">
              <Info className="w-5 h-5" />
              <h3 className="text-sm font-semibold text-content-primary">
                Mock Password Recovery
              </h3>
            </div>
            <p className="text-xs text-content-secondary leading-relaxed">
              This is a client-side demonstration workstation. Password recovery emails are not sent.
              You can log in directly using the pre-configured demo account:
            </p>
            <div className="p-3 rounded bg-surface-secondary/60 border border-border-subtle font-mono text-2xs space-y-1">
              <div><span className="text-content-muted">Email:</span> <span className="text-content-primary">analyst@geoastra.demo</span></div>
              <div><span className="text-content-muted">Password:</span> <span className="text-accent-primary">GeoAstra@123</span></div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setForgotModalOpen(false);
                  handleFillDemo();
                }}
              >
                Use Demo Account
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setForgotModalOpen(false)}
              >
                Dismiss
              </Button>
            </div>
          </div>
        </div>
      )}
    </AuthLayout>
  );
};
