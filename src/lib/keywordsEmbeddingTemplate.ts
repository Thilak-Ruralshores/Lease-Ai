// lib/keywordsEmbeddingTemplate.ts

 const arr = [
  // === Basic Lease Info ===
  { keyword: "Premises Address", query: "Clause defining the full leased premises address, including street, city, state, and ZIP code" }, //done
  { keyword: "Premises Floor/Unit", query: "Clause specifying the floor or unit of the leased premises, including suite or unit numbers if mentioned" },//done
  { keyword: "Premises Area (Sq Ft)", query: "Clause specifying the rentable, usable, or leased area of the premises in square feet, including RSF, USF, or gross/net area" },//done
  { keyword: "Premises Plan / Exhibit Reference", query: "Clause referencing the plan, exhibit, schedule, or appendix associated with the leased premises" },//done
  { keyword: "Property Owner / Landlord Legal Name", query: "Clause specifying the landlord's legal entity name, including common variations in naming or entity type" },//done
  { keyword: "Tenant Legal Name", query: "Clause specifying the tenant's legal entity name, including corporate or registered names" },//done
  { keyword: "Tenant Trading Name", query: "Clause identifying the tenant’s trade name, brand name, or “doing business as” designation" },//done
  { keyword: "Guarantor Name (if any)", query: "Clause specifying the name of any guarantor and their obligations under the lease" },//done

  // === Key Dates ===
  { keyword: "Lease Effective Date", query: "Clause specifying the effective date of the lease" },
  { keyword: "Lease Commencement Date", query: "Clause specifying the commencement date of the lease term" },
  { keyword: "Rent Commencement Date", query: "Clause specifying the date rent obligations start under the lease" },
  { keyword: "Lease Expiry Date", query: "Clause specifying the expiration date of the lease term" },
  { keyword: "Lease Term (Years)", query: "Clause stating the duration or length of the lease term" },
  { keyword: "Lease Term (Months)", query: "Clause stating the duration or length of the lease term" },
  { keyword: "Initial Possession Date", query: "Clause specifying the initial possession date for the tenant" }, // done till here

  // === Rent Free / Proration ===
  { keyword: "Rent Free Period Start Date", query: "Clause specifying the start date of any rent-free or abatement period" },
  { keyword: "Rent Free Period End Date", query: "Clause specifying the end date of any rent-free or abatement period" },
  { keyword: "Prorated Rent Start", query: "Clause describing how rent is prorated, including methods like monthly or 30-day calculations." },

  // === Termination & Renewal ===
  { keyword: "Early Termination Notice Date", query: "Clause specifying the notice requirements for early termination of the lease" },
  { keyword: "Number of Renewal Options", query: "Clause specifying the number of renewal or extension options available under the lease." },

  // === Rights / Options ===
  { keyword: "Right of First Refusal (Y/N)", query: "Clause indicating the existence of a right of first refusal under the lease" },
  { keyword: "Right of First Refusal Description", query: "Clause describing the terms and conditions of any right of first refusal." },
  { keyword: "Right of First Offer (Y/N)", query: "Clause indicating the existence of a right of first offer under the lease" },
  { keyword: "Right of First Offer Description", query: "Clause describing the terms and conditions of any right of first offer" },
  { keyword: "Expansion Space Area", query: "Clause specifying expansion rights and any additional rentable area associated with such rights" },
  { keyword: "Relocation Rights (Y/N)", query: "Clause indicating the existence of tenant relocation rights under the lease" },
  { keyword: "Relocation Rights Description", query: "Clause describing the terms and conditions governing tenant relocation rights" },
  { keyword: "Relocation Compensation Terms", query: "Clause specifying compensation terms related to tenant relocation" },

  // === CAM / Operating Expenses / Taxes ===
  { keyword: "CAM Charges (Annual Estimate)", query: "Clause specifying the annual estimated Common Area Maintenance (CAM) charges" },
  { keyword: "CAM Reconciliation Frequency", query: "Clause describing how often CAM charges are reconciled" },
  { keyword: "CAM Reconciliation Due Date", query: "Clause specifying the due date for CAM reconciliation statements or payments" },
  { keyword: "CAM Recoverable Items – List", query: "Clause listing the items included as recoverable expenses under CAM" },
  { keyword: "CAM Non-Recoverable Items – List", query: "Clause listing the items excluded from CAM recoverable expenses" },
  { keyword: "CAM Base Year", query: "Clause specifying the CAM base year for expense calculations" },
  { keyword: "Gross-Up Clause (%)", query: "Clause specifying the gross-up provisions applied to CAM calculations" },
  { keyword: "CAM Cap (%)", query: "Clause specifying any cap on increases to CAM charges" },
  { keyword: "Management Fee Included in CAM", query: "Clause describing whether management fees are included in CAM calculations." },
  { keyword: "Management Fee (%)", query: "Clause specifying any percentage-based management fee included in CAM charges" },//check it once no such keyword
  { keyword: "Management Fee Basis", query: "Clause specifying the basis used to calculate management fees" },
  { keyword: "Management Fee Included in CAM (Y/N)", query: "Clause confirming whether management fees are included in CAM." },
  { keyword: "Insurance Included in CAM (Y/N)", query: "Clause confirming whether insurance costs are included in CAM." },
  { keyword: "Real Estate Tax Payment Method", query: "Clause specifying how real estate taxes are calculated, billed, or paid" },
  { keyword: "Real Estate Tax Payment Description", query: "Clause describing terms and responsibilities for real estate tax payment." },
  { keyword: "Utilities Included in CAM (Y/N)", query: "Clause confirming whether utilities are included in CAM." },
  { keyword: "Audit Rights for CAM (Y/N)", query: "Clause indicating the existence of audit rights related to CAM charges" },
  { keyword: "Audit Rights & Audit Period", query: "Clause describing the duration and terms of any CAM audit rights." },

  // === Utilities ===
  { keyword: "Utilities Responsibility (Tenant/Landlord)", query: "Clause specifying which party is responsible for utilities, including operational and maintenance obligations." },
  { keyword: "Utilities Responsibility Description", query: "Clause describing responsibilities, terms, or limitations for utility obligations" },
  { keyword: "Utilities Metering (Submeter Required) (Y/N)", query: "Clause specifying whether a utility submeter is present or required." },// check there  is no yes/no
  { keyword: "Utilities Metering (Submeter Restriction)", query: "Clause describing any restrictions or conditions on utility submeters" },

  // === Security Deposits / Guarantees ===
  { keyword: "Security Deposit Required", query: "Clause specifying whether a security deposit is required" },
  { keyword: "Security Deposit Interest Payable (Y/N)", query: "Clause specifying whether the security deposit accrues interest" },
  { keyword: "Security Deposit Refund (Timeline)", query: "Clause describing the timeline for refunding the security deposit" },
  { keyword: "Security Deposit Refund Description", query: "Clause describing conditions for refunding the security deposit" },
  { keyword: "Letter of Credit Details", query: "Clause specifying terms and conditions of any Letter of Credit required as a security deposit or guarantee" },
  { keyword: "Guarantee Name (if guarantor)", query: "Clause specifying the name of the guarantor under the lease" },
  { keyword: "Guarantee Type", query: "Clause specifying the type of guarantee provided" },

  // === Late / EFT / Payment ===
  { keyword: "Late Payment Interest Rate (%)", query: "Clause specifying the late payment interest rate or fee percentage" },
  { keyword: "Late Payment Grace Period (Definition)", query: "Clause specifying the definition and duration of the grace period allowed for late payments" },
  { keyword: "Electronic Funds Transfer Details Required per Lease ?", query: "Clause specifying whether electronic funds transfer (EFT) is required under the lease" },
  { keyword: "Electronic Funds Transfer Details Non-Compliance Description", query: "Clause describing the conditions or circumstances of EFT non-compliance penalties" },

  // === Maintenance / Facility Responsibility ===
  { keyword: "Foundation / Building / Exterior Responsibility", query: "Clause specifying responsibility for foundation, building structure, or exterior maintenance" },
  { keyword: "Electrical & Lighting Responsibility", query: "Clause specifying responsibility for electrical systems and lighting" },
  { keyword: "Fire / Life Safety Responsibility", query: "Clause specifying responsibility for fire protection and life safety systems" },
  { keyword: "Plumbing Responsibility", query: "Clause specifying responsibility for plumbing systems" },
  { keyword: "Driveways / Walkways / Sidewalks Responsibility", query: "Clause specifying responsibility for driveways, walkways, or sidewalks" },
  { keyword: "Landscaping, Sweeping and Snow / Ice Responsibility", query: "Clause specifying responsibility for landscaping, sweeping, snow, and ice removal" },//check its wrong description
  { keyword: "Equipment Responsibility", query: "Clause specifying responsibility for equipment maintenance" },
  { keyword: "Dock, Dock Equipment, and Dock Doors Responsibility", query: "Clause specifying responsibility for docks, dock equipment, and dock doors." },//check remarks
  { keyword: "Security Services Responsibility", query: "Clause specifying responsibility for security services" },
  { keyword: "Other Interior Responsibility", query: "Clause specifying responsibility for other interior areas" },
  { keyword: "Janitorial Services Responsibility", query: "Clause specifying responsibility for janitorial services" },
  { keyword: "Responsibilities - Roof", query: "Clause specifying responsibility for roof maintenance" },
  { keyword: "HVAC Responsibility", query: "Clause specifying responsibility for heating, ventilation, and air conditioning (HVAC) systems" },
  { keyword: "After-hours HVAC Charges", query: "Clause specifying terms for after-hours HVAC usage and charges" },
  { keyword: "Pest Control Responsibility", query: "Clause specifying responsibility for pest control services" },

  // === Tenant Improvements / Alterations ===
  { keyword: "Tenant Improvement Allowance Amount", query: "Clause specifying the tenant improvement (TI) allowance provided by the landlord" },
  { keyword: "Tenant Improvement Allowance Amount Description", query: "Clause specifying terms, conditions or payment terms of the tenant improvement allowance" },
  { keyword: "TI Allowance Payment Method", query: "Clause specifying whether TI payments are single or multiple installments" },
  { keyword: "TI Allowance Payment Method Description", query: "Clause specifying details of the tenant improvement payment method" },
  { keyword: "TI Amortization  (if applicable)", query: "Clause specifying amortization terms for tenant improvement allowance" },
  { keyword: "Removal of Tenant Fixtures on Expiry", query: "Clause specifying responsibility for removal of tenant-installed fixtures at lease expiry" },
  { keyword: "Landlord Consent for Alterations (Y/N)", query: "Clause specifying whether landlord consent is required for tenant alterations" },
  { keyword: "Landlord Consent Required for Alterations Description", query: "Clause specifying conditions or limitations regarding landlord consent for alterations" },

  // === Insurance / Casualty ===
  { keyword: "Insurance – Tenant Minimum Coverage (Type & Limit)", query: "Clause specifying minimum insurance coverage and type required for the tenant" },
  { keyword: "Additional Insured Requirements", query: "Clause specifying additional insured obligations under the lease" },
  { keyword: "Waiver of Subrogation (Y/N)", query: "Clause specifying whether waiver of subrogation applies" },
  { keyword: "Casualty – Partial Damage Rent Abatement", query: "Clause specifying rent abatement in case of partial damage" },
  { keyword: "Casualty – Total Destruction Termination Right (Y/N)", query: "Clause specifying the right to terminate the lease if total destruction occurs" },

  // === Assignment / Subletting ===
  { keyword: "Assignment Permission", query: "Clause specifying assignment rights under the lease" },
  { keyword: "Assignment Consent Process", query: "Clause specifying the approval process for assignment" },
  { keyword: "Consent Not Unreasonably Withheld", query: "Clause stating that consent cannot be unreasonably withheld" },
  { keyword: "Assignment Fee Amount", query: "Clause specifying the fee for assignment" },
  { keyword: "Assignment Fee Description", query: "Clause specifying details of the assignment fee" },
  { keyword: "Permitted Transferees / Assignment Conditions", query: "Clause specifying permitted transferees and conditions for assignment" },
  { keyword: "Subletting Permission", query: "Clause specifying subletting rights under the lease" },
  { keyword: "Subletting Consent Process", query: "Clause specifying the process for subletting approval" },
  { keyword: "Sublease Rent Sharing Terms", query: "Clause specifying how sublease rent is shared" },
  { keyword: "Subletting Fee Amount", query: "Clause specifying subletting fee" },
  { keyword: "Subletting Fee Description", query: "Clause specifying details of the subletting fee" },

  // === Use / Signage / Hazardous Materials ===
  { keyword: "Permitted Use", query: "Clause specifying permitted activities or use of the leased premises" },
  { keyword: "Prohibited Uses", query: "Clause specifying prohibited activities on the leased premises" },
  { keyword: "Hazardous Materials Prohibition", query: "Clause specifying restriction on hazardous materials" },
  { keyword: "Hazardous Materials Prohibition Description", query: "Clause specifying details regarding hazardous materials handling or storage" },
  { keyword: "Signage Rights & Restrictions", query: "Clause specifying signage rights and limitations" },
  { keyword: "Signage Approval Required", query: "Clause specifying signage approval requirements" },
  { keyword: "Signage Responsibility", query: "Clause specifying responsibility for signage installation and maintenance" },

  // === Defaults / Notices / Holdover ===
  { keyword: "Events of Default – Tenant", query: "Clause specifying tenant default events" },
  { keyword: "Cure Period for Tenant Default (days)", query: "Clause specifying the period allowed to cure tenant defaults" },
  { keyword: "Notice Address – Tenant", query: "Clause specifying tenant notice address" },
  { keyword: "Notice Method (Email/Registered Mail)", query: "Clause specifying permitted notice delivery methods" },
  { keyword: "Surrender Conditions", query: "Clause specifying tenant surrender conditions at lease expiry" },
  { keyword: "Holdover Rent Rate (if tenant holds over)", query: "Clause specifying holdover rent rate" },
  { keyword: "Holdover Period Treatment", query: "Clause specifying treatment of holdover period" },

  // === Sustainability / ESG / Energy ===
  { keyword: "Sustainability / ESG Obligations (Y/N)", query: "Clause specifying ESG or sustainability obligations of the tenant" },
  { keyword: "Energy Performance Required (Y/N)", query: "Clause specifying required energy performance standards" },
  { keyword: "Energy Efficiency Requirements (Y/N)", query: "Clause specifying required energy efficiency standards" },

  // === Parking / Water ===
  { keyword: "Parking allocated Area", query: "Clause specifying the number of parking spaces allocated to tenant" },
  { keyword: "Parking allocated Area Description", query: "Clause specifying details of parking allocation" },
  { keyword: "Parking allocated Area Restrictions", query: "Clause specifying restrictions on parking usage" },
  { keyword: "Parking area Responsibility", query: "Clause specifying responsibility for parking areas" },
  { keyword: "Water Responsibility", query: "Clause specifying responsibility for water utilities" },

  // === Base Rent / Escalation ===
  { keyword: "Escalation Rate (%)", query: "Clause specifying base rent escalation rate percentage" },
  { keyword: "Escalation Cap (%)", query: "Clause specifying maximum base rent escalation percentage" },
  {keyword: "CPI Base Index Value",query: "Clause specifying base CPI index value used for rent escalation calculations" },
   {keyword: "Market Rent Review Frequency",query: "Clause specifying frequency of market rent reviews"},
  {keyword: "CPI Index Source",query: "Clause specifying CPI index source used for base rent escalation"},
  {keyword: "Market Rent Review Methodology",query: "Clause specifying methodology for market rent adjustments"},
  {keyword: "Utilities Responsibility (Tenant/Landlord) (Y/N)",query: "Clause specifying responsible party for utilities in Operating Expenses or CAM sections"},

  {
    keyword: "Electronic Funds Transfer Details Required per Lease?",
    query: "Clause specifying requirement for electronic funds transfer (EFT) for lease payments"
  },
  {
    keyword: "Electronic Funds Transfer Details Non-Compliance Fee?",
    query: "Clause specifying penalties or fees for non-compliance with EFT requirements"
  },
  {
    keyword: "Electronic Funds Transfer Details Non-Compliance Fee Amount",
    query: "Clause specifying the amount of any EFT non-compliance fee"
  },
  {
    keyword: "Removal of Tenant Fixtures on Expiry Description",
    query: "Clause specifying responsibility and conditions for removal of tenant-installed fixtures at lease expiry"
  },
  {
    keyword: "Landlord Consent Required for Alterations",
    query: "Clause specifying requirement for landlord consent for tenant alterations or improvements"
  },

  {
    keyword: "Tenant Contact Person",
    query: "Clause specifying the tenant’s contact person or authorized representative for notices or communications"
  },
  {
    keyword: "Tenant Contact Email",
    query: "Clause specifying the tenant’s email address for notices or communications"
  },
  {
    keyword: "Tenant Contact Phone",
    query: "Clause specifying the tenant’s telephone number for notices or communications"
  },
  {
    keyword: "Rent Escalation Type (CPI / Fixed / Percentage)",
    query: "Clause specifying the type or method of rent escalation, including CPI-based, fixed, or percentage-based adjustments"
  },
  {
    keyword: "Tax Appeals Responsibility",
    query: "Clause specifying responsibility for tax appeals, including which party may initiate or manage tax appeal proceedings"
  },
  {
    keyword:"Fire / Life Safety Responsibility Description",
    query:"Clause specifying responsibility for fire and life safety systems, compliance, maintenance, and related obligations"
  },
  {
    keyword:"Plumbing Responsibility Description",
    query:"Clause specifying responsibility for maintenance and repair of plumbing systems"
  },
  {
    keyword:"Driveways, Walkways, and Sidewalks Responsibility Description",
    query:"Clause specifying responsibility for maintenance and repair of driveways, walkways and sidewalks"
  },
  {
    keyword:"Landscaping, Sweeping, and Snow / Ice Responsibility Description",
    query:"Clause specifying responsibility for landscaping, sweeping, snow removal or ice control services"
  },
  {
    keyword:"Equipment Responsibility Description",
    query:"Clause specifying responsibility for maintenance or repair of equipment serving the premises"
  },
  {
    keyword:"Dock, Dock Equipment, and Dock Doors Responsibility Description",
    query:"Clause specifying responsibility for loading docks, dock equipment, and dock doors"
  },
  {
    keyword:"Security Services Responsibility Description",
    query:"Clause describing responsibility for providing or maintaining security services for the premises or property"
  },
  {
    keyword:"Other Interior Responsibility Description",
    query:"Clause describing responsibility for interior maintenance or repairs not otherwise addressed in specific responsibility provisions"
  },
  {
    keyword:"Janitorial Services Responsibility Description",
    query:"Clause describing responsibility for janitorial or cleaning services within the premises"
  },
  {
    keyword:"Alterations Deposit",
    query:"Clause specifying any deposit required in connection with tenant alterations or improvements"
  },
  {
    keyword:"Alterations Deposit Description",
    query:"Clause describing the purpose, amount, use, or return conditions of an alterations-related deposit"
  },
  {
    keyword:"Condemnation – Termination Rights",
    query:"Clause describing termination rights of the landlord or tenant in the event of condemnation or eminent domain"
  },
  {
    keyword:"Force Majeure Clause Summary",
    query:"Clause describing force majeure events and their impact on performance of lease obligations"
  },
  {
    keyword:"Operating Expense Statement Frequency (Y/N)",
    query:"Clause indicating whether operating expense or reconciliation statements are required to be provided"
  },
  {
    keyword:"Operating Expense Statement Frequency",
    query:"Clause specifying the frequency or timing of operating expense or reconciliation statements"
  },
  {
    keyword:"Audit Rights (Y/N)",
    query:"Clause indicating whether audit rights are granted in connection with operating or common area expenses"
  },
  {
    keyword:"Audit Rights",
    query:"Clause specifying audit rights, procedures, or limitations related to operating or common area expenses"
  },
  {
    keyword:"Financial Statements Required (Y/N)",
    query:"Clause indicating whether the tenant is required to provide financial statements"
  },
  {
    keyword:"Financial Statements Required Timeline",
    query:"Clause specifying the timing or deadlines for delivery of required financial statements"
  },
  {
    keyword:"Financial Statements Required Description",
    query:"Clause specifying the type, scope, or conditions of required financial statements"
  },
  {
    keyword:"Access for Inspections (Notice Required)",
    query:"Clause specifying access rights for inspections, including notice requirements"
  },
  {
    keyword:"Access Hours to Premises",
    query:"Clause specifying permitted hours for access to the premises"
  },
  {
    keyword:"Landlord Right to Access",
    query:"Clause specifying the landlord’s rights to enter or access the premises"
  },
  {
    keyword:"Environmental Indemnity Terms",
    query:"Clause specifying indemnification obligations related to environmental matters or hazardous materials"
  },
  {
    keyword:"Building Services Hours (HVAC / Lighting)",
    query:"Clause specifying hours during which building services such as HVAC or lighting are provided"
  },
  {
    keyword:"Parking Area Responsibility Description",
    query:"Clause specifying responsibility for maintenance, operation, or costs related to parking areas"
  },
  {
    keyword:"Water Responsibility Description",
    query:"Clause specifying responsibility for water usage, charges, or maintenance"
  }  
];

  let str=
