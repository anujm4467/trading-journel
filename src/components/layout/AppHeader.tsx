'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Logo } from '@/components/ui/Logo'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { 
  Search,
  Download,
  Plus,
  Bell,
  Settings,
  User
} from 'lucide-react'

interface AppHeaderProps {
  onExport: (format: string) => void
  onSearch: (query: string) => void
  searchQuery: string
}


export function AppHeader({
  onExport,
  onSearch,
  searchQuery
}: AppHeaderProps) {

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60 shadow-lg">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        {/* Logo - Always visible */}
        <div className="flex-shrink-0">
          <Logo size="md" className="hover:scale-105 transition-transform duration-300" />
        </div>

        {/* Center - Empty for now */}
        <div className="flex-1">
        </div>

        {/* Right Controls - Responsive */}
        <div className="flex items-center space-x-3 flex-shrink-0 ml-4">
          {/* Search - Hidden on small screens */}
          <div className="hidden md:block relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search trades..."
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              className="w-48 lg:w-56 pl-10 h-9 text-sm bg-white/60 dark:bg-gray-800/60 border-gray-200 dark:border-gray-700 backdrop-blur-sm focus:ring-2 focus:ring-blue-500/20 rounded-lg"
            />
          </div>

          {/* Last Updated Badge - Hidden on small screens */}
          <Badge variant="outline" className="hidden lg:flex text-xs bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-700 px-3 py-1">
            <span className="hidden xl:inline">Last updated: 2 minutes ago</span>
            <span className="xl:hidden">2m ago</span>
          </Badge>

          {/* Quick Add Trade - Responsive text */}
          <Link href="/trades/new">
            <Button 
              className="h-9 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 text-sm font-medium px-4"
            >
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Add Trade</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </Link>

          {/* Export Menu - Icon only on small screens */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 bg-white/60 dark:bg-gray-800/60 border-gray-200 dark:border-gray-700 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-gray-700/60 px-3">
                <Download className="h-4 w-4 mr-2" />
                <span className="hidden lg:inline">Export</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="backdrop-blur-xl bg-white/90 dark:bg-gray-800/90 border-white/20">
              <DropdownMenuItem onClick={() => onExport('csv')} className="hover:bg-blue-50 dark:hover:bg-blue-900/20">
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onExport('excel')} className="hover:bg-green-50 dark:hover:bg-green-900/20">
                Export as Excel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onExport('pdf')} className="hover:bg-red-50 dark:hover:bg-red-900/20">
                Export as PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications */}
          <Button variant="outline" size="sm" className="h-9 w-9 p-0 bg-white/60 dark:bg-gray-800/60 border-gray-200 dark:border-gray-700 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-gray-700/60 relative rounded-lg">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-bold">1</span>
          </Button>

          {/* Settings */}
          <Button variant="outline" size="sm" className="h-9 w-9 p-0 bg-white/60 dark:bg-gray-800/60 border-gray-200 dark:border-gray-700 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-gray-700/60 rounded-lg">
            <Settings className="h-4 w-4" />
          </Button>

          {/* User Profile */}
          <Button variant="outline" size="sm" className="h-9 w-9 p-0 bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg rounded-lg">
            <User className="h-4 w-4" />
          </Button>
        </div>
      </div>

    </header>
  )
}
