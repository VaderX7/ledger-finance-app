'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronDown, HelpCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQPage() {
  const router = useRouter();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      question: "What is Truely Money?",
      answer: "Truely Money is an independent personal finance reference platform designed to help Indians compare financial products in one place. We present options for savings accounts, fixed deposits, loans, credit cards, and government schemes. Please note that Truely Money is not a bank, not an NBFC, and not a financial advisor. We do not sell financial products, offer investment advice, or facilitate financial transactions."
    },
    {
      question: "Is this app free to use?",
      answer: "Yes, Truely Money is 100% free to use. We do not charge users any fees to browse, compare, or analyze financial products. We aim to offer honest, unbiased information directly to everyday users."
    },
    {
      question: "How is the financial data sourced and how often is it updated?",
      answer: "All product parameters, rates, and criteria are manually curated and extracted from the official websites of the respective banks and financial institutions, as well as official publications like the RBI. While we check and update our spreadsheet database regularly, rates and terms are subject to change by banks at any time. We strongly advise you to verify the exact terms on the bank's official portal before applying."
    },
    {
      question: "Is Truely Money affiliated with any bank or financial institution?",
      answer: "No, Truely Money is entirely independent. We are not affiliated with, sponsored by, or partnered with any bank, NBFC, or financial brand. We do not promote specific lenders for commission, ensuring that you receive unbiased and transparent comparison details."
    },
    {
      question: "How do I compare products?",
      answer: "You can navigate to specific categories (like Savings Accounts or Fixed Deposits) through our Search page. You can apply filters based on lender type, minimum balance requirement, or tenure, and sort them by interest yield or ratings to evaluate options objectively."
    },
    {
      question: "Can I apply for a product through this app?",
      answer: "No. Truely Money is purely an informational resource. We do not host application forms, collect credentials, or process registrations. When you click 'Access Official Portal' or similar buttons, we redirect you securely to the official website of the bank or institution where you can apply directly."
    },
    {
      question: "Is my personal data safe?",
      answer: "Your personal data is completely safe because we do not collect, transmit, or store it on any server. All inputs (like your name, favourites, and recently viewed items) are saved locally in your device's browser memory (localStorage) only. If you clear your browser's data, this info is reset."
    },
    {
      question: "What does the AI Advisor do?",
      answer: "The AI Advisor uses simulated insights powered by Gemini AI to explain finance terms (jargon buster) and show daily tips. No personal financial information or identifiers are sent to external servers for this feature."
    },
    {
      question: "How do I reset or edit my profile?",
      answer: "You can edit your display name directly from the Profile page. If you wish to reset all state and restart the setup flow, simply tap 'Log Out' on the Profile screen which clears your local preferences."
    },
    {
      question: "Who can I contact for support?",
      answer: "For any queries, feedback, or data correction suggestions, please write to us at support@truelymoney.com. We aim to respond to all enquiries within 30 days."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

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
          Help & FAQs
        </h1>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 px-4 py-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-4"
        >
          {/* Header intro */}
          <div className="text-center py-2 space-y-1">
            <div className="w-10 h-10 rounded-2xl bg-[#C9A96E]/10 flex items-center justify-center mx-auto mb-2 border border-[#C9A96E]/20">
              <HelpCircle size={20} className="text-[#C9A96E]" />
            </div>
            <h2 className="text-[14px] font-bold text-white/90" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Frequently Asked Questions
            </h2>
            <p className="text-[11px] text-white/40 max-w-xs mx-auto leading-relaxed">
              Find instant answers regarding comparisons, data sourcing, privacy, and our services.
            </p>
          </div>

          {/* Accordion List */}
          <div className="space-y-2.5">
            {faqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border transition-all duration-300 overflow-hidden"
                  style={{
                    background: isOpen ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.01)',
                    borderColor: isOpen ? 'rgba(201, 169, 110, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                  }}
                >
                  <button
                    onClick={() => toggleFAQ(idx)}
                    className="w-full flex items-center justify-between p-4 text-left transition-colors cursor-pointer"
                  >
                    <span
                      className="text-[13px] font-bold pr-4 transition-colors"
                      style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        color: isOpen ? '#C9A96E' : 'rgba(255, 255, 255, 0.75)',
                      }}
                    >
                      {faq.question}
                    </span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-white/30 flex-shrink-0"
                    >
                      <ChevronDown size={16} />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                      >
                        <div
                          className="px-4 pb-4 pt-1 text-[12px] leading-relaxed text-white/50"
                          style={{
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            fontWeight: 500,
                            borderTop: '1px solid rgba(255, 255, 255, 0.02)'
                          }}
                        >
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
