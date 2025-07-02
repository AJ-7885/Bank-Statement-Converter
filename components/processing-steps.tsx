import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Circle, Loader2, XCircle } from "lucide-react";
import type { ProcessingStep } from "../types/bank-statement";

interface ProcessingStepsProps {
  steps: ProcessingStep[];
}

export function ProcessingSteps({ steps }: ProcessingStepsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Processing Steps</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {steps.map((step) => (
            <div key={step.step} className="flex items-center gap-3">
              {step.status === "completed" && (
                <CheckCircle className="h-5 w-5 text-green-500" />
              )}
              {step.status === "processing" && (
                <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
              )}
              {step.status === "error" && (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              {step.status === "pending" && (
                <Circle className="h-5 w-5 text-gray-400" />
              )}
              <span
                className={`text-sm ${step.status === "completed" ? "text-green-700" : step.status === "error" ? "text-red-700" : "text-gray-600"}`}
              >
                {step.description}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
