"use client";

import type React from "react";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, AlertCircle, CheckCircle } from "lucide-react";

import { bankConfigs } from "../config/bank-configs";
import {
  parseCSV,
  convertToCSV,
  detectSeparator,
} from "../utils/csv-processor";
import { ProcessingMonitor } from "../components/processing-monitor";
import { ConversionSummary } from "../components/conversion-summary";
import { DataTable } from "../components/data-table";
import { CSVPreview } from "../components/csv-preview";
import { ProcessingSummary } from "../components/processing-summary";
import { BankSpecificInfo } from "../components/bank-specific-info";
import { AmexDebugPreview } from "../components/amex-debug-preview";

import type { ProcessingStep, ConversionResult } from "../types";

export default function BankStatementConverter() {
  const [selectedBank, setSelectedBank] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingSteps, setProcessingSteps] = useState<ProcessingStep[]>([]);
  const [conversionResult, setConversionResult] =
    useState<ConversionResult | null>(null);
  const [rawData, setRawData] = useState<string[][]>([]);
  const [detectedSeparator, setDetectedSeparator] = useState<string>("");
  const [inputRowCount, setInputRowCount] = useState<number>(0);
  const [error, setError] = useState<string>("");

  const initializeSteps = (bankKey: string): ProcessingStep[] => {
    const config = bankConfigs[bankKey];
    const bankSpecificSteps = {
      postbank: [
        {
          step: 1,
          description: `Parse CSV with detected separator`,
          status: "pending" as const,
        },
        {
          step: 2,
          description: `Remove first ${config.skipRows} header rows`,
          status: "pending" as const,
        },
        {
          step: 3,
          description: "Convert date formats to YYYY-MM-DD",
          status: "pending" as const,
        },
        {
          step: 4,
          description: "Merge description columns (C to O)",
          status: "pending" as const,
        },
        {
          step: 5,
          description: "Map Column P(15) → D-Unit, Column Q(16) → C-Unit",
          status: "pending" as const,
        },
        {
          step: 6,
          description: "Remove last row(s) if needed",
          status: "pending" as const,
        },
        {
          step: 7,
          description: "Sort transactions by date (oldest to newest)",
          status: "pending" as const,
        },
        {
          step: 8,
          description: "Generate standardized CSV format",
          status: "pending" as const,
        },
      ],
      amex: [
        {
          step: 1,
          description: `Parse CSV with detected separator`,
          status: "pending" as const,
        },
        {
          step: 2,
          description: `Remove first ${config.skipRows} header rows`,
          status: "pending" as const,
        },
        {
          step: 3,
          description: "Convert date from Column A to YYYY-MM-DD",
          status: "pending" as const,
        },
        {
          step: 4,
          description: "Merge description columns G + H",
          status: "pending" as const,
        },
        {
          step: 5,
          description: "Process Column E: Negative → C-Unit, Positive → D-Unit",
          status: "pending" as const,
        },
        {
          step: 6,
          description: "Sort transactions by date (oldest to newest)",
          status: "pending" as const,
        },
        {
          step: 7,
          description: "Generate standardized CSV format",
          status: "pending" as const,
        },
      ],
      revolut: [
        {
          step: 1,
          description: `Parse CSV with detected separator`,
          status: "pending" as const,
        },
        {
          step: 2,
          description: `Remove first ${config.skipRows} header rows`,
          status: "pending" as const,
        },
        {
          step: 3,
          description: "Extract date from Column C (remove time)",
          status: "pending" as const,
        },
        {
          step: 4,
          description: "Use Column E for description",
          status: "pending" as const,
        },
        {
          step: 5,
          description: "Process Column F: Positive → C-Unit, Negative → D-Unit",
          status: "pending" as const,
        },
        {
          step: 6,
          description: "Sort transactions by date (oldest to newest)",
          status: "pending" as const,
        },
        {
          step: 7,
          description: "Generate standardized CSV format",
          status: "pending" as const,
        },
      ],
    };

    return (
      bankSpecificSteps[bankKey as keyof typeof bankSpecificSteps] || [
        {
          step: 1,
          description: `Parse CSV with detected separator`,
          status: "pending" as const,
        },
        {
          step: 2,
          description: `Remove first ${config.skipRows} header rows`,
          status: "pending" as const,
        },
        {
          step: 3,
          description: "Process transactions",
          status: "pending" as const,
        },
        {
          step: 4,
          description: "Generate standardized CSV format",
          status: "pending" as const,
        },
      ]
    );
  };

  const updateStep = (
    stepNumber: number,
    status: ProcessingStep["status"],
    details?: string
  ) => {
    setProcessingSteps((prev) =>
      prev.map((step) =>
        step.step === stepNumber ? { ...step, status, details } : step
      )
    );
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setError("");
      setConversionResult(null);
      setProcessingSteps([]);
      setRawData([]);
      setDetectedSeparator("");
      setInputRowCount(0);
    }
  };

  const processFile = async () => {
    if (!file || !selectedBank) return;

    setIsProcessing(true);
    setError("");
    setConversionResult(null);

    const steps = initializeSteps(selectedBank);
    setProcessingSteps(steps);

    try {
      const config = bankConfigs[selectedBank];
      const fileText = await file.text();

      // Step 1: Parse CSV
      updateStep(1, "processing");

      // Detect separator
      const separator = detectSeparator(fileText);
      setDetectedSeparator(separator);
      console.log(`Detected CSV separator: "${separator}"`);

      const csvData = parseCSV(fileText, separator);
      setRawData(csvData);

      updateStep(
        1,
        "completed",
        `Detected "${separator}" separator, parsed ${csvData.length} rows`
      );

      if (csvData.length <= config.skipRows) {
        throw new Error(
          `File has insufficient data. Expected more than ${config.skipRows} rows, got ${csvData.length}`
        );
      }

      // Step 2: Remove header rows
      updateStep(2, "processing");
      const dataWithoutHeaders = csvData.slice(config.skipRows);
      setInputRowCount(dataWithoutHeaders.length);
      updateStep(
        2,
        "completed",
        `Removed ${config.skipRows} header rows, ${dataWithoutHeaders.length} data rows remaining`
      );

      // Remove last rows if needed (mainly for Postbank)
      const cleanedData =
        config.removeLastRows > 0
          ? dataWithoutHeaders.slice(0, -config.removeLastRows)
          : dataWithoutHeaders;

      // Process data using bank-specific processor
      const nextStep =
        selectedBank === "postbank" ? 3 : selectedBank === "amex" ? 3 : 3;
      updateStep(nextStep, "processing");

      const processedData = config.processor(cleanedData, config);

      // Update remaining steps
      const totalSteps = steps.length;
      for (let i = nextStep; i < totalSteps - 1; i++) {
        updateStep(i, "completed");
      }

      // Final step
      updateStep(totalSteps - 1, "processing");

      if (processedData.length === 0) {
        throw new Error("No valid transactions found in the file");
      }

      // Calculate summary
      const totalDebits = processedData.reduce(
        (sum, t) => sum + (t.debitUnit || 0),
        0
      );
      const totalCredits = processedData.reduce(
        (sum, t) => sum + (t.creditUnit || 0),
        0
      );
      const dates = processedData
        .map((t) => t.date)
        .filter((d) => d)
        .sort();

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
      };

      setConversionResult(result);
      updateStep(
        totalSteps - 1,
        "completed",
        `Generated CSV with ${processedData.length} transactions`
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      setError(errorMessage);

      setProcessingSteps((prev) =>
        prev.map((step) =>
          step.status === "processing"
            ? { ...step, status: "error", details: errorMessage }
            : step
        )
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadCSV = () => {
    if (!conversionResult?.data.length) return;

    const csv = convertToCSV(conversionResult.data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `converted_${selectedBank}_${
      new Date().toISOString().split("T")[0]
    }.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Bank Statement Converter</h1>
        <p className="text-lg text-muted-foreground">
          Convert bank statements from multiple banks into standardized CSV
          format for Google Sheets
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
              <CardDescription>
                Select your bank and upload the CSV statement file for
                conversion
              </CardDescription>
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
                  <Input
                    id="file-upload"
                    type="file"
                    accept=".csv,.txt"
                    onChange={handleFileUpload}
                  />
                </div>
              </div>

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
                    Conversion completed! {inputRowCount} input rows →{" "}
                    {conversionResult.data.length} transactions
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Bank-Specific Info */}
        <div>
          <BankSpecificInfo selectedBank={selectedBank} />
        </div>
      </div>

      {/* Processing Summary */}
      {inputRowCount > 0 && conversionResult && (
        <div className="mb-8">
          <ProcessingSummary
            inputRows={inputRowCount}
            outputRows={conversionResult.data.length}
            skippedRows={[]}
            errors={[]}
          />
        </div>
      )}

      {/* CSV Structure Preview */}
      {rawData.length > 0 && detectedSeparator && (
        <div className="mb-8">
          <CSVPreview rawData={rawData} separator={detectedSeparator} />
        </div>
      )}

      {/* Amex-Specific Debug */}
      {selectedBank === "amex" &&
        rawData.length > 0 &&
        conversionResult?.data && (
          <div className="mb-8">
            <AmexDebugPreview
              rawData={rawData}
              processedData={conversionResult.data}
            />
          </div>
        )}

      {/* Processing Steps */}
      {processingSteps.length > 0 && (
        <div className="mb-8">
          <ProcessingMonitor
            steps={processingSteps}
            isProcessing={isProcessing}
          />
        </div>
      )}

      {/* Conversion Summary */}
      {conversionResult && (
        <div className="mb-8">
          <ConversionSummary result={conversionResult} />
        </div>
      )}

      {/* Data Preview */}
      {conversionResult?.data && (
        <DataTable data={conversionResult.data} onDownload={downloadCSV} />
      )}
    </div>
  );
}
