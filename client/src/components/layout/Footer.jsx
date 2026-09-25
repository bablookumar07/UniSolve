import {
  ArrowUpRight,
  Mail,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-white transition-colors duration-200 dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 py-14 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr]">
          {/* Brand */}
          <div>
            <Link
              to="/"
              className="group inline-flex items-center gap-2.5"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 shadow-sm transition group-hover:bg-indigo-700">
                <ShieldCheck className="h-5 w-5 text-white" />
              </div>

              <span className="text-xl font-bold tracking-tight text-slate-950 dark:text-white">
                Uni<span className="text-indigo-600">Solve</span>
              </span>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
              A modern campus complaint management platform that helps
              students report issues and enables teams to track and resolve
              them efficiently.
            </p>

        
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Product
            </h3>

            <ul className="mt-5 space-y-3">
              <li>
                <a
                  href="/#features"
                  className="text-sm text-slate-500 transition hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
                >
                  Features
                </a>
              </li>

              <li>
                <a
                  href="/#how-it-works"
                  className="text-sm text-slate-500 transition hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
                >
                  How It Works
                </a>
              </li>

              <li>
                <a
                  href="/#solutions"
                  className="text-sm text-slate-500 transition hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
                >
                  Solutions
                </a>
              </li>

              <li>
                <Link
                  to="/register"
                  className="text-sm text-slate-500 transition hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
                >
                  Get Started
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Company
            </h3>

            <ul className="mt-5 space-y-3">
              <li>
                <a
                  href="/#about"
                  className="text-sm text-slate-500 transition hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
                >
                  About
                </a>
              </li>

              <li>
                <a
                  href="/#contact"
                  className="text-sm text-slate-500 transition hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
                >
                  Contact
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="text-sm text-slate-500 transition hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
                >
                  Privacy Policy
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="text-sm text-slate-500 transition hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Get in Touch */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Get in touch
            </h3>

            <div className="mt-5 space-y-4">
              <a
                href="mailto:hello@unisolve.app"
                className="flex items-start gap-3 text-sm text-slate-500 transition hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
              >
                <Mail className="mt-0.5 h-4 w-4 shrink-0" />

                <span>hello@unisolve.app</span>
              </a>

              <div className="flex items-start gap-3 text-sm text-slate-500 dark:text-slate-400">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />

                <span>
                  Campus & Hostel
                  <br />
                  Management Platform
                </span>
              </div>

              <a
                href="/#contact"
                className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 transition hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                Contact UniSolve

                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="flex flex-col gap-4 border-t border-slate-200 py-6 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            © {currentYear} UniSolve. All rights reserved.
          </p>

          <p className="text-xs text-slate-400 dark:text-slate-500">
            Built with React, Node.js, Express & MongoDB.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;