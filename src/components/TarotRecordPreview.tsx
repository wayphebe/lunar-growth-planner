
import React from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Sparkles, Plus } from 'lucide-react';
import { useTarotRecords } from '@/hooks/useTarotRecords';
import { format } from 'date-fns';

export const TarotRecordPreview: React.FC = () => {
  const { tarotRecords } = useTarotRecords();

  // 只显示最近的3条记录
  const recentRecords = tarotRecords.slice(0, 3);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">塔罗记录</h3>
          <p className="text-sm text-muted-foreground">
            共有 {tarotRecords.length} 条记录
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          新记录
        </Button>
      </div>

      <div className="grid gap-4">
        {recentRecords.map(record => (
          <Card key={record.id} className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(record.date), 'yyyy年MM月dd日')}
                  </span>
                  <Badge variant="outline">{record.moonPhase}</Badge>
                </div>
                <p className="font-medium">{record.question}</p>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex flex-wrap gap-2 mb-2">
                {record.cards.map((card, index) => (
                  <Badge key={index} variant="secondary">
                    {card}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                {record.interpretation}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