`Clause defining the full address of the leased premises, including building number, street, city, state, and postal code. 
Clause specifying the floor number, suite, or unit identifier of the leased premises within the building.
Clause specifying the total area of the leased premises in square feet or square meters, including any measurement standards or calculation methods.
Clause referencing the plan, exhibit, schedule, or appendix associated with the leased premises, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying the landlord's legal entity name, including common variations in naming or entity type, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying the tenant's legal entity name, including corporate or registered names, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
 Clause identifying the tenant’s trade name, brand name, or “doing business as” designation, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying the name of any guarantor and their obligations under the lease, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying the effective date of the lease, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying the commencement date of the lease term, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying the date rent obligations start under the lease, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying the expiration date of the lease term, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying the expiration date of the lease term, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause stating the duration or length of the lease term, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying the initial possession date for the tenant, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying the start date of any rent-free or abatement period, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying the end date of any rent-free or abatement period, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause describing how rent is prorated, including methods like monthly or 30-day calculations, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying the notice requirements for early termination of the lease, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying the number of renewal or extension options available under the lease, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause indicating the existence of a right of first refusal under the lease, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause describing the terms and conditions of any right of first refusal, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause indicating the existence of a right of first offer under the lease, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause describing the terms and conditions of any right of first offer, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying the total area of the leased premises in square feet or square meters, including any measurement standards or calculation methods.
Clause indicating the existence of tenant relocation rights under the lease, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause describing the terms and conditions governing tenant relocation rights, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying compensation terms related to tenant relocation, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying the annual estimated Common Area Maintenance (CAM) charges, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause describing how often CAM charges are reconciled, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying the due date for CAM reconciliation statements or payments, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause listing the items included as recoverable expenses under CAM, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause listing the items excluded from CAM recoverable expenses, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying the CAM base year for expense calculations, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying the gross-up provisions applied to CAM calculations, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying any cap on increases to CAM charges, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause describing whether management fees are included in CAM calculations, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying any percentage-based management fee included in CAM charges, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying the basis used to calculate management fees, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause confirming whether management fees are included in CAM, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause confirming whether insurance costs are included in CAM, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying how real estate taxes are calculated, billed, or paid, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause describing terms and responsibilities for real estate tax payment, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause confirming whether utilities are included in CAM, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause indicating the existence of audit rights related to CAM charges, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause describing the duration and terms of any CAM audit rights, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying which party is responsible for utilities, including operational and maintenance obligations, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause describing responsibilities, terms, or limitations for utility obligations, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying whether a utility submeter is present or required, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause describing any restrictions or conditions on utility submeters, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying whether a security deposit is required, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying whether the security deposit accrues interest, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause describing the timeline for refunding the security deposit, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause describing conditions for refunding the security deposit, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying terms and conditions of any Letter of Credit required as a security deposit or guarantee, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying the name of the guarantor under the lease, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying the type of guarantee provided, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying the late payment interest rate or fee percentage, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying the definition and duration of the grace period allowed for late payments, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying whether electronic funds transfer (EFT) is required under the lease, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause describing the conditions or circumstances of EFT non-compliance penalties, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying responsibility for foundation, building structure, or exterior maintenance, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying responsibility for electrical systems and lighting, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying responsibility for fire protection and life safety systems, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying responsibility for plumbing systems, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying responsibility for driveways, walkways, or sidewalks, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying responsibility for landscaping, sweeping, snow, and ice removal, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying responsibility for equipment maintenance, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying responsibility for docks, dock equipment, and dock doors, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying responsibility for security services, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying responsibility for other interior areas, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying responsibility for janitorial services, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying responsibility for roof maintenance, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying responsibility for heating, ventilation, and air conditioning (HVAC) systems, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying terms for after-hours HVAC usage and charges, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying responsibility for pest control services, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying the tenant improvement (TI) allowance provided by the landlord, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying terms, conditions or payment terms of the tenant improvement allowance, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying whether TI payments are single or multiple installments, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying details of the tenant improvement payment method, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying amortization terms for tenant improvement allowance, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying responsibility for removal of tenant-installed fixtures at lease expiry, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying whether landlord consent is required for tenant alterations, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying conditions or limitations regarding landlord consent for alterations, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying minimum insurance coverage and type required for the tenant, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying additional insured obligations under the lease, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying whether waiver of subrogation applies, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying rent abatement in case of partial damage, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying the right to terminate the lease if total destruction occurs, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying assignment rights under the lease, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying the approval process for assignment, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause stating that consent cannot be unreasonably withheld, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying the fee for assignment, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying details of the assignment fee, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying permitted transferees and conditions for assignment, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying subletting rights under the lease, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying the process for subletting approval, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying how sublease rent is shared, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying subletting fee, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying details of the subletting fee, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying permitted activities or use of the leased premises, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying prohibited activities on the leased premises, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying restriction on hazardous materials, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying details regarding hazardous materials handling or storage, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying signage rights and limitations, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying signage approval requirements, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying responsibility for signage installation and maintenance, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying tenant default events, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying the period allowed to cure tenant defaults, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause defining the full address of the leased premises, including building number, street, city, state, and postal code.
Clause specifying permitted notice delivery methods, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying tenant surrender conditions at lease expiry, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying holdover rent rate, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying treatment of holdover period, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying ESG or sustainability obligations of the tenant, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying required energy performance standards, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying required energy efficiency standards, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying the total area of the leased premises in square feet or square meters, including any measurement standards or calculation methods.
Clause specifying the total area of the leased premises in square feet or square meters, including any measurement standards or calculation methods.
Clause specifying the total area of the leased premises in square feet or square meters, including any measurement standards or calculation methods.
Clause specifying the total area of the leased premises in square feet or square meters, including any measurement standards or calculation methods.
Clause specifying responsibility for water utilities, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying base rent escalation rate percentage, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying maximum base rent escalation percentage, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying base CPI index value used for rent escalation calculations, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying frequency of market rent reviews, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying CPI index source used for base rent escalation, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying methodology for market rent adjustments, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying responsible party for utilities in Operating Expenses or CAM sections, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying requirement for electronic funds transfer (EFT) for lease payments, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying penalties or fees for non-compliance with EFT requirements, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying the amount of any EFT non-compliance fee, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying responsibility and conditions for removal of tenant-installed fixtures at lease expiry, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying requirement for landlord consent for tenant alterations or improvements, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Tenant Contact Person, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying the tenant’s email address for notices or communications, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying the tenant’s telephone number for notices or communications, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying the type or method of rent escalation, including CPI-based, fixed, or percentage-based adjustments, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying responsibility for tax appeals, including which party may initiate or manage tax appeal proceedings, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying responsibility for fire and life safety systems, compliance, maintenance, and related obligations, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying responsibility for maintenance and repair of plumbing systems, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying responsibility for maintenance and repair of driveways, walkways and sidewalks, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying responsibility for landscaping, sweeping, snow removal or ice control services, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying responsibility for maintenance or repair of equipment serving the premises, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying responsibility for loading docks, dock equipment, and dock doors, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause describing responsibility for providing or maintaining security services for the premises or property, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause describing responsibility for interior maintenance or repairs not otherwise addressed in specific responsibility provisions, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause describing responsibility for janitorial or cleaning services within the premises, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying any deposit required in connection with tenant alterations or improvements, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause describing the purpose, amount, use, or return conditions of an alterations-related deposit, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause describing termination rights of the landlord or tenant in the event of condemnation or eminent domain, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause describing force majeure events and their impact on performance of lease obligations, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause indicating whether operating expense or reconciliation statements are required to be provided, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying the frequency or timing of operating expense or reconciliation statements, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause indicating whether audit rights are granted in connection with operating or common area expenses, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying audit rights, procedures, or limitations related to operating or common area expenses, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause indicating whether the tenant is required to provide financial statements, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying the timing or deadlines for delivery of required financial statements, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying the type, scope, or conditions of required financial statements, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying access rights for inspections, including notice requirements, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying permitted hours for access to the premises, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying the landlord’s rights to enter or access the premises, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying indemnification obligations related to environmental matters or hazardous materials, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
 Clause specifying hours during which building services such as HVAC or lighting are provided, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.
Clause specifying the total area of the leased premises in square feet or square meters, including any measurement standards or calculation methods.
Clause specifying responsibility for water usage, charges, or maintenance, including related synonyms, defined terms, amounts, percentages, timelines, or conditions where applicable.` 

const arr2 = str
  .replace(/\n+/g, " ")   // remove all newlines
  .trim()
  .split(".")
  .map(s => s.trim())
  .filter(Boolean);

export const leaseKeywordQueries= arr.map((item,i) => ({...item, query: arr2[i]}));

