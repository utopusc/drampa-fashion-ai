"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export interface VerticalMenuBarItem {
  icon: (props: React.SVGProps<SVGSVGElement>) => React.JSX.Element
  label: string
  onClick?: () => void
  isActive?: boolean
}

interface VerticalMenuBarProps extends React.HTMLAttributes<HTMLDivElement> {
  items: VerticalMenuBarItem[]
  currentActiveIndex?: number
  onItemClick?: (index: number, item: VerticalMenuBarItem) => void
}

const springConfig = {
  duration: 0.3,
  ease: "easeInOut" as const
}

export function VerticalMenuBar({ 
  items, 
  className, 
  currentActiveIndex,
  onItemClick,
  ...props 
}: VerticalMenuBarProps) {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null)
  const [activeIndex, setActiveIndex] = React.useState<number | null>(currentActiveIndex ?? null)
  const menuRef = React.useRef<HTMLDivElement>(null)
  const [tooltipPosition, setTooltipPosition] = React.useState({ top: 0, height: 0 })
  const tooltipRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (currentActiveIndex !== undefined) {
      setActiveIndex(currentActiveIndex)
    }
  }, [currentActiveIndex])

  React.useEffect(() => {
    if (hoveredIndex !== null && menuRef.current && tooltipRef.current) {
      const menuContainer = menuRef.current.querySelector('[data-menu-container]')
      if (!menuContainer) return
      
      const menuItem = menuContainer.children[hoveredIndex] as HTMLElement
      if (!menuItem) return
      
      const menuRect = menuRef.current.getBoundingClientRect()
      const itemRect = menuItem.getBoundingClientRect()
      const tooltipRect = tooltipRef.current.getBoundingClientRect()
    
      const top = itemRect.top - menuRect.top + (itemRect.height - tooltipRect.height) / 2
    
      setTooltipPosition({
        top: Math.max(0, Math.min(top, menuRect.height - tooltipRect.height)),
        height: tooltipRect.height
      })
    }
  }, [hoveredIndex])

  const handleItemClick = (index: number, item: VerticalMenuBarItem) => {
    setActiveIndex(index)
    if (item.onClick) {
      item.onClick()
    }
    if (onItemClick) {
      onItemClick(index, item)
    }
  }

  return (
    <div 
      ref={menuRef}
      className={cn("relative", className)} 
      {...props}
    >
      <AnimatePresence>
        {hoveredIndex !== null && (
          <motion.div
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -5 }}
            transition={springConfig}
            className="absolute left-[calc(100%+12px)] pointer-events-none z-50"
            style={{ top: tooltipPosition.top }}
          >
            <motion.div
              ref={tooltipRef}
              className={cn(
                "h-8 px-3 rounded-lg inline-flex justify-center items-center overflow-hidden",
                "bg-background/95 backdrop-blur",
                "border border-border/50",
                "shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_4px_8px_-2px_rgba(0,0,0,0.1)]",
                "dark:border-border/50 dark:shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_4px_8px_-2px_rgba(0,0,0,0.2)]"
              )}
              style={{ width: "auto" }}
            >
              <p className="text-[13px] font-medium leading-tight whitespace-nowrap">
                {items[hoveredIndex].label}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div 
        data-menu-container
        className={cn(
          "w-16 px-2 py-3 inline-flex flex-col justify-start items-center gap-2 overflow-hidden z-10 relative",
          "rounded-full bg-white/95 backdrop-blur-xl",
          "border border-gray-200/50",
          "shadow-[0_0_0_1px_rgba(0,0,0,0.04),0_12px_24px_-4px_rgba(0,0,0,0.08)]",
          "dark:bg-gray-900/95 dark:border-gray-800/50 dark:shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_12px_24px_-4px_rgba(0,0,0,0.3)]"
        )}
      >
        {/* Active indicator */}
        {activeIndex !== null && activeIndex >= 0 && (
          <motion.div
            className="absolute w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg shadow-orange-500/25"
            animate={{
              y: activeIndex * 56, // 48px height + 8px gap = 56px per item
            }}
            transition={{
              type: "spring",
              stiffness: 380,
              damping: 30,
            }}
          />
        )}
        {items.map((item, index) => (
          <motion.button
            key={index}
            className={cn(
              "w-12 h-12 rounded-full flex justify-center items-center transition-all duration-200 relative z-10",
              "hover:bg-orange-100 hover:text-orange-600",
              activeIndex === index ? "text-white" : "text-gray-600 hover:text-orange-600"
            )}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => handleItemClick(index, item)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <div className="flex justify-center items-center">
              <div className="w-6 h-6 flex justify-center items-center overflow-hidden">
                <item.icon className="w-full h-full" />
              </div>
            </div>
            <span className="sr-only">{item.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  )
}