'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { 
  Save,
  Download,
  Upload,
  Trash2,
  AlertTriangle
} from 'lucide-react'

// Mock settings data
const mockSettings = {
  general: {
    defaultInstrument: 'EQUITY',
    defaultPosition: 'BUY',
    autoCalculateCharges: true,
    requireStrategyTag: false,
    currencySymbol: '₹',
    decimalPlaces: 2,
    thousandsSeparator: 'comma',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24',
    theme: 'light'
  },
  display: {
    defaultPageSize: 50,
    denseMode: false,
    zebraStriping: true,
    stickyHeaders: true,
    autoRefresh: false
  },
  charges: {
    brokerage: {
      type: 'flat',
      value: 20
    },
    stt: {
      equity: 0.001,
      futures: 0.0001,
      options: 0.0005
    },
    exchange: 0.0000173,
    sebi: 0.000001,
    stampDuty: 0.00003
  },
  export: {
    defaultFormat: 'csv',
    includeFilters: true,
    includeCharts: false,
    fileNamingTemplate: 'trades_{date}',
    keepTradeHistory: 'forever',
    autoBackupFrequency: 'weekly'
  }
}

export function SettingsOverview() {
  const [settings, setSettings] = useState(mockSettings)
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  const handleSettingChange = (category: string, key: string, value: unknown) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }))
    setHasChanges(true)
  }

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
    setHasChanges(false)
  }

  const handleReset = () => {
    setSettings(mockSettings)
    setHasChanges(false)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Configure your trading journal preferences
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {hasChanges && (
            <Badge variant="outline" className="text-warning">
              Unsaved changes
            </Badge>
          )}
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <Button onClick={handleSave} disabled={isSaving || !hasChanges}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="display">Display</TabsTrigger>
          <TabsTrigger value="charges">Charges</TabsTrigger>
          <TabsTrigger value="export">Export</TabsTrigger>
          <TabsTrigger value="backup">Backup</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Basic configuration for your trading journal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="defaultInstrument">Default Instrument</Label>
                  <Select
                    value={settings.general.defaultInstrument}
                    onValueChange={(value) => handleSettingChange('general', 'defaultInstrument', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EQUITY">Equity</SelectItem>
                      <SelectItem value="FUTURES">Futures</SelectItem>
                      <SelectItem value="OPTIONS">Options</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="defaultPosition">Default Position</Label>
                  <Select
                    value={settings.general.defaultPosition}
                    onValueChange={(value) => handleSettingChange('general', 'defaultPosition', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BUY">Buy/Long</SelectItem>
                      <SelectItem value="SELL">Sell/Short</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-calculate Charges</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically calculate brokerage and other charges
                    </p>
                  </div>
                  <Switch
                    checked={settings.general.autoCalculateCharges}
                    onCheckedChange={(checked) => handleSettingChange('general', 'autoCalculateCharges', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Strategy Tag</Label>
                    <p className="text-sm text-muted-foreground">
                      Make strategy tags mandatory for new trades
                    </p>
                  </div>
                  <Switch
                    checked={settings.general.requireStrategyTag}
                    onCheckedChange={(checked) => handleSettingChange('general', 'requireStrategyTag', checked)}
                  />
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="currencySymbol">Currency Symbol</Label>
                  <Input
                    id="currencySymbol"
                    value={settings.general.currencySymbol}
                    onChange={(e) => handleSettingChange('general', 'currencySymbol', e.target.value)}
                    className="w-20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="decimalPlaces">Decimal Places</Label>
                  <Select
                    value={settings.general.decimalPlaces.toString()}
                    onValueChange={(value) => handleSettingChange('general', 'decimalPlaces', parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0</SelectItem>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateFormat">Date Format</Label>
                  <Select
                    value={settings.general.dateFormat}
                    onValueChange={(value) => handleSettingChange('general', 'dateFormat', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeFormat">Time Format</Label>
                  <Select
                    value={settings.general.timeFormat}
                    onValueChange={(value) => handleSettingChange('general', 'timeFormat', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12">12 Hour</SelectItem>
                      <SelectItem value="24">24 Hour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Display Settings */}
        <TabsContent value="display" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Display Settings</CardTitle>
              <CardDescription>
                Customize how data is displayed in your journal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Dense Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Use compact spacing in tables and lists
                    </p>
                  </div>
                  <Switch
                    checked={settings.display.denseMode}
                    onCheckedChange={(checked) => handleSettingChange('display', 'denseMode', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Zebra Striping</Label>
                    <p className="text-sm text-muted-foreground">
                      Alternate row colors in tables
                    </p>
                  </div>
                  <Switch
                    checked={settings.display.zebraStriping}
                    onCheckedChange={(checked) => handleSettingChange('display', 'zebraStriping', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Sticky Headers</Label>
                    <p className="text-sm text-muted-foreground">
                      Keep table headers visible while scrolling
                    </p>
                  </div>
                  <Switch
                    checked={settings.display.stickyHeaders}
                    onCheckedChange={(checked) => handleSettingChange('display', 'stickyHeaders', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto Refresh</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically refresh data every 5 minutes
                    </p>
                  </div>
                  <Switch
                    checked={settings.display.autoRefresh}
                    onCheckedChange={(checked) => handleSettingChange('display', 'autoRefresh', checked)}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="defaultPageSize">Default Page Size</Label>
                <Select
                  value={settings.display.defaultPageSize.toString()}
                  onValueChange={(value) => handleSettingChange('display', 'defaultPageSize', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                    <SelectItem value="200">200</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Charges Settings */}
        <TabsContent value="charges" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Charge Configuration</CardTitle>
              <CardDescription>
                Set up brokerage and other trading charges
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Brokerage Type</Label>
                  <Select
                    value={settings.charges.brokerage.type}
                    onValueChange={(value) => handleSettingChange('charges', 'brokerage', {
                      ...settings.charges.brokerage,
                      type: value
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="flat">Flat Rate (₹)</SelectItem>
                      <SelectItem value="percentage">Percentage (%)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Brokerage Value</Label>
                  <Input
                    type="number"
                    value={settings.charges.brokerage.value}
                    onChange={(e) => handleSettingChange('charges', 'brokerage', {
                      ...settings.charges.brokerage,
                      value: parseFloat(e.target.value)
                    })}
                    placeholder="20"
                  />
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>STT - Equity (%)</Label>
                  <Input
                    type="number"
                    step="0.0001"
                    value={settings.charges.stt.equity}
                    onChange={(e) => handleSettingChange('charges', 'stt', {
                      ...settings.charges.stt,
                      equity: parseFloat(e.target.value)
                    })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>STT - Futures (%)</Label>
                  <Input
                    type="number"
                    step="0.0001"
                    value={settings.charges.stt.futures}
                    onChange={(e) => handleSettingChange('charges', 'stt', {
                      ...settings.charges.stt,
                      futures: parseFloat(e.target.value)
                    })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>STT - Options (%)</Label>
                  <Input
                    type="number"
                    step="0.0001"
                    value={settings.charges.stt.options}
                    onChange={(e) => handleSettingChange('charges', 'stt', {
                      ...settings.charges.stt,
                      options: parseFloat(e.target.value)
                    })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Exchange Charges (%)</Label>
                  <Input
                    type="number"
                    step="0.000001"
                    value={settings.charges.exchange}
                    onChange={(e) => handleSettingChange('charges', 'exchange', parseFloat(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>SEBI Charges (%)</Label>
                  <Input
                    type="number"
                    step="0.000001"
                    value={settings.charges.sebi}
                    onChange={(e) => handleSettingChange('charges', 'sebi', parseFloat(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Stamp Duty (%)</Label>
                  <Input
                    type="number"
                    step="0.000001"
                    value={settings.charges.stampDuty}
                    onChange={(e) => handleSettingChange('charges', 'stampDuty', parseFloat(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Export Settings */}
        <TabsContent value="export" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Export Settings</CardTitle>
              <CardDescription>
                Configure export formats and options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Default Export Format</Label>
                  <Select
                    value={settings.export.defaultFormat}
                    onValueChange={(value) => handleSettingChange('export', 'defaultFormat', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                      <SelectItem value="pdf">PDF</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>File Naming Template</Label>
                  <Input
                    value={settings.export.fileNamingTemplate}
                    onChange={(e) => handleSettingChange('export', 'fileNamingTemplate', e.target.value)}
                    placeholder="trades_{date}"
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Include Filters</Label>
                    <p className="text-sm text-muted-foreground">
                      Include applied filters in export
                    </p>
                  </div>
                  <Switch
                    checked={settings.export.includeFilters}
                    onCheckedChange={(checked) => handleSettingChange('export', 'includeFilters', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Include Charts</Label>
                    <p className="text-sm text-muted-foreground">
                      Include charts in PDF exports
                    </p>
                  </div>
                  <Switch
                    checked={settings.export.includeCharts}
                    onCheckedChange={(checked) => handleSettingChange('export', 'includeCharts', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Backup Settings */}
        <TabsContent value="backup" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Backup & Restore</CardTitle>
              <CardDescription>
                Manage your data backup and restore options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Create Backup</h4>
                    <p className="text-sm text-muted-foreground">
                      Download a complete backup of your trading data
                    </p>
                  </div>
                  <Button>
                    <Download className="h-4 w-4 mr-2" />
                    Download Backup
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Restore from Backup</h4>
                    <p className="text-sm text-muted-foreground">
                      Upload and restore from a previous backup
                    </p>
                  </div>
                  <Button variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Backup
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Auto Backup Frequency</h4>
                    <p className="text-sm text-muted-foreground">
                      How often to create automatic backups
                    </p>
                  </div>
                  <Select
                    value={settings.export.autoBackupFrequency}
                    onValueChange={(value) => handleSettingChange('export', 'autoBackupFrequency', value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="never">Never</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                  <div>
                    <h4 className="font-medium text-destructive">Danger Zone</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      These actions cannot be undone. Please be careful.
                    </p>
                    <Button variant="destructive" className="mt-3">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete All Data
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced Settings */}
        <TabsContent value="advanced" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>
                Advanced configuration options for power users
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Debug Mode</h4>
                    <p className="text-sm text-muted-foreground">
                      Enable detailed logging and debugging information
                    </p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Performance Monitoring</h4>
                    <p className="text-sm text-muted-foreground">
                      Track application performance metrics
                    </p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Analytics</h4>
                    <p className="text-sm text-muted-foreground">
                      Share anonymous usage data to help improve the app
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>API Endpoint</Label>
                <Input
                  placeholder="https://api.tradejournal.com"
                  disabled
                />
                <p className="text-xs text-muted-foreground">
                  Custom API endpoints coming soon
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
