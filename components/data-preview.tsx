"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Download, Eye } from "lucide-react"
import type { StandardizedTransaction } from "../types/bank-statement"

interface DataPreviewProps {
  data: StandardizedTransaction[]
  onDownload: () => void
}

export function DataPreview({ data, onDownload }: DataPreviewProps) {
  if (data.length === 0) return null

  const totalDebits = data.reduce((sum, row) => sum + (row.debitUnit && row.debitUnit > 0 ? row.debitUnit : 0), 0)
  const totalCredits = data.reduce((sum, row) => sum + (row.creditUnit && row.creditUnit > 0 ? row.creditUnit : 0), 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Converted Data Preview ({data.length} transactions)
          </span>
          <Button onClick={onDownload} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download CSV
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 grid grid-cols-3 gap-4 text-sm">
          <div className="bg-blue-50 p-3 rounded">
            <div className="font-semibold text-blue-700">Total Transactions</div>
            <div className="text-2xl font-bold text-blue-900">{data.length}</div>
          </div>
          <div className="bg-red-50 p-3 rounded">
            <div className="font-semibold text-red-700">Total Debits</div>
            <div className="text-2xl font-bold text-red-900">€{totalDebits.toFixed(2)}</div>
          </div>
          <div className="bg-green-50 p-3 rounded">
            <div className="font-semibold text-green-700">Total Credits</div>
            <div className="text-2xl font-bold text-green-900">€{totalCredits.toFixed(2)}</div>
          </div>
        </div>

        <div className="max-h-96 overflow-auto border rounded">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="sticky top-0 bg-white">Date</TableHead>
                <TableHead className="sticky top-0 bg-white">Category</TableHead>
                <TableHead className="sticky top-0 bg-white">Description</TableHead>
                <TableHead className="sticky top-0 bg-white">Reference No.</TableHead>
                <TableHead className="sticky top-0 bg-white">QTY</TableHead>
                <TableHead className="sticky top-0 bg-white">D- Unit</TableHead>
                <TableHead className="sticky top-0 bg-white">C- Unit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.slice(0, 50).map((row, index) => (
                <TableRow key={index}>
                  <TableCell className="font-mono text-sm">{row.date}</TableCell>
                  <TableCell>{row.category || "NULL"}</TableCell>
                  <TableCell className="max-w-xs">
                    <div className="truncate" title={row.description}>
                      {row.description}
                    </div>
                  </TableCell>
                  <TableCell>{row.referenceNo || "NULL"}</TableCell>
                  <TableCell>{row.qty || "NULL"}</TableCell>
                  <TableCell className="text-right font-mono">
                    {row.debitUnit !== null && row.debitUnit > 0 ? `€${row.debitUnit.toFixed(2)}` : ""}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {row.creditUnit !== null && row.creditUnit > 0 ? `€${row.creditUnit.toFixed(2)}` : ""}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {data.length > 50 && (
          <p className="text-sm text-muted-foreground mt-2 text-center">
            Showing first 50 rows. Download CSV to see all {data.length} transactions.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
