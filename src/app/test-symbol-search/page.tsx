'use client'

import { useState } from 'react'
import { SymbolSearchInput } from '@/components/forms/SymbolSearchInput'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'

export default function TestSymbolSearchPage() {
  const [selectedSymbol, setSelectedSymbol] = useState('')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-8">
      <div className="max-w-2xl mx-auto">
        <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 rounded-2xl shadow-2xl border border-white/20 p-8">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                Symbol Search & CSV Import Test
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Test the enhanced symbol search with CSV import functionality
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Search & Import Symbols</Label>
                <SymbolSearchInput
                  value={selectedSymbol}
                  onChange={setSelectedSymbol}
                  placeholder="Search or import symbols from CSV..."
                  className="w-full"
                />
              </div>

              {selectedSymbol && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                    Selected Symbol:
                  </h3>
                  <p className="text-blue-700 dark:text-blue-300 font-mono">
                    {selectedSymbol}
                  </p>
                </div>
              )}

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Features:
                </h3>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Search through predefined stock symbols
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Import symbols from CSV files
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Automatic duplicate detection and removal
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    View imported symbols in a table
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Keyboard navigation support
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Download sample CSV template
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  CSV Format:
                </h3>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <pre className="text-xs text-gray-700 dark:text-gray-300">
{`Company N Industry,Symbol,Series,ISIN Code
Reliance Industries Ltd,RELIANCE,EQ,INE002A01018
Tata Consultancy Services Ltd,TCS,EQ,INE467B01029
HDFC Bank Ltd,HDFCBANK,EQ,INE040A01034`}
                  </pre>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  <p><strong>Note:</strong> &quot;Company N Industry&quot; column will be automatically mapped to Company Name field.</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

