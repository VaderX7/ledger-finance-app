'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, Mail, Landmark, Shield, Cpu, Scale } from 'lucide-react';
import TruelyMoneyLogo from '@/components/TruelyMoneyLogo';

export default function AboutPage() {
  const router = useRouter();

  const coverages = [
    "Savings Accounts",
    "Fixed Deposits",
    "Loans",
    "Credit Cards",
    "Current Accounts",
    "Government Schemes",
    "Insurance"
  ];

  return (
    <div className="min-h-screen bg-[#070A12] text-white flex flex-col max-w-md mx-auto relative pb-20">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-[#070A12]/95 backdrop-blur-md border-b border-white/[0.06] px-4 py-4 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="p-1.5 rounded-xl hover:bg-white/5 transition-all text-white/70 hover:text-white"
        >
          <ArrowLeft size={18} />
        </button>
        <h1
          className="text-[16px] font-bold"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          About App
        </h1>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 px-5 py-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-6 text-center"
        >
          {/* Logo & Branding */}
          <div className="py-4 space-y-2">
            <div className="flex justify-center mb-4">
              <TruelyMoneyLogo variant="hero" />
            </div>
            <p
              className="text-[12px] text-white/40 italic font-medium"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              India&apos;s honest financial guide
            </p>
            <div className="pt-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/5 border border-white/10 text-white/60">
                Version 1.0.0 (Beta)
              </span>
            </div>
          </div>

          {/* Mission Statement */}
          <div className="space-y-2 text-left p-4 rounded-2xl bg-white/[0.01] border border-white/[0.04]">
            <h3 className="text-[12px] font-bold text-[#C9A96E] uppercase tracking-wider" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Our Mission
            </h3>
            <p
              className="text-[12px] leading-relaxed text-white/60"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 500,
              }}
            >
              Truely Money is built to help everyday Indians make informed, self-guided financial decisions without needing a pushy relationship manager or a biased financial advisor. We believe in providing pure, unmanipulated comparisons so you can build wealth and save money honestly.
            </p>
          </div>

          {/* Coverage Categories */}
          <div className="space-y-3 text-left">
            <h3 className="text-[12px] font-bold text-white/40 uppercase tracking-wider" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              What We Compare
            </h3>
            <div className="flex flex-wrap gap-2">
              {coverages.map((cov, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl text-[11px] font-semibold bg-white/[0.02] border border-white/[0.06] text-white/70"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  {cov}
                </span>
              ))}
            </div>
          </div>

          {/* Declarations (What We Are NOT) */}
          <div className="space-y-2.5 text-left p-4 rounded-2xl bg-red-500/[0.02] border border-red-500/10">
            <div className="flex items-center gap-2 text-red-400">
              <Landmark size={14} />
              <h3 className="text-[12px] font-bold uppercase tracking-wider" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Important Declarations
              </h3>
            </div>
            <p
              className="text-[12px] leading-relaxed text-white/60"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 500,
              }}
            >
              Truely Money operates strictly as an independent information provider. We are **NOT a bank**, **NOT an NBFC**, **NOT a loan broker**, and have **no commercial affiliation** with any financial institution. We do not process loans, open bank accounts, or solicit financial investments.
            </p>
          </div>

          {/* Tech & Data Sourcing */}
          <div className="border-t border-b border-white/[0.04] py-4 space-y-3.5 text-left text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white/40">
                <Cpu size={14} />
                <span>Tech Stack</span>
              </div>
              <span className="font-semibold text-white/70">Next.js, Tailwind CSS, Framer Motion</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white/40">
                <Shield size={14} />
                <span>Data Source</span>
              </div>
              <span className="font-semibold text-white/70 text-right max-w-[200px]">Manually curated bank portals & RBI</span>
            </div>
          </div>

          {/* Legal Compliance Disclaimer */}
          <div className="space-y-2 text-left p-4 rounded-2xl bg-white/[0.01] border border-white/[0.04]">
            <div className="flex items-center gap-2 text-white/40">
              <Scale size={14} />
              <h3 className="text-[12px] font-bold uppercase tracking-wider" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Legal Disclaimer
              </h3>
            </div>
            <p
              className="text-[11px] leading-relaxed text-white/45"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 500,
              }}
            >
              All financial details, calculations, rates, and information provided inside this app are for general reference and educational purposes only. They do not constitute financial advice. Always verify interest rates, processing fees, and full terms on the respective financial institution's official site before completing any application.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => alert("Thank you for your interest! Rating options will be added soon.")}
              className="py-3 px-4 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Star size={14} className="text-yellow-400" />
              <span className="text-xs font-semibold text-white/85" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Rate this App
              </span>
            </button>
            <a
              href="mailto:support@truelymoney.com"
              className="py-3 px-4 rounded-2xl bg-[#C9A96E]/10 hover:bg-[#C9A96E]/15 border border-[#C9A96E]/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Mail size={14} className="text-[#C9A96E]" />
              <span className="text-xs font-semibold text-[#C9A96E]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Contact Support
              </span>
            </a>
          </div>

          {/* Copyright Info */}
          <p
            className="text-[10px] text-white/20 pt-4"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            © 2025 Truely Money. All rights reserved.
          </p>
        </motion.div>
      </main>
    </div>
  );
}
