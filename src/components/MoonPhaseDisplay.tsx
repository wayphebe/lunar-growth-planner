
import React from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Moon, Sparkles } from 'lucide-react';

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
  const getMoonVisual = (illumination: number) => {
    // 根据月相百分比创建视觉效果
    const rotation = (illumination / 100) * 360;
    return (
      <div className="relative w-32 h-32 mx-auto mb-4">
        <div className="w-full h-full rounded-full bg-gradient-to-r from-gray-600 to-gray-400 shadow-2xl"></div>
        <div 
          className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-200 to-yellow-400 shadow-inner"
          style={{
            clipPath: `polygon(50% 0%, ${50 + illumination/2}% 0%, ${50 + illumination/2}% 100%, 50% 100%)`
          }}
        ></div>
        <div className="absolute inset-0 rounded-full shadow-inner border border-white/20"></div>
      </div>
    );
  };

  if (!currentPhase) {
    return (
      <Card className="bg-white/10 backdrop-blur-md border-white/20 p-8 text-center">
        <div className="animate-pulse">
          <div className="w-32 h-32 bg-white/20 rounded-full mx-auto mb-4"></div>
          <div className="h-4 bg-white/20 rounded w-24 mx-auto"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-white/10 backdrop-blur-md border-white/20 p-8 text-center hover:bg-white/15 transition-all duration-300 cursor-pointer group"
          onClick={onClick}>
      <div className="group-hover:scale-105 transition-transform duration-300">
        {getMoonVisual(currentPhase.illumination)}
        
        <div className="space-y-4">
          <div>
            <Badge variant="secondary" className="bg-purple-600/80 text-white text-lg px-4 py-2 mb-2">
              {currentPhase.emoji} {currentPhase.name}
            </Badge>
            <p className="text-white text-2xl font-bold">
              {Math.round(currentPhase.illumination)}% 照明
            </p>
          </div>

          {nextSignificantPhase && (
            <div className="border-t border-white/20 pt-4">
              <p className="text-purple-200 text-sm mb-2">下一个重要月相</p>
              <div className="flex items-center justify-center space-x-2">
                <span className="text-xl">{nextSignificantPhase.emoji}</span>
                <span className="text-white font-medium">{nextSignificantPhase.name}</span>
              </div>
              {nextSignificantPhase.nextDate && (
                <p className="text-purple-300 text-sm mt-1">
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

          <div className="flex items-center justify-center space-x-2 text-purple-300 text-sm group-hover:text-purple-200 transition-colors">
            <Sparkles className="h-4 w-4" />
            <span>点击进行塔罗占卜</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
