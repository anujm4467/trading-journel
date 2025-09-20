'use client'

import { cn } from '@/lib/utils'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showText?: boolean
  className?: string
  animated?: boolean
}

export function Logo({ 
  size = 'md', 
  showText = true, 
  className,
  animated = true 
}: LogoProps) {
  const sizeClasses = {
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-lg',
    lg: 'h-12 w-12 text-xl',
    xl: 'h-16 w-16 text-2xl'
  }

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-xl',
    xl: 'text-2xl'
  }

  return (
    <div className={cn("flex items-center space-x-3", className)}>
      {/* Logo Icon */}
      <div className="relative">
        <div className={cn(
          "rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 flex items-center justify-center shadow-xl transition-all duration-300",
          sizeClasses[size],
          animated && "hover:shadow-2xl hover:scale-105"
        )}>
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent"></div>
          <span className="text-white font-black relative z-10">AI</span>
        </div>
        
        {/* Animated Ring */}
        {animated && (
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-blue-400 to-purple-500 opacity-75 animate-pulse"></div>
        )}
      </div>
      
      {/* Logo Text */}
      {showText && (
        <div>
          <h1 className={cn(
            "font-black bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent tracking-tight",
            textSizeClasses[size]
          )}>
            Anuj Investment Plan
          </h1>
          <div className="flex items-center gap-2 -mt-1">
            <div className="h-1 w-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">Professional Trading</p>
            <div className="h-1 w-6 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"></div>
          </div>
        </div>
      )}
    </div>
  )
}

// Compact version for collapsed states
export function LogoCompact({ size = 'md', className }: { size?: 'sm' | 'md' | 'lg' | 'xl', className?: string }) {
  const sizeClasses = {
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-lg',
    lg: 'h-12 w-12 text-xl',
    xl: 'h-16 w-16 text-2xl'
  }

  return (
    <div className={cn("relative", className)}>
      <div className={cn(
        "rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105",
        sizeClasses[size]
      )}>
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent"></div>
        <span className="text-white font-black relative z-10">AI</span>
      </div>
      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-blue-400 to-purple-500 opacity-75 animate-pulse"></div>
    </div>
  )
}
