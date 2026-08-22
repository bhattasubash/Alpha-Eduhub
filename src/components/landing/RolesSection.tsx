"use client";

const ROLES = [
  {
    idx: "01",
    role: "Principal Admin",
    scope: "Full Institutional Oversight",
    description: "Sees every classroom, every fee ledger, every report — across the whole school.",
  },
  {
    idx: "02",
    role: "Teacher",
    scope: "Assigned Classrooms Only",
    description: "Sees their own classes, marks attendance, enters grades. Nothing else.",
  },
  {
    idx: "03",
    role: "Parent",
    scope: "Enrolled Pupil Only",
    description: "Sees their own child's attendance, grades, and fee status. Nothing else.",
  },
];

export default function RolesSection() {
  return (
    <section id="roles" className="py-24 px-4 sm:px-6 lg:px-8 bg-paper border-b-2 border-line">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-3xl mb-14">
          <span className="font-mono text-xs uppercase tracking-widest text-brass-dark font-bold">
            § 05 · ACCESS BOUNDARIES
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-ink leading-[1.08] tracking-tight mt-2">
            Everyone sees only what&apos;s theirs.
          </h2>
          <p className="text-[18px] text-ink-muted mt-3 max-w-prose leading-relaxed">
            Strict permission boundaries protect student privacy and prevent accidental data overwrites.
          </p>
        </div>

        {/* Open Folio Layout with Vertical Hairline Dividers */}
        <div className="grid grid-cols-1 md:grid-cols-3 border-y-2 border-line divide-y-2 md:divide-y-0 md:divide-x-2 divide-line bg-paper-light">
          {ROLES.map((item) => (
            <div
              key={item.role}
              className="p-8 sm:p-10 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between font-mono text-xs pb-4 border-b border-line mb-6">
                  <span className="font-bold text-brass-dark">§ {item.idx}</span>
                  <span className="text-ink font-semibold">{item.scope}</span>
                </div>
                <h3 className="font-serif text-2xl font-bold text-ink mb-3">
                  {item.role}
                </h3>
                <p className="text-base text-ink-muted leading-relaxed font-normal">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
