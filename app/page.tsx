"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight, FileText, Zap, Shield, TrendingUp } from "lucide-react";

// Chart component using a simple implementation
function SolutionComparisonChart() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Off-the-Shelf</span>
        <div className="flex space-x-1">
          <div className="w-8 h-4 bg-orange-400 rounded"></div>
          <div className="w-12 h-4 bg-blue-400 rounded"></div>
          <div className="w-14 h-4 bg-teal-400 rounded"></div>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Direct Integration</span>
        <div className="flex space-x-1">
          <div className="w-6 h-4 bg-orange-400 rounded"></div>
          <div className="w-8 h-4 bg-blue-400 rounded"></div>
          <div className="w-18 h-4 bg-teal-400 rounded"></div>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Google Apps Script</span>
        <div className="flex space-x-1">
          <div className="w-10 h-4 bg-orange-400 rounded"></div>
          <div className="w-18 h-4 bg-blue-400 rounded"></div>
          <div className="w-16 h-4 bg-teal-400 rounded"></div>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Custom React App</span>
        <div className="flex space-x-1">
          <div className="w-20 h-4 bg-orange-400 rounded"></div>
          <div className="w-20 h-4 bg-blue-400 rounded"></div>
          <div className="w-20 h-4 bg-teal-400 rounded"></div>
        </div>
      </div>
      <div className="flex justify-center space-x-4 text-xs mt-4">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-orange-400 rounded mr-1"></div>
          <span>Effort & Cost</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-400 rounded mr-1"></div>
          <span>Flexibility</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-teal-400 rounded mr-1"></div>
          <span>Automation Level</span>
        </div>
      </div>
    </div>
  );
}

