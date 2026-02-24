import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Cake, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function AdminBirthdaySettings() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ principal_name: "", wishes_message: "", quote: "" });
  const [saving, setSaving] = useState(false);

  const { data: settings, isLoading } = useQuery({
    queryKey: ["birthday-settings"],
    queryFn: async () => {
      const { data } = await supabase.from("birthday_settings").select("*").limit(1).maybeSingle();
      return data;
    },
  });

  useEffect(() => {
    if (settings) {
      setForm({ principal_name: settings.principal_name, wishes_message: settings.wishes_message, quote: settings.quote });
    }
  }, [settings]);

  const handleSave = async () => {
    if (!form.principal_name.trim() || !form.wishes_message.trim()) {
      toast.error("Principal name and wishes message are required");
      return;
    }
    setSaving(true);
    try {
      if (settings?.id) {
        await supabase.from("birthday_settings").update({ ...form, updated_by: user?.id, updated_at: new Date().toISOString() }).eq("id", settings.id);
      } else {
        await supabase.from("birthday_settings").insert({ ...form, updated_by: user?.id });
      }
      queryClient.invalidateQueries({ queryKey: ["birthday-settings"] });
      toast.success("Birthday settings saved!");
    } catch (err: any) {
      toast.error(err.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full border border-border rounded-xl px-3 py-2.5 font-body text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all";

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2">
          <Cake className="w-5 h-5 text-primary" /> Birthday Wishes Settings
        </h2>
        <p className="font-body text-sm text-muted-foreground mt-1">Customize the birthday popup message shown to students</p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 max-w-2xl">
        {isLoading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-10 bg-muted rounded-xl" />
            <div className="h-32 bg-muted rounded-xl" />
            <div className="h-20 bg-muted rounded-xl" />
          </div>
        ) : (
          <div className="space-y-5">
            <div>
              <label className="font-body text-xs font-semibold text-muted-foreground mb-1.5 block">Principal's Name</label>
              <input value={form.principal_name} onChange={(e) => setForm({ ...form, principal_name: e.target.value })} className={inputClass} placeholder="Sri Gopal H.R" />
              <p className="font-body text-[11px] text-muted-foreground mt-1">This name will appear in the birthday wishes</p>
            </div>
            <div>
              <label className="font-body text-xs font-semibold text-muted-foreground mb-1.5 block">Birthday Wishes Message</label>
              <Textarea value={form.wishes_message} onChange={(e) => setForm({ ...form, wishes_message: e.target.value })} className="rounded-xl font-body text-sm min-h-[120px]" placeholder="Birthday wishes message..." />
              <p className="font-body text-[11px] text-muted-foreground mt-1">This message is shown in the birthday popup dialog</p>
            </div>
            <div>
              <label className="font-body text-xs font-semibold text-muted-foreground mb-1.5 block">Inspirational Quote</label>
              <Textarea value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} className="rounded-xl font-body text-sm min-h-[80px]" placeholder="An inspirational quote..." />
            </div>
            <Button onClick={handleSave} disabled={saving} className="rounded-xl font-body">
              <Save className="w-4 h-4 mr-2" /> {saving ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
