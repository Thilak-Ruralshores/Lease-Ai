import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const categoryColors: Record<string, string> = {
  "Premises & Property Details": "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800",
  "Parties & Contacts": "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800",
  "Lease Dates & Term": "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800",
  "Rent & Payment Terms": "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
  "Escalation & Indexation": "bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 border-teal-200 dark:border-teal-800",
  "CAM / Operating Expenses": "bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800",
  "Taxes & Utilities": "bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-800",
  "Security Deposits & Guarantees": "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800",
  "Maintenance & Repairs": "bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800",
  "Improvements & Alterations": "bg-lime-50 dark:bg-lime-900/20 text-lime-700 dark:text-lime-400 border-lime-200 dark:border-lime-800",
  "Insurance & Risk": "bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800",
  "Casualty & Condemnation": "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800",
  "Assignment & Subletting": "bg-pink-50 dark:bg-pink-900/20 text-pink-700 dark:text-pink-400 border-pink-200 dark:border-pink-800",
  "Use, Access & Operations": "bg-fuchsia-50 dark:bg-fuchsia-900/20 text-fuchsia-700 dark:text-fuchsia-400 border-fuchsia-200 dark:border-fuchsia-800",
  "Defaults, Remedies & Termination": "bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400 border-violet-200 dark:border-violet-800",
  "Legal, Compliance & ESG": "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-700",
  "Notices & Contacts": "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-700",
};

