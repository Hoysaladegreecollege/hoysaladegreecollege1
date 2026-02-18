import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ChatBot from "./ChatBot";
import PageLoader from "./PageLoader";
import PageTransition from "./PageTransition";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <PageLoader />
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
