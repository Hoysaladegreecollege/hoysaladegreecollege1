import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft, Home } from "lucide-react";
import SEOHead from "@/components/SEOHead";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <>
      <SEOHead
        title="Page Not Found"
        description="The page you are looking for does not exist. Return to the Hoysala Degree College home page."
        noIndex
      />

      <main className="min-h-screen bg-muted/30 flex items-center justify-center px-4">
        <section className="w-full max-w-xl bg-card border border-border rounded-3xl p-8 sm:p-10 text-center shadow-xl animate-fade-in-up">
          <div className="mx-auto mb-4 w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
            <ArrowLeft className="w-6 h-6" />
          </div>
          <p className="font-body text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">Error 404</p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground">Page not found</h1>
          <p className="font-body text-sm text-muted-foreground mt-3">
            The page may have been moved, renamed, or is temporarily unavailable.
          </p>

          <div className="mt-7">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-5 py-3 font-body text-sm font-semibold hover:opacity-95 hover:-translate-y-0.5 transition-all duration-300"
            >
              <Home className="w-4 h-4" />
              Back to home
            </Link>
          </div>
        </section>
      </main>
    </>
  );
};

export default NotFound;

