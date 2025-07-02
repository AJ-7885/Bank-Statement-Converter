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

interface CSVPreviewProps {
  rawData: string[][];
  separator: string;
}

export function CSVPreview({ rawData, separator }: CSVPreviewProps) {
  if (rawData.length === 0) return null;

  const maxColumns = Math.max(...rawData.slice(0, 10).map((row) => row.length));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          CSV Structure Preview
          <Badge variant="outline">Separator: "{separator}"</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="max-h-64 overflow-auto border rounded">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="sticky top-0 bg-white w-12">#</TableHead>
                {Array.from({ length: maxColumns }, (_, i) => (
                  <TableHead
                    key={i}
                    className="sticky top-0 bg-white text-xs min-w-24"
                  >
                    {String.fromCharCode(65 + i)} ({i})
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rawData.slice(0, 10).map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  <TableCell className="font-mono text-xs">
                    {rowIndex + 1}
                  </TableCell>
                  {Array.from({ length: maxColumns }, (_, colIndex) => (
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
        <p className="text-sm text-gray-500 mt-2">
          Showing first 10 rows. Total columns detected: {maxColumns}
        </p>
      </CardContent>
    </Card>
  );
}
