"use client";

import DashboardNavbar from "@/components/ui/navbar";

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