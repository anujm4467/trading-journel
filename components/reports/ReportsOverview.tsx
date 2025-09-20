'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  FileDown,
  Calendar,
  Download,
  Mail,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

// Mock data
const mockReports = [
  {
    id: '1',
    name: 'Monthly Performance Report',
    type: 'performance',
    format: 'pdf',
    lastGenerated: '2024-09-15',
    status: 'completed',
    size: '2.4 MB',
    description: 'Comprehensive monthly trading performance analysis'
  },
  {
    id: '2',
    name: 'Tax Report - Q3 2024',
    type: 'tax',
    format: 'excel',
    lastGenerated: '2024-09-10',
    status: 'completed',
    size: '1.8 MB',
    description: 'Quarterly tax report for filing purposes'
  },
  {
    id: '3',
    name: 'Strategy Analysis',
    type: 'analysis',
    format: 'pdf',
    lastGenerated: '2024-09-12',
    status: 'completed',
    size: '3.1 MB',
    description: 'Detailed analysis of trading strategies'
  },
  {
    id: '4',
    name: 'Weekly Summary',
    type: 'summary',
    format: 'csv',
    lastGenerated: '2024-09-14',
    status: 'generating',
    size: '0.5 MB',
    description: 'Weekly trading summary and metrics'
  }
]

const reportTemplates = [
  {
    id: 'monthly',
    name: 'Monthly Performance Report',
    description: 'Comprehensive monthly analysis with charts and metrics',
    icon: '📊',
    estimatedTime: '2-3 minutes'
  },
  {
    id: 'tax',
    name: 'Tax Report',
    description: 'Formatted report for tax filing purposes',
    icon: '📋',
    estimatedTime: '1-2 minutes'
  },
  {
    id: 'strategy',
    name: 'Strategy Analysis',
    description: 'Deep dive into strategy performance',
    icon: '🎯',
    estimatedTime: '3-5 minutes'
  },
  {
    id: 'custom',
    name: 'Custom Report',
    description: 'Build your own report with selected metrics',
    icon: '⚙️',
    estimatedTime: '5-10 minutes'
  }
]

export function ReportsOverview() {
  const handleGenerateReport = (templateId: string) => {
    // Simulate report generation
    console.log('Generating report for template:', templateId)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-success" />
      case 'generating':
        return <Clock className="h-4 w-4 text-warning animate-spin" />
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-destructive" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-success/10 text-success'
      case 'generating':
        return 'bg-warning/10 text-warning'
      case 'failed':
        return 'bg-destructive/10 text-destructive'
      default:
        return 'bg-muted/10 text-muted-foreground'
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports & Export</h1>
          <p className="text-muted-foreground">
            Generate and manage your trading reports
          </p>
        </div>
        <Button>
          <FileDown className="h-4 w-4 mr-2" />
          Quick Export
        </Button>
      </div>

      {/* Report Generation */}
      <Card>
        <CardHeader>
          <CardTitle>Generate New Report</CardTitle>
          <CardDescription>
            Choose a template to generate a new report
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {reportTemplates.map((template) => (
              <Card 
                key={template.id} 
                className="hover-lift cursor-pointer"
                onClick={() => handleGenerateReport(template.id)}
              >
                <CardContent className="p-4">
                  <div className="text-center space-y-2">
                    <div className="text-3xl">{template.icon}</div>
                    <h3 className="font-medium">{template.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {template.description}
                    </p>
                    <Badge variant="outline" className="text-xs">
                      {template.estimatedTime}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Report History */}
      <Tabs defaultValue="recent" className="space-y-4">
        <TabsList>
          <TabsTrigger value="recent">Recent Reports</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Reports</CardTitle>
              <CardDescription>
                Your recently generated reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockReports.map((report) => (
                  <div 
                    key={report.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl">
                        {report.format === 'pdf' ? '📄' : 
                         report.format === 'excel' ? '📊' : '📋'}
                      </div>
                      <div>
                        <h4 className="font-medium">{report.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {report.description}
                        </p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-xs text-muted-foreground">
                            Generated: {report.lastGenerated}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Size: {report.size}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(report.status)}>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(report.status)}
                          <span className="capitalize">{report.status}</span>
                        </div>
                      </Badge>
                      {report.status === 'completed' && (
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Reports</CardTitle>
              <CardDescription>
                Set up automatic report generation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium mb-2">No Scheduled Reports</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Set up automatic report generation to receive regular updates
                </p>
                <Button>
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Report Templates</CardTitle>
              <CardDescription>
                Manage and customize your report templates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {reportTemplates.map((template) => (
                  <Card key={template.id} className="hover-lift">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className="text-2xl">{template.icon}</div>
                        <div className="flex-1">
                          <h4 className="font-medium">{template.name}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {template.description}
                          </p>
                          <div className="flex items-center space-x-2 mt-3">
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                            <Button variant="outline" size="sm">
                              Duplicate
                            </Button>
                            <Button variant="outline" size="sm">
                              Preview
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="hover-lift cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Download className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Export All Data</h3>
                <p className="text-sm text-muted-foreground">
                  Download complete trading data
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                <Mail className="h-5 w-5 text-success" />
              </div>
              <div>
                <h3 className="font-medium">Email Report</h3>
                <p className="text-sm text-muted-foreground">
                  Send report via email
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-warning" />
              </div>
              <div>
                <h3 className="font-medium">Schedule Report</h3>
                <p className="text-sm text-muted-foreground">
                  Set up automatic reports
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
