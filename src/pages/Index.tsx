import { useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

const Index = () => {
  useEffect(() => {
    document.title = "Patient Health Dashboard | Heart Failure Care";
  }, []);
  return <DashboardLayout />;
};

export default Index;
