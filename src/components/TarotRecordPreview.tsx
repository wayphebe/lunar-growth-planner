
import React from 'react';
import { useTarotRecords } from '@/hooks/useTarotRecords';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Calendar, Moon } from 'lucide-react';
import { format } from 'date-fns';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export const TarotRecordPreview: React.FC = () => {
  const { tarotRecords } = useTarotRecords();
  const recentRecords = tarotRecords.slice(0, 5); // 只显示最近5条记录

  if (!recentRecords.length) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-foreground/5 backdrop-blur-sm flex items-center justify-center">
          <Sparkles className="w-8 h-8 text-foreground/30" />
        </div>
        <p className="text-foreground/70 font-light">还没有塔罗记录</p>
        <p className="text-sm text-foreground/50 mt-2">点击"塔罗记录"开始你的占卜之旅</p>
      </div>
    );
  }

  const getMoonPhaseEmoji = (phase: string) => {
    switch (phase) {
      case '新月': return '🌑';
      case '上弦月': return '🌓';
      case '满月': return '🌕';
      case '下弦月': return '🌗';
      default: return '🌙';
    }
  };

  return (
    <div className="space-y-4">
      {recentRecords.map(record => (
        <HoverCard key={record.id}>
          <HoverCardTrigger asChild>
            <div className="group bg-background/30 backdrop-blur-sm rounded-lg border border-border/10 p-4 hover:bg-background/40 transition-all duration-200 cursor-pointer">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-foreground/10 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-foreground/70" />
                </div>

                <div className="flex-grow space-y-2">
                  <div className="flex items-center gap-2 text-sm text-foreground/70">
                    <Calendar className="h-4 w-4" />
                    <span>{format(record.date, 'MM/dd HH:mm')}</span>
                    <span className="w-1 h-1 rounded-full bg-foreground/30" />
                    <Moon className="h-4 w-4" />
                    <span>{record.moonPhase}</span>
                    <span className="text-lg filter drop-shadow-sm">
                      {getMoonPhaseEmoji(record.moonPhase)}
                    </span>
                  </div>

                  <h3 className="font-light text-lg group-hover:text-foreground/90 transition-colors">
                    {record.question}
                  </h3>

                  <div className="flex flex-wrap gap-2">
                    {record.cards.map((card, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="bg-background/20 border-border/20 font-light"
                      >
                        {card}
                      </Badge>
                    ))}
                  </div>

                  <p className="text-sm text-foreground/70 line-clamp-2">
                    {record.interpretation}
                  </p>
                </div>
              </div>
            </div>
          </HoverCardTrigger>
          <HoverCardContent 
            className="w-80 bg-background/95 backdrop-blur-xl border-border/20"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-foreground/70">
                <Calendar className="h-4 w-4" />
                <span>{format(record.date, 'yyyy年MM月dd日 HH:mm')}</span>
              </div>
              <h4 className="font-medium">{record.question}</h4>
              <div className="flex flex-wrap gap-2">
                {record.cards.map((card, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="bg-background/20 border-border/20 font-light"
                  >
                    {card}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-foreground/70 mt-2">
                {record.interpretation}
              </p>
            </div>
          </HoverCardContent>
        </HoverCard>
      ))}
    </div>
  );
};
