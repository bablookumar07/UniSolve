import { useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  FileText,
  Headphones,
  Mail,
  MapPin,
  MessageSquare,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
  Wrench,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Easy Complaint Reporting",
    description:
      "Students can report campus and hostel issues with clear details, category, priority and location.",
  },
  {
    icon: Search,
    title: "Track Every Complaint",
    description:
      "Follow complaint progress from submission to resolution without relying on manual follow-ups.",
  },
  {
    icon: Users,
    title: "Role-Based Access",
    description:
      "Dedicated workflows for students, staff and administrators keep responsibilities clearly separated.",
  },
  {
    icon: Zap,
    title: "Faster Resolution",
    description:
      "Admins can assign complaints to the right staff member and keep resolution workflows organized.",
  },
  {
    icon: ShieldCheck,
    title: "Secure & Structured",
    description:
      "Authentication, authorization and protected workflows help keep campus data secure.",
  },
  {
    icon: Sparkles,
    title: "Smart Insights",
    description:
      "Analytics can help institutions understand complaint trends, priorities and resolution performance.",
  },
];

const workflow = [
  {
    step: "01",
    icon: MessageSquare,
    title: "Report an Issue",
    description:
      "Students submit a complaint with the required information and supporting details.",
  },
  {
    step: "02",
    icon: Search,
    title: "Review & Assign",
    description:
      "Administrators review the complaint and assign it to the appropriate staff member.",
  },
  {
    step: "03",
    icon: Wrench,
    title: "Work on Resolution",
    description:
      "Assigned staff members update the complaint while working toward a resolution.",
  },
  {
    step: "04",
    icon: CheckCircle2,
    title: "Resolve & Close",
    description:
      "The issue is resolved, verified and finally closed with a clear record of the outcome.",
  },
];

const solutions = [
  {
    icon: Users,
    title: "For Students",
    description:
      "A simple way to report issues, monitor progress and stay informed about resolutions.",
    points: [
      "Create and manage complaints",
      "Track complaint status",
      "View complaint history",
      "Receive important updates",
    ],
  },
  {
    icon: Wrench,
    title: "For Staff",
    description:
      "A focused workspace to manage assigned complaints and keep resolution progress updated.",
    points: [
      "View assigned complaints",
      "Update work progress",
      "Add resolution notes",
      "Track pending work",
    ],
  },
  {
    icon: ShieldCheck,
    title: "For Administrators",
    description:
      "Centralized visibility into campus issues, assignments, priorities and operational trends.",
    points: [
      "Manage all complaints",
      "Assign staff members",
      "Monitor complaint trends",
      "Access operational analytics",
    ],
  },
];

const faqs = [
  {
    question: "What is UniSolve?",
    answer:
      "UniSolve is a campus and hostel complaint management platform designed to make issue reporting, assignment, tracking and resolution more organized.",
  },
  {
    question: "Who can use UniSolve?",
    answer:
      "UniSolve is designed around three primary roles: students or residents, staff or technicians, and administrators or wardens.",
  },
  {
    question: "Can students track their complaints?",
    answer:
      "Yes. The planned complaint workflow allows students to view the current status and history of complaints they have submitted.",
  },
  {
    question: "Can administrators assign complaints to staff?",
    answer:
      "Yes. Administrators can review complaints and assign them to the appropriate staff member based on the issue and required work.",
  },
  {
    question: "Will UniSolve support notifications?",
    answer:
      "Yes. Notifications are part of the planned system so users can receive important complaint and workflow updates.",
  },
  {
    question: "Is UniSolve only for hostel complaints?",
    answer:
      "No. The platform is designed for both campus and hostel-related issues such as maintenance, facilities, cleanliness, electrical problems and other institutional concerns.",
  },
];

