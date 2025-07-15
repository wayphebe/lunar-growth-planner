import React, { useState } from 'react';
import { format, addMonths, subMonths, isToday, isSameMonth, isSameDay } from 'date-fns';
import { useMoonCalendar } from '@/hooks/useMoonCalendar';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useProjects } from '@/hooks/useProjects';
import { useTarotRecords } from '@/hooks/useTarotRecords';
import { cn } from '@/lib/utils';
import type { MoonCalendarDay } from '@/lib/types';

export const MoonCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { calendarData, loading } = useMoonCalendar(
    currentDate.getFullYear(),
    currentDate.getMonth()
  );
  const { projects } = useProjects();
  const { tarotRecords } = useTarotRecords();

  const handlePreviousMonth = () => {
    setCurrentDate(prev => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => addMonths(prev, 1));
  };

  const getMoonPhaseEmoji = (phase: string) => {
    switch (phase) {
      case '新月': return '🌑';
      case '上弦月': return '🌓';
      case '满月': return '🌕';
      case '下弦月': return '🌗';
      default: return '🌙';
    }
  };

  const renderDay = (day: MoonCalendarDay) => {
    const dayProjects = projects.filter(p => 
      isSameDay(new Date(p.startDate), day.date)
    );
    const dayTarotRecords = tarotRecords.filter(r => 
      isSameDay(new Date(r.date), day.date)
    );

    return (
      <div 
        className={cn(
          "min-h-[120px] h-full p-3 border border-gray-200",
          "bg-white/60 shadow-sm",
          isToday(day.date) && "ring-2 ring-blue-200 ring-offset-2",
          !isSameMonth(day.date, currentDate) && "opacity-50 bg-gray-50/30",
          "hover:bg-white/80 hover:shadow-md transition-all duration-200"
        )}
      >
        <div className="flex items-start justify-between mb-2">
          <div className="flex flex-col">
            <span className={cn(
              "text-base",
              !isSameMonth(day.date, currentDate) && "text-gray-400"
            )}>
              {format(day.date, 'dd')}
            </span>
            <span className="text-xs text-gray-500">
              农历{format(day.date, 'MM.dd')}
            </span>
          </div>
          <span className="text-lg" title={`${day.moonPhase.name} (${Math.round(day.moonPhase.illumination * 100)}%)`}>
            {day.moonPhase.emoji}
          </span>
        </div>

        <div className="space-y-1 mt-2">
          {dayProjects.map(project => (
            <div
              key={project.id}
              className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-sm truncate hover:bg-blue-100 transition-colors cursor-pointer shadow-sm"
              title={project.title}
            >
              ⭐ {project.title}
            </div>
          ))}
          {dayTarotRecords.map(record => (
            <div
              key={record.id}
              className="text-xs px-2 py-1 bg-purple-50 text-purple-700 rounded-sm truncate hover:bg-purple-100 transition-colors cursor-pointer shadow-sm"
              title={record.question}
            >
              🎴 {record.question}
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="text-center py-8">加载中...</div>;
  }

  if (!calendarData?.days) {
    return <div className="text-center py-8">暂无数据</div>;
  }

  return (
    <div className="p-4">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-light">
          {format(currentDate, 'yyyy年MM月')}
        </h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePreviousMonth}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNextMonth}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 mb-2">
        {['日', '一', '二', '三', '四', '五', '六'].map(day => (
          <div key={day} className="text-center text-sm text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarData.days.map((day, index) => (
          <div key={index}>
            {renderDay(day)}
          </div>
        ))}
      </div>
    </div>
  );
}; 