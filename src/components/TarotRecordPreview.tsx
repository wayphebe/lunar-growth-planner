
import React from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Sparkles } from 'lucide-react';

interface TarotRecord {
  id: string;
  date: Date;
  moonPhase: string;
  question: string;
  cards: string[];
  interpretation: string;
  projectId?: string;
}

interface TarotRecordPreviewProps {
  records: TarotRecord[];
}

export const TarotRecordPreview: React.FC<TarotRecordPreviewProps> = ({ records = [] }) => {
  const getMoonPhaseEmoji = (phase: string) => {
    switch (phase) {
      case '新月': return '🌑';
      case '上弦月': return '🌓';
      case '满月': return '🌕';
      case '下弦月': return '🌗';
      default: return '🌙';
    }
  };

  if (records.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-card/60 backdrop-blur-sm flex items-center justify-center">
          <Sparkles className="h-12 w-12 text-foreground/40" />
        </div>
        <h3 className="text-xl font-light tracking-wide text-foreground/90 mb-2">暂无塔罗记录</h3>
        <p className="text-foreground/70 font-light">记录你的第一次塔罗占卜，获取宇宙的指引</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center space-x-3 mb-8">
        <Sparkles className="h-6 w-6 text-foreground/70" />
        <h2 className="text-2xl font-light tracking-wide text-foreground/90">塔罗记录</h2>
        <Badge variant="secondary" className="bg-secondary/20 text-secondary-foreground font-light">
          {records.length} 次占卜
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {records.map((record) => (
          <Card key={record.id} className="p-6 group">
            <div className="space-y-4">
              {/* 问题和月相 */}
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-xl filter drop-shadow-sm">{getMoonPhaseEmoji(record.moonPhase)}</span>
                  <span className="text-foreground/60 text-sm font-light">{record.moonPhase}</span>
                </div>
                <h3 className="text-lg font-light tracking-wide text-foreground/90 line-clamp-2">
                  {record.question}
                </h3>
              </div>

              {/* 卡牌展示 */}
              <div className="flex flex-wrap gap-2">
                {record.cards.map((card, index) => (
                  <Badge 
                    key={index}
                    variant="outline" 
                    className="bg-card/60 text-foreground/70 border-border/30 font-light"
                  >
                    {card}
                  </Badge>
                ))}
              </div>

              {/* 解读预览 */}
              <p className="text-sm text-foreground/70 line-clamp-3 font-light">
                {record.interpretation}
              </p>

              {/* 日期信息 */}
              <div className="text-sm text-foreground/60 font-light">
                {record.date.toLocaleDateString('zh-CN', {
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