function BankRadarChart({ scores }: { scores: number[] }) {
  const [reliability, ease] = scores;
  return (
    <div className="relative w-48 h-48 mx-auto">
      <div className="absolute inset-0 border-2 border-gray-200 rounded-full"></div>
      <div className="absolute inset-4 border border-gray-200 rounded-full"></div>
      <div className="absolute inset-8 border border-gray-200 rounded-full"></div>

      {/* Data points */}
      <div
        className="absolute w-3 h-3 bg-indigo-600 rounded-full transform -translate-x-1/2 -translate-y-1/2"
        style={{
          top: `${50 - reliability * 4}%`,
          left: "50%",
        }}
      ></div>
      <div
        className="absolute w-3 h-3 bg-indigo-600 rounded-full transform -translate-x-1/2 -translate-y-1/2"
        style={{
          top: "50%",
          left: `${50 + ease * 4}%`,
        }}
      ></div>

      {/* Labels */}
      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-xs font-medium">
        Data Reliability
      </div>
      <div className="absolute bottom-2 right-2 text-xs font-medium">
        Processing Ease
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [selectedBank, setSelectedBank] = useState("Postbank");

  const bankData = {
    Postbank: {
      recommendation:
        "Since Postbank primarily provides PDF statements, the best method is to use a specialized PDF-to-CSV converter like DocuClipper. This avoids manual entry but relies on OCR accuracy.",
      scores: [6, 4],
    },
    "American Express": {
      recommendation:
        "AMEX offers native CSV downloads. This is the preferred method as it provides structured, highly reliable data, eliminating any OCR errors. Direct integration is also an option.",
      scores: [9, 8],
    },
    Revolut: {
      recommendation:
        "Like other digital banks, Revolut supports native CSV exports and has strong direct integration support via services like Plaid. Both are excellent, reliable options.",
      scores: [9, 9],
    },
    ING: {
      recommendation:
        "ING provides excellent export options, including a detailed native CSV format. This is the most reliable and recommended method for acquiring clean data.",
      scores: [10, 8],
    },
    N26: {
      recommendation:
        "N26 allows for easy native CSV exports from its web app. This is the preferred method. Direct integration via Plaid is also a strong secondary option for full automation.",
      scores: [9, 9],
    },
  };

  return (
    <div className="min-h-screen bg-stone-100 text-gray-800">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="font-bold text-xl text-indigo-600">
                FinanceFlow
              </span>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a
                  href="#challenge"
                  className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  The Challenge
                </a>
                <a
                  href="#solutions"
                  className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Solution Pathways
                </a>
                <a
                  href="#bank-guide"
                  className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Bank-Specific Guide
                </a>
                <a
                  href="#action-plan"
                  className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Your Action Plan
                </a>
              </div>
            </div>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero Section */}
        <section id="hero" className="bg-white">
          <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Tired of Manual Data Entry?</span>
              <span className="block text-indigo-600">
                Automate Your Bank Statements.
              </span>
            </h1>
            <p className="mt-6 max-w-lg mx-auto text-xl text-gray-500">
              This interactive guide helps you move from tedious, manual updates
              to a streamlined, automated financial workflow. Discover the best
              tools and strategies to convert statements from your banks into a
              perfect Google Sheet format.
            </p>
          </div>
        </section>

        {/* Challenge Section */}
        <section id="challenge" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center">
              <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">
                The Challenge
              </h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                From Messy Statements to a Perfect Sheet
              </p>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                Your core problem is transforming inconsistent data from
                multiple banks into a single, standardized format. This involves
                specific, non-trivial rules that make manual processing slow and
                error-prone.
              </p>
            </div>

            <div className="mt-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                <Card className="p-6">
                  <h3 className="text-xl font-bold mb-4 text-center">
                    Your Target Google Sheet Format
                  </h3>
                  <p className="text-gray-600 mb-6 text-center">
                    The goal is to populate this precise seven-column structure.
                    The key is automating the transformations required to fit
                    data from any bank into these columns correctly.
                  </p>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Column
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Required Transformation
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-4 py-2 font-mono">Date</td>
                          <td className="px-4 py-2">Reformat to YYYY-MM-DD</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 font-mono">Category</td>
                          <td className="px-4 py-2">Leave as NULL</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 font-mono">Description</td>
                          <td className="px-4 py-2">
                            Merge multiple text fields
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 font-mono">Reference No.</td>
                          <td className="px-4 py-2">Leave as NULL</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 font-mono">QTY</td>
                          <td className="px-4 py-2">Leave as NULL</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 font-mono text-red-600">
                            D- Unit
                          </td>
                          <td className="px-4 py-2 text-red-600">
                            Extract Debit as positive number
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 font-mono text-green-600">
                            C- Unit
                          </td>
                          <td className="px-4 py-2 text-green-600">
                            Extract Credit as positive number
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </Card>

                <div className="flex flex-col items-center justify-center">
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className="p-3 bg-white rounded-lg shadow-md border border-gray-200 text-2xl">
                        🏦
                      </div>
                      <p className="text-sm mt-1">Banks</p>
                    </div>
                    <div className="text-5xl text-gray-300">→</div>
                    <div className="text-center">
                      <div className="p-3 bg-white rounded-lg shadow-md border border-red-200 text-2xl">
                        🧠
                      </div>
                      <p className="text-sm mt-1">Manual Work</p>
                    </div>
                    <div className="text-5xl text-gray-300">→</div>
                    <div className="text-center">
                      <div className="p-3 bg-white rounded-lg shadow-md border border-green-200 text-2xl">
                        📋
                      </div>
                      <p className="text-sm mt-1">Google Sheet</p>
                    </div>
                  </div>
                  <p className="mt-8 text-center text-gray-600 max-w-sm">
                    This diagram shows your current workflow. The goal of this
                    guide is to replace the "Manual Work" step with an
                    efficient, automated process.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Solutions Section */}
        <section id="solutions" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center">
              <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">
                Solution Pathways
              </h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Choosing Your Automation Strategy
              </p>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                There are several ways to solve this problem, from ready-made
                tools to custom scripts. Explore the options below to see how
                they compare in terms of effort, flexibility, and automation
                level.
              </p>
            </div>

            <div className="mt-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                <div className="space-y-6">
                  <Card className="p-6 hover:shadow-lg transition-shadow">
                    <h3 className="text-lg font-bold">
                      1. Off-the-Shelf Converters
                    </h3>
                    <p className="mt-2 text-gray-600">
                      Web or desktop apps that use OCR to extract data from PDF
                      statements. Best for banks that only provide PDFs (like
                      Postbank).
                      <br />
                      <strong>Key Tool:</strong> DocuClipper (offers description
                      merging & debit/credit splitting).
                    </p>
                  </Card>

                  <Card className="p-6 hover:shadow-lg transition-shadow">
                    <h3 className="text-lg font-bold">
                      2. Direct Bank Integration
                    </h3>
                    <p className="mt-2 text-gray-600">
                      Google Sheets Add-ons that use services like Plaid to sync
                      transactions automatically. Highest level of automation
                      but may require post-processing for your specific format.
                    </p>
                  </Card>

                  <Card className="p-6 hover:shadow-lg transition-shadow">
                    <h3 className="text-lg font-bold">3. Custom Solutions</h3>
                    <p className="mt-2 text-gray-600">
                      Build your own solution for perfect control.
                      <br />• <strong>Google Apps Script:</strong> Free,
                      powerful for transforming data already in Sheets. The
                      recommended custom approach.
                      <br />• <strong>React App:</strong> High effort and cost,
                      not recommended for personal use.
                    </p>
                  </Card>
                </div>

                <Card className="p-4">
                  <h3 className="text-xl font-bold mb-4 text-center">
                    Solution Comparison
                  </h3>
                  <SolutionComparisonChart />
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Bank Guide Section */}
        <section id="bank-guide" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center">
              <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">
                Bank-Specific Guide
              </h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                The Best Strategy For Each Bank
              </p>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                The best way to get your data depends on what each bank offers.
                Select a bank to see its recommended acquisition method and how
                its data quality compares.
              </p>
            </div>

            <div className="mt-12">
              <div className="flex justify-center flex-wrap gap-4 mb-8">
                {Object.keys(bankData).map((bank) => (
                  <button
                    key={bank}
                    onClick={() => setSelectedBank(bank)}
                    className={`p-2 bg-white rounded-lg shadow-md transition-all ${
                      selectedBank === bank
                        ? "ring-2 ring-indigo-500 ring-offset-2"
                        : "hover:shadow-lg"
                    }`}
                  >
                    <div className="w-24 h-10 flex items-center justify-center text-xs font-bold bg-gradient-to-r from-gray-100 to-gray-200 rounded">
                      {bank}
                    </div>
                  </button>
                ))}
              </div>

              <Card className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                  <div>
                    <h3 className="text-2xl font-bold">{selectedBank}</h3>
                    <p
                      className="mt-4 text-gray-600"
                      dangerouslySetInnerHTML={{
                        __html:
                          bankData[selectedBank as keyof typeof bankData]
                            .recommendation,
                      }}
                    />
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-center mb-2">
                      Data Quality Analysis
                    </h4>
                    <BankRadarChart
                      scores={
                        bankData[selectedBank as keyof typeof bankData].scores
                      }
                    />
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Action Plan Section */}
        <section id="action-plan" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center">
              <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">
                Your Action Plan
              </h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                A Phased Approach to Automation
              </p>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                Follow this recommended three-phase plan. This strategy provides
                immediate results with off-the-shelf tools and builds towards a
                fully customized, automated workflow over time.
              </p>
            </div>

            <div className="mt-12">
              <div className="flex flex-col md:flex-row items-center justify-center space-y-8 md:space-y-0 md:space-x-8">
                <Card className="p-6 border-2 border-indigo-200 bg-indigo-50 w-full md:w-1/3">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-indigo-500 text-white mx-auto text-xl font-bold">
                    1
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-center">
                    Phase 1: Acquire Data
                  </h3>
                  <p className="mt-2 text-gray-600 text-center">
                    Use the easiest method for each bank. Prioritize native{" "}
                    <strong>CSV downloads</strong> (for AMEX, ING, N26). For
                    PDF-only banks (Postbank), use a specialized converter like{" "}
                    <strong>DocuClipper</strong>.
                  </p>
                </Card>

                <div className="text-2xl font-light text-gray-400 transform rotate-90 md:rotate-0">
                  ➡️
                </div>

                <Card className="p-6 border-2 border-indigo-200 bg-indigo-50 w-full md:w-1/3">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-indigo-500 text-white mx-auto text-xl font-bold">
                    2
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-center">
                    Phase 2: Transform Data
                  </h3>
                  <p className="mt-2 text-gray-600 text-center">
                    Use <strong>Google Apps Script</strong> inside your Google
                    Sheet. Write simple functions to reformat dates, merge
                    descriptions, and split debit/credit columns to perfectly
                    match your target format.
                  </p>
                </Card>

                <div className="text-2xl font-light text-gray-400 transform rotate-90 md:rotate-0">
                  ➡️
                </div>

                <Card className="p-6 border-2 border-gray-200 bg-gray-50 w-full md:w-1/3">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gray-400 text-white mx-auto text-xl font-bold">
                    3
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-center">
                    Phase 3: Long-Term
                  </h3>
                  <p className="mt-2 text-gray-600 text-center">
                    Consider a custom app only as a last resort. The combination
                    of native exports, a PDF converter, and Google Apps Script
                    solves the problem efficiently for most personal use cases.
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Ready to Start Converting?
            </h2>
            <p className="mt-4 text-xl text-indigo-100">
              Skip the manual work and use our automated bank statement
              converter right now. Support for Postbank, American Express,
              Revolut, ING, and N26.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/converting">
                <Button
                  size="lg"
                  className="bg-white text-indigo-600 hover:bg-gray-100 font-semibold px-8 py-4 text-lg"
                >
                  <Zap className="mr-2 h-5 w-5" />
                  Start Converting Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>

              <div className="flex items-center space-x-6 text-indigo-100">
                <div className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  <span className="text-sm">Secure & Private</span>
                </div>
                <div className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  <span className="text-sm">All Banks Supported</span>
                </div>
                <div className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  <span className="text-sm">Instant Results</span>
                </div>
              </div>
            </div>

            <div className="mt-8 text-indigo-200 text-sm">
              ✨ No signup required • Process unlimited files • Export to Google
              Sheets format
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center text-gray-400">
          <p>
            Interactive report generated to simplify financial data automation.
          </p>
        </div>
      </footer>
    </div>
  );
}
