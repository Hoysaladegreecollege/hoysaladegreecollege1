import { RefreshCw } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

export default function RefreshButton() {
  const qc = useQueryClient();
  const [spinning, setSpinning] = useState(false);

  const handleRefresh = async () => {
    setSpinning(true);
    try {
      // Clear all query cache and force refetch
      qc.clear();
      await qc.refetchQueries({ type: 'active' });
      // Clear browser caches
      if ("caches" in window) {
        const names = await caches.keys();
        await Promise.all(names.map(name => caches.delete(name)));
      }
      toast.success("Data refreshed with latest information!");
    } catch {
      toast.error("Failed to refresh some data");
    } finally {
      setTimeout(() => setSpinning(false), 400);
    }
  };

  return (
    <button
      onClick={handleRefresh}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-muted/50 hover:bg-muted border border-border/60 font-body text-xs text-muted-foreground hover:text-foreground transition-all duration-200 hover:shadow-sm"
      title="Refresh data"
    >
      <RefreshCw className={`w-3.5 h-3.5 transition-transform duration-700 ${spinning ? "animate-spin" : ""}`} />
      <span className="hidden sm:inline">Refresh</span>
    </button>
  );
}
