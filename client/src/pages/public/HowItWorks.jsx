import {
  FilePlus2,
  ClipboardList,
  Wrench,
  CheckCircle2,
} from "lucide-react";

const steps = [
  {
    icon: FilePlus2,
    title: "Report an Issue",
    description:
      "Students can submit a complaint with relevant details, category, location and supporting evidence.",
  },
  {
    icon: ClipboardList,
    title: "Review & Assign",
    description:
      "Administrators review complaints and assign them to the appropriate maintenance staff.",
  },
  {
    icon: Wrench,
    title: "Resolve the Issue",
    description:
      "Assigned staff work on the complaint and update its progress through the resolution workflow.",
  },
  {
    icon: CheckCircle2,
    title: "Verify & Close",
    description:
      "Students can verify the resolution before the complaint is finally closed.",
  },
];

const HowItWorks = () => {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
          How UniSolve Works
        </p>

        <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
          From complaint to resolution
        </h1>

        <p className="mt-5 text-lg leading-8 text-slate-600">
          UniSolve provides a structured workflow for reporting, assigning,
          resolving and verifying campus issues.
        </p>
      </div>

      <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => {
          const Icon = step.icon;

          return (
            <div
              key={step.title}
              className="rounded-2xl border border-slate-200 bg-white p-6"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50">
                <Icon className="h-6 w-6 text-indigo-600" />
              </div>

              <p className="mt-6 text-sm font-semibold text-indigo-600">
                0{index + 1}
              </p>

              <h2 className="mt-2 text-lg font-semibold text-slate-900">
                {step.title}
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                {step.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default HowItWorks;