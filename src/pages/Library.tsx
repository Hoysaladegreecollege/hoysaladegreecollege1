import { useState } from "react";
import SEOHead from "@/components/SEOHead";
import PageHeader from "@/components/PageHeader";
import SectionHeading from "@/components/SectionHeading";
import ScrollReveal from "@/components/ScrollReveal";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Search, Book, User, BarChart2, Library as LibraryIcon, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Library() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("All");

  const { data: books = [], isLoading } = useQuery({
    queryKey: ["public-library"],
    queryFn: async () => {
      const { data } = await supabase
        .from("library_books")
        .select("*")
        .order("title");
      return data || [];
    },
  });

  const categories = ["All", ...Array.from(new Set(books.map((b: any) => b.category)))];
  
  const filteredBooks = books.filter((b: any) => {
    const matchesSearch = b.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          b.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === "All" || b.category === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="page-enter bg-background min-h-screen">
      <SEOHead 
        title="Digital Library | Hoysala Degree College" 
        description="Search and explore books, journals, and resources available at Hoysala Degree College library." 
      />
      <PageHeader 
        title="Digital Library" 
        subtitle="Explore our vast collection of academic resources" 
      />

      <section className="py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="container px-4 max-w-6xl mx-auto relative">
          <ScrollReveal>
            <div className="max-w-2xl mx-auto text-center mb-12">
              <SectionHeading title="Book Catalog" subtitle="Find what you need" />
              
              {/* Search Bar */}
              <div className="relative mt-8 group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="Search by book title or author..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-card/50 backdrop-blur-xl border-2 border-border/50 rounded-2xl py-4 pl-12 pr-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all shadow-lg"
                />
              </div>
            </div>
          </ScrollReveal>

          {/* Filters */}
          <ScrollReveal delay={100}>
            <div className="flex flex-wrap gap-2 mb-12 justify-center">
              {categories.map((c: any) => (
                <button 
                  key={c} 
                  onClick={() => setFilter(c)}
                  className={`font-body text-xs px-5 py-2.5 rounded-full transition-all duration-300 font-medium border backdrop-blur-sm ${
                    filter === c
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105 border-primary"
                      : "bg-card/80 border-border/50 text-muted-foreground hover:bg-muted hover:border-primary/30"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </ScrollReveal>

          {/* Grid */}
          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-48 rounded-3xl" />
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBooks.map((book: any, i: number) => (
                <ScrollReveal key={book.id} delay={i * 50}>
                  <div className="group relative flex gap-4 rounded-3xl border border-border/30 bg-card/40 backdrop-blur-sm p-5 transition-all duration-500 hover:bg-card/60 hover:shadow-xl hover:border-primary/20 hover:-translate-y-1 h-full">
                    
                    {/* Book Cover Placeholder */}
                    <div className="w-24 shrink-0 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/10 flex flex-col items-center justify-center text-primary/40 group-hover:scale-105 transition-transform duration-500">
                      <Book className="w-8 h-8 mb-2 opacity-50" />
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider opacity-50 text-center px-2">{book.category.substring(0,4)}</span>
                    </div>

                    <div className="flex flex-col flex-1 py-1">
                      <h3 className="font-display text-lg font-bold text-foreground leading-tight mb-1 group-hover:text-primary transition-colors line-clamp-2" title={book.title}>
                        {book.title}
                      </h3>
                      
                      <p className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
                        <User className="w-3.5 h-3.5" /> {book.author}
                      </p>

                      <div className="mt-auto space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Category:</span>
                          <span className="font-medium text-foreground">{book.category}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Status:</span>
                          {book.available_copies > 0 ? (
                            <span className="inline-flex items-center gap-1 text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md font-medium">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              {book.available_copies} Available
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-destructive bg-destructive/10 px-2 py-0.5 rounded-md font-medium">
                              <AlertCircle className="w-3 h-3" /> Checked Out
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          )}

          {filteredBooks.length === 0 && !isLoading && (
            <div className="text-center py-20 bg-card/30 rounded-3xl border border-border/30">
              <LibraryIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="font-display text-xl font-medium text-foreground mb-2">No books found</h3>
              <p className="text-muted-foreground text-sm">Try adjusting your search or category filter.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
