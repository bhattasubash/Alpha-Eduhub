"use client";

const ROLES = [
  {
    role: "Principal Admin",
    scope: "Full School Oversight",
    description: "Sees every classroom, every fee ledger, every report — across the whole school.",
  },
  {
    role: "Teacher",
    scope: "Assigned Classes Only",
    description: "Sees their own classes, marks attendance, enters grades. Nothing else.",
  },
  {
    role: "Parent",
    scope: "Enrolled Child Only",
    description: "Sees their own child's attendance, grades, and fee status. Nothing else.",
  },
];

export default function RolesSection() {
  return (
    <section id="roles" className="py-20 px-4 sm:px-6 lg:px-8 bg-paper border-b border-line">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-2xl mb-12">
          <span className="font-mono text-xs uppercase tracking-widest text-brass-dark font-semibold">
            Role-Based Access
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink leading-tight mt-2">
            Everyone sees only what&apos;s theirs.
          </h2>
          <p className="text-base text-ink-muted mt-2">
            Strict permission boundaries protect student privacy and prevent accidental data overwrites.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ROLES.map((item, i) => (
            <div
              key={item.role}
              className="paper-card rounded p-6 sm:p-7 flex flex-col justify-between border border-line"
            >
              <div>
                <div className="flex items-center justify-between font-mono text-xs text-ink-subtle pb-3 border-b border-line mb-4">
                  <span>0{i + 1}</span>
                  <span className="text-brass-dark font-semibold">{item.scope}</span>
                </div>
                <h3 className="font-serif text-xl font-bold text-ink mb-2">
                  {item.role}
                </h3>
                <p className="text-sm text-ink-muted leading-relaxed font-normal">
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
