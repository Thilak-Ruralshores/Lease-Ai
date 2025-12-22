"use client";

import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from "react";
import { categorizeKeywords, categoryColors } from "@/lib/utils";
import { INITIAL_KEYWORDS } from "@/lib/dummy-data";

// Define the shape of a keyword object
export interface Keyword {
  id: string;
  text: string;
  category: string;
  isActive: boolean;
  isCustom: boolean;
}

// Fixed set of categories for the commercial lease domain
export const CATEGORIES = [
  "Premises & Property Details",
  "Parties & Contacts",
  "Lease Dates & Term",
  "Rent & Payment Terms",
  "Escalation & Indexation",
  "CAM / Operating Expenses",
  "Taxes & Utilities",
  "Security Deposits & Guarantees",
  "Maintenance & Repairs",
  "Improvements & Alterations",
  "Insurance & Risk",
  "Casualty & Condemnation",
  "Assignment & Subletting",
  "Use, Access & Operations",
  "Defaults, Remedies & Termination",
  "Legal, Compliance & ESG",
  "Notices & Contacts"
] as const;

export type Category = typeof CATEGORIES[number];

interface KeywordContextType {
  keywords: Keyword[];
  activeKeywords: Keyword[];
  activeCount: number;
  toggleKeyword: (id: string, nextState: "checked" | "unchecked") => void;
  toggleCategory: (category: string,nextState: "checked" | "unchecked") => void;
  resetKeywords: () => void;
  addCustomKeyword: (text: string, category: string) => void;
  removeCustomKeyword: (id: string) => void;
  getCategoryState: (category: string) => "checked" | "unchecked" | "indeterminate";
}

const KeywordContext = createContext<KeywordContextType | undefined>(undefined);

// Helper to initial keywords
const getInitialKeywords = (): Keyword[] => {
  const categorized = categorizeKeywords(INITIAL_KEYWORDS);
  const selectedKeywords: Keyword[] = [];
  
  // We need to select exactly 30 default active keywords.
  // We will distribute them across categories to have a spread.
 

  CATEGORIES.forEach(cat => {
    const kws = categorized[cat] || [];
    
    kws.forEach(text => {
      // Use composite ID to ensure uniqueness across categories
      const id = `${cat}-${text}`;
      selectedKeywords.push({
        id,
        text,
        category: cat,
        isActive: true, // Default active
        isCustom: false
      });
    });
  });

  
  // Create a Set for fast lookup of what is active by TEXT, since we want to activate same text in diff categories?
  // Or just rely on the specific selected keys.
  // Let's rely on text matching for "is this generic keyword active?" logic if we want sync, 
  // but for "initial state", we physically created selectedKeywords objects.
  
  // However, we are about to build the FULL LIST.
  // The full list needs to know which ones are active.
  // Since we use composite IDs now, checking `activeSet.has(text)` is still valid for "is this text active by default".
  const activeTextSet = new Set(selectedKeywords.map(k => k.text));

  // Now build the FULL list of all keywords (all 270+)
  const fullList: Keyword[] = [];
  
  CATEGORIES.forEach(cat => {
      const kws = categorized[cat] || [];
      kws.forEach(text => {
          const id = `${cat}-${text}`;
          fullList.push({
              id,
              text,
              category: cat,
              isActive: activeTextSet.has(text),
              isCustom: false
          });
      });
  });

  return fullList;
};

export function KeywordProvider({ children }: { children: React.ReactNode }) {
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  // EXPLICITLY track active IDs in order of selection
  const [activeIds, setActiveIds] = useState<string[]>([]);

  // Initialize on mount
  useEffect(() => {
    const initial = getInitialKeywords();
    setKeywords(initial);
    // Initialize activeIds from the default active keywords in their original order
    // Ensure uniqueness just in case
    const initialActive = Array.from(new Set(initial.filter(k => k.isActive).map(k => k.id)));
    setActiveIds(initialActive);
  }, []);

  // Compute activeKeywords by mapping activeIds to the actual keyword objects
  // This preserves the order of activeIds
  const activeKeywords = useMemo(() => {
    const keywordMap = new Map(keywords.map(k => [k.id, k]));
    return activeIds
      .map(id => keywordMap.get(id))
      .filter((k): k is Keyword => !!k);
  }, [keywords, activeIds]);

  const activeCount = activeIds.length;

  const toggleKeyword = useCallback(
  (id: string, nextState: "checked" | "unchecked") => {
    setActiveIds(prev => {
      const isActive = prev.includes(id);

      if (nextState === "checked" && !isActive) {
        return [...prev, id];
      }

      if (nextState === "unchecked" && isActive) {
        return prev.filter(activeId => activeId !== id);
      }

      return prev;
    });

    setKeywords(prev =>
      prev.map(k =>
        k.id === id
          ? { ...k, isActive: nextState === "checked" }
          : k
      )
    );
  },
  []
);


  const toggleCategory = useCallback(
  (category: string, nextState: "checked" | "unchecked") => {
    setKeywords(prev => {
      const updated = prev.map(k =>
        k.category === category
          ? { ...k, isActive: nextState === "checked" }
          : k
      );

      // Sync activeIds from isActive
      const newActiveIds = updated
        .filter(k => k.isActive)
        .map(k => k.id);

      setActiveIds(newActiveIds);

      return updated;
    });
  },
  []
);


  const resetKeywords = useCallback(() => {
    const initial = getInitialKeywords();
    setKeywords(initial);
    setActiveIds(initial.filter(k => k.isActive).map(k => k.id));
  }, []);

  const addCustomKeyword = useCallback((text: string, category: string) => {
    const id = `custom-${Date.now()}`;
    const newKw: Keyword = {
      id,
      text,
      category,
      isActive: true,
      isCustom: true
    };

    setKeywords(prev => [...prev, newKw]);
    setActiveIds(prev => [...prev, id]); // Add to end
  }, []);

  const removeCustomKeyword = useCallback((id: string) => {
    setKeywords(prev => prev.filter(k => k.id !== id));
    setActiveIds(prev => prev.filter(activeId => activeId !== id));
  }, []);

  const getCategoryState = useCallback((category: string): "checked" | "unchecked" | "indeterminate" => {
    const catKeywords = keywords.filter(k => k.category === category);
    if (catKeywords.length === 0) return "unchecked";
    
    // We must check against activeIds to be sure, although we sync 'isActive' prop.
    // Using 'isActive' prop on keyword is faster since we update it.
    const activeInCat = catKeywords.filter(k => k.isActive).length;
    
    if (activeInCat === 0) return "unchecked";
    if (activeInCat === catKeywords.length) return "checked";
    return "indeterminate";
  }, [keywords]);

  return (
    <KeywordContext.Provider value={{
      keywords,
      activeKeywords,
      activeCount,
      toggleKeyword,
      toggleCategory,
      resetKeywords,
      addCustomKeyword,
      removeCustomKeyword,
      getCategoryState
    }}>
      {children}
    </KeywordContext.Provider>
  );
}

export const useKeywords = () => {
  const context = useContext(KeywordContext);
  if (context === undefined) {
    throw new Error("useKeywords must be used within a KeywordProvider");
  }
  return context;
};
