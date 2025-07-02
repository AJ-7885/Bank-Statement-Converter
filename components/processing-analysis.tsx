"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, Info } from "lucide-react";

interface ProcessingAnalysisProps {
  inputRows: number;
  outputRows: number;
  expectedRows: number;
  bankName: string;
}

export function ProcessingAnalysis({
  inputRows,
  outputRows,
  expectedRows,
  bankName,
}: ProcessingAnalysisProps) {
  const successRate =
    inputRows > 0 ? ((outputRows / inputRows) * 100).toFixed(1) : "0";
  const isSuccess = outputRows >= expectedRows * 0.95; // 95% success rate threshold
  const hasSignificantLoss = inputRows - outputRows > inputRows * 0.1; // More than 10% loss

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isSuccess ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-red-500" />
          )}
          {bankName} Processing Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Success Rate */}
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {inputRows}
              </div>
              <div className="text-sm text-gray-600">Input Rows</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {outputRows}
              </div>
              <div className="text-sm text-gray-600">Processed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {inputRows - outputRows}
              </div>
              <div className="text-sm text-gray-600">Lost</div>
            </div>
            <div className="text-center">
              <div
                className={`text-2xl font-bold ${
                  isSuccess ? "text-green-600" : "text-red-600"
                }`}
              >
                {successRate}%
              </div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
          </div>

          {/* Status Badges */}
          <div className="flex gap-2 flex-wrap">
            <Badge variant={isSuccess ? "default" : "destructive"}>
              {isSuccess ? "Processing OK" : "Processing Issues"}
            </Badge>
            {hasSignificantLoss && (
              <Badge variant="destructive">Significant Data Loss</Badge>
            )}
            {bankName === "American Express" && !isSuccess && (
              <Badge variant="outline">Date Format Issues</Badge>
            )}
          </div>

          {/* Alerts */}
          {!isSuccess && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Data Loss Detected:</strong> {inputRows - outputRows}{" "}
                rows were not processed. This indicates issues with date
                parsing, validation logic, or data format compatibility.
              </AlertDescription>
            </Alert>
          )}

          {bankName === "American Express" && !isSuccess && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Amex Processing:</strong> Check console logs for
                detailed row-by-row analysis. Common issues include date format
                mismatches (DD/MM/YYYY vs MM/DD/YYYY) and strict validation
                rules.
              </AlertDescription>
            </Alert>
          )}

          {isSuccess && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Processing Successful:</strong> {successRate}% of rows
                processed successfully with minimal data loss.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
