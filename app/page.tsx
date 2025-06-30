"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, FileText, AlertCircle, Info, CheckCircle } from "lucide-react"

import { bankConfigs } from "../config/bank-configs"
import { parseCSV, convertToCSV, detectSeparator } from "../utils/csv-processor"
import { ProcessingMonitor } from "../components/processing-monitor"
import { ConversionSummary } from "../components/conversion-summary"
import { DataTable } from "../components/data-table"
import { CSVPreview } from "../components/csv-preview"

import type { ProcessingStep, ConversionResult } from "../types"

export default function BankStatementConverter() {
  const [selectedBank, setSelectedBank] = useState<string>("")
  const [file, setFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingSteps, setProcessingSteps] = useState<ProcessingStep[]>([])
  const [conversionResult, setConversionResult] = useState<ConversionResult | null>(null)
  const [rawData, setRawData] = useState<string[][]>([])
  const [detectedSeparator, setDetectedSeparator] = useState<string>("")
  const [error, setError] = useState<string>("")

  const initializeSteps = (bankKey: string): ProcessingStep[] => {
    const config = bankConfigs[bankKey]
    return [
      { step: 1, description: `Parse CSV with detected separator`, status: "pending" },
      { step: 2, description: `Remove first ${config.skipRows} header rows`, status: "pending" },
      { step: 3, description: "Convert date formats to YYYY-MM-DD", status: "pending" },
      { step: 4, description: "Merge description columns (C to O)", status: "pending" },
      { step: 5, description: "Extract amounts from last columns", status: "pending" },
      { step: 6, description: "Remove last row(s) if needed", status: "pending" },
      { step: 7, description: "Sort transactions by date (oldest to newest)", status: "pending" },
      { step: 8, description: "Generate standardized CSV format", status: "pending" },
    ]
  }

  const updateStep = (stepNumber: number, status: ProcessingStep["status"], details?: string) => {
    setProcessingSteps((prev) => prev.map((step) => (step.step === stepNumber ? { ...step, status, details } : step)))
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0]
    if (uploadedFile) {
      setFile(uploadedFile)
      setError("")
      setConversionResult(null)
      setProcessingSteps([])
      setRawData([])
      setDetectedSeparator("")
    }
  }

  const processFile = async () => {
    if (!file || !selectedBank) return

    setIsProcessing(true)
    setError("")
    setConversionResult(null)

    const steps = initializeSteps(selectedBank)
    setProcessingSteps(steps)

    try {
      const config = bankConfigs[selectedBank]
      const fileText = await file.text()

      // Step 1: Parse CSV
      updateStep(1, "processing")

      // Detect separator
      const separator = detectSeparator(fileText)
      setDetectedSeparator(separator)
      console.log(`Detected CSV separator: "${separator}"`)

      const csvData = parseCSV(fileText, separator)
      setRawData(csvData)

      updateStep(1, "completed", `Detected "${separator}" separator, parsed ${csvData.length} rows`)

      if (csvData.length <= config.skipRows) {
        throw new Error(`File has insufficient data. Expected more than ${config.skipRows} rows, got ${csvData.length}`)
      }

      // Step 2: Remove header rows
      updateStep(2, "processing")
      const dataWithoutHeaders = csvData.slice(config.skipRows)
      updateStep(
        2,
        "completed",
        `Removed ${config.skipRows} header rows, ${dataWithoutHeaders.length} data rows remaining`,
      )

      // Step 6: Remove last rows if needed
      updateStep(6, "processing")
      const cleanedData =
        config.removeLastRows > 0 ? dataWithoutHeaders.slice(0, -config.removeLastRows) : dataWithoutHeaders
      updateStep(
        6,
        "completed",
        config.removeLastRows > 0 ? `Removed ${config.removeLastRows} footer rows` : "No footer rows to remove",
      )

      // Steps 3-5: Process data using bank-specific processor
      updateStep(3, "processing")
      updateStep(4, "processing")
      updateStep(5, "processing")

      const processedData = config.processor(cleanedData, config)

      updateStep(3, "completed", `Converted ${processedData.length} dates to YYYY-MM-DD format`)
      updateStep(4, "completed", "Merged description columns")
      updateStep(5, "completed", "Extracted debit and credit amounts")

      // Step 7: Sort by date (already done in processor)
      updateStep(7, "processing")
      updateStep(7, "completed", "Sorted transactions chronologically")

      // Step 8: Generate result
      updateStep(8, "processing")

      if (processedData.length === 0) {
        throw new Error("No valid transactions found in the file")
      }

      // Calculate summary
      const totalDebits = processedData.reduce((sum, t) => sum + (t.debitUnit || 0), 0)
      const totalCredits = processedData.reduce((sum, t) => sum + (t.creditUnit || 0), 0)
      const dates = processedData
        .map((t) => t.date)
        .filter((d) => d)
        .sort()

      const result: ConversionResult = {
        success: true,
        data: processedData,
        errors: [],
        warnings: [],
        summary: {
          totalTransactions: processedData.length,
          totalDebits,
          totalCredits,
          dateRange: {
            from: dates[0] || "",
            to: dates[dates.length - 1] || "",
          },
        },
      }

      setConversionResult(result)
      updateStep(8, "completed", `Generated CSV with ${processedData.length} transactions`)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
      setError(errorMessage)

      // Mark current processing step as error
      setProcessingSteps((prev) =>
        prev.map((step) => (step.status === "processing" ? { ...step, status: "error", details: errorMessage } : step)),
      )
    } finally {
      setIsProcessing(false)
    }
  }

  const downloadCSV = () => {
    if (!conversionResult?.data.length) return

    const csv = convertToCSV(conversionResult.data)
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = `converted_${selectedBank}_${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Bank Statement Converter</h1>
        <p className="text-lg text-muted-foreground">
          Convert bank statements from multiple banks into standardized CSV format for Google Sheets
        </p>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3 mb-8">
        {/* Upload Section */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Bank Statement
              </CardTitle>
              <CardDescription>Select your bank and upload the CSV statement file for conversion</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="bank-select">Select Bank</Label>
                  <Select value={selectedBank} onValueChange={setSelectedBank}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose your bank" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(bankConfigs).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          {config.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="file-upload">Upload CSV File</Label>
                  <Input id="file-upload" type="file" accept=".csv,.txt" onChange={handleFileUpload} />
                </div>
              </div>

              {selectedBank && (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <strong>{bankConfigs[selectedBank].name}</strong> format selected. Will detect separator
                    automatically.
                  </AlertDescription>
                </Alert>
              )}

              <Button
                onClick={processFile}
                disabled={!file || !selectedBank || isProcessing}
                className="w-full"
                size="lg"
              >
                {isProcessing ? "Converting..." : "Convert Statement"}
              </Button>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {conversionResult?.success && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Conversion completed successfully! {conversionResult.data.length} transactions processed.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Format Info */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Processing Rules
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">Date:</span>
                  <span className="text-gray-600">Column A → YYYY-MM-DD</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Description:</span>
                  <span className="text-gray-600">Columns C-O merged</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Amounts:</span>
                  <span className="text-gray-600">Last columns with numbers</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Separator:</span>
                  <span className="text-gray-600">Auto-detected</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CSV Structure Preview */}
      {rawData.length > 0 && detectedSeparator && (
        <div className="mb-8">
          <CSVPreview rawData={rawData} separator={detectedSeparator} />
        </div>
      )}

      {/* Processing Steps */}
      {processingSteps.length > 0 && (
        <div className="mb-8">
          <ProcessingMonitor steps={processingSteps} isProcessing={isProcessing} />
        </div>
      )}

      {/* Conversion Summary */}
      {conversionResult && (
        <div className="mb-8">
          <ConversionSummary result={conversionResult} />
        </div>
      )}

      {/* Data Preview */}
      {conversionResult?.data && <DataTable data={conversionResult.data} onDownload={downloadCSV} />}
    </div>
  )
}
