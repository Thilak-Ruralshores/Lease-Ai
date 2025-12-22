"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { Plus, X, Search, ChevronDown, ChevronUp, RotateCcw, AlertCircle, Check, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { categoryColors, cn } from "@/lib/utils";
import { useKeywords, CATEGORIES, Keyword } from "@/context/keyword-context";
type CheckboxState = "checked" | "unchecked" | "indeterminate";
// Custom Checkbox Component for 3 states
const TriStateCheckbox = ({ 
  state, 
  onChange, 
  className 
}: { 
  state: CheckboxState; 
 onChange: (nextState: "checked" | "unchecked") => void;
  className?: string;
}) => {
  console.log(state,'is state')
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (state === "checked") {
      onChange("unchecked");
    } else {
      // unchecked OR indeterminate
      onChange("checked");
    }
  };
  return (
    <div 
      onClick={(e) => {handleClick(e)}}
      className={cn(
        "w-4 h-4 rounded border flex items-center justify-center cursor-pointer transition-colors",
        state === "checked" || state === "indeterminate"
          ? "bg-blue-600 border-blue-600 text-white" 
          : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800",
        className
      )}
    >
      {state === "checked" && <Check className="w-3 h-3" />}
      {state === "indeterminate" && <Minus className="w-3 h-3" />}
    </div>
  );
};

