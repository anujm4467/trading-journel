'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { 
  Gauge, 
  TrendingUp, 
  TrendingDown, 
  Brain, 
  HeartCrack, 
  Moon, 
  Zap, 
  Target, 
  Clock,
  AlertTriangle,
  Coffee,
  Activity
} from 'lucide-react'

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
    // Enhanced fields
    sleepQuality?: number
    meditationPractice?: boolean
    internetIssues?: boolean
    stressLevel?: number
    energyLevel?: number
    focusLevel?: number
    marketSentiment?: string
    newsImpact?: string
    socialMediaInfluence?: boolean
    fomoLevel?: number
    revengeTrading?: boolean
    impulsiveTrading?: boolean
    overconfidence?: boolean
    analysisTime?: number
    decisionTime?: number
    preTradeMood?: string
    postTradeMood?: string
    learningFromMistakes?: boolean
    strategyDeviation?: string
    emotionalTriggers?: string
    copingMechanisms?: string
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
    strategyDeviation: string
    emotionalTriggers: string
    copingMechanisms: string
    sleepQuality: number
    stressLevel: number
    energyLevel: number
    focusLevel: number
    fomoLevel: number
    greedScore: number
    fearScore: number
    analysisTime: number
    decisionTime: number
    marketSentiment: string
    newsImpact: string
    preTradeMood: string
    postTradeMood: string
    meditationPractice: boolean
    internetIssues: boolean
    socialMediaInfluence: boolean
    revengeTrading: boolean
    impulsiveTrading: boolean
    overconfidence: boolean
    learningFromMistakes: boolean
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
    meditationPractice: initialData?.meditationPractice ?? false,
    internetIssues: initialData?.internetIssues ?? false,
    socialMediaInfluence: initialData?.socialMediaInfluence ?? false,
    revengeTrading: initialData?.revengeTrading ?? false,
    impulsiveTrading: initialData?.impulsiveTrading ?? false,
    overconfidence: initialData?.overconfidence ?? false,
    learningFromMistakes: initialData?.learningFromMistakes ?? false,
  })

  const [psychologyNotes, setPsychologyNotes] = useState(initialData?.psychologyNotes || '')
  const [strategyDeviation, setStrategyDeviation] = useState(initialData?.strategyDeviation || '')
  const [emotionalTriggers, setEmotionalTriggers] = useState(initialData?.emotionalTriggers || '')
  const [copingMechanisms, setCopingMechanisms] = useState(initialData?.copingMechanisms || '')

  // Scale-based metrics (1-10)
  const [sleepQuality, setSleepQuality] = useState(initialData?.sleepQuality ?? 7)
  const [stressLevel, setStressLevel] = useState(initialData?.stressLevel ?? 5)
  const [energyLevel, setEnergyLevel] = useState(initialData?.energyLevel ?? 7)
  const [focusLevel, setFocusLevel] = useState(initialData?.focusLevel ?? 7)
  const [fomoLevel, setFomoLevel] = useState(initialData?.fomoLevel ?? 3)
  const [greedScore, setGreedScore] = useState(30)
  const [fearScore, setFearScore] = useState(45)

  // Time-based metrics
  const [analysisTime, setAnalysisTime] = useState(initialData?.analysisTime ?? 30)
  const [decisionTime, setDecisionTime] = useState(initialData?.decisionTime ?? 5)

  // Select-based metrics
  const [marketSentiment, setMarketSentiment] = useState(initialData?.marketSentiment ?? 'Neutral')
  const [newsImpact, setNewsImpact] = useState(initialData?.newsImpact ?? 'Neutral')
  const [preTradeMood, setPreTradeMood] = useState(initialData?.preTradeMood ?? 'Calm')
  const [postTradeMood, setPostTradeMood] = useState(initialData?.postTradeMood ?? 'Neutral')

  const handleMetricChange = (metric: keyof typeof psychologyMetrics, checked: boolean) => {
    setPsychologyMetrics(prev => ({ ...prev, [metric]: checked }))
  }

  const handleSave = () => {
    const data = {
      ...psychologyMetrics,
      psychologyNotes,
      strategyDeviation,
      emotionalTriggers,
      copingMechanisms,
      sleepQuality,
      stressLevel,
      energyLevel,
      focusLevel,
      fomoLevel,
      greedScore,
      fearScore,
      analysisTime,
      decisionTime,
      marketSentiment,
      newsImpact,
      preTradeMood,
      postTradeMood
    }
    onSave?.(data)
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600'
    if (score >= 6) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreLabel = (score: number, type: 'quality' | 'level') => {
    if (type === 'quality') {
      if (score >= 8) return 'Excellent'
      if (score >= 6) return 'Good'
      if (score >= 4) return 'Fair'
      return 'Poor'
    } else {
      if (score >= 8) return 'High'
      if (score >= 6) return 'Moderate'
      if (score >= 4) return 'Low'
      return 'Very Low'
    }
  }

  return (
    <div className="space-y-8 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Enhanced Trading Psychology Analysis</h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive analysis of your emotional and behavioral patterns in trading
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Physical & Mental State */}
        <Card className="lg:col-span-2 backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg text-gray-900 dark:text-gray-100">
              <Activity className="h-5 w-5 text-blue-600" />
              Physical & Mental State
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              How was your physical and mental condition during this trade?
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0 space-y-6">
            {/* Sleep Quality */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Moon className="h-4 w-4 text-indigo-600" />
                <Label className="text-sm font-medium">Sleep Quality (1-10)</Label>
              </div>
              <div className="space-y-2">
                <Slider
                  value={[sleepQuality]}
                  max={10}
                  min={1}
                  step={1}
                  onValueChange={(val) => setSleepQuality(val[0])}
                  className="w-full"
                />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Poor</span>
                  <span className={`text-lg font-bold ${getScoreColor(sleepQuality)}`}>
                    {sleepQuality}/10
                  </span>
                  <span className="text-sm text-gray-600">Excellent</span>
                </div>
                <p className="text-xs text-gray-500">{getScoreLabel(sleepQuality, 'quality')}</p>
              </div>
            </div>

            {/* Energy Level */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-yellow-600" />
                <Label className="text-sm font-medium">Energy Level (1-10)</Label>
              </div>
              <div className="space-y-2">
                <Slider
                  value={[energyLevel]}
                  max={10}
                  min={1}
                  step={1}
                  onValueChange={(val) => setEnergyLevel(val[0])}
                  className="w-full"
                />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Low</span>
                  <span className={`text-lg font-bold ${getScoreColor(energyLevel)}`}>
                    {energyLevel}/10
                  </span>
                  <span className="text-sm text-gray-600">High</span>
                </div>
                <p className="text-xs text-gray-500">{getScoreLabel(energyLevel, 'level')}</p>
              </div>
            </div>

            {/* Stress Level */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <Label className="text-sm font-medium">Stress Level (1-10)</Label>
              </div>
              <div className="space-y-2">
                <Slider
                  value={[stressLevel]}
                  max={10}
                  min={1}
                  step={1}
                  onValueChange={(val) => setStressLevel(val[0])}
                  className="w-full"
                />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Low</span>
                  <span className={`text-lg font-bold ${getScoreColor(10 - stressLevel)}`}>
                    {stressLevel}/10
                  </span>
                  <span className="text-sm text-gray-600">High</span>
                </div>
                <p className="text-xs text-gray-500">{getScoreLabel(10 - stressLevel, 'level')} Stress Management</p>
              </div>
            </div>

            {/* Focus Level */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-purple-600" />
                <Label className="text-sm font-medium">Focus Level (1-10)</Label>
              </div>
              <div className="space-y-2">
                <Slider
                  value={[focusLevel]}
                  max={10}
                  min={1}
                  step={1}
                  onValueChange={(val) => setFocusLevel(val[0])}
                  className="w-full"
                />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Distracted</span>
                  <span className={`text-lg font-bold ${getScoreColor(focusLevel)}`}>
                    {focusLevel}/10
                  </span>
                  <span className="text-sm text-gray-600">Laser Focus</span>
                </div>
                <p className="text-xs text-gray-500">{getScoreLabel(focusLevel, 'level')}</p>
              </div>
            </div>

            {/* Practice Checkboxes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="meditationPractice"
                  checked={psychologyMetrics.meditationPractice}
                  onCheckedChange={(checked: boolean) => handleMetricChange('meditationPractice', checked)}
                />
                <Label htmlFor="meditationPractice" className="text-sm font-medium">
                  Did you meditate today?
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="internetIssues"
                  checked={psychologyMetrics.internetIssues}
                  onCheckedChange={(checked: boolean) => handleMetricChange('internetIssues', checked)}
                />
                <Label htmlFor="internetIssues" className="text-sm font-medium">
                  Faced internet connectivity issues?
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emotional State */}
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

          <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg text-gray-900 dark:text-gray-100">
                <Coffee className="h-5 w-5 text-orange-600" />
                FOMO Level
              </CardTitle>
              <CardDescription>Fear of Missing Out (1-10)</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-col items-center space-y-4">
                <Slider
                  value={[fomoLevel]}
                  max={10}
                  min={1}
                  step={1}
                  onValueChange={(val) => setFomoLevel(val[0])}
                  className="w-full"
                />
                <span className="text-2xl font-bold text-orange-600">{fomoLevel}/10</span>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {fomoLevel > 7 ? 'High FOMO' : fomoLevel > 4 ? 'Moderate FOMO' : 'Low FOMO'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Market Context & External Factors */}
      <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-indigo-600" />
            Market Context & External Factors
          </CardTitle>
          <CardDescription>
            How external factors influenced your trading decisions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Market Sentiment</Label>
              <Select value={marketSentiment} onValueChange={setMarketSentiment}>
                <SelectTrigger>
                  <SelectValue placeholder="Select sentiment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bullish">🐂 Bullish</SelectItem>
                  <SelectItem value="Bearish">🐻 Bearish</SelectItem>
                  <SelectItem value="Neutral">😐 Neutral</SelectItem>
                  <SelectItem value="Volatile">⚡ Volatile</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">News Impact</Label>
              <Select value={newsImpact} onValueChange={setNewsImpact}>
                <SelectTrigger>
                  <SelectValue placeholder="Select impact" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Positive">📈 Positive</SelectItem>
                  <SelectItem value="Negative">📉 Negative</SelectItem>
                  <SelectItem value="Neutral">➡️ Neutral</SelectItem>
                  <SelectItem value="Mixed">🔄 Mixed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Pre-Trade Mood</Label>
              <Select value={preTradeMood} onValueChange={setPreTradeMood}>
                <SelectTrigger>
                  <SelectValue placeholder="Select mood" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Excited">😄 Excited</SelectItem>
                  <SelectItem value="Calm">😌 Calm</SelectItem>
                  <SelectItem value="Anxious">😰 Anxious</SelectItem>
                  <SelectItem value="Confident">💪 Confident</SelectItem>
                  <SelectItem value="Frustrated">😤 Frustrated</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Post-Trade Mood</Label>
              <Select value={postTradeMood} onValueChange={setPostTradeMood}>
                <SelectTrigger>
                  <SelectValue placeholder="Select mood" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Satisfied">😊 Satisfied</SelectItem>
                  <SelectItem value="Regretful">😔 Regretful</SelectItem>
                  <SelectItem value="Neutral">😐 Neutral</SelectItem>
                  <SelectItem value="Proud">🎉 Proud</SelectItem>
                  <SelectItem value="Disappointed">😞 Disappointed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="socialMediaInfluence"
                checked={psychologyMetrics.socialMediaInfluence}
                onCheckedChange={(checked: boolean) => handleMetricChange('socialMediaInfluence', checked)}
              />
              <Label htmlFor="socialMediaInfluence" className="text-sm font-medium">
                Influenced by social media/news
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="learningFromMistakes"
                checked={psychologyMetrics.learningFromMistakes}
                onCheckedChange={(checked: boolean) => handleMetricChange('learningFromMistakes', checked)}
              />
              <Label htmlFor="learningFromMistakes" className="text-sm font-medium">
                Learned from previous mistakes
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trading Behavior & Decision Making */}
      <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            Trading Behavior & Decision Making
          </CardTitle>
          <CardDescription>
            Analyze your trading behavior and decision-making process
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Time Analysis */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-white">Time Analysis</h4>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Analysis Time (minutes)</Label>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <Input
                      type="number"
                      value={analysisTime}
                      onChange={(e) => setAnalysisTime(Number(e.target.value))}
                      className="w-20"
                      min="1"
                      max="300"
                    />
                    <span className="text-sm text-gray-600">minutes</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Decision Time (minutes)</Label>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-green-600" />
                    <Input
                      type="number"
                      value={decisionTime}
                      onChange={(e) => setDecisionTime(Number(e.target.value))}
                      className="w-20"
                      min="1"
                      max="60"
                    />
                    <span className="text-sm text-gray-600">minutes</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Behavioral Patterns */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-white">Behavioral Patterns</h4>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="followedRiskReward"
                    checked={psychologyMetrics.followedRiskReward}
                    onCheckedChange={(checked: boolean) => handleMetricChange('followedRiskReward', checked)}
                  />
                  <Label htmlFor="followedRiskReward" className="text-sm font-medium">
                    Followed Risk:Reward Ratio
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="followedIntradayHunter"
                    checked={psychologyMetrics.followedIntradayHunter}
                    onCheckedChange={(checked: boolean) => handleMetricChange('followedIntradayHunter', checked)}
                  />
                  <Label htmlFor="followedIntradayHunter" className="text-sm font-medium">
                    Followed Intraday Hunter Strategy
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="overtrading"
                    checked={psychologyMetrics.overtrading}
                    onCheckedChange={(checked: boolean) => handleMetricChange('overtrading', checked)}
                  />
                  <Label htmlFor="overtrading" className="text-sm font-medium">
                    Avoided Overtrading
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="waitedForRetracement"
                    checked={psychologyMetrics.waitedForRetracement}
                    onCheckedChange={(checked: boolean) => handleMetricChange('waitedForRetracement', checked)}
                  />
                  <Label htmlFor="waitedForRetracement" className="text-sm font-medium">
                    Waited for Retracement
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hadPatienceWhileExiting"
                    checked={psychologyMetrics.hadPatienceWhileExiting}
                    onCheckedChange={(checked: boolean) => handleMetricChange('hadPatienceWhileExiting', checked)}
                  />
                  <Label htmlFor="hadPatienceWhileExiting" className="text-sm font-medium">
                    Had Patience While Exiting
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="tradedAgainstTrend"
                    checked={psychologyMetrics.tradedAgainstTrend}
                    onCheckedChange={(checked: boolean) => handleMetricChange('tradedAgainstTrend', checked)}
                  />
                  <Label htmlFor="tradedAgainstTrend" className="text-sm font-medium">
                    Traded Against Market Trend
                  </Label>
                </div>
              </div>
            </div>
          </div>

          {/* Emotional Trading Patterns */}
          <div className="mt-6 pt-6 border-t">
            <h4 className="font-medium text-gray-900 dark:text-white mb-4">Emotional Trading Patterns</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="showedGreed"
                  checked={psychologyMetrics.showedGreed}
                  onCheckedChange={(checked: boolean) => handleMetricChange('showedGreed', checked)}
                />
                <Label htmlFor="showedGreed" className="text-sm font-medium">
                  Showed Greed
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="showedFear"
                  checked={psychologyMetrics.showedFear}
                  onCheckedChange={(checked: boolean) => handleMetricChange('showedFear', checked)}
                />
                <Label htmlFor="showedFear" className="text-sm font-medium">
                  Showed Fear
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="revengeTrading"
                  checked={psychologyMetrics.revengeTrading}
                  onCheckedChange={(checked: boolean) => handleMetricChange('revengeTrading', checked)}
                />
                <Label htmlFor="revengeTrading" className="text-sm font-medium">
                  Revenge Trading
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="impulsiveTrading"
                  checked={psychologyMetrics.impulsiveTrading}
                  onCheckedChange={(checked: boolean) => handleMetricChange('impulsiveTrading', checked)}
                />
                <Label htmlFor="impulsiveTrading" className="text-sm font-medium">
                  Impulsive Trading
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="overconfidence"
                  checked={psychologyMetrics.overconfidence}
                  onCheckedChange={(checked: boolean) => handleMetricChange('overconfidence', checked)}
                />
                <Label htmlFor="overconfidence" className="text-sm font-medium">
                  Overconfident
                </Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Reflection */}
      <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-indigo-600" />
            Detailed Reflection
          </CardTitle>
          <CardDescription>
            Deep dive into your psychological state and decision-making process
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Strategy Deviation Reason</Label>
            <Textarea
              value={strategyDeviation}
              onChange={(e) => setStrategyDeviation(e.target.value)}
              placeholder="If you deviated from your strategy, what was the reason? (e.g., market conditions, emotions, news, etc.)"
              className="min-h-[80px] resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Emotional Triggers</Label>
            <Textarea
              value={emotionalTriggers}
              onChange={(e) => setEmotionalTriggers(e.target.value)}
              placeholder="What triggered your emotions during this trade? (e.g., news, social media, previous losses, etc.)"
              className="min-h-[80px] resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Coping Mechanisms</Label>
            <Textarea
              value={copingMechanisms}
              onChange={(e) => setCopingMechanisms(e.target.value)}
              placeholder="How did you cope with stress or negative emotions during this trade? (e.g., deep breathing, taking breaks, etc.)"
              className="min-h-[80px] resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Additional Psychology Notes</Label>
            <Textarea
              value={psychologyNotes}
              onChange={(e) => setPsychologyNotes(e.target.value)}
              placeholder="Reflect on your emotional state, decision-making process, and any behavioral patterns you noticed..."
              className="min-h-[120px] resize-none"
            />
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        {onCancel && (
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button onClick={handleSave} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
          Save Enhanced Psychology Analysis
        </Button>
      </div>
    </div>
  )
}