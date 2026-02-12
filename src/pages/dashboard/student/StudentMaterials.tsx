import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, Download, ExternalLink } from "lucide-react";

export default function StudentMaterials() {
  const { data: materials = [], isLoading } = useQuery({
    queryKey: ["student-materials"],
    queryFn: async () => {
      const { data } = await supabase
        .from("study_materials")
        .select("*, courses(name)")
        .order("created_at", { ascending: false });
      return data || [];
    },
  });

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold text-foreground">Study Materials</h2>
      {isLoading ? (
        <p className="font-body text-sm text-muted-foreground">Loading...</p>
      ) : materials.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-6 text-center">
          <BookOpen className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
          <p className="font-body text-sm text-muted-foreground">No study materials available.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {materials.map((m) => (
            <div key={m.id} className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-body text-xs text-muted-foreground mb-1">{m.subject} • {m.courses?.name}</p>
                  <h3 className="font-body text-sm font-semibold text-foreground">{m.title}</h3>
                  <p className="font-body text-xs text-muted-foreground mt-1">{new Date(m.created_at).toLocaleDateString()}</p>
                </div>
                {m.file_url && (
                  <a href={m.file_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
