import React from 'react';
import { ShieldCheck, Lock, Key, Server, Eye, FileText, CheckCircle2 } from 'lucide-react';

export default function TrustAndSecurity() {
  const securityControls = [
    { name: "SSRF URL Protection Guard", status: "ACTIVE", detail: "Blocks requests to loopback (127.0.0.1), RFC1918 private IPs, AWS IMDS (169.254.169.254)", file: "server/utils/ssrfGuard.js" },
    { name: "Prompt Injection Sanitizer", status: "ACTIVE", detail: "Sanitizes raw user inputs to guard against prompt injection vulnerabilities", file: "server/middleware/promptSanitizer.js" },
    { name: "Zod Schema Enforcement", status: "ACTIVE", detail: "Strict runtime payload validation for extract, enrich, validate, and batch routes", file: "server/middleware/validation.js" },
    { name: "Helmet Security Headers", status: "ACTIVE", detail: "HSTS, X-Content-Type-Options, X-Frame-Options protection", file: "api/index.js" },
    { name: "Rate Limiting Middleware", status: "ACTIVE", detail: "Standard rate limiter (100 req/min) & Batch rate limiter (10 batch req/min)", file: "server/middleware/security.js" },
    { name: "Secret Audit Verification", status: "VERIFIED", detail: "Automated scan ensuring zero client-side API key leaks", file: "scripts/audit-secrets.js" }
  ];

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6 font-mono text-xs">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-extrabold text-white tracking-tight">TRUST & SECURITY CENTER</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Verified technical security protections, input sanitization, and governance controls.
          </p>
        </div>

        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl font-bold">
          All Controls Verified
        </span>
      </div>

      {/* Security Controls Table */}
      <div className="space-y-3">
        <div className="text-slate-400 uppercase tracking-wider text-[11px] font-bold">
          Implemented Security Controls:
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {securityControls.map((ctrl, i) => (
            <div key={i} className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs flex items-center space-x-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{ctrl.name}</span>
                </span>
                <span className="px-2 py-0.5 rounded text-[9px] bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                  {ctrl.status}
                </span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">{ctrl.detail}</p>
              <div className="text-[10px] text-slate-500 font-mono">
                Source: <code className="text-amber-400">{ctrl.file}</code>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
