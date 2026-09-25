import { Outlet } from "react-router-dom";

import BackToTop from "../components/common/BackToTop";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 transition-colors duration-200 dark:bg-slate-950 dark:text-white">
      <Navbar />

      <main>
        <Outlet />
      </main>

      <Footer />

      <BackToTop />
    </div>
  );
};

export default PublicLayout;