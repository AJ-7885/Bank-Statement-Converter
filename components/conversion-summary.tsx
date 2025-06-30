import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Calendar, FileText } from "lucide-react"
import type { ConversionResult } from "../types"

interface ConversionSummaryProps {
  result: ConversionResult
}

export function ConversionSummary({ result }: ConversionSummaryProps) {
  if (!result.success || result.data.length === 0) return null

  const { summary } = result

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Conversion Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-blue-700 mb-1">
              <FileText className="h-4 w-4" />
              <span className="text-sm font-medium">Transactions</span>
            </div>
            <div className="text-2xl font-bold text-blue-900">{summary.totalTransactions}</div>
          </div>

          <div className="bg-red-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-red-700 mb-1">
              <TrendingDown className="h-4 w-4" />
              <span className="text-sm font-medium">Total Debits</span>
            </div>
            <div className="text-2xl font-bold text-red-900">€{summary.totalDebits.toFixed(2)}</div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-green-700 mb-1">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-medium">Total Credits</span>
            </div>
            <div className="text-2xl font-bold text-green-900">€{summary.totalCredits.toFixed(2)}</div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-purple-700 mb-1">
              <Calendar className="h-4 w-4" />
              <span className="text-sm font-medium">Date Range</span>
            </div>
            <div className="text-sm font-bold text-purple-900">
              {summary.dateRange.from}
              <br />
              to {summary.dateRange.to}
            </div>
          </div>
        </div>

        {result.warnings.length > 0 && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="text-sm font-medium text-yellow-800 mb-2">Warnings:</div>
            <ul className="text-sm text-yellow-700 space-y-1">
              {result.warnings.map((warning, index) => (
                <li key={index}>• {warning}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
