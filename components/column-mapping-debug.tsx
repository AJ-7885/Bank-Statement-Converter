"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface ColumnMappingDebugProps {
  rawData: string[][];
  processedData: any[];
}

export function ColumnMappingDebug({
  rawData,
  processedData,
}: ColumnMappingDebugProps) {
  if (rawData.length === 0) return null;

  // Show first few rows with column mapping
  const sampleRows = rawData.slice(8, 13); // Skip headers, show data rows

  return (
    <Card>
      <CardHeader>
        <CardTitle>Column Mapping Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Column Legend */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
            <Badge variant="outline">A(0): Date</Badge>
            <Badge variant="outline">C-O(2-14): Description</Badge>
            <Badge variant="outline">P(15): D-Unit</Badge>
            <Badge variant="outline">Q(16): C-Unit</Badge>
          </div>

          {/* Sample Data Analysis */}
          <div className="max-h-64 overflow-auto border rounded">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="sticky top-0 bg-white w-12">
                    #
                  </TableHead>
                  <TableHead className="sticky top-0 bg-white">
                    A(0) Date
                  </TableHead>
                  <TableHead className="sticky top-0 bg-white">
                    C-O Description
                  </TableHead>
                  <TableHead className="sticky top-0 bg-white">
                    P(15) D-Unit
                  </TableHead>
                  <TableHead className="sticky top-0 bg-white">
                    Q(16) C-Unit
                  </TableHead>
                  <TableHead className="sticky top-0 bg-white">
                    Last Cols
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sampleRows.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-mono text-xs">
                      {index + 9}
                    </TableCell>
                    <TableCell className="text-xs max-w-24">
                      <div className="truncate" title={row[0] || ""}>
                        {row[0] || ""}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs max-w-32">
                      <div
                        className="truncate"
                        title={row.slice(2, 15).filter(Boolean).join(" ")}
                      >
                        {row
                          .slice(2, 15)
                          .filter(Boolean)
                          .join(" ")
                          .substring(0, 30)}
                        ...
                      </div>
                    </TableCell>
                    <TableCell className="text-xs">
                      <div className="truncate" title={row[15] || ""}>
                        {row[15] || "(empty)"}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs">
                      <div className="truncate" title={row[16] || ""}>
                        {row[16] || "(empty)"}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs">
                      <div
                        className="truncate"
                        title={row.slice(-3).join(", ")}
                      >
                        {row.slice(-3).join(", ")}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Processing Results Summary */}
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="bg-blue-50 p-3 rounded">
              <div className="font-medium">Total Transactions</div>
              <div className="text-xl font-bold">{processedData.length}</div>
            </div>
            <div className="bg-red-50 p-3 rounded">
              <div className="font-medium">With D-Unit</div>
              <div className="text-xl font-bold">
                {
                  processedData.filter(
                    (t) => t.debitUnit !== null && t.debitUnit > 0
                  ).length
                }
              </div>
            </div>
            <div className="bg-green-50 p-3 rounded">
              <div className="font-medium">With C-Unit</div>
              <div className="text-xl font-bold">
                {
                  processedData.filter(
                    (t) => t.creditUnit !== null && t.creditUnit > 0
                  ).length
                }
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
