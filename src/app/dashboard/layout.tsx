"use client";

import DashboardNavbar from "@/components/ui/dashboard-navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <DashboardNavbar />
      {children}
    </>
  );
} 