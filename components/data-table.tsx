"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Download, Eye } from "lucide-react"
import type { StandardizedTransaction } from "../types"

interface DataTableProps {
  data: StandardizedTransaction[]
  onDownload: () => void
}

export function DataTable({ data, onDownload }: DataTableProps) {
  if (data.length === 0) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Converted Data ({data.length} transactions)
          </span>
          <Button onClick={onDownload} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download CSV
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="max-h-96 overflow-auto border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="sticky top-0 bg-white border-b">Date</TableHead>
                <TableHead className="sticky top-0 bg-white border-b">Category</TableHead>
                <TableHead className="sticky top-0 bg-white border-b">Description</TableHead>
                <TableHead className="sticky top-0 bg-white border-b">Reference No.</TableHead>
                <TableHead className="sticky top-0 bg-white border-b">QTY</TableHead>
                <TableHead className="sticky top-0 bg-white border-b text-right">D- Unit</TableHead>
                <TableHead className="sticky top-0 bg-white border-b text-right">C- Unit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.slice(0, 100).map((row, index) => (
                <TableRow key={index} className="hover:bg-gray-50">
                  <TableCell className="font-mono text-sm">{row.date}</TableCell>
                  <TableCell className="text-gray-500">NULL</TableCell>
                  <TableCell className="max-w-xs">
                    <div className="truncate" title={row.description}>
                      {row.description || "-"}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-500">NULL</TableCell>
                  <TableCell className="text-gray-500">NULL</TableCell>
                  <TableCell className="text-right font-mono">
                    {row.debitUnit !== null ? `€${row.debitUnit.toFixed(2)}` : ""}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {row.creditUnit !== null ? `€${row.creditUnit.toFixed(2)}` : ""}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {data.length > 100 && (
          <p className="text-sm text-gray-500 mt-3 text-center">
            Showing first 100 rows. Download CSV to see all {data.length} transactions.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
