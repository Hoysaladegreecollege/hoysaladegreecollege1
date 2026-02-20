import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, Download, ExternalLink, FileText, Image, Video, File, FileArchive, Search } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

function fileIcon(url: string) {
  const ext = url?.split(".").pop()?.toLowerCase() || "";
  if (["jpg","jpeg","png","gif","webp","svg"].includes(ext)) return <Image className="w-6 h-6 text-blue-500" />;
  if (["mp4","webm","mov","avi"].includes(ext)) return <Video className="w-6 h-6 text-purple-500" />;
  if (ext === "pdf") return <FileText className="w-6 h-6 text-red-500" />;
  if (["doc","docx","ppt","pptx","xls","xlsx"].includes(ext)) return <FileArchive className="w-6 h-6 text-green-500" />;
  return <File className="w-6 h-6 text-muted-foreground" />;
}

function fileBadge(url: string) {
  const ext = url?.split(".").pop()?.toLowerCase() || "file";
  const map: Record<string, { label: string; cls: string }> = {
    pdf: { label: "PDF", cls: "bg-red-100 text-red-700" },
    jpg: { label: "Image", cls: "bg-blue-100 text-blue-700" },
    jpeg: { label: "Image", cls: "bg-blue-100 text-blue-700" },
    png: { label: "Image", cls: "bg-blue-100 text-blue-700" },
    mp4: { label: "Video", cls: "bg-purple-100 text-purple-700" },
    doc: { label: "DOC", cls: "bg-green-100 text-green-700" },
    docx: { label: "DOCX", cls: "bg-green-100 text-green-700" },
    ppt: { label: "PPT", cls: "bg-orange-100 text-orange-700" },
    pptx: { label: "PPT", cls: "bg-orange-100 text-orange-700" },
    xls: { label: "Excel", cls: "bg-emerald-100 text-emerald-700" },
    xlsx: { label: "Excel", cls: "bg-emerald-100 text-emerald-700" },
  };
  const info = map[ext] || { label: ext.toUpperCase(), cls: "bg-muted text-muted-foreground" };
  return <span className={`font-body text-[10px] font-bold px-2 py-0.5 rounded-full ${info.cls}`}>{info.label}</span>;
}

export default function StudentMaterials() {
  const [search, setSearch] = useState("");

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

  const handleDownload = async (url: string, title: string) => {
    try {
      const resp = await fetch(url);
      const blob = await resp.blob();
      const ext = url.split(".").pop()?.split("?")[0] || "file";
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `${title}.${ext}`;
      a.click();
    } catch {
      window.open(url, "_blank");
    }
  };

  const filtered = materials.filter((m: any) => {
    const q = search.toLowerCase();
    return !q || m.title?.toLowerCase().includes(q) || m.subject?.toLowerCase().includes(q) || m.courses?.name?.toLowerCase().includes(q);
  });

  const grouped = filtered.reduce((acc: any, m: any) => {
    const key = m.courses?.name || "General";
    if (!acc[key]) acc[key] = [];
    acc[key].push(m);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border border-border rounded-2xl p-6">
        <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" /> Study Materials
        </h2>
        <p className="font-body text-sm text-muted-foreground mt-1">Access and download study materials uploaded by your teachers</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search materials, subjects or courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 rounded-xl"
        />
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-32 bg-muted/50 rounded-2xl animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-12 text-center">
          <BookOpen className="w-14 h-14 text-muted-foreground mx-auto mb-3" />
          <h3 className="font-display text-lg font-bold text-foreground mb-1">No Materials Found</h3>
          <p className="font-body text-sm text-muted-foreground">No study materials available yet. Check back later.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {Object.entries(grouped).map(([courseName, items]: [string, any]) => (
            <div key={courseName} className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
              <div className="px-5 py-3.5 bg-gradient-to-r from-primary/5 to-secondary/5 border-b border-border flex items-center justify-between">
                <h3 className="font-display text-sm font-bold text-foreground flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-primary" /> {courseName}
                </h3>
                <span className="font-body text-xs text-muted-foreground bg-background px-2 py-0.5 rounded-full border border-border">
                  {items.length} file{items.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border/50">
                {items.map((m: any, idx: number) => (
                  <div
                    key={m.id}
                    className={`p-5 hover:bg-muted/20 transition-colors group ${idx !== 0 && idx % 2 === 0 ? "sm:col-span-2 sm:divide-y sm:divide-border/50" : ""}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-11 h-11 rounded-xl bg-muted/50 flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                        {fileIcon(m.file_url || "")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h4 className="font-body text-sm font-semibold text-foreground">{m.title}</h4>
                          {m.file_url && fileBadge(m.file_url)}
                        </div>
                        <p className="font-body text-xs text-muted-foreground">{m.subject}</p>
                        <p className="font-body text-[10px] text-muted-foreground mt-0.5">
                          {new Date(m.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      </div>
                    </div>
                    {m.file_url && (
                      <div className="flex gap-2 mt-3 ml-14">
                        <a href={m.file_url} target="_blank" rel="noopener noreferrer" className="flex-1">
                          <button className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl border border-border bg-background hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all font-body text-xs font-semibold">
                            <ExternalLink className="w-3 h-3" /> Open
                          </button>
                        </a>
                        <button
                          onClick={() => handleDownload(m.file_url, m.title)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-border bg-background hover:bg-secondary hover:text-secondary-foreground hover:border-secondary transition-all font-body text-xs font-semibold"
                        >
                          <Download className="w-3 h-3" /> Download
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