export default function KeywordSection() {
  const { 
    keywords, 
    activeKeywords, 
    activeCount, 
    toggleKeyword, 
    toggleCategory, 
    resetKeywords, 
    addCustomKeyword, 
    getCategoryState 
  } = useKeywords();

  const [searchQuery, setSearchQuery] = useState("");
  const [newKeyword, setNewKeyword] = useState("");
  const [selectedCustomCategory, setSelectedCustomCategory] = useState<string>(CATEGORIES[0]);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set()); // Collapsed by default

  const toggleExpand = (category: string) => {
    const newSet = new Set(expandedCategories);
    if (newSet.has(category)) {
      newSet.delete(category);
    } else {
      newSet.add(category);
    }
    setExpandedCategories(newSet);
  };

  const handleAddCustom = () => {
    if (newKeyword.trim()) {
      addCustomKeyword(newKeyword.trim(), selectedCustomCategory);
      setNewKeyword("");
    }
  };

  // Filter categories and keywords based on search
  const filteredData = useMemo(() => {
    if (!searchQuery) return { categories: CATEGORIES, keywords };
    
    // If search active, find keywords matching or categories matching
    const lowerQuery = searchQuery.toLowerCase();
    
    // We want to show a category if it matches query OR if it has keywords that match query
    const matchingCategories = CATEGORIES.filter(cat => {
      const catMatch = cat.toLowerCase().includes(lowerQuery);
      const hasKeywordMatch = keywords.some(k => k.category === cat && k.text.toLowerCase().includes(lowerQuery));
      return catMatch || hasKeywordMatch;
    });

    return { categories: matchingCategories, keywords };
  }, [keywords, searchQuery]);

  // Group keywords by category for rendering
  const keywordsByCategory = useMemo(() => {
    const mapping: Record<string, Keyword[]> = {};
    keywords.forEach(k => {
      if (!mapping[k.category]) mapping[k.category] = [];
      mapping[k.category].push(k);
    });
    return mapping;
  }, [keywords]);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col max-h-[800px]">
      {/* Header */}
      <div className="p-5 border-b border-slate-100 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">Extraction Keywords</h3>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={resetKeywords} className="text-xs h-7 text-muted-foreground hover:text-foreground">
              <RotateCcw className="w-3 h-3 mr-1" />
              Reset
            </Button>
            <span className={cn(
              "text-xs px-2.5 py-1 rounded-full font-medium transition-colors border",
              activeCount > 0 
                ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800" 
                : "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
            )}>
              {activeCount} Active
            </span>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search categories or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 bg-slate-50 dark:bg-slate-800/50"
          />
        </div>
      </div>

      {/* Active Keywords Panel (Chips) */}
      {activeCount > 0 && (
         <div className="px-5 py-3 bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800">
           <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">Active Selection</p>
           <div className="flex flex-wrap gap-2 max-h-[120px] overflow-y-auto pr-1">
             <AnimatePresence mode="popLayout">
               {activeKeywords.map(k => (
                 <motion.div
                   key={k.id}
                   initial={{ opacity: 0, scale: 0.8 }}
                   animate={{ opacity: 1, scale: 1 }}
                   exit={{ opacity: 0, scale: 0.8 }}
                   layout
                   className={cn(
                     "flex items-center gap-1.5 pl-3 pr-1.5 py-1 rounded-full text-xs font-medium border shadow-sm",
                     categoryColors[k.category] || "bg-white border-slate-200"
                   )}
                 >
                   {k.text}
                   <button
                     onClick={() => toggleKeyword(k.id,k.isActive ? "unchecked" : "checked")}
                     className="p-0.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                   >
                     <X className="w-3 h-3" />
                   </button>
                 </motion.div>
               ))}
             </AnimatePresence>
           </div>
         </div>
      )}

      {/* Warning if 0 active */}
      {activeCount === 0 && (
        <div className="bg-amber-50 dark:bg-amber-900/20 p-4 flex items-start gap-3 border-b border-amber-100 dark:border-amber-900/30">
          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="text-sm text-amber-800 dark:text-amber-300">
            <p className="font-medium">No keywords selected</p>
            <p className="text-amber-700/80 dark:text-amber-400/80 mt-1">
              You must select at least one keyword to perform extraction.
            </p>
          </div>
        </div>
      )}

      {/* Categories List */}
      <div className="flex-1 overflow-y-auto min-h-[300px] bg-slate-50/30 dark:bg-slate-900/10" style={{ scrollbarWidth: 'thin' }}>
        <div className="p-4 space-y-3">
          {filteredData.categories.map(category => {
            const catKeywords = keywordsByCategory[category]?.filter(k => 
                !searchQuery || k.text.toLowerCase().includes(searchQuery.toLowerCase())
            ) || [];
            
            if (catKeywords.length === 0 && searchQuery) return null;
            if (!keywordsByCategory[category]) return null;

            return (
              <div key={category} className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden shadow-sm">
                {/* Category Header */}
                <div 
                  className="px-3 py-3 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                  onClick={() => toggleExpand(category)}
                >
                  <div className="flex items-center gap-3">
                    <TriStateCheckbox 
                      state={getCategoryState(category)} 
                      onChange={(nextState) => toggleCategory(category, nextState)}
                    />
                    <div className="flex flex-col">
                        <span className="font-medium text-sm text-slate-800 dark:text-slate-200 select-none">
                            {category}
                        </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                     <span className="text-xs text-muted-foreground bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                      {catKeywords.length}
                    </span>
                    {expandedCategories.has(category) ? (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                    ) : (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Keywords Grid */}
                <AnimatePresence initial={false}>
                  {expandedCategories.has(category) && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden border-t border-slate-100 dark:border-slate-800/50"
                    >
                      <div className="p-3 grid grid-cols-1 gap-1">
                        {catKeywords.map(keyword => (
                          <div 
                            key={keyword.id}
                            className={cn(
                              "group flex items-center gap-3 p-2 rounded-md transition-colors duration-300 cursor-pointer",
                              keyword.isActive 
                                ? "bg-blue-50/50 dark:bg-blue-900/10" 
                                : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                            )}
                            onClick={() => toggleKeyword(keyword.id,keyword.isActive ? "checked" : "unchecked")}
                          >
                            <TriStateCheckbox  
                                  state={keyword.isActive ?  "checked" : "unchecked"} 
                                onChange={(nextState) => toggleKeyword(keyword.id, nextState)}
                                className={cn("w-3.5 h-3.5", keyword.isActive ? "" : "border-slate-300")}
                            />
                            <span className={cn(
                              "text-xs leading-tight",
                              keyword.isActive ? "text-slate-900 dark:text-slate-100 font-medium" : "text-slate-600 dark:text-slate-400"
                            )}>
                              {keyword.text}
                            </span>
                            {/* Chip indicator for active */}
                            {keyword.isActive && (
                                <span className={cn(
                                    "ml-auto text-[9px] px-1.5 py-0.5 rounded-full uppercase tracking-wider font-bold opacity-60",
                                    categoryColors[keyword.category]
                                )}>
                                    Active
                                </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
          
          {filteredData.categories.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
                <Search className="w-8 h-8 mx-auto mb-2 opacity-20" />
                <p>No matching categories found</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer: Custom Keyword */}
      <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 rounded-b-xl">
        <label className="text-xs font-semibold text-muted-foreground mb-2 block">Add Custom Keyword</label>
        <div className="flex flex-col gap-2">
            <Input
                placeholder="Keyword name..."
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                className="h-8 text-sm bg-white dark:bg-slate-950"
            />
            <div className="flex gap-2">
                <select 
                    className="flex-1 h-8 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs px-2"
                    value={selectedCustomCategory}
                    onChange={(e) => setSelectedCustomCategory(e.target.value)}
                >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <Button onClick={handleAddCustom} size="sm" className="h-8 gap-1" disabled={!newKeyword.trim()}>
                    <Plus className="w-3.5 h-3.5" />
                    Add
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
}
