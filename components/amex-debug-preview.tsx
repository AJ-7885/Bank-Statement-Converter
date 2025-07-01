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

interface AmexDebugPreviewProps {
  rawData: string[][];
  processedData: any[];
}

export function AmexDebugPreview({
  rawData,
  processedData,
}: AmexDebugPreviewProps) {
  if (rawData.length === 0) return null;

  // Show first few rows with Amex-specific column mapping
  const sampleRows = rawData.slice(1, 11); // Skip header, show first 10 data rows

  return (
    <Card>
      <CardHeader>
        <CardTitle>American Express Column Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Column Legend for Amex */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
            <Badge variant="outline">A(0): Datum</Badge>
            <Badge variant="outline">B(1): Beschreibung</Badge>
            <Badge variant="outline">E(4): Betrag</Badge>
            <Badge variant="outline">G(6): Statement Desc</Badge>
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
                    A(0) Datum
                  </TableHead>
                  <TableHead className="sticky top-0 bg-white">
                    B(1) Beschreibung
                  </TableHead>
                  <TableHead className="sticky top-0 bg-white">
                    E(4) Betrag
                  </TableHead>
                  <TableHead className="sticky top-0 bg-white">
                    G(6) Statement
                  </TableHead>
                  <TableHead className="sticky top-0 bg-white">
                    H(7) Address
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sampleRows.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-mono text-xs">
                      {index + 2}
                    </TableCell>
                    <TableCell className="text-xs max-w-24">
                      <div className="truncate" title={row[0] || ""}>
                        {row[0] || "(empty)"}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs max-w-32">
                      <div className="truncate" title={row[1] || ""}>
                        {row[1] || "(empty)"}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs">
                      <div className="truncate" title={row[4] || ""}>
                        {row[4] || "(empty)"}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs max-w-32">
                      <div className="truncate" title={row[6] || ""}>
                        {row[6] || "(empty)"}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs max-w-32">
                      <div className="truncate" title={row[7] || ""}>
                        {row[7] || "(empty)"}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Processing Results Summary */}
          <div className="grid grid-cols-4 gap-4 text-sm">
            <div className="bg-blue-50 p-3 rounded">
              <div className="font-medium">Total Rows</div>
              <div className="text-xl font-bold">{rawData.length}</div>
            </div>
            <div className="bg-green-50 p-3 rounded">
              <div className="font-medium">Processed</div>
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
            <div className="bg-purple-50 p-3 rounded">
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
