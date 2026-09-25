import {
  Menu,
  Moon,
  ShieldCheck,
  Sun,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useTheme } from "../../context/ThemeContext";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Solutions", href: "#solutions" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;

      const documentHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      if (documentHeight <= 0) {
        setScrollProgress(0);
        return;
      }

      const progress = (scrollTop / documentHeight) * 100;

      setScrollProgress(Math.min(progress, 100));
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/90">
      <nav
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          to="/"
          onClick={closeMenu}
          className="group flex items-center gap-2.5"
          aria-label="UniSolve Home"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 shadow-sm transition duration-200 group-hover:bg-indigo-700">
            <ShieldCheck className="h-5 w-5 text-white" />
          </div>

          <span className="text-xl font-bold tracking-tight text-slate-950 dark:text-white">
            Uni<span className="text-indigo-600">Solve</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="relative py-2 text-sm font-medium text-slate-600 transition-colors duration-200 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-2 md:flex">
          {/* Theme Toggle */}
         <button
  type="button"
  onClick={toggleTheme}
  className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
  aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
  title={isDark ? "Light mode" : "Dark mode"}
>
  {isDark ? (
    <Sun className="h-5 w-5" />
  ) : (
    <Moon className="h-5 w-5" />
  )}
</button>

          <Link
            to="/login"
            className="rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors duration-200 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            Sign In
          </Link>

          <Link
            to="/register"
            className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-indigo-700 hover:shadow-md"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center gap-1 md:hidden">
          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label={
              isDark ? "Switch to light theme" : "Switch to dark theme"
            }
          >
            {isDark ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsOpen((previous) => !previous)}
            className="rounded-lg p-2 text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label={
              isOpen ? "Close navigation menu" : "Open navigation menu"
            }
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
          >
            {isOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {isOpen && (
        <div
          id="mobile-navigation"
          className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 md:hidden"
        >
          <div className="mx-auto max-w-7xl px-6 py-5">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={closeMenu}
                  className="rounded-lg px-3 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-indigo-600 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-indigo-400"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
              <Link
                to="/login"
                onClick={closeMenu}
                className="rounded-lg border border-slate-200 px-4 py-2.5 text-center text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900"
              >
                Sign In
              </Link>

              <Link
                to="/register"
                onClick={closeMenu}
                className="rounded-lg bg-indigo-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Reading Progress Bar */}
      <div
        className="absolute bottom-0 left-0 h-0.5 bg-indigo-600 transition-[width] duration-100"
        style={{
          width: `${scrollProgress}%`,
        }}
        aria-hidden="true"
      />
    </header>
  );
};

export default Navbar;