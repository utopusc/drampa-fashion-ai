declare module '@/components/ui/meteors' {
  export interface MeteorsProps {
    number?: number;
    className?: string;
  }
  
  export const Meteors: React.FC<MeteorsProps>;
}

declare module '@/components/ui/animated-gradient-text' {
  export interface AnimatedGradientTextProps {
    children: React.ReactNode;
    gradientColors?: string[];
    className?: string;
    duration?: number;
  }
  
  export const AnimatedGradientText: React.FC<AnimatedGradientTextProps>;
}

declare module '@/components/ui/flickering-grid' {
  export interface FlickeringGridProps extends React.HTMLAttributes<HTMLDivElement> {
    squareSize?: number;
    gridGap?: number;
    flickerChance?: number;
    color?: string;
    width?: number;
    height?: number;
    className?: string;
    maxOpacity?: number;
    text?: string;
    textColor?: string;
    fontSize?: number;
    fontWeight?: number | string;
  }
  
  export const FlickeringGrid: React.FC<FlickeringGridProps>;
} 