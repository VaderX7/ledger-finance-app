'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

export default function PrivacyPage() {
  const router = useRouter();

  const sections = [
    {
      title: "1. Introduction & Identity of Data Fiduciary",
      content: "Truely Money (referred to as \"we\", \"us\", or \"our\") operates as an independent information and comparison platform. We act as the Data Fiduciary under the Digital Personal Data Protection Act, 2023 (DPDP Act). We are not a bank, NBFC, broker, or financial advisor, and we maintain no affiliation with any financial institution or regulatory body."
    },
    {
      title: "2. Scope of Application",
      content: "This Privacy Policy governs your use of the Truely Money web application, mobile interfaces, and the website truelymoney.com. By accessing or using the platform, you acknowledge and agree to the terms outlined in this policy."
    },
    {
      title: "3. What Personal Data We Collect",
      content: "We believe in extreme data minimization. The only data collected is what you voluntarily input during setup (such as a profile nickname, and optionally your age range or approximate income class to filter eligible products). We do NOT collect, ask for, or store sensitive personal identifiers like PAN card numbers, Aadhaar details, passport copies, phone numbers, email addresses (unless you contact support), bank account details, or payment card info."
    },
    {
      title: "4. Data Storage & Localisation",
      content: "All user-specific preferences, names, favorited products, and recently viewed histories are stored exclusively on your own device's local storage (localStorage). We do not transmit this data to any remote servers, cloud hosts, or databases. Cleansing your browser history or resetting the application will immediately and permanently erase all this data from your device."
    },
    {
      title: "5. Financial Product Data Accuracy",
      content: "The interest rates, tenure specifications, eligibility values, and rules presented in this app are fetched from publicly accessible bank portals via Google Sheets. This data is updated periodically but is not real-time. Truely Money is not liable for discrepancies; users must verify all terms directly with the bank before initiating any applications."
    },
    {
      title: "6. Data Processors & Third-Party Services",
      content: "We utilize minimal third-party systems to operate: (a) Google Sheets: Used to store and read public product listing data. No user data is sent here. (b) Gemini AI API: Used anonymously to generate contextual financial tips; no personal details are sent in these prompts. (c) Firebase: Used exclusively if you decide to explicitly sign in to sync preferences, which is governed under Google's Privacy Policy."
    },
    {
      title: "7. Children's Privacy",
      content: "Truely Money is not designed for or targeted at individuals under the age of 18. We do not knowingly collect or solicit personal data from minors. If you are under 18, please do not use the app or input any information."
    },
    {
      title: "8. User Rights under the DPDP Act, 2023",
      content: "In compliance with the DPDP Act 2023, you hold full rights over your data: (a) Right to Access: You can view all saved information on your profile page. (b) Right to Correction & Erasure: You can modify your name, or clear all data instantly by clearing your browser's local storage or using the Log Out function. (c) Right to Grievance Redressal: You may contact our Grievance Officer to resolve data queries."
    },
    {
      title: "9. Grievance Officer & Statutory Compliance",
      content: "As mandated by the Information Technology Act, 2000 (and associated Rules), the contact details of our Grievance Officer are:\nName: Grievance Officer, Truely Money\nEmail: support@truelymoney.com\nWe will address and resolve any concerns or complaints within 30 days of receipt."
    },
    {
      title: "10. No Cookies & Analytics Tracking",
      content: "To guarantee user privacy, Truely Money does not implement browser cookies, tracking pixels, third-party advertising SDKs, or web analytics scripts (like Google Analytics). Your navigation flow inside the app remains completely anonymous and unmonitored."
    },
    {
      title: "11. No Sale or Commercialization of Data",
      content: "We do not sell, rent, trade, or share user preferences or data with third-party advertising agencies, lead-generation companies, or brokers for commercial gain."
    },
    {
      title: "12. Disclaimer & Financial Advice",
      content: "Truely Money is an informational search directory. Nothing within this application constitutes financial, investment, or tax advice. We recommend consulting a SEBI-registered financial advisor or your banking partner before finalizing any transaction."
    },
    {
      title: "13. Changes to this Policy",
      content: "We may update this Privacy Policy from time to time. Any changes will be updated in-app, and your continued usage of the platform constitutes acceptance of those changes."
    },
    {
      title: "14. Effective Date",
      content: "This Privacy Policy is effective as of June 2025."
    }
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
          Privacy Policy
        </h1>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 px-5 py-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-6"
        >
          {/* Header intro */}
          <div className="text-center py-2 space-y-1">
            <div className="w-10 h-10 rounded-2xl bg-[#C9A96E]/10 flex items-center justify-center mx-auto mb-2 border border-[#C9A96E]/20">
              <ShieldCheck size={20} className="text-[#C9A96E]" />
            </div>
            <h2 className="text-[14px] font-bold text-white/90" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Privacy & Legal Declarations
            </h2>
            <p className="text-[11px] text-white/40 max-w-xs mx-auto leading-relaxed">
              Compliant with the Indian Information Technology Act, 2000 and Digital Personal Data Protection Act, 2023.
            </p>
          </div>

          {/* Privacy Sections */}
          <div className="space-y-5">
            {sections.map((sec, idx) => (
              <div key={idx} className="space-y-1.5">
                <h3
                  className="text-[12px] font-bold tracking-wide uppercase text-[#C9A96E]"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  {sec.title}
                </h3>
                <p
                  className="text-[12px] leading-relaxed text-white/60 whitespace-pre-line"
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 500,
                  }}
                >
                  {sec.content}
                </p>
                {idx < sections.length - 1 && (
                  <div className="pt-3 border-b border-white/[0.04]" />
                )}
              </div>
            ))}
          </div>

          {/* Footer Contact Details */}
          <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/[0.04] text-center space-y-1 mt-6">
            <p className="text-[11px] text-white/40" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              For queries or to exercise your rights under DPDP Act:
            </p>
            <a
              href="mailto:support@truelymoney.com"
              className="text-[12px] font-semibold text-[#C9A96E] hover:underline"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              support@truelymoney.com
            </a>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
