"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowRight,
  CheckCircle,
  Upload,
  Download,
  FileText,
  Zap,
  Shield,
  BarChart3,
  Clock,
  Users,
  Star,
  Info,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  const supportedBanks = [
    {
      name: "Postbank",
      description: "German bank statements with custom date formats",
      features: [
        "Date: D.M.YYYY format",
        "Description merging",
        "Debit/Credit separation",
      ],
      complexity: "Advanced",
    },
    {
      name: "American Express",
      description: "Credit card statements with European formatting",
      features: [
        "Date: DD/MM/YYYY format",
        "Amount categorization",
        "Multi-column descriptions",
      ],
      complexity: "Complex",
    },
    {
      name: "Revolut",
      description: "Digital bank statements with timestamp handling",
      features: [
        "Timestamp removal",
        "Simple format",
        "Positive/Negative logic",
      ],
      complexity: "Simple",
    },
    {
      name: "ING Bank",
      description: "International bank statements",
      features: [
        "Standard format",
        "Multi-column support",
        "Date normalization",
      ],
      complexity: "Medium",
    },
    {
      name: "N26",
      description: "Digital bank statements",
      features: ["Modern format", "Clean data", "Minimal processing"],
      complexity: "Simple",
    },
  ];

  const processingSteps = [
    {
      step: 1,
      title: "Upload Your File",
      description: "Select your bank and upload the CSV statement file",
      icon: Upload,
    },
    {
      step: 2,
      title: "Automatic Processing",
      description:
        "Our system detects format and processes your data intelligently",
      icon: Zap,
    },
    {
      step: 3,
      title: "Review Results",
      description: "Preview converted data and verify accuracy",
      icon: BarChart3,
    },
    {
      step: 4,
      title: "Download CSV",
      description: "Get your standardized CSV file ready for Google Sheets",
      icon: Download,
    },
  ];

  const features = [
    {
      icon: Shield,
      title: "Secure Processing",
      description:
        "All processing happens in your browser. Your data never leaves your device.",
    },
    {
      icon: Zap,
      title: "Smart Detection",
      description:
        "Automatically detects CSV format, separators, and bank-specific structures.",
    },
    {
      icon: FileText,
      title: "Standardized Output",
      description:
        "Converts all formats to a unified CSV structure compatible with Google Sheets.",
    },
    {
      icon: BarChart3,
      title: "Data Analysis",
      description:
        "Built-in analysis tools to verify conversion accuracy and identify issues.",
    },
    {
      icon: Clock,
      title: "Real-time Processing",
      description:
        "Watch your data being processed with live progress monitoring.",
    },
    {
      icon: Users,
      title: "Multi-Bank Support",
      description:
        "Works with 5+ major banks, each with custom processing logic.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="container mx-auto px-6 pt-16 pb-24">
        <div className="text-center max-w-4xl mx-auto">
          <Badge variant="outline" className="mb-4 px-4 py-2">
            <Star className="h-4 w-4 mr-2" />
            Trusted by Financial Professionals
          </Badge>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Bank Statement Converter
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
            Transform bank statements from multiple banks into a standardized
            CSV format compatible with Google Sheets and Excel in seconds.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/converter">
              <Button size="lg" className="px-8 py-4 text-lg">
                Start Converting Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-4 text-lg bg-transparent"
            >
              View Demo
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">5+</div>
              <div className="text-gray-600">Supported Banks</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">100%</div>
              <div className="text-gray-600">Client-Side Processing</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">Instant</div>
              <div className="text-gray-600">Conversion Speed</div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-white py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Convert your bank statements in 4 simple steps. No registration
              required.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processingSteps.map((step) => (
              <Card
                key={step.step}
                className="text-center hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <step.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">
                    Step {step.step}: {step.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Supported Banks Section */}
      <div className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Supported Banks</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Each bank has custom processing logic to ensure accurate data
              conversion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {supportedBanks.map((bank) => (
              <Card
                key={bank.name}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{bank.name}</CardTitle>
                    <Badge
                      variant={
                        bank.complexity === "Simple"
                          ? "default"
                          : bank.complexity === "Medium"
                          ? "secondary"
                          : bank.complexity === "Advanced"
                          ? "outline"
                          : "destructive"
                      }
                    >
                      {bank.complexity}
                    </Badge>
                  </div>
                  <CardDescription>{bank.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {bank.features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center text-sm text-gray-600"
                      >
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built with advanced processing capabilities and user-friendly
              design.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-4">
                  <feature.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Output Format Section */}
      <div className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Standardized Output Format
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              All bank statements are converted to this unified CSV format.
            </p>
          </div>

          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                CSV Output Structure
              </CardTitle>
              <CardDescription>
                Compatible with Google Sheets, Excel, and other spreadsheet
                applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-2 text-left">
                        Column
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-left">
                        Description
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-left">
                        Example
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-mono">
                        Date
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        Transaction date (YYYY-MM-DD)
                      </td>
                      <td className="border border-gray-300 px-4 py-2 font-mono">
                        2025-01-15
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2 font-mono">
                        Category
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        Transaction category (empty)
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-gray-500">
                        NULL
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-mono">
                        Description
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        Transaction description
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        ROSSMANN BERLIN
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2 font-mono">
                        Reference No.
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        Reference number (empty)
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-gray-500">
                        NULL
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-mono">
                        QTY
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        Quantity (empty)
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-gray-500">
                        NULL
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2 font-mono">
                        D- Unit
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        Debit amount (money in)
                      </td>
                      <td className="border border-gray-300 px-4 py-2 font-mono text-green-600">
                        1250.00
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-mono">
                        C- Unit
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        Credit amount (money out)
                      </td>
                      <td className="border border-gray-300 px-4 py-2 font-mono text-red-600">
                        45.67
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Important Notes Section */}
      <div className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Important Information</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Please read these important notes before using the converter.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                <strong>Privacy & Security:</strong> All processing happens in
                your browser. Your bank data never leaves your device and is not
                stored anywhere.
              </AlertDescription>
            </Alert>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>File Format:</strong> Upload CSV files exported directly
                from your bank. Make sure the file is in the original format
                without modifications.
              </AlertDescription>
            </Alert>

            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Accuracy:</strong> The converter processes data
                intelligently but always review the output before using it for
                financial analysis.
              </AlertDescription>
            </Alert>

            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Backup:</strong> Always keep a backup of your original
                bank statement files before conversion.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Convert Your Bank Statements?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of users who trust our converter for their financial
            data processing needs.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/converter">
              <Button
                size="lg"
                variant="secondary"
                className="px-8 py-4 text-lg"
              >
                Start Converting Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="px-8 py-4 text-lg border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">
                Bank Statement Converter
              </h3>
              <p className="text-gray-400">
                Secure, fast, and reliable bank statement conversion for
                financial professionals.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Supported Banks</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Postbank</li>
                <li>American Express</li>
                <li>Revolut</li>
                <li>ING Bank</li>
                <li>N26</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Client-side processing</li>
                <li>Real-time conversion</li>
                <li>Data analysis tools</li>
                <li>Multiple format support</li>
                <li>Google Sheets compatible</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Bank Statement Converter. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
