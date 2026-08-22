"use client";

export default function Features() {
  return (
    <section id="features" className="divide-y-2 divide-line border-b-2 border-line">
      
      {/* ─── BAND 1: ATTENDANCE & FEES (Deeper Paper Band: #ECE6D8) ─────────── */}
      <div className="py-24 px-4 sm:px-6 lg:px-8 bg-paper-band">
        <div className="max-w-6xl mx-auto space-y-28">
          
          {/* SECTION 1: ATTENDANCE (Text Left, Open Ledger Table Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-5">
              <span className="font-mono text-xs uppercase tracking-widest text-brass-dark font-bold">
                § 01 · DAILY ROLL CALL
              </span>
              <h2 className="font-serif text-4xl sm:text-5xl font-bold text-ink leading-[1.08] tracking-tight">
                Roll call takes 90 seconds, not the whole first period.
              </h2>
              <p className="text-[18px] text-ink-muted leading-relaxed max-w-prose font-normal">
                A teacher marks attendance from their phone or the classroom tablet. Absent students trigger an automatic message to parents — no separate step, no end-of-day catch-up. By the time the bell rings for period two, the day&apos;s register is closed and every parent who needed to know, knows.
              </p>
            </div>

            <div className="lg:col-span-7">
              {/* Open Ledger Register Table */}
              <div className="bg-paper-light border-y-2 border-line sm:border-2 sm:rounded shadow-ledger overflow-hidden">
                <div className="bg-paper-band px-5 py-3 border-b border-line flex items-center justify-between font-mono text-xs">
                  <span className="font-bold text-ink uppercase tracking-wide">Grade 8-A · Period 1 Homeroom</span>
                  <span className="text-ink-subtle">Tuesday, 08:30 AM</span>
                </div>

                <div className="p-5 sm:p-6 bg-paper-light space-y-4">
                  <table className="w-full text-left font-mono text-xs">
                    <thead>
                      <tr className="border-b-2 border-line text-ink-subtle uppercase text-[11px]">
                        <th className="pb-2.5 font-bold">Roll #</th>
                        <th className="pb-2.5 font-bold">Student Name</th>
                        <th className="pb-2.5 font-bold">Status</th>
                        <th className="pb-2.5 font-bold text-right">Verification</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line">
                      <tr>
                        <td className="py-3 text-ink-subtle">#01</td>
                        <td className="py-3 font-semibold text-ink text-sm">Aarav Sharma</td>
                        <td className="py-3 text-ledger font-bold">Present</td>
                        <td className="py-3 text-right font-sans text-xs text-ink-subtle">08:29 AM</td>
                      </tr>
                      <tr>
                        <td className="py-3 text-ink-subtle">#02</td>
                        <td className="py-3 font-semibold text-ink text-sm">Claire Vance</td>
                        <td className="py-3 text-alert font-bold">Absent (Unexcused)</td>
                        <td className="py-3 text-right font-sans text-xs text-alert font-bold">SMS Dispatched 08:31</td>
                      </tr>
                      <tr>
                        <td className="py-3 text-ink-subtle">#03</td>
                        <td className="py-3 font-semibold text-ink text-sm">Devin Reynolds</td>
                        <td className="py-3 text-brass-dark font-bold">Late (Medical)</td>
                        <td className="py-3 text-right font-sans text-xs text-ink-subtle">Doctor Note Verified</td>
                      </tr>
                      <tr>
                        <td className="py-3 text-ink-subtle">#04</td>
                        <td className="py-3 font-semibold text-ink text-sm">Elena Rostova</td>
                        <td className="py-3 text-ledger font-bold">Present</td>
                        <td className="py-3 text-right font-sans text-xs text-ink-subtle">08:28 AM</td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="pt-3 border-t-2 border-line flex items-center justify-between text-xs font-mono text-ink">
                    <span>Register Summary: <strong className="text-ledger font-bold">27 Present</strong> · <strong className="text-alert font-bold">1 Absent</strong></span>
                    <span className="font-bold text-ledger">Closed &amp; Archived</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: FEES (Open Ledger Statement Left, Text Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 order-2 lg:order-1">
              <div className="bg-paper-light border-y-2 border-line sm:border-2 sm:rounded shadow-ledger overflow-hidden">
                <div className="bg-paper-band px-5 py-3 border-b border-line flex items-center justify-between font-mono text-xs">
                  <span className="font-bold text-ink uppercase tracking-wide">Fee Ledger Statement · Grade 10</span>
                  <span className="text-ink-subtle font-medium">Term II Accounts</span>
                </div>

                <div className="p-5 sm:p-6 bg-paper-light space-y-4">
                  <table className="w-full text-left font-mono text-xs">
                    <thead>
                      <tr className="border-b-2 border-line text-ink-subtle uppercase text-[11px]">
                        <th className="pb-2.5 font-bold">Receipt</th>
                        <th className="pb-2.5 font-bold">Student / Family</th>
                        <th className="pb-2.5 font-bold">Billed</th>
                        <th className="pb-2.5 font-bold">Paid</th>
                        <th className="pb-2.5 font-bold text-right">Balance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line">
                      <tr>
                        <td className="py-3 text-ink-subtle">#REC-8491</td>
                        <td className="py-3 font-semibold text-ink text-sm">Marcus Bell (G10-B)</td>
                        <td className="py-3 text-ink font-medium">$650.00</td>
                        <td className="py-3 text-ledger font-bold">$650.00</td>
                        <td className="py-3 text-right text-ledger font-bold">$0.00 (Paid)</td>
                      </tr>
                      <tr>
                        <td className="py-3 text-ink-subtle">#REC-8492</td>
                        <td className="py-3 font-semibold text-ink text-sm">Siddharth Nair (G10-A)</td>
                        <td className="py-3 text-ink font-medium">$650.00</td>
                        <td className="py-3 text-ink font-medium">$350.00</td>
                        <td className="py-3 text-right text-alert font-bold">$300.00 Dues</td>
                      </tr>
                      <tr>
                        <td className="py-3 text-ink-subtle">#REC-8493</td>
                        <td className="py-3 font-semibold text-ink text-sm">Hannah Abbott (G10-B)</td>
                        <td className="py-3 text-ink font-medium">$650.00</td>
                        <td className="py-3 text-ledger font-bold">$650.00</td>
                        <td className="py-3 text-right text-ledger font-bold">$0.00 (Paid)</td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="pt-3 border-t-2 border-line flex items-center justify-between text-xs font-mono text-ink">
                    <span>Class Assessment: $24,700 Total</span>
                    <span className="text-ledger font-bold">$22,400 Collected (90.6%)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-5 order-1 lg:order-2">
              <span className="font-mono text-xs uppercase tracking-widest text-brass-dark font-bold">
                § 02 · FINANCIAL LEDGER
              </span>
              <h2 className="font-serif text-4xl sm:text-5xl font-bold text-ink leading-[1.08] tracking-tight">
                Every fee, every family, one ledger — no spreadsheet reconciliation.
              </h2>
              <p className="text-[18px] text-ink-muted leading-relaxed max-w-prose font-normal">
                Set a fee structure once per class or term. Parents pay through the portal or you record cash/cheque manually — either way it lands in the same ledger, with a receipt generated automatically. At the end of the month, you&apos;re not chasing down which of three spreadsheets has the correct pending-dues list.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* ─── BAND 2: REPORT CARDS & PARENT COMMUNICATION (Paper Tone: #F6F3EC) */}
      <div className="py-24 px-4 sm:px-6 lg:px-8 bg-paper">
        <div className="max-w-6xl mx-auto space-y-28">

          {/* SECTION 3: REPORT CARDS (Text Left, Official Sheet Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-5">
              <span className="font-mono text-xs uppercase tracking-widest text-brass-dark font-bold">
                § 03 · ACADEMIC TRANSCRIPTS
              </span>
              <h2 className="font-serif text-4xl sm:text-5xl font-bold text-ink leading-[1.08] tracking-tight">
                Enter a grade once. The report card writes itself.
              </h2>
              <p className="text-[18px] text-ink-muted leading-relaxed max-w-prose font-normal">
                Teachers enter exam scores directly against the syllabus they already built in the system. When it&apos;s time for report cards, the system pulls every subject, formats it against your school&apos;s template, and generates a PDF per student — not a week of manual formatting in Word.
              </p>
            </div>

            <div className="lg:col-span-7">
              {/* Printed Transcript Sheet */}
              <div className="bg-paper-light border-2 border-line rounded p-6 sm:p-7 shadow-ledger space-y-5">
                <div className="border-b-2 border-line pb-4 flex items-start justify-between">
                  <div>
                    <p className="font-mono text-[10px] text-brass-dark uppercase tracking-widest font-bold">Official Terminal Transcript</p>
                    <h3 className="font-serif text-2xl font-bold text-ink">St. Jude Academy · Term II Evaluation</h3>
                    <p className="font-mono text-xs text-ink-muted mt-0.5">Pupil: Olivia Wright · Grade 9-A · Roll #14</p>
                  </div>
                  <div className="border-2 border-line px-3 py-1.5 rounded font-mono text-sm text-ledger bg-paper font-bold">
                    GPA: 3.88
                  </div>
                </div>

                <table className="w-full text-left font-mono text-xs">
                  <thead>
                    <tr className="border-b-2 border-line text-ink-subtle uppercase text-[11px]">
                      <th className="pb-2 font-bold">Subject</th>
                      <th className="pb-2 font-bold">Max Marks</th>
                      <th className="pb-2 font-bold">Scored</th>
                      <th className="pb-2 font-bold text-right">Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    <tr>
                      <td className="py-2.5 font-semibold text-ink text-sm">Mathematics (Algebra II)</td>
                      <td className="py-2.5 text-ink-subtle">100</td>
                      <td className="py-2.5 text-ink font-bold text-sm">94</td>
                      <td className="py-2.5 text-right text-ledger font-bold text-sm">A</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-semibold text-ink text-sm">Physics &amp; Chemistry</td>
                      <td className="py-2.5 text-ink-subtle">100</td>
                      <td className="py-2.5 text-ink font-bold text-sm">89</td>
                      <td className="py-2.5 text-right text-ledger font-bold text-sm">A-</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-semibold text-ink text-sm">English Literature</td>
                      <td className="py-2.5 text-ink-subtle">100</td>
                      <td className="py-2.5 text-ink font-bold text-sm">92</td>
                      <td className="py-2.5 text-right text-ledger font-bold text-sm">A</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-semibold text-ink text-sm">World History</td>
                      <td className="py-2.5 text-ink-subtle">100</td>
                      <td className="py-2.5 text-ink font-bold text-sm">86</td>
                      <td className="py-2.5 text-right text-ledger font-bold text-sm">B+</td>
                    </tr>
                  </tbody>
                </table>

                <div className="pt-3.5 border-t-2 border-line flex items-center justify-between text-xs font-mono text-ink">
                  <span>Term Attendance: <strong className="text-ledger font-bold">98.5% (65/66 Days)</strong></span>
                  <span className="font-bold text-ink font-sans text-xs">
                    PDF Formatted Automatically
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 4: PARENT COMMUNICATION (Guardian Stream Left, Text Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 order-2 lg:order-1">
              <div className="bg-paper-light border-2 border-line rounded p-6 shadow-ledger space-y-4">
                <div className="flex items-center justify-between border-b-2 border-line pb-3 font-mono text-xs">
                  <span className="font-bold text-ink uppercase tracking-wide">Guardian Feed (Parent: Mrs. Wright)</span>
                  <span className="text-brass-dark font-bold">Live Stream</span>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3.5 bg-paper border border-line rounded flex items-start justify-between">
                    <div>
                      <span className="text-[11px] uppercase text-ledger font-bold">Morning Attendance</span>
                      <p className="font-sans text-sm font-semibold text-ink mt-1">Olivia Wright marked Present for Period 1.</p>
                    </div>
                    <span className="text-ink-subtle text-xs">08:30 AM</span>
                  </div>

                  <div className="p-3.5 bg-paper border border-line rounded flex items-start justify-between">
                    <div>
                      <span className="text-[11px] uppercase text-brass-dark font-bold">Grade Published</span>
                      <p className="font-sans text-sm font-semibold text-ink mt-1">Mathematics Term II score published: 94/100 (Grade A).</p>
                    </div>
                    <span className="text-ink-subtle text-xs">11:45 AM</span>
                  </div>

                  <div className="p-3.5 bg-paper border border-line rounded flex items-start justify-between">
                    <div>
                      <span className="text-[11px] uppercase text-ledger font-bold">Receipt Logged</span>
                      <p className="font-sans text-sm font-semibold text-ink mt-1">Term II Tuition fee receipt #REC-8491 confirmed ($650.00).</p>
                    </div>
                    <span className="text-ink-subtle text-xs">Yesterday</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-5 order-1 lg:order-2">
              <span className="font-mono text-xs uppercase tracking-widest text-brass-dark font-bold">
                § 04 · PARENT PORTAL
              </span>
              <h2 className="font-serif text-4xl sm:text-5xl font-bold text-ink leading-[1.08] tracking-tight">
                Parents see what&apos;s happening the same day, not at the next PTM.
              </h2>
              <p className="text-[18px] text-ink-muted leading-relaxed max-w-prose font-normal">
                Attendance, grades, and fee status are visible to parents as they happen — not batched into a term-end update. Fewer &ldquo;is my child actually attending?&rdquo; phone calls to the front office.
              </p>
            </div>
          </div>

        </div>
      </div>

    </section>
  );
}
