export interface StandardizedTransaction {
  date: string;
  category: string;
  description: string;
  referenceNo: string;
  qty: string;
  debitUnit: number | null;
  creditUnit: number | null;
}

export interface BankConfig {
  name: string;
  dateFormat: string;
  skipRows: number;
  removeLastRows: number;
  dateColumn: number;
  descriptionColumns: number[];
  debitColumn: number;
  creditColumn: number;
  columnsToIgnore: number[];
  processor: (
    data: string[][],
    config: BankConfig,
  ) => StandardizedTransaction[];
}

export interface ProcessingStep {
  step: number;
  description: string;
  status: "pending" | "processing" | "completed" | "error";
  details?: string;
}

export interface ConversionResult {
  success: boolean;
  data: StandardizedTransaction[];
  errors: string[];
  warnings: string[];
  summary: {
    totalTransactions: number;
    totalDebits: number;
    totalCredits: number;
    dateRange: {
      from: string;
      to: string;
    };
  };
}
