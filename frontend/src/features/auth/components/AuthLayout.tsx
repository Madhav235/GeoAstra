import React from "react";
import { AuthBranding } from "./AuthBranding";
import { Orbit } from "lucide-react";

export interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
}) => {
  return (
    <div className="min-h-screen w-screen bg-surface-main bg-tech-grid flex items-center justify-center p-4 sm:p-6 lg:p-8 select-none relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-secondary/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Split Container */}
      <div className="w-full max-w-5xl rounded-xl border border-border-subtle bg-surface-panel/90 backdrop-blur-md shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[620px] z-10">
        {/* Left: Branding Column (5 cols on lg, hidden on mobile/tablet) */}
        <div className="hidden lg:block lg:col-span-5 border-r border-border-subtle bg-surface-secondary/40">
          <AuthBranding />
        </div>

        {/* Right: Auth Form Column (7 cols on lg, full width on small) */}
        <div className="lg:col-span-7 flex flex-col justify-center p-6 sm:p-10 lg:p-12">
          {/* Mobile-only Branding Header */}
          <div className="lg:hidden flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-surface-elevated border border-accent-primary/40 flex items-center justify-center text-accent-primary shadow-glow">
              <Orbit className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <span className="font-mono text-base font-bold text-content-primary">
                GeoAstra
              </span>
              <p className="text-2xs font-mono uppercase tracking-wider text-accent-primary">
                Hyperspectral Intelligence
              </p>
            </div>
          </div>

          {/* Form Header */}
          <div className="space-y-1.5 mb-6 text-left">
            <h2 className="text-xl sm:text-2xl font-bold text-content-primary tracking-tight">
              {title}
            </h2>
            <p className="text-xs text-content-secondary leading-relaxed">
              {subtitle}
            </p>
          </div>

          {/* Form Body */}
          <div className="w-full">{children}</div>
        </div>
      </div>
    </div>
  );
};
