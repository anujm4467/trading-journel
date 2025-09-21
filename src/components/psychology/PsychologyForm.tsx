'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Textarea } from '@/components/ui/textarea'
import { Gauge, TrendingUp, TrendingDown, Brain, HeartCrack } from 'lucide-react'

interface PsychologyFormProps {
  initialData?: {
    followedRiskReward?: boolean
    followedIntradayHunter?: boolean
    overtrading?: boolean
    waitedForRetracement?: boolean
    hadPatienceWhileExiting?: boolean
    showedGreed?: boolean
    showedFear?: boolean
    tradedAgainstTrend?: boolean
    psychologyNotes?: string
  }
  onSave?: (data: {
    followedRiskReward: boolean
    followedIntradayHunter: boolean
    overtrading: boolean
    waitedForRetracement: boolean
    hadPatienceWhileExiting: boolean
    showedGreed: boolean
    showedFear: boolean
    tradedAgainstTrend: boolean
    psychologyNotes: string
  }) => void
  onCancel?: () => void
}

export function PsychologyForm({ initialData, onSave, onCancel }: PsychologyFormProps) {
  const [psychologyMetrics, setPsychologyMetrics] = useState({
    followedRiskReward: initialData?.followedRiskReward ?? true,
    followedIntradayHunter: initialData?.followedIntradayHunter ?? true,
    overtrading: initialData?.overtrading ?? false,
    waitedForRetracement: initialData?.waitedForRetracement ?? true,
    hadPatienceWhileExiting: initialData?.hadPatienceWhileExiting ?? true,
    showedGreed: initialData?.showedGreed ?? false,
    showedFear: initialData?.showedFear ?? false,
    tradedAgainstTrend: initialData?.tradedAgainstTrend ?? false,
  })

  const [psychologyNotes, setPsychologyNotes] = useState(initialData?.psychologyNotes || '')

  // Placeholder for sentiment/emotion scores (0-100)
  const [greedScore, setGreedScore] = useState(30)
  const [fearScore, setFearScore] = useState(45)

  const handleMetricChange = (metric: keyof typeof psychologyMetrics, checked: boolean) => {
    setPsychologyMetrics(prev => ({ ...prev, [metric]: checked }))
  }

  const handleSave = () => {
    const data = {
      ...psychologyMetrics,
      psychologyNotes,
      greedScore,
      fearScore
    }
    onSave?.(data)
  }

  return (
    <div className="space-y-8 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Trading Psychology & Behavior</h1>
          <p className="text-muted-foreground mt-1">
            Analyze your emotional and behavioral patterns in trading
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Behavioral Checklist */}
        <Card className="lg:col-span-2 backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg text-gray-900 dark:text-gray-100">
              <Brain className="h-5 w-5 text-indigo-600" />
              Behavioral Checklist
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Reflect on your actions for each trade (optional)
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="followedRiskReward"
                  checked={psychologyMetrics.followedRiskReward}
                  onCheckedChange={(checked: boolean) => handleMetricChange('followedRiskReward', checked)}
                />
                <Label htmlFor="followedRiskReward" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Followed Risk:Reward Ratio
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="followedIntradayHunter"
                  checked={psychologyMetrics.followedIntradayHunter}
                  onCheckedChange={(checked: boolean) => handleMetricChange('followedIntradayHunter', checked)}
                />
                <Label htmlFor="followedIntradayHunter" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Followed Intraday Hunter Strategy
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="overtrading"
                  checked={psychologyMetrics.overtrading}
                  onCheckedChange={(checked: boolean) => handleMetricChange('overtrading', checked)}
                />
                <Label htmlFor="overtrading" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Avoided Overtrading
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="waitedForRetracement"
                  checked={psychologyMetrics.waitedForRetracement}
                  onCheckedChange={(checked: boolean) => handleMetricChange('waitedForRetracement', checked)}
                />
                <Label htmlFor="waitedForRetracement" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Waited for Retracement
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hadPatienceWhileExiting"
                  checked={psychologyMetrics.hadPatienceWhileExiting}
                  onCheckedChange={(checked: boolean) => handleMetricChange('hadPatienceWhileExiting', checked)}
                />
                <Label htmlFor="hadPatienceWhileExiting" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Had Patience While Exiting
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="tradedAgainstTrend"
                  checked={psychologyMetrics.tradedAgainstTrend}
                  onCheckedChange={(checked: boolean) => handleMetricChange('tradedAgainstTrend', checked)}
                />
                <Label htmlFor="tradedAgainstTrend" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Traded Against Market Trend
                </Label>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="showedGreed"
                checked={psychologyMetrics.showedGreed}
                onCheckedChange={(checked: boolean) => handleMetricChange('showedGreed', checked)}
              />
              <Label htmlFor="showedGreed" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Showed Greed in This Trade
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="showedFear"
                checked={psychologyMetrics.showedFear}
                onCheckedChange={(checked: boolean) => handleMetricChange('showedFear', checked)}
              />
              <Label htmlFor="showedFear" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Showed Fear in This Trade
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Greed & Fear Gauges */}
        <div className="space-y-6">
          <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg text-gray-900 dark:text-gray-100">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Greed Index
              </CardTitle>
              <CardDescription>How much greed influenced your trade</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-col items-center space-y-4">
                <Gauge className="h-16 w-16 text-green-500" />
                <Slider
                  value={[greedScore]}
                  max={100}
                  step={1}
                  onValueChange={(val) => setGreedScore(val[0])}
                  className="w-full"
                />
                <span className="text-2xl font-bold text-green-600">{greedScore}%</span>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {greedScore > 70 ? 'High Greed' : greedScore > 40 ? 'Moderate Greed' : 'Low Greed'}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg text-gray-900 dark:text-gray-100">
                <TrendingDown className="h-5 w-5 text-red-600" />
                Fear Index
              </CardTitle>
              <CardDescription>How much fear influenced your trade</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-col items-center space-y-4">
                <HeartCrack className="h-16 w-16 text-red-500" />
                <Slider
                  value={[fearScore]}
                  max={100}
                  step={1}
                  onValueChange={(val) => setFearScore(val[0])}
                  className="w-full"
                />
                <span className="text-2xl font-bold text-red-600">{fearScore}%</span>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {fearScore > 70 ? 'High Fear' : fearScore > 40 ? 'Moderate Fear' : 'Low Fear'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Psychology Notes */}
      <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-indigo-600" />
            Additional Psychology Notes
          </CardTitle>
          <CardDescription>
            Reflect on your emotional state, decision-making process, and any behavioral patterns you noticed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={psychologyNotes}
            onChange={(e) => setPsychologyNotes(e.target.value)}
            placeholder="Reflect on your emotional state, decision-making process, and any behavioral patterns you noticed..."
            className="min-h-[120px] resize-none"
          />
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        {onCancel && (
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button onClick={handleSave}>
          Save Psychology Analysis
        </Button>
      </div>
    </div>
  )
}
