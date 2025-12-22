"use client";

import { ExtractionData } from "@/lib/dummy-data";
import { Edit2, FileText, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";

interface ExtractionTableProps {
  data: ExtractionData[];
  onEdit: (data: ExtractionData) => void;
}

export default function ExtractionTable({ data, onEdit }: ExtractionTableProps) {
  
  const handleDownloadExcel = () => {
    // Map data to the desired format
    const excelData = data.map((item) => ({
      "Field name": item.field,
      "Extracted value": item.value,
    }));

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Extraction Results");

    // Generate Excel file
    XLSX.writeFile(workbook, "extraction_results.xlsx");
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={handleDownloadExcel} variant="outline" size="sm" className="gap-2">
          <Download className="w-4 h-4" />
          Download Excel
        </Button>
      </div>
      <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
        <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-medium uppercase text-xs">
            <tr>
              <th className="px-6 py-4">Field Name</th>
              <th className="px-6 py-4">Extracted Value</th>
              <th className="px-6 py-4">Evidence</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            <AnimatePresence>
            {data.map((row, index) => (
              <motion.tr
                key={row.field}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, delay: index * 0.02 }}
                onClick={() => onEdit(row)}
                className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
              >
                <td className="px-6 py-3 font-medium text-slate-900 dark:text-slate-100 tracking-tight">
                    {row.field}
                </td>
                <td className="px-6 py-3 text-slate-700 dark:text-slate-300">
                  <span className={cn(
                    "font-medium",
                    row.value === "Not Extracted" ? "text-slate-400 italic font-normal" : "text-slate-700 dark:text-slate-200"
                  )}>
                    {row.value}
                  </span>
                </td>
                <td className="px-6 py-3 max-w-xs relative group/evidence">
                  {row.evidence !== "No matching evidence found in document." ? (
                    <>
                        <div className="flex items-start gap-2">
                            <FileText className="w-4 h-4 text-blue-500/70 flex-shrink-0 mt-0.5" />
                            <div>
                            <p className="text-slate-600 dark:text-slate-400 text-xs italic line-clamp-2">
                                "{row.evidence}"
                            </p>
                            <span className="text-xs text-blue-500 font-medium mt-1 inline-block">
                                Clause {row.clause}
                            </span>
                            </div>
                        </div>
                        <div className="hidden group-hover/evidence:block absolute top-full left-0 z-20 bg-slate-900 text-white text-xs p-3 rounded-lg shadow-xl mt-1 w-80 max-w-sm pointer-events-none">
                            <p className="italic">"{row.evidence}"</p>
                            <p className="text-blue-400 font-medium mt-2">Clause {row.clause}</p>
                        </div>
                    </>
                  ) : (
                    <span className="text-slate-400 text-xs italic">-</span>
                  )}
                </td>
                <td className="px-6 py-3 text-right">
                  <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-slate-500 hover:text-primary transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
            </AnimatePresence>
            {data.length === 0 && (
                <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-slate-400 italic">
                        No keywords extracted. Please select keywords from the dashboard.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
      </div>
    </div>
  );
}
