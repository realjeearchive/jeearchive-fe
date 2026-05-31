import type { Metadata } from "next";
import DashboardPage from "@/components/dashboard/dashboardPage/dashboardPage";

export const metadata: Metadata = {
  title: "Dashboard - JEE Archive",
  description: "Your JEE preparation dashboard. Track progress, view analytics, and continue practicing.",
  robots: {
    index: false, // Personal dashboard - no SEO value
    follow: false,
  },
};

const Dashboard = () => {
  return <DashboardPage />;
};

export default Dashboard;