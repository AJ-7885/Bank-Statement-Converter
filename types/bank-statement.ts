export interface StandardizedTransaction {
  date: string
  category: string
  description: string
  referenceNo: string
  qty: string
  debitUnit: number | null
  creditUnit: number | null
}

export interface BankConfig {
  name: string
  dateFormat: string
  skipRows: number
  removeLastRows: number
  dateColumn: number
  descriptionColumns: number[]
  debitColumn: number
  creditColumn: number
  columnsToRemove: number[]
  processor: (data: string[][], config: BankConfig) => StandardizedTransaction[]
}

export interface ProcessingStep {
  step: number
  description: string
  status: "pending" | "processing" | "completed" | "error"
}
