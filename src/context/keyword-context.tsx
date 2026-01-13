"use client";

import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from "react";
// import { categorizeKeywords } from "@/lib/utils";
// import { INITIAL_KEYWORDS } from "@/lib/dummy-data";
import { useToast } from "@/context/toast-context";

// Define the shape of a keyword object matching the DB schema
export interface Keyword {
  id: string;
  keyword: string;
  category: string;
  isActive: boolean;
  isCustom: boolean;
}

// Fixed set of categories
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
  isLoading: boolean;
  allCategories: string[];
  toggleKeyword: (id: string, nextState: "checked" | "unchecked") => void;
  toggleCategory: (category: string, nextState: "checked" | "unchecked") => void;
  resetKeywords: () => void;
  addCustomKeyword: (text: string, category: string) => Promise<void>;
  removeCustomKeyword: (id: string) => void;
  getCategoryState: (category: string) => "checked" | "unchecked" | "indeterminate";
  confirmedDocIds: string[];
  confirmKeywords: (docId: string) => void;
  fetchKeywords: () => Promise<void>;
  getSelectedKeywordsForDoc: (docId: string) => Keyword[];
}

const KeywordContext = createContext<KeywordContextType | undefined>(undefined);

export function KeywordProvider({ children }: { children: React.ReactNode }) {
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [activeIds, setActiveIds] = useState<string[]>([]);
  const [confirmedDocIds, setConfirmedDocIds] = useState<string[]>([]);
  const [selectedKeywordsByDoc, setSelectedKeywordsByDoc] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();

  // Dynamically compute all categories from base list + keywords from DB
  const allCategories = useMemo(() => {
    const fromKeywords = Array.from(new Set(keywords.map(k => k.category)));
    const base = [...CATEGORIES];
    // Merge them and filter out any duplicates
    const merged = Array.from(new Set([...base, ...fromKeywords]));
    return merged.sort();
  }, [keywords]);

  const fetchKeywords = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/keywords');
      if (!response.ok) throw new Error('Failed to fetch keywords');
      const data = await response.json();
      setKeywords(data);
      
      // Initialize activeIds from keywords where isActive is true
      const initialActive = data.filter((k: Keyword) => k.isActive).map((k: Keyword) => k.id);
      setActiveIds(initialActive);
    } catch (error) {
      console.error('Error fetching keywords:', error);
      addToast("Failed to fetch keywords", "error");
    } finally {
      setIsLoading(false);
    }
  }, [addToast]);

  // Initial load
  useEffect(() => {
    fetchKeywords();

    // Load confirmed IDs from storage
    const stored = localStorage.getItem("confirmed_docs");
    if (stored) {
      try {
        setConfirmedDocIds(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to load confirmed docs", e);
      }
    }

    // Load selections from storage
    const storedSelections = localStorage.getItem("keyword_selections_by_doc");
    if (storedSelections) {
      try {
        setSelectedKeywordsByDoc(JSON.parse(storedSelections));
      } catch (e) {
        console.error("Failed to load keyword selections", e);
      }
    }
  }, [fetchKeywords]);

  const confirmKeywords = useCallback((docId: string) => {
    // Store the current activeIds for this specific document
    setSelectedKeywordsByDoc(prev => {
      const next = { ...prev, [docId]: activeIds };
      localStorage.setItem("keyword_selections_by_doc", JSON.stringify(next));
      return next;
    });

    setConfirmedDocIds(prev => {
      if (prev.includes(docId)) return prev;
      const next = [...prev, docId];
      localStorage.setItem("confirmed_docs", JSON.stringify(next));
      return next;
    });
  }, [activeIds]);

  const getSelectedKeywordsForDoc = useCallback((docId: string) => {
    const docKeywordIds = selectedKeywordsByDoc[docId] || [];
    const keywordMap = new Map(keywords.map(k => [k.id, k]));
    return docKeywordIds
      .map(id => keywordMap.get(id))
      .filter((k): k is Keyword => !!k);
  }, [keywords, selectedKeywordsByDoc]);

  const activeKeywords = useMemo(() => {
    const keywordMap = new Map(keywords.map(k => [k.id, k]));
    return activeIds
      .map(id => keywordMap.get(id))
      .filter((k): k is Keyword => !!k);
  }, [keywords, activeIds]);

  const activeCount = activeIds.length;

  const toggleKeyword = useCallback((id: string, nextState: "checked" | "unchecked") => {
    setActiveIds(prev => {
      const isActive = prev.includes(id);
      if (nextState === "checked" && !isActive) return [...prev, id];
      if (nextState === "unchecked" && isActive) return prev.filter(activeId => activeId !== id);
      return prev;
    });

    setKeywords(prev =>
      prev.map(k => k.id === id ? { ...k, isActive: nextState === "checked" } : k)
    );
  }, []);

  const toggleCategory = useCallback((category: string, nextState: "checked" | "unchecked") => {
    setKeywords(prev => {
      const updated = prev.map(k =>
        k.category === category ? { ...k, isActive: nextState === "checked" } : k
      );
      const newActiveIds = updated.filter(k => k.isActive).map(k => k.id);
      setActiveIds(newActiveIds);
      return updated;
    });
  }, []);

  const resetKeywords = useCallback(() => {
    // For now, just re-fetch from API to reset to base state
    fetchKeywords();
  }, [fetchKeywords]);

  const addCustomKeyword = useCallback(async (text: string, category: string) => {
    // Check for duplicates GLOBALLY locally first
    const existing = keywords.find(k => k.keyword.toLowerCase() === text.toLowerCase());
    if (existing) {
      addToast(`Keyword already exists in category: ${existing.category}`, "error");
      return;
    }

    try {
      const response = await fetch('/api/keywords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword: text, category }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to add keyword');
      }

      addToast("Keyword added successfully", "success");
      await fetchKeywords(); // Re-fetch all to sync
    } catch (error: any) {
      console.error('Error adding keyword:', error);
      addToast(error.message || "Failed to add keyword", "error");
    }
  }, [keywords, fetchKeywords, addToast]);

  const removeCustomKeyword = useCallback((id: string) => {
    // Removing from DB is not requested yet, so just local for now if needed, 
    // but the task says "Keywords are global". 
    // Usually custom ones should be deletable but let's stick to adding for now.
    setKeywords(prev => prev.filter(k => k.id !== id));
    setActiveIds(prev => prev.filter(activeId => activeId !== id));
  }, []);

  const getCategoryState = useCallback((category: string): "checked" | "unchecked" | "indeterminate" => {
    const catKeywords = keywords.filter(k => k.category === category);
    if (catKeywords.length === 0) return "unchecked";
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
      isLoading,
      allCategories,
      toggleKeyword,
      toggleCategory,
      resetKeywords,
      addCustomKeyword,
      removeCustomKeyword,
      getCategoryState,
      confirmedDocIds,
      confirmKeywords,
      fetchKeywords,
      getSelectedKeywordsForDoc
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
