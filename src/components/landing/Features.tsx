"use client";

export default function Features() {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-paper border-b border-line">
      <div className="max-w-6xl mx-auto space-y-24">

        {/* ─── SECTION 1: ATTENDANCE (Text Left, UI Right) ──────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5 space-y-4">
            <span className="font-mono text-xs uppercase tracking-widest text-brass font-medium">
              01 / Daily Roll Call
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink leading-tight">
              Roll call takes 90 seconds, not the whole first period.
            </h2>
            <p className="text-base sm:text-[17px] text-ink-muted leading-relaxed">
              A teacher marks attendance from their phone or the classroom tablet. Absent students trigger an automatic message to parents — no separate step, no end-of-day catch-up. By the time the bell rings for period two, the day&apos;s register is closed and every parent who needed to know, knows.
            </p>
          </div>

          <div className="lg:col-span-7">
            <div className="paper-card rounded-md shadow-ledger overflow-hidden">
              <div className="bg-paper-dark px-4 py-2.5 border-b border-line flex items-center justify-between font-mono text-xs">
                <span className="font-semibold text-ink">Grade 8-A · Period 1 Homeroom</span>
                <span className="text-ink-subtle">Tuesday, 08:30 AM</span>
              </div>

              <div className="p-4 sm:p-5 bg-paper-light space-y-3">
                <table className="w-full text-left font-mono text-xs">
                  <thead>
                    <tr className="border-b border-line text-ink-subtle">
                      <th className="pb-2 font-medium">Roll #</th>
                      <th className="pb-2 font-medium">Student Name</th>
                      <th className="pb-2 font-medium">Status</th>
                      <th className="pb-2 font-medium text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line/60">
                    <tr>
                      <td className="py-2.5 text-ink-subtle">#01</td>
                      <td className="py-2.5 font-medium text-ink">Aarav Sharma</td>
                      <td className="py-2.5 text-ledger font-semibold">Present</td>
                      <td className="py-2.5 text-right font-sans text-xs text-ink-subtle">08:29 AM</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 text-ink-subtle">#02</td>
                      <td className="py-2.5 font-medium text-ink">Claire Vance</td>
                      <td className="py-2.5 text-alert font-semibold">Absent (Unexcused)</td>
                      <td className="py-2.5 text-right font-sans text-xs text-alert">SMS Dispatched 08:31</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 text-ink-subtle">#03</td>
                      <td className="py-2.5 font-medium text-ink">Devin Reynolds</td>
                      <td className="py-2.5 text-brass font-semibold">Late (Medical)</td>
                      <td className="py-2.5 text-right font-sans text-xs text-ink-subtle">Note Verified</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 text-ink-subtle">#04</td>
                      <td className="py-2.5 font-medium text-ink">Elena Rostova</td>
                      <td className="py-2.5 text-ledger font-semibold">Present</td>
                      <td className="py-2.5 text-right font-sans text-xs text-ink-subtle">08:28 AM</td>
                    </tr>
                  </tbody>
                </table>

                <div className="pt-2 border-t border-line flex items-center justify-between text-xs font-mono text-ink-muted">
                  <span>Register Summary: 27 Present · 1 Absent</span>
                  <span className="text-ledger font-medium">Register Sealed</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── SECTION 2: FEES (UI Left, Text Right) ────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 order-2 lg:order-1">
            <div className="paper-card rounded-md shadow-ledger overflow-hidden">
              <div className="bg-paper-dark px-4 py-2.5 border-b border-line flex items-center justify-between font-mono text-xs">
                <span className="font-semibold text-ink">Fee Ledger Statement · Grade 10</span>
                <span className="text-ink-subtle">Term II Ledger</span>
              </div>

              <div className="p-4 sm:p-5 bg-paper-light space-y-3">
                <table className="w-full text-left font-mono text-xs">
                  <thead>
                    <tr className="border-b border-line text-ink-subtle">
                      <th className="pb-2 font-medium">Receipt</th>
                      <th className="pb-2 font-medium">Student / Family</th>
                      <th className="pb-2 font-medium">Billed</th>
                      <th className="pb-2 font-medium">Paid</th>
                      <th className="pb-2 font-medium text-right">Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line/60">
                    <tr>
                      <td className="py-2.5 text-ink-subtle">#REC-8491</td>
                      <td className="py-2.5 font-medium text-ink">Marcus Bell (G10-B)</td>
                      <td className="py-2.5 text-ink">$650.00</td>
                      <td className="py-2.5 text-ledger font-semibold">$650.00</td>
                      <td className="py-2.5 text-right text-ledger font-semibold">$0.00 (Paid)</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 text-ink-subtle">#REC-8492</td>
                      <td className="py-2.5 font-medium text-ink">Siddharth Nair (G10-A)</td>
                      <td className="py-2.5 text-ink">$650.00</td>
                      <td className="py-2.5 text-ink">$350.00</td>
                      <td className="py-2.5 text-right text-alert font-semibold">$300.00 Dues</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 text-ink-subtle">#REC-8493</td>
                      <td className="py-2.5 font-medium text-ink">Hannah Abbott (G10-B)</td>
                      <td className="py-2.5 text-ink">$650.00</td>
                      <td className="py-2.5 text-ledger font-semibold">$650.00</td>
                      <td className="py-2.5 text-right text-ledger font-semibold">$0.00 (Paid)</td>
                    </tr>
                  </tbody>
                </table>

                <div className="pt-2 border-t border-line flex items-center justify-between text-xs font-mono text-ink-muted">
                  <span>Class Total: $24,700 Billed</span>
                  <span className="text-ink font-semibold">$22,400 Collected (90.6%)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4 order-1 lg:order-2">
            <span className="font-mono text-xs uppercase tracking-widest text-brass font-medium">
              02 / Financial Ledger
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink leading-tight">
              Every fee, every family, one ledger — no spreadsheet reconciliation.
            </h2>
            <p className="text-base sm:text-[17px] text-ink-muted leading-relaxed">
              Set a fee structure once per class or term. Parents pay through the portal or you record cash/cheque manually — either way it lands in the same ledger, with a receipt generated automatically. At the end of the month, you&apos;re not chasing down which of three spreadsheets has the correct pending-dues list.
            </p>
          </div>
        </div>

        {/* ─── SECTION 3: REPORT CARDS (Text Left, UI Right) ────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5 space-y-4">
            <span className="font-mono text-xs uppercase tracking-widest text-brass font-medium">
              03 / Academic Transcripts
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink leading-tight">
              Enter a grade once. The report card writes itself.
            </h2>
            <p className="text-base sm:text-[17px] text-ink-muted leading-relaxed">
              Teachers enter exam scores directly against the syllabus they already built in the system. When it&apos;s time for report cards, the system pulls every subject, formats it against your school&apos;s template, and generates a PDF per student — not a week of manual formatting in Word.
            </p>
          </div>

          <div className="lg:col-span-7">
            <div className="paper-card rounded-md shadow-ledger p-5 sm:p-6 bg-paper-light space-y-4 border border-line">
              <div className="border-b border-line pb-3 flex items-start justify-between">
                <div>
                  <p className="font-mono text-[10px] text-brass uppercase tracking-wider font-semibold">Official Terminal Transcript</p>
                  <h3 className="font-serif text-base font-bold text-ink">St. Jude Academy · Term II Evaluation</h3>
                  <p className="font-mono text-xs text-ink-muted">Pupil: Olivia Wright · Grade 9-A · Roll #14</p>
                </div>
                <div className="border border-line px-2.5 py-1 rounded font-mono text-xs text-ink bg-paper font-semibold">
                  GPA: 3.88
                </div>
              </div>

              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-line text-ink-subtle">
                    <th className="pb-1.5 font-medium">Subject</th>
                    <th className="pb-1.5 font-medium">Max Marks</th>
                    <th className="pb-1.5 font-medium">Scored</th>
                    <th className="pb-1.5 font-medium text-right">Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line/50">
                  <tr>
                    <td className="py-2 font-medium text-ink">Mathematics (Algebra II)</td>
                    <td className="py-2 text-ink-subtle">100</td>
                    <td className="py-2 text-ink font-semibold">94</td>
                    <td className="py-2 text-right text-ledger font-bold">A</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-medium text-ink">Physics &amp; Chemistry</td>
                    <td className="py-2 text-ink-subtle">100</td>
                    <td className="py-2 text-ink font-semibold">89</td>
                    <td className="py-2 text-right text-ledger font-bold">A-</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-medium text-ink">English Literature</td>
                    <td className="py-2 text-ink-subtle">100</td>
                    <td className="py-2 text-ink font-semibold">92</td>
                    <td className="py-2 text-right text-ledger font-bold">A</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-medium text-ink">World History</td>
                    <td className="py-2 text-ink-subtle">100</td>
                    <td className="py-2 text-ink font-semibold">86</td>
                    <td className="py-2 text-right text-ledger font-bold">B+</td>
                  </tr>
                </tbody>
              </table>

              <div className="pt-3 border-t border-line flex items-center justify-between text-xs font-mono text-ink-muted">
                <span>Term Attendance: 98.5% (65/66 Days)</span>
                <span className="border border-line px-2 py-0.5 rounded text-ink font-sans text-xs bg-paper">
                  PDF Generated Automatically
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ─── SECTION 4: PARENT COMMUNICATION (UI Left, Text Right) ────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 order-2 lg:order-1">
            <div className="paper-card rounded-md shadow-ledger p-5 bg-paper-light space-y-3 border border-line">
              <div className="flex items-center justify-between border-b border-line pb-2.5 font-mono text-xs">
                <span className="font-semibold text-ink">Guardian Feed (Parent: Mrs. Wright)</span>
                <span className="text-ink-subtle">Live Updates</span>
              </div>

              <div className="space-y-2.5 font-mono text-xs">
                <div className="p-3 bg-paper border border-line rounded flex items-start justify-between">
                  <div>
                    <span className="text-[10px] uppercase text-ledger font-bold">Morning Attendance</span>
                    <p className="font-sans text-xs font-medium text-ink mt-0.5">Olivia Wright marked Present for Period 1.</p>
                  </div>
                  <span className="text-ink-subtle text-[11px]">08:30 AM</span>
                </div>

                <div className="p-3 bg-paper border border-line rounded flex items-start justify-between">
                  <div>
                    <span className="text-[10px] uppercase text-brass font-bold">Grade Published</span>
                    <p className="font-sans text-xs font-medium text-ink mt-0.5">Mathematics Term II score published: 94/100 (Grade A).</p>
                  </div>
                  <span className="text-ink-subtle text-[11px]">11:45 AM</span>
                </div>

                <div className="p-3 bg-paper border border-line rounded flex items-start justify-between">
                  <div>
                    <span className="text-[10px] uppercase text-ink font-bold">Receipt Logged</span>
                    <p className="font-sans text-xs font-medium text-ink mt-0.5">Term II Tuition fee receipt #REC-8491 confirmed ($650.00).</p>
                  </div>
                  <span className="text-ink-subtle text-[11px]">Yesterday</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4 order-1 lg:order-2">
            <span className="font-mono text-xs uppercase tracking-widest text-brass font-medium">
              04 / Parent Portal
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink leading-tight">
              Parents see what&apos;s happening the same day, not at the next PTM.
            </h2>
            <p className="text-base sm:text-[17px] text-ink-muted leading-relaxed">
              Attendance, grades, and fee status are visible to parents as they happen — not batched into a term-end update. Fewer &ldquo;is my child actually attending?&rdquo; phone calls to the front office.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
