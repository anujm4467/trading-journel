'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Logo, LogoCompact } from '@/components/ui/Logo'
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
  Database
} from 'lucide-react'

interface SidebarProps {
  className?: string
}

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
    name: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
    description: 'Performance analysis'
  },
  {
    name: 'Psychology',
    href: '/psychology',
    icon: Brain,
    description: 'Trading psychology analysis'
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
  const pathname = usePathname()

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

      {/* Header */}
      <div className="flex h-16 items-center px-4 border-b">
        {!isCollapsed ? (
          <Logo size="md" />
        ) : (
          <LogoCompact size="md" />
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link key={item.name} href={item.href}>
              <div
                className={cn(
                  "group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  isActive 
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm" 
                    : "text-sidebar-foreground",
                  isCollapsed && "justify-center px-2"
                )}
              >
                <Icon className={cn(
                  "h-5 w-5 flex-shrink-0",
                  isCollapsed ? "mr-0" : "mr-3"
                )} />
                
                {!isCollapsed && (
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="truncate">{item.name}</span>
                      {item.badge !== undefined && item.badge > 0 && (
                        <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-xs">
                          {item.badge}
                        </Badge>
                      )}
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
            </Link>
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
