'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  LayoutDashboard,
  FileText,
  BarChart3,
  Brain,
  Settings,
  FileDown,
  Wallet,
  ChevronLeft,
  ChevronRight,
  Database,
  Target,
  TrendingUp,
  PieChart,
  Clock,
  Shield,
  ChevronDown,
  ChevronUp,
  Activity,
  HeartCrack,
  BrainCircuit,
  Target as TargetIcon,
  Zap,
  Moon
} from 'lucide-react'

interface SidebarProps {
  className?: string
}

const analyticsSubItems = [
  {
    name: 'Overview',
    href: '/analytics',
    icon: BarChart3,
    description: 'Analytics dashboard overview'
  },
  {
    name: 'Performance',
    href: '/analytics/performance',
    icon: BarChart3,
    description: 'Performance charts & metrics'
  },
  {
    name: 'Strategies',
    href: '/analytics/strategies',
    icon: PieChart,
    description: 'Strategy performance analysis'
  },
  {
    name: 'Time Analysis',
    href: '/analytics/time-analysis',
    icon: Clock,
    description: 'Time-based performance patterns'
  },
  {
    name: 'Risk Metrics',
    href: '/analytics/risk-metrics',
    icon: Shield,
    description: 'Risk analysis & management'
  },
  {
    name: 'Comparison',
    href: '/analytics/comparison',
    icon: TrendingUp,
    description: 'Performance comparison & benchmarks'
  }
]

const psychologySubItems = [
  {
    name: 'Overview',
    href: '/psychology',
    icon: Brain,
    description: 'Psychology dashboard overview'
  },
  {
    name: 'Psychological Factors',
    href: '/psychology/factors',
    icon: Activity,
    description: 'Physical & mental state analysis'
  },
  {
    name: 'Behavioral Patterns',
    href: '/psychology/behavioral',
    icon: TargetIcon,
    description: 'Trading behavior analysis'
  },
  {
    name: 'Emotional Analysis',
    href: '/psychology/emotional',
    icon: HeartCrack,
    description: 'Emotional state & impact'
  },
  {
    name: 'P&L Correlations',
    href: '/psychology/correlations',
    icon: BrainCircuit,
    description: 'Psychology vs performance'
  },
  {
    name: 'Insights & Recommendations',
    href: '/psychology/insights',
    icon: Zap,
    description: 'AI insights & recommendations'
  }
]

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
    description: 'Overview and key metrics'
  },
  {
    name: 'Trades',
    href: '/trades',
    icon: FileText,
    description: 'Complete trade journal',
    badge: 0
  },
  {
    name: 'Stock Management',
    href: '/stock-management',
    icon: Database,
    description: 'Manage stock symbols & CSV imports'
  },
  {
    name: 'Capital',
    href: '/capital',
    icon: Wallet,
    description: 'Capital management'
  },
  {
    name: 'Predictions',
    href: '/predictions',
    icon: Target,
    description: 'Strategy predictions & tracking'
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
    description: 'Performance analysis',
    subItems: analyticsSubItems
  },
  {
    name: 'Prediction Analytics',
    href: '/predictions/analytics',
    icon: TrendingUp,
    description: 'Prediction performance metrics'
  },
  {
    name: 'Psychology',
    href: '/psychology',
    icon: Brain,
    description: 'Trading psychology analysis',
    subItems: psychologySubItems
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
    description: 'Configuration'
  },
  {
    name: 'Reports',
    href: '/reports',
    icon: FileDown,
    description: 'Export and reports'
  }
]

export function Sidebar({ className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const pathname = usePathname()

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(item => item !== itemName)
        : [...prev, itemName]
    )
  }

  const isItemActive = (href: string, subItems?: { href: string; name: string; icon: React.ComponentType<{ className?: string }>; description: string }[]) => {
    if (pathname === href) return true
    if (subItems) {
      return subItems.some(subItem => pathname === subItem.href)
    }
    return false
  }

  const isSubItemActive = (href: string) => {
    return pathname === href
  }

  return (
    <div className={cn(
      "relative flex h-full flex-col border-r bg-sidebar transition-all duration-300",
      isCollapsed ? "w-16" : "w-64",
      className
    )}>
      {/* Collapse Toggle */}
      <div className="absolute -right-3 top-4 z-10">
        <Button
          variant="outline"
          size="sm"
          className="h-6 w-6 rounded-full p-0 bg-background border-2"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? (
            <ChevronRight className="h-3 w-3" />
          ) : (
            <ChevronLeft className="h-3 w-3" />
          )}
        </Button>
      </div>

      {/* Header - Empty since logo moved to topbar */}
      <div className="flex h-16 items-center px-4 border-b">
        <div className="text-sm font-medium text-muted-foreground">
          {!isCollapsed ? 'Navigation' : ''}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navigationItems.map((item) => {
          const isActive = isItemActive(item.href, item.subItems)
          const isExpanded = expandedItems.includes(item.name.toLowerCase())
          const Icon = item.icon

          return (
            <div key={item.name}>
              {/* Main Navigation Item */}
              <div
                className={cn(
                  "group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground cursor-pointer",
                  isActive 
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm" 
                    : "text-sidebar-foreground",
                  isCollapsed && "justify-center px-2"
                )}
                onClick={() => {
                  if (item.subItems && !isCollapsed) {
                    toggleExpanded(item.name.toLowerCase())
                  } else {
                    window.location.href = item.href
                  }
                }}
              >
                <Icon className={cn(
                  "h-5 w-5 flex-shrink-0",
                  isCollapsed ? "mr-0" : "mr-3"
                )} />
                
                {!isCollapsed && (
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="truncate">{item.name}</span>
                      <div className="flex items-center gap-2">
                        {item.badge !== undefined && item.badge > 0 && (
                          <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                            {item.badge}
                          </Badge>
                        )}
                        {item.subItems && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 hover:bg-transparent"
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleExpanded(item.name.toLowerCase())
                            }}
                          >
                            {isExpanded ? (
                              <ChevronUp className="h-3 w-3" />
                            ) : (
                              <ChevronDown className="h-3 w-3" />
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {item.description}
                    </p>
                  </div>
                )}

                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-sm rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                    {item.name}
                  </div>
                )}
              </div>

              {/* Sub Navigation Items */}
              {item.subItems && !isCollapsed && isExpanded && (
                <div className="ml-6 mt-1 space-y-1">
                  {item.subItems.map((subItem) => {
                    const isSubActive = isSubItemActive(subItem.href)
                    const SubIcon = subItem.icon

                    return (
                      <Link key={subItem.name} href={subItem.href}>
                        <div
                          className={cn(
                            "group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                            isSubActive 
                              ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm" 
                              : "text-sidebar-foreground/70"
                          )}
                        >
                          <SubIcon className="h-4 w-4 flex-shrink-0 mr-3" />
                          <div className="flex-1 min-w-0">
                            <div className="truncate">{subItem.name}</div>
                            <p className="text-xs text-muted-foreground truncate">
                              {subItem.description}
                            </p>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="border-t p-4">
          <div className="text-xs text-muted-foreground text-center">
            <p>TradeJournal Pro v1.0.0</p>
            <p className="mt-1">© 2024 All rights reserved</p>
          </div>
        </div>
      )}
    </div>
  )
}
