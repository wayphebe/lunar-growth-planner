
import React from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Sparkles } from 'lucide-react';

interface MoonPhase {
  name: string;
  illumination: number;
  emoji: string;
  nextDate?: Date;
}

interface MoonPhaseDisplayProps {
  currentPhase: MoonPhase | null;
  nextSignificantPhase: MoonPhase | null;
  onClick: () => void;
}

export const MoonPhaseDisplay: React.FC<MoonPhaseDisplayProps> = ({
  currentPhase,
  nextSignificantPhase,
  onClick
}) => {
  if (!currentPhase) {
    return (
      <Card className="bg-card/80 backdrop-blur-sm border-border/50 p-8 text-center">
        <div className="animate-pulse">
          <div className="w-32 h-32 bg-muted/50 rounded-full mx-auto mb-4"></div>
          <div className="h-4 bg-muted/50 rounded w-24 mx-auto"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card 
      className="bg-card/80 backdrop-blur-sm border-border/50 p-8 text-center hover:bg-card/90 transition-all duration-500 cursor-pointer group"
      onClick={onClick}
    >
      <div className="group-hover:scale-102 transition-transform duration-500">
        {/* 月相emoji显示 */}
        <div className="text-8xl mb-6 leading-none select-none filter drop-shadow-lg">
          {currentPhase.emoji}
        </div>
        
        <div className="space-y-6">
          <div>
            <Badge 
              variant="secondary" 
              className="bg-secondary/50 text-secondary-foreground text-lg px-6 py-2 mb-3 font-light tracking-wide"
            >
              {currentPhase.name}
            </Badge>
            <p className="text-foreground/80 text-2xl font-extralight tracking-wider">
              {Math.round(currentPhase.illumination)}% 照明
            </p>
          </div>

          {nextSignificantPhase && (
            <div className="border-t border-border/30 pt-6">
              <p className="text-muted-foreground text-sm mb-3 font-light">下一个重要月相</p>
              <div className="flex items-center justify-center space-x-3">
                <span className="text-4xl select-none filter drop-shadow-sm">
                  {nextSignificantPhase.emoji}
                </span>
                <span className="text-foreground/70 font-extralight tracking-wide">
                  {nextSignificantPhase.name}
                </span>
              </div>
              {nextSignificantPhase.nextDate && (
                <p className="text-muted-foreground text-sm mt-2 font-light tracking-wide">
                  {nextSignificantPhase.nextDate.toLocaleDateString('zh-CN', {
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              )}
            </div>
          )}

          <div className="flex items-center justify-center space-x-2 text-muted-foreground/80 text-sm group-hover:text-muted-foreground transition-colors duration-500">
            <Sparkles className="h-4 w-4" />
            <span className="font-light tracking-wide">点击进行塔罗占卜</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
