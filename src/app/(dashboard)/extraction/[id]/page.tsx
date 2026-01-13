"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Download, FileText, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ExtractionTable from "@/components/extraction/extraction-table";
import ReviewPanel from "@/components/extraction/review-panel";
import { DUMMY_EXTRACTIONS, DUMMY_DOCUMENTS, ExtractionData, INITIAL_KEYWORDS } from "@/lib/dummy-data";
import { useToast } from "@/context/toast-context";
import { useKeywords } from "@/context/keyword-context";
import { motion } from "framer-motion";

export default function ExtractionPage() {
  const params = useParams();
  const router = useRouter();
  const { addToast } = useToast();
  const id = params.id as string;

  const [document, setDocument] = useState(DUMMY_DOCUMENTS.find((d: { id: string }) => d.id === id));
  const [data, setData] = useState<ExtractionData[]>([]);
  const [selectedField, setSelectedField] = useState<ExtractionData | null>(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

    const { getSelectedKeywordsForDoc, keywords } = useKeywords();

    useEffect(() => {
    // Get keywords for this specific document
    const docKeywords = getSelectedKeywordsForDoc(id);
    
    // Determine source data
    let sourceData: ExtractionData[] = [];
    if (DUMMY_EXTRACTIONS[id]) {
      sourceData = DUMMY_EXTRACTIONS[id];
    } else {
      sourceData = DUMMY_EXTRACTIONS["doc_1"] || [];
    }

    // Create map for quick lookup
    const dataMap = new Map(sourceData.map(item => [item.field, item]));

    // Helper to generate realistic dummy data
    const generateDummyData = (keyword: string): ExtractionData => {
      let value = "Not Extracted";
      let evidence = "No matching evidence found in document.";
      let clause = "-";

      const lower = keyword.toLowerCase();
      
      if (lower.includes("date") || lower.includes("period")) {
         value = "2024-05-15";
         evidence = `The ${keyword.toLowerCase()} shall be May 15, 2024.`;
         clause = "1.2";
      } else if (lower.includes("amount") || lower.includes("rent") || lower.includes("cost") || lower.includes("fee")) {
         value = "$12,500.00";
         evidence = `The ${keyword.toLowerCase()} is set at twelve thousand five hundred dollars ($12,500.00).`;
         clause = "3.4";
      } else if (lower.includes("name") || lower.includes("party")) {
         value = "Acme Corp Ltd.";
         evidence = `The ${keyword.toLowerCase()} is Acme Corp Ltd.`;
         clause = "Preamble";
      } else if (lower.includes("area") || lower.includes("square")) {
         value = "2,500 Sq Ft";
         evidence = `Premises approximately 2,500 square feet.`;
         clause = "2.1";
      } else if (lower.includes("method")) {
        value = "Bank Transfer";
        evidence = "Payments shall be made via electronic bank transfer.";
        clause = "4.2";
      } else {
         value = "Applicable";
         evidence = `The tenant is responsible for ${keyword.toLowerCase()} as per standard terms.`;
         clause = "5.0";
      }

      // Add randomization to make it look distinct
      if (Math.random() > 0.7) {
         value = "Not Applicable";
         evidence = "N/A";
         clause = "-";
      }

      return {
        field: keyword,
        value,
        evidence,
        clause
      };
    };

    // Generate full list based on document-specific keywords (preserves order)
    const fullData: ExtractionData[] = docKeywords.map(k => {
      const keywordText = k.keyword;
      if (dataMap.has(keywordText)) {
        return dataMap.get(keywordText)!;
      }
      return generateDummyData(keywordText);
    });

    setData(fullData);
    
    const doc = DUMMY_DOCUMENTS.find((d: { id: string }) => d.id === id);
    if(doc) setDocument(doc);

  }, [id, getSelectedKeywordsForDoc, keywords]);

  const handleEdit = (field: ExtractionData) => {
    setSelectedField(field);
    setIsReviewOpen(true);
  };

  const handleSaveField = (updatedField: ExtractionData) => {
    setData(prev => prev.map(item => 
      item.field === updatedField.field ? updatedField : item
    ));
    addToast(`Updated ${updatedField.field}`, "success");
  };



  if (!document) {
    return <div className="p-8">Document not found</div>;
  }

  return (
    <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-6xl mx-auto space-y-8"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <FileText className="w-6 h-6 text-blue-500" />
              {document.name}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Uploaded on {document.uploadedAt} • {document.size}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
            <Button className="bg-green-600 hover:bg-green-700">
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Mark as Reviewed
            </Button>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900 rounded-xl p-4 flex items-start gap-3">
        <div className="bg-blue-100 dark:bg-blue-800 p-2 rounded-full text-blue-600 dark:text-blue-300">
            <CheckCircle2 className="w-5 h-5" />
        </div>
        <div>
            <h3 className="font-semibold text-blue-900 dark:text-blue-100">AI Extraction Complete</h3>
            <p className="text-sm text-blue-700 dark:text-blue-300">
                Review the extracted fields below. Click on any row to edit the value or view the source clause.
            </p>
        </div>
      </div>

      <ExtractionTable data={data} onEdit={handleEdit} />

      <ReviewPanel 
        isOpen={isReviewOpen} 
        onClose={() => setIsReviewOpen(false)}
        data={selectedField}
        onSave={handleSaveField}
      />
    </motion.div>
  );
}
