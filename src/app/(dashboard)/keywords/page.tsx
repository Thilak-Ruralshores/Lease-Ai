"use client";

import { useEffect } from "react";
import KeywordSection from "@/components/dashboard/keyword-section";
import { Button } from "@/components/ui/button";
import { ChevronLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useKeywords } from "@/context/keyword-context";
import { useToast } from "@/context/toast-context";

export default function KeywordsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const docId = searchParams.get("docId");
  const { confirmKeywords, activeCount, fetchKeywords } = useKeywords();
  const { addToast } = useToast();

  // Fetch keywords whenever the page is visited
  useEffect(() => {
    fetchKeywords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run on mount to ensure fresh data

  const handleConfirm = () => {
    if (docId) {
      confirmKeywords(docId);
      addToast("Keywords confirmed for extraction", "success");
      router.push("/dashboard");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="rounded-full">
            <Link href="/dashboard">
              <ChevronLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              Manage Keywords
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              {docId ? "Tailor extraction data for your document" : "Customize global extraction data points"}
            </p>
          </div>
        </div>

        {docId && (
            <Button 
              onClick={handleConfirm}
              className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 px-6"
              disabled={activeCount === 0}
            >
              <CheckCircle2 className="w-4 h-4" />
              Confirm & Return
            </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6">
        <KeywordSection isFullPage={true} />
        
        {docId && (
          <div className="flex justify-center pt-2">
             <Button 
                size="lg"
                onClick={handleConfirm}
                className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 min-w-[220px] transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                disabled={activeCount === 0}
              >
                <CheckCircle2 className="w-5 h-5 text-blue-100" />
                Confirm Selection
              </Button>
          </div>
        )}

        <div className="bg-gradient-to-br from-indigo-500/5 to-blue-600/5 border border-blue-100 dark:border-blue-900/30 rounded-xl p-8 text-slate-800 dark:text-slate-200">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1">
              <h3 className="font-semibold text-xl mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-500" />
                Why Keywords Matter?
              </h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Our AI uses these keywords as semantic anchors to locate and extract specific information from your lease agreements. 
                By selecting specific keywords, you can tailor the extraction process to your exact needs, ensuring higher accuracy 
                and relevance for your property management workflows.
              </p>
            </div>
            <div className="w-full md:w-auto">
              <Button variant="ghost" asChild className="text-slate-600 hover:text-slate-900">
                <Link href="/dashboard">
                  Cancel and Back
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
