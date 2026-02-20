import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ChatBot from "./ChatBot";
import PageLoader from "./PageLoader";
import PageTransition from "./PageTransition";
import PopupBanner from "./PopupBanner";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <PageLoader />
      <PopupBanner />
      <Navbar />
      <main className="flex-1">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
      <Footer />
      <ChatBot />
    </div>
  );
}

