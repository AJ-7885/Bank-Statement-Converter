import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Circle, Loader2, XCircle } from "lucide-react"
import type { ProcessingStep } from "../types"

interface ProcessingMonitorProps {
  steps: ProcessingStep[]
  isProcessing: boolean
}

export function ProcessingMonitor({ steps, isProcessing }: ProcessingMonitorProps) {
  if (steps.length === 0) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isProcessing && <Loader2 className="h-5 w-5 animate-spin" />}
          Processing Steps
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {steps.map((step) => (
            <div key={step.step} className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {step.status === "completed" && <CheckCircle className="h-5 w-5 text-green-500" />}
                {step.status === "processing" && <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />}
                {step.status === "error" && <XCircle className="h-5 w-5 text-red-500" />}
                {step.status === "pending" && <Circle className="h-5 w-5 text-gray-400" />}
              </div>
              <div className="flex-1">
                <div
                  className={`text-sm font-medium ${
                    step.status === "completed"
                      ? "text-green-700"
                      : step.status === "error"
                        ? "text-red-700"
                        : step.status === "processing"
                          ? "text-blue-700"
                          : "text-gray-600"
                  }`}
                >
                  {step.description}
                </div>
                {step.details && <div className="text-xs text-gray-500 mt-1">{step.details}</div>}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
