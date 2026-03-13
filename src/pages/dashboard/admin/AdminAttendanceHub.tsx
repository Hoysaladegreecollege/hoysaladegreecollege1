import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserCheck, Clock } from "lucide-react";
import AdminAttendanceOverview from "./AdminAttendanceOverview";
import AdminAbsentReport from "./AdminAbsentReport";

export default function AdminAttendanceHub() {
  return (
    <div className="space-y-6 animate-fade-in">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-card border border-border/60 rounded-xl p-1 h-auto gap-1">
          <TabsTrigger value="overview" className="gap-2 rounded-lg data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-body text-xs font-semibold px-4 py-2.5">
            <UserCheck className="w-3.5 h-3.5" /> Attendance Overview
          </TabsTrigger>
          <TabsTrigger value="absent" className="gap-2 rounded-lg data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-body text-xs font-semibold px-4 py-2.5">
            <Clock className="w-3.5 h-3.5" /> Absent Report
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <AdminAttendanceOverview />
        </TabsContent>
        <TabsContent value="absent">
          <AdminAbsentReport />
        </TabsContent>
      </Tabs>
    </div>
  );
}