export const categorizeKeywords = (keywords: string[]) => {
  const categories: Record<string, string[]> = {
    "Premises & Property Details": [],
    "Parties & Contacts": [],
    "Lease Dates & Term": [],
    "Rent & Payment Terms": [],
    "Escalation & Indexation": [],
    "CAM / Operating Expenses": [],
    "Taxes & Utilities": [],
    "Security Deposits & Guarantees": [],
    "Maintenance & Repairs": [],
    "Improvements & Alterations": [],
    "Insurance & Risk": [],
    "Casualty & Condemnation": [],
    "Assignment & Subletting": [],
    "Use, Access & Operations": [],
    "Defaults, Remedies & Termination": [],
    "Legal, Compliance & ESG": [],
    "Notices & Contacts": [],
  };

  keywords.forEach((keyword) => {
    const lower = keyword.toLowerCase();

    // Priority 1: Premises & Property
    if (
      (lower.includes("premises") || lower.includes("property")) && 
      !lower.includes("property tax") && !lower.includes("property manager") && !lower.includes("owner / landlord")
      || lower.includes("expansion option") || lower.includes("right of first")
    ) {
      categories["Premises & Property Details"].push(keyword);
      return;
    } 

    // Priority 2: Parties
    if (
      lower.includes("landlord") || lower.includes("tenant") || lower.includes("guarantor") || 
      lower.includes("property owner") || lower.includes("property manager") 
    ) {
       // "Notices" check later might overlap, but generally names go here.
       // Check if it's "Tenant Improvement" or "Tenant Right to Quiet" - those are separate.
       if (lower.includes("improvement")) {
           categories["Improvements & Alterations"].push(keyword);
           return;
       }
       if (lower.includes("quiet enjoyment") || lower.includes("licenses") || lower.includes("default")) {
           // handled later in Ops or Defaults
       } else {
           categories["Parties & Contacts"].push(keyword);
           return;
       }
    }
    
    // Fallback checks for keywords skipped above or not caught
    
    // Explicit Category Rules
    if (categories["Parties & Contacts"].includes(keyword)) return;
    if (categories["Improvements & Alterations"].includes(keyword)) return;

    if (
      lower.includes("lease execution") || lower.includes("lease effective") || lower.includes("lease commencement") ||
      lower.includes("rent commencement") || lower.includes("lease expiry") || lower.includes("lease term") ||
      lower.includes("possession") || lower.includes("commencement conditions") || lower.includes("option exercise") ||
      lower.includes("rent free") || lower.includes("early termination notice") ||
      lower.includes("renewal option") || lower.includes("renewal notice")
    ) {
      categories["Lease Dates & Term"].push(keyword);
      return;
    } 
    
    if (
      lower.includes("base rent") || lower.includes("prorated rent") || lower.includes("payment method") ||
      lower.includes("rent account") || lower.includes("renewal rent") || lower.includes("holdover rent") ||
      lower.includes("break fee") || lower.includes("payment allocation") || lower.includes("currency conversion") ||
      lower.includes("late payment") || lower.includes("late fee") || lower.includes("bank charges") ||
      lower.includes("electronic funds") || (lower.includes("vat") && lower.includes("rent")) || lower.includes("withholding tax")
      || lower.includes("invoice")
    ) {
      categories["Rent & Payment Terms"].push(keyword);
      return;
    }
    
    if (
      lower.includes("escalation") || lower.includes("cpi") || lower.includes("market rent")
    ) {
      categories["Escalation & Indexation"].push(keyword);
      return;
    }
    
    if (
      lower.includes("cam") || lower.includes("operating expense") || lower.includes("management fee") ||
      lower.includes("gross-up") || lower.includes("audit rights")
    ) {
      categories["CAM / Operating Expenses"].push(keyword);
      return;
    }
    
    if (
      lower.includes("real estate tax") || lower.includes("property tax") || lower.includes("tax appeals") ||
      lower.includes("utilities") || lower.includes("utility") || lower.includes("electricity") || 
      lower.includes("water") || lower.includes("gas") || lower.includes("vat") // catch remaining VAT
    ) {
      categories["Taxes & Utilities"].push(keyword);
      return;
    }
    
    if (
      lower.includes("security deposit") || lower.includes("bank guarantee") || lower.includes("letter of credit") ||
      lower.includes("escrow") || lower.includes("guarantee") 
    ) {
      categories["Security Deposits & Guarantees"].push(keyword);
      return;
    }
    
    if (
      lower.includes("maintenance") || lower.includes("repair") || lower.includes("foundation") ||
      lower.includes("electrical") || lower.includes("lighting") || lower.includes("fire") ||
      lower.includes("plumbing") || lower.includes("driveway") || lower.includes("walkway") ||
      lower.includes("sidewalk") || lower.includes("landscaping") || lower.includes("snow") ||
      lower.includes("equipments") || lower.includes("dock") || lower.includes("janitorial") ||
      lower.includes("roof") || lower.includes("hvac") || lower.includes("pest control") ||
      lower.includes("sla") || lower.includes("makegood") || lower.includes("surrender")
    ) {
      if (!lower.includes("safety certificates")) { // avoid safety certs in maint if they belong to ops
          categories["Maintenance & Repairs"].push(keyword);
          return;
      } else {
          categories["Use, Access & Operations"].push(keyword);
          return;
      }
    }
    
    if (
      lower.includes("improvement") || lower.includes("alteration") || lower.includes("fixtures") ||
      lower.includes("punchlist") || lower.includes("as-built")
    ) {
      categories["Improvements & Alterations"].push(keyword);
      return;
    }
    
    if (
      lower.includes("insurance") || lower.includes("waiver of subrogation") || lower.includes("loss payee")
    ) {
      categories["Insurance & Risk"].push(keyword);
      return;
    }
    
    if (
      lower.includes("casualty") || lower.includes("condemnation") || lower.includes("temporary relocation") ||
      lower.includes("business interruption")
    ) {
      categories["Casualty & Condemnation"].push(keyword);
      return;
    }
    
    if (
      lower.includes("assignment") || lower.includes("subletting") || lower.includes("sublease") ||
      lower.includes("transferee")
    ) {
      categories["Assignment & Subletting"].push(keyword);
      return;
    }
    
    if (
      lower.includes("event of default") || lower.includes("cure period") || lower.includes("remedies") ||
      lower.includes("rent acceleration") || lower.includes("distress") || lower.includes("mitigation") ||
      lower.includes("holdover period") || lower.includes("break notice") || lower.includes("conditions to exercise break")
    ) {
       // Check for overlap with dates
       if (!categories["Lease Dates & Term"].includes(keyword) && !categories["Rent & Payment Terms"].includes(keyword)) {
           categories["Defaults, Remedies & Termination"].push(keyword);
           return;
       }
    }
    
    if (
       lower.includes("governing law") || lower.includes("dispute") || lower.includes("arbitration") ||
       lower.includes("limitation of liability") || lower.includes("consequential damages") ||
       lower.includes("force majeure") || lower.includes("survival") || lower.includes("severability") ||
       lower.includes("entire agreement") || lower.includes("amendments") || lower.includes("counterparts") ||
       lower.includes("environmental") || lower.includes("hazardous") || lower.includes("asbestos") ||
       lower.includes("sustainability") || lower.includes("esg") || lower.includes("green") ||
       lower.includes("recycling") || lower.includes("energy") || lower.includes("remediation")
    ) {
      categories["Legal, Compliance & ESG"].push(keyword);
      return;
    }
    
    if (
      lower.includes("permitted use") || lower.includes("prohibited use") || lower.includes("radius") ||
      lower.includes("signage") || lower.includes("license") || lower.includes("occupancy") ||
      lower.includes("certificate") || lower.includes("health & safety") || lower.includes("access") ||
      lower.includes("lockout") || lower.includes("loading") || lower.includes("deliveries") ||
      lower.includes("parking") || lower.includes("quiet enjoyment") || lower.includes("relocation rights")
    ) {
      categories["Use, Access & Operations"].push(keyword);
      return;
    }
    
    if (
      lower.includes("notice") || lower.includes("contact")
    ) {
      // Catch all notices and contacts unused
      categories["Notices & Contacts"].push(keyword);
      return;
    }
    
    // Fallback for tricky ones:
    // "Security Services Responsibility" -> Maintenance? Or Ops? Let's put in Maintenance.
    // "Break Clause Present" -> Dates or Termination? Dates usually.
    
    // Safety net
    if (lower.includes("security")) {
        categories["Security Deposits & Guarantees"].push(keyword);
        return;
    }
    else if (lower.includes("repair")) {
        categories["Maintenance & Repairs"].push(keyword);
        return;
    }
    else {
        categories["Legal, Compliance & ESG"].push(keyword);
        return;
    }
  });

  // Filter out duplicates if any logic overlaid (using Set) and empty categories
  const result: Record<string, string[]> = {};
  for (const [key, value] of Object.entries(categories)) {
      if (value.length > 0) {
          result[key] = Array.from(new Set(value));
      }
  }
  
  return result;
};