const Home = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleContactChange = (event) => {
    const { name, value } = event.target;

    setContactForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setIsSent(false);
  };

  const handleContactSubmit = (event) => {
    event.preventDefault();

    setIsSending(true);
    setIsSent(false);

    // Temporary frontend simulation.
    // This will later be replaced with an API request.
    setTimeout(() => {
      setIsSending(false);
      setIsSent(true);

      setContactForm({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    }, 1200);
  };

  const toggleFaq = (index) => {
    setOpenFaq((previous) => (previous === index ? null : index));
  };

  return (
    <div className="overflow-hidden">
      {/* =========================================================
          HERO
      ========================================================== */}
     <section
        id="home"
        className="relative isolate scroll-mt-24 bg-slate-50 dark:bg-slate-950 px-6 pb-20 pt-16 sm:pb-28 sm:pt-24"
      >
      
        <div className="mx-auto max-w-7xl">
          {/* Hero Content */}
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-200 dark:border-indigo-900 bg-white dark:bg-slate-900 px-4 py-2 text-sm font-medium text-indigo-700 shadow-sm">
              <Sparkles className="h-4 w-4" />
              Modern campus issue management
            </div>

            <h1 className="text-5xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-6xl lg:text-7xl">
              Turn campus problems into
              <span className="block text-indigo-600">
                visible solutions.
              </span>
            </h1>

            <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-400 dark:text-slate-500 sm:text-xl">
              UniSolve gives students, maintenance teams and administrators
              one structured platform to report, track and resolve campus and
              hostel issues.
            </p>

            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href="#how-it-works"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700"
              >
                See How It Works

                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>

              <a
                href="#features"
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-6 py-3.5 text-sm font-semibold text-slate-700 dark:text-slate-300 transition hover:border-slate-400 hover:bg-slate-50 dark:bg-slate-950"
              >
                Explore Features
              </a>
            </div>
          </div>

          {/* Product Preview */}
          <div className="relative mx-auto mt-16 max-w-5xl">
            <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-indigo-200/40 dark:bg-indigo-950/30 blur-3xl" />

            <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl shadow-slate-900/10">
              {/* Browser Header */}
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-5 py-3">
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                </div>

                <div className="hidden rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-20 py-1 text-xs text-slate-400 dark:text-slate-500 sm:block">
                  app.unisolve.com/dashboard
                </div>

                <div className="w-12" />
              </div>

              {/* Dashboard Preview */}
              <div className="grid min-h-[420px] md:grid-cols-[190px_1fr]">
                {/* Sidebar */}
                <aside className="hidden border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-5 md:block">
                  <div className="mb-8 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
                      <ShieldCheck className="h-4 w-4 text-white" />
                    </div>

                    <span className="font-bold text-slate-900 dark:text-slate-100">
                      Uni<span className="text-indigo-600">Solve</span>
                    </span>
                  </div>

                  <div className="space-y-2">
                    {[
                      "Dashboard",
                      "Complaints",
                      "Notifications",
                      "Analytics",
                    ].map((item, index) => (
                      <div
                        key={item}
                        className={`rounded-lg px-3 py-2 text-xs font-medium ${
                          index === 0
                            ? "bg-indigo-100 dark:bg-indigo-950/50 text-indigo-700"
                            : "text-slate-500 dark:text-slate-400 dark:text-slate-500"
                        }`}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </aside>

                {/* Dashboard Content */}
                <div className="p-5 sm:p-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 dark:text-slate-500">
                        Overview
                      </p>

                      <h3 className="mt-1 text-xl font-bold text-slate-900 dark:text-slate-100">
                        Complaint Dashboard
                      </h3>
                    </div>

                    <div className="hidden rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white sm:block">
                      + Report Issue
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
                    {[
                      ["Total", "248"],
                      ["Pending", "32"],
                      ["In Progress", "47"],
                      ["Resolved", "169"],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4"
                      >
                        <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500">{label}</p>

                        <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Recent Complaints */}
                  <div className="mt-5 rounded-xl border border-slate-200 dark:border-slate-800">
                    <div className="border-b border-slate-200 dark:border-slate-800 px-4 py-3">
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        Recent complaints
                      </p>
                    </div>

                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                      {[
                        [
                          "Broken ceiling fan",
                          "Electrical",
                          "In Progress",
                        ],
                        ["Water leakage", "Plumbing", "Pending"],
                        ["Wi-Fi connectivity", "Network", "Resolved"],
                      ].map(([title, category, status]) => (
                        <div
                          key={title}
                          className="flex items-center justify-between gap-4 px-4 py-4"
                        >
                          <div>
                            <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                              {title}
                            </p>

                            <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                              {category}
                            </p>
                          </div>

                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                              status === "Resolved"
                                ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400"
                                : status === "Pending"
                                  ? "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400"
                                  : "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700"
                            }`}
                          >
                            {status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          STATS
      ========================================================== */}
      <section className="border-y border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-slate-200 dark:divide-slate-800 md:grid-cols-4">
          <div className="px-6 py-8 text-center">
            <p className="text-2xl font-bold text-slate-950 dark:text-white">24/7</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500 sm:text-sm">
              Complaint Access
            </p>
          </div>

          <div className="border-b border-slate-200 dark:border-slate-800 px-6 py-8 text-center md:border-b-0">
            <p className="text-2xl font-bold text-slate-950 dark:text-white">3</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500 sm:text-sm">
              User Roles
            </p>
          </div>

          <div className="px-6 py-8 text-center">
            <p className="text-2xl font-bold text-slate-950 dark:text-white">5</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500 sm:text-sm">
              Complaint Stages
            </p>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-800 px-6 py-8 text-center md:border-t-0">
            <p className="text-2xl font-bold text-slate-950 dark:text-white">1</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500 sm:text-sm">
              Centralized Platform
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================
          FEATURES
      ========================================================== */}
      <section id="features" className="bg-white dark:bg-slate-900 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold text-indigo-600">
              Everything in one place
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
              Built for better campus operations
            </h2>

            <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-400 dark:text-slate-500">
              UniSolve brings reporting, assignment, tracking and resolution
              into one structured workflow.
            </p>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 transition-all duration-200 hover:-translate-y-1 hover:border-indigo-100 dark:border-indigo-900 hover:shadow-lg hover:shadow-slate-200/50"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="mt-5 text-base font-semibold text-slate-950 dark:text-white">
                    {feature.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400 dark:text-slate-500">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================
          HOW IT WORKS
      ========================================================== */}
      <section id="how-it-works" className="bg-slate-50 dark:bg-slate-950 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold text-indigo-600">
              Simple workflow
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
              From complaint to resolution
            </h2>

            <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-400 dark:text-slate-500">
              Every complaint follows a clear lifecycle so everyone knows what
              happens next.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {workflow.map((item, index) => {
              const Icon = item.icon;

              return (
                <div key={item.step} className="relative">
                  {index < workflow.length - 1 && (
                    <div className="absolute left-[calc(100%+12px)] top-7 hidden h-px w-6 bg-slate-200 lg:block" />
                  )}

                  <div className="h-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-white">
                        <Icon className="h-5 w-5" />
                      </div>

                      <span className="text-xs font-bold text-slate-300">
                        {item.step}
                      </span>
                    </div>

                    <h3 className="mt-6 text-base font-semibold text-slate-950 dark:text-white">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400 dark:text-slate-500">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Status lifecycle */}
          <div className="mx-auto mt-12 max-w-4xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8">
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Complaint lifecycle
              </p>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                {[
                  "PENDING",
                  "ASSIGNED",
                  "IN_PROGRESS",
                  "RESOLVED",
                  "CLOSED",
                ].map((status, index, array) => (
                  <div key={status} className="flex items-center gap-2">
                    <span className="rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-1.5 text-[10px] font-semibold text-slate-600 dark:text-slate-400 dark:text-slate-500 sm:text-xs">
                      {status}
                    </span>

                    {index < array.length - 1 && (
                      <ArrowRight className="h-3.5 w-3.5 text-slate-300" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          SOLUTIONS
      ========================================================== */}
      <section id="solutions" className="bg-white dark:bg-slate-900 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold text-indigo-600">
              One platform, different workflows
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
              Designed around every role
            </h2>

            <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-400 dark:text-slate-500">
              Each user gets the tools and information relevant to their
              responsibilities.
            </p>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {solutions.map((solution) => {
              const Icon = solution.icon;

              return (
                <div
                  key={solution.title}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-7 shadow-sm"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600">
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="mt-6 text-lg font-semibold text-slate-950 dark:text-white">
                    {solution.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400 dark:text-slate-500">
                    {solution.description}
                  </p>

                  <ul className="mt-6 space-y-3">
                    {solution.points.map((point) => (
                      <li
                        key={point}
                        className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400 dark:text-slate-500"
                      >
                        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600">
                          <Check className="h-3 w-3" />
                        </span>

                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================
          ABOUT
      ========================================================== */}
       <section
        id="about"
        className="scroll-mt-24 bg-slate-950 px-6 py-24 text-white sm:py-28"
      >
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-400">
              About UniSolve
            </p>

            <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
              Built to bring clarity to campus operations.
            </h2>
          </div>

          <div>
            <p className="text-lg leading-8 text-slate-300">
              UniSolve is a centralized complaint management platform for
              campuses and hostels. Instead of relying on disconnected
              conversations and manual follow-ups, it creates a structured
              workflow where every issue has an owner, a status and a visible
              history.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-white dark:bg-slate-900/5 p-5">
                <Zap className="h-5 w-5 text-indigo-400" />

                <h3 className="mt-4 font-semibold">
                  Faster communication
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-400 dark:text-slate-500">
                  Keep everyone aligned without relying on repeated manual
                  follow-ups.
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white dark:bg-slate-900/5 p-5">
                <BarChart3 className="h-5 w-5 text-indigo-400" />

                <h3 className="mt-4 font-semibold">
                  Better visibility
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-400 dark:text-slate-500">
                  Turn complaint data into useful operational insights.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* =========================================================
          CONTACT
      ========================================================== */}
      <section id="contact" className="bg-slate-50 dark:bg-slate-950 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
            {/* Contact information */}
            <div>
              <p className="text-sm font-semibold text-indigo-600">
                Get in touch
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
                Have a question about UniSolve?
              </h2>

              <p className="mt-5 max-w-lg text-base leading-7 text-slate-600 dark:text-slate-400 dark:text-slate-500">
                Whether you want to learn more about the platform, discuss a
                campus use case or share feedback, send us a message.
              </p>

              <div className="mt-8 space-y-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white dark:bg-slate-900 text-indigo-600 shadow-sm ring-1 ring-slate-200">
                    <Mail className="h-4 w-4" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      Email
                    </p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500">
                      hello@unisolve.app
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white dark:bg-slate-900 text-indigo-600 shadow-sm ring-1 ring-slate-200">
                    <MapPin className="h-4 w-4" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      Platform
                    </p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500">
                      Campus & Hostel Management
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white dark:bg-slate-900 text-indigo-600 shadow-sm ring-1 ring-slate-200">
                    <Headphones className="h-4 w-4" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      Support
                    </p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500">
                      We're here to help with your questions.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact form */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm sm:p-8">
              <div className="mb-7">
                <h3 className="text-lg font-semibold text-slate-950 dark:text-white">
                  Send us a message
                </h3>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500">
                  Fill out the form and we'll get back to you.
                </p>
              </div>

              <form onSubmit={handleContactSubmit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                      Name
                    </label>

                    <input
                      id="contact-name"
                      type="text"
                      name="name"
                      value={contactForm.name}
                      onChange={handleContactChange}
                      placeholder="Your name"
                      required
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 outline-none transition placeholder:text-slate-400 dark:text-slate-500 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-email"
                      className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                      Email
                    </label>

                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      value={contactForm.email}
                      onChange={handleContactChange}
                      placeholder="you@example.com"
                      required
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 outline-none transition placeholder:text-slate-400 dark:text-slate-500 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="contact-subject"
                    className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Subject
                  </label>

                  <input
                    id="contact-subject"
                    type="text"
                    name="subject"
                    value={contactForm.subject}
                    onChange={handleContactChange}
                    placeholder="How can we help?"
                    required
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 outline-none transition placeholder:text-slate-400 dark:text-slate-500 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Message
                  </label>

                  <textarea
                    id="contact-message"
                    name="message"
                    value={contactForm.message}
                    onChange={handleContactChange}
                    placeholder="Write your message..."
                    rows="5"
                    required
                    className="w-full resize-none rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 outline-none transition placeholder:text-slate-400 dark:text-slate-500 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSending}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSending ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>

                {isSent && (
                  <div
                    role="status"
                    aria-live="polite"
                    className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 dark:bg-emerald-950/40 p-4"
                  >
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />

                    <div>
                      <p className="text-sm font-semibold text-emerald-800">
                        Message sent successfully!
                      </p>

                      <p className="mt-1 text-xs leading-5 text-emerald-700 dark:text-emerald-400">
                        Thanks for reaching out. We&apos;ll get back to you
                        soon.
                      </p>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          FAQ
      ========================================================== */}
      <section id="faq" className="bg-white dark:bg-slate-900 py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-6">
          <div className="text-center">
            <p className="text-sm font-semibold text-indigo-600">
              Frequently asked questions
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
              Questions, answered.
            </h2>

            <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-400 dark:text-slate-500">
              A quick overview of how UniSolve is designed to work.
            </p>
          </div>

          <div className="mt-12 divide-y divide-slate-200 dark:divide-slate-800 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;

              return (
                <div key={faq.question} className="px-5 sm:px-6">
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    className="flex w-full items-center justify-between gap-6 py-5 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 sm:text-base">
                      {faq.question}
                    </span>

                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-slate-400 dark:text-slate-500 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-indigo-600" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="pb-5 pr-8">
                      <p className="text-sm leading-6 text-slate-500 dark:text-slate-400 dark:text-slate-500">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================
          FINAL CTA
      ========================================================== */}
      <section className="bg-slate-50 dark:bg-slate-950 px-6 pb-20 lg:pb-28">
        <div className="mx-auto max-w-7xl">
          <div className="overflow-hidden rounded-3xl bg-indigo-600 px-6 py-14 text-center sm:px-12 lg:px-20">
            <div className="mx-auto max-w-2xl">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white dark:bg-slate-950/40">
                <ShieldCheck className="h-6 w-6 text-indigo-600" />
              </div>

              <h2 className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Ready to make campus issue management simpler?
              </h2>

              <p className="mt-4 text-sm leading-6 text-indigo-100 sm:text-base">
                Give students a better way to report issues and give
                administrators the visibility they need to resolve them.
              </p>

              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <a
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white dark:bg-slate-900 px-6 py-3.5 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50 dark:bg-indigo-950/40"
                >
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </a>

                <a
                  href="#contact"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white dark:bg-slate-900 px-6 py-3.5 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50  dark:bg-indigo-950/40"
                >
                  Contact Us
                  <Mail className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;