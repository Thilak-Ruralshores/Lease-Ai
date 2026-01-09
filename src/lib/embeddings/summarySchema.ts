import * as z from "zod";

export const ChunkSummarySchema = z.object({
  sectionType: z.string().describe("Type/category of the clause"),
  entities: z.array(z.string()).describe("Parties or entities involved"),
  keyFacts: z.array(z.string()).describe("Important facts and variables"),
  dates: z.array(z.string()).describe("Dates or temporal references"),
  quantitativeTerms: z.array(z.string()).describe("Numbers, areas, money, measurements"),
  obligations: z.array(z.string()).describe("Rights, duties, or conditions"),
  exclusions: z.array(z.string()).describe("Limits, exclusions, or carve-outs"),
  ambiguities: z.array(z.string()).describe("Unclear or vague aspects"),
  dependencies: z.array(z.string()).describe("Referenced sections or external dependencies"),
  scope: z.string().describe("Scope and applicability of the clause"),
  narrativeSummary: z.string().describe(
    "Compact, retrieval-optimized summary in natural language"
  )
});

export type ChunkSummary = z.infer<typeof ChunkSummarySchema>;
