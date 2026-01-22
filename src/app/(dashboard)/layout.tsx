
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
// import { redirect, unstable_noStore as noStore } from "next/navigation";
import { redirect } from "next/navigation";
// import AuthClientGuard from "@/components/AuthClientGuard";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div className="flex min-h-screen bg-background">
      {/* <AuthClientGuard /> */}
      <Sidebar />
      <div className="flex-1 flex flex-col md:ml-64 transition-colors duration-300">
        <Header />
        <main className="flex-1 p-6 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
