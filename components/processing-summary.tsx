"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle } from "lucide-react";

interface ProcessingSummaryProps {
  inputRows: number;
  outputRows: number;
  skippedRows?: string[];
  errors?: string[];
}

export function ProcessingSummary({
  inputRows,
  outputRows,
  skippedRows = [],
  errors = [],
}: ProcessingSummaryProps) {
  const hasDiscrepancy = inputRows !== outputRows;
  const hasIssues = skippedRows.length > 0 || errors.length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {hasDiscrepancy ? (
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
          ) : (
            <CheckCircle className="h-5 w-5 text-green-500" />
          )}
          Processing Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Row Count Summary */}
          <div className="grid grid-cols-3 gap-4">
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
              <div className="text-sm text-gray-600">Output Transactions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {inputRows - outputRows}
              </div>
              <div className="text-sm text-gray-600">Difference</div>
            </div>
          </div>

          {/* Discrepancy Alert */}
          {hasDiscrepancy && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Row count mismatch:</strong> {inputRows} input rows
                resulted in {outputRows} transactions. {inputRows - outputRows}{" "}
                rows were not processed.
              </AlertDescription>
            </Alert>
          )}

          {/* Issues Summary */}
          {hasIssues && (
            <div className="space-y-3">
              <div className="flex gap-2">
                {skippedRows.length > 0 && (
                  <Badge
                    variant="outline"
                    className="text-yellow-700 border-yellow-300"
                  >
                    {skippedRows.length} Skipped
                  </Badge>
                )}
                {errors.length > 0 && (
                  <Badge
                    variant="outline"
                    className="text-red-700 border-red-300"
                  >
                    {errors.length} Errors
                  </Badge>
                )}
              </div>

              {/* Skipped Rows Details */}
              {skippedRows.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm mb-2">Skipped Rows:</h4>
                  <div className="max-h-32 overflow-auto text-xs space-y-1">
                    {skippedRows.map((skip, index) => (
                      <div
                        key={index}
                        className="text-yellow-700 bg-yellow-50 p-1 rounded"
                      >
                        {skip}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Errors Details */}
              {errors.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm mb-2">Errors:</h4>
                  <div className="max-h-32 overflow-auto text-xs space-y-1">
                    {errors.map((error, index) => (
                      <div
                        key={index}
                        className="text-red-700 bg-red-50 p-1 rounded"
                      >
                        {error}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Success Message */}
          {!hasDiscrepancy && !hasIssues && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                All {inputRows} rows processed successfully!
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
