"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"

interface DebugPreviewProps {
  rawData: string[][]
  processedData: any[]
}

export function DebugPreview({ rawData, processedData }: DebugPreviewProps) {
  const [showDebug, setShowDebug] = useState(false)

  if (!showDebug) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Debug Information</span>
            <Button variant="outline" onClick={() => setShowDebug(true)} className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Show Debug Data
            </Button>
          </CardTitle>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Debug Information</span>
          <Button variant="outline" onClick={() => setShowDebug(false)} className="flex items-center gap-2">
            <EyeOff className="h-4 w-4" />
            Hide Debug Data
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Raw Data Preview */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Raw Data (First 5 rows)</h3>
            <div className="max-h-64 overflow-auto border rounded">
              <Table>
                <TableHeader>
                  <TableRow>
                    {Array.from({ length: Math.max(...rawData.slice(0, 5).map((row) => row.length)) }, (_, i) => (
                      <TableHead key={i} className="sticky top-0 bg-white text-xs">
                        Col {String.fromCharCode(65 + i)} ({i})
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rawData.slice(0, 5).map((row, index) => (
                    <TableRow key={index}>
                      {Array.from({ length: Math.max(...rawData.slice(0, 5).map((r) => r.length)) }, (_, colIndex) => (
                        <TableCell key={colIndex} className="text-xs max-w-32">
                          <div className="truncate" title={row[colIndex] || ""}>
                            {row[colIndex] || ""}
                          </div>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Column Mapping */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Column Mapping</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="bg-blue-50 p-3 rounded">
                <div className="font-medium">Date</div>
                <div className="text-gray-600">Column A (0)</div>
              </div>
              <div className="bg-green-50 p-3 rounded">
                <div className="font-medium">Description</div>
                <div className="text-gray-600">Columns C-O (2-14)</div>
              </div>
              <div className="bg-red-50 p-3 rounded">
                <div className="font-medium">D-Unit</div>
                <div className="text-gray-600">Column P (15)</div>
              </div>
              <div className="bg-purple-50 p-3 rounded">
                <div className="font-medium">C-Unit</div>
                <div className="text-gray-600">Column Q (16)</div>
              </div>
            </div>
          </div>

          {/* Processing Results */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Processing Results (First 3 transactions)</h3>
            <div className="max-h-64 overflow-auto border rounded">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="sticky top-0 bg-white">Date</TableHead>
                    <TableHead className="sticky top-0 bg-white">Description</TableHead>
                    <TableHead className="sticky top-0 bg-white">D-Unit</TableHead>
                    <TableHead className="sticky top-0 bg-white">C-Unit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {processedData.slice(0, 3).map((row, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-mono text-sm">{row.date}</TableCell>
                      <TableCell className="max-w-xs">
                        <div className="truncate" title={row.description}>
                          {row.description || "(empty)"}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono">{row.debitUnit || ""}</TableCell>
                      <TableCell className="font-mono">{row.creditUnit || ""}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
