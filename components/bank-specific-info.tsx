"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BankSpecificInfoProps {
  selectedBank: string;
}

export function BankSpecificInfo({ selectedBank }: BankSpecificInfoProps) {
  if (!selectedBank) return null;

  const bankInfo = {
    postbank: {
      name: "Postbank",
      rules: [
        "Date: Column A → YYYY-MM-DD",
        "Description: Columns C-O merged",
        "D-Unit: Column P (15)",
        "C-Unit: Column Q (16)",
        "Skip: 8 header rows, 1 footer row",
      ],
    },
    amex: {
      name: "American Express",
      rules: [
        "Date: Column A → YYYY-MM-DD",
        "Description: Columns G + H merged",
        "Amount: Column E",
        "Negative → C-Unit (outgoing)",
        "Positive → D-Unit (incoming)",
      ],
    },
    revolut: {
      name: "Revolut",
      rules: [
        "Date: Column C (time removed)",
        "Description: Column E",
        "Amount: Column F",
        "Positive → C-Unit (incoming)",
        "Negative → D-Unit (outgoing)",
      ],
    },
    ing: {
      name: "ING Bank",
      rules: [
        "Date: Column A",
        "Description: Columns B + C",
        "D-Unit: Column D",
        "C-Unit: Column E",
      ],
    },
    n26: {
      name: "N26",
      rules: [
        "Date: Column A",
        "Description: Columns B + E",
        "Amount: Column F (shared)",
      ],
    },
  };

  const info = bankInfo[selectedBank as keyof typeof bankInfo];
  if (!info) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Badge variant="outline">{info.name}</Badge>
          Processing Rules
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {info.rules.map((rule, index) => (
            <div key={index} className="text-sm flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
              <span>{rule}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
