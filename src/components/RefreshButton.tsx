import { RefreshCw } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

export default function RefreshButton() {
  const qc = useQueryClient();
  const [spinning, setSpinning] = useState(false);

  const handleRefresh = () => {
    setSpinning(true);
    qc.invalidateQueries();
    toast.success("Data refreshed!");
    setTimeout(() => setSpinning(false), 800);
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
