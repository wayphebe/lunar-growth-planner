import React, { useState } from 'react';
import { format, addMonths, subMonths } from 'date-fns';
import { useMoonCalendar } from '@/hooks/useMoonCalendar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Loader2
} from 'lucide-react';

export const MoonCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { calendarData, loading, error } = useMoonCalendar(
    currentDate.getFullYear(),
    currentDate.getMonth()
  );

  const handlePreviousMonth = () => {
    setCurrentDate(prev => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => addMonths(prev, 1));
  };

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        发生错误: {error}
      </div>
    );
  }

  return (
    <Card className="p-4">
      {/* 日历头部 */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePreviousMonth}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          <h2 className="text-lg font-semibold">
            {format(currentDate, 'yyyy年MM月')}
          </h2>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={handleNextMonth}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* 星期标题 */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['日', '一', '二', '三', '四', '五', '六'].map(day => (
          <div
            key={day}
            className="text-center text-sm font-medium text-gray-500 p-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* 日历格子 */}
      {loading ? (
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 35 }).map((_, i) => (
            <Skeleton
              key={i}
              className="aspect-square rounded-lg"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-7 gap-1">
          {calendarData?.days.map((day, index) => (
            <div
              key={index}
              className={`
                p-2 border rounded-lg min-h-[100px]
                ${day.date.toDateString() === new Date().toDateString()
                  ? 'border-primary'
                  : 'border-border'
                }
              `}
            >
              <div className="flex flex-col h-full">
                {/* 日期和月相 */}
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">
                    {format(day.date, 'd')}
                  </span>
                  <span title={day.moonPhase.name}>
                    {day.moonPhase.emoji}
                  </span>
                </div>

                {/* 月相百分比 */}
                <div className="text-xs text-gray-500 mb-2">
                  {Math.round(day.moonPhase.illumination)}%
                </div>

                {/* 项目和塔罗标记 */}
                <div className="flex flex-wrap gap-1">
                  {day.projects.length > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {day.projects.length} 个项目
                    </Badge>
                  )}
                  {day.tarotRecords.length > 0 && (
                    <Badge variant="outline" className="text-xs">
                      {day.tarotRecords.length} 个塔罗
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}; 