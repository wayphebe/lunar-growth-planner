
import React from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Sparkles } from 'lucide-react';
import { useMoonPhase } from '@/hooks/useMoonPhase';

export const MoonPhaseDisplay: React.FC = () => {
  const { currentPhase, nextSignificantPhase } = useMoonPhase();

  if (!currentPhase || !nextSignificantPhase) {
    return null;
  }

  return (
    <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/30">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-light tracking-wide text-foreground/90">
            当前月相
          </h2>
          <p className="text-foreground/70 text-sm mt-1">
            跟随月亮的节律，规划你的项目
          </p>
        </div>
        <Button variant="outline" size="icon">
          <Sparkles className="h-5 w-5" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 当前月相 */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">{currentPhase.emoji}</span>
            <div>
              <h3 className="text-xl font-medium">{currentPhase.name}</h3>
              <p className="text-sm text-foreground/70">
                月相能量: {Math.round(currentPhase.illumination)}%
              </p>
            </div>
          </div>
          <p className="text-sm text-foreground/70 mt-2">
            {currentPhase.name === '新月' && "新月是播种新想法的完美时机。"}
            {currentPhase.name === '满月' && "满月是收获与反思的时刻。"}
            {currentPhase.name === '上弦月' && "上弦月时要保持行动力。"}
            {currentPhase.name === '下弦月' && "下弦月是释放和清理的时期。"}
          </p>
        </div>

        {/* 下一个重要月相 */}
        <div>
          <h3 className="text-lg font-medium mb-2">下一个重要月相</h3>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{nextSignificantPhase.emoji}</span>
            <div>
              <p className="font-medium">{nextSignificantPhase.name}</p>
              <p className="text-sm text-foreground/70">
                {nextSignificantPhase.nextDate &&
                  `将在 ${nextSignificantPhase.nextDate.toLocaleDateString()} 到来`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
