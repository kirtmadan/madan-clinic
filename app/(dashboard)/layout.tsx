import "../globals.css";
import Dashboard from "@/layouts/Dashboard";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <Dashboard>{children}</Dashboard>;
}
