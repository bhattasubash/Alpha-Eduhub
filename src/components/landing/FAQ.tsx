"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "Can I import our existing student data?",
    a: "Yes. Send us your current spreadsheet or export from your old system — we do the import for you before you go live, not you.",
  },
  {
    q: "What happens to our data if we stop using Alpha EduHub?",
    a: "You can export everything — student records, attendance history, fee ledgers — as a spreadsheet at any time. It's your data.",
  },
  {
    q: "How long does setup actually take?",
    a: "A single campus is usually live within a week: import your student and staff list, set your fee structure, and you're marking attendance day one. Multi-campus setups take longer because we set up each campus separately.",
  },
  {
    q: "Do parents need to install an app?",
    a: "No. It works in any phone browser. There's an app for people who prefer it, but nobody's required to install anything to see their child's attendance or pay a fee.",
  },
];

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 bg-paper border-b border-line">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <span className="font-mono text-xs uppercase tracking-widest text-brass font-medium">
            Common Inquiries
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink leading-tight mt-2">
            Frequently Asked Questions
          </h2>
          <p className="text-base text-ink-muted mt-2">
            Plain answers to the practical questions school administrators ask most often.
          </p>
        </div>

        <div className="divide-y divide-line border-y border-line">
          {FAQS.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div key={item.q} className="py-5">
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between text-left gap-4 cursor-pointer group"
                >
                  <span className="font-serif text-lg font-bold text-ink group-hover:text-ledger transition-colors">
                    {item.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-ink-subtle shrink-0 transition-transform ${
                      isOpen ? "rotate-180 text-ledger" : ""
                    }`}
                    strokeWidth={1.75}
                  />
                </button>

                {isOpen && (
                  <p className="mt-3 text-base text-ink-muted leading-relaxed font-normal pr-8">
                    {item.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
