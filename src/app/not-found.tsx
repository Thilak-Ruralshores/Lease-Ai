import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 p-4 text-center">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-full shadow-lg mb-8">
        <FileQuestion className="w-16 h-16 text-slate-400" />
      </div>
      <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">Page Not Found</h2>
      <p className="text-slate-500 mb-8 max-w-md">
        The page you are looking for does not exist or has been moved. 
        Please check the URL or return to the dashboard.
      </p>
      <Button asChild>
        <Link href="/dashboard">Return to Dashboard</Link>
      </Button>
    </div>
  );
}
