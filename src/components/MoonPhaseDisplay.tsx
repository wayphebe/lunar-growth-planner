
import React from 'react';
import { ChevronLeft, ChevronRight, Moon, Info } from 'lucide-react';
import { useMoonPhase } from '@/hooks/useMoonPhase';
import { Button } from './ui/button';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "./ui/hover-card";

export const MoonPhaseDisplay: React.FC = () => {
  const { currentPhase, nextSignificantPhase } = useMoonPhase();

  if (!currentPhase || !nextSignificantPhase) {
    return null;
  }

  const getMoonPhaseAdvice = (phaseName: string) => {
    switch (phaseName) {
      case '新月':
        return '新月是开始新项目和设定新目标的理想时机。这是一个充满可能性的时刻。';
      case '上弦月':
        return '上弦月是行动和突破的时刻。适合克服障碍，推进项目。';
      case '满月':
        return '满月是收获和庆祝的时刻。适合回顾进展，完成项目，进行反思。';
      case '下弦月':
        return '下弦月是释放和净化的时刻。适合放下不再需要的事物，为新的周期做准备。';
      default:
        return '关注月相变化，调整你的节奏。';
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      {/* Current Phase */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-foreground/10 backdrop-blur-sm flex items-center justify-center">
            <span className="text-3xl filter drop-shadow-lg">{currentPhase.emoji}</span>
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-foreground/5 backdrop-blur-sm flex items-center justify-center">
            <Moon className="w-4 h-4 text-foreground/70" />
          </div>
        </div>
        
        <div className="space-y-1">
          <h2 className="text-xl font-light tracking-wide">
            {currentPhase.name}
          </h2>
          <div className="flex items-center gap-2 text-sm text-foreground/70">
            <span>月相能量: {Math.round(currentPhase.illumination * 100)}%</span>
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button variant="ghost" size="icon" className="w-6 h-6">
                  <Info className="w-4 h-4" />
                </Button>
              </HoverCardTrigger>
              <HoverCardContent 
                className="w-80 bg-background/95 backdrop-blur-xl border-border/20"
              >
                <p className="text-sm text-foreground/70">
                  {getMoonPhaseAdvice(currentPhase.name)}
                </p>
              </HoverCardContent>
            </HoverCard>
          </div>
        </div>
      </div>

      {/* Next Significant Phase */}
      <div className="flex items-center gap-4 bg-foreground/5 backdrop-blur-sm rounded-lg p-3">
        <div className="space-y-1">
          <div className="text-sm text-foreground/70">下一个重要月相</div>
          <div className="flex items-center gap-2">
            <span className="text-xl">{nextSignificantPhase.emoji}</span>
            <span className="font-light">{nextSignificantPhase.name}</span>
            <span className="text-sm text-foreground/50">
              {nextSignificantPhase.nextDate?.toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon"
            className="hover:bg-foreground/10"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            className="hover:bg-foreground/10"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
