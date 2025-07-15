import { useState, useEffect } from 'react';
import type { MoonCalendarMonth } from '@/lib/types';
import { moonPhaseService } from '@/lib/services/moonPhaseService';
import { STORAGE_KEYS } from '@/lib/constants';

export const useMoonCalendar = (year: number, month: number) => {
  const [calendarData, setCalendarData] = useState<MoonCalendarMonth | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCalendarData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 尝试从缓存获取数据
        const cacheKey = `${STORAGE_KEYS.MOON_CALENDAR}${year}_${month}`;
        const cachedData = localStorage.getItem(cacheKey);
        
        if (cachedData) {
          const parsed = JSON.parse(cachedData);
          // 转换日期字符串回 Date 对象
          const dataWithDates = {
            ...parsed,
            days: parsed.days.map((day: any) => ({
              ...day,
              date: new Date(day.date)
            }))
          };
          setCalendarData(dataWithDates);
          setLoading(false);
          return;
        }

        // 如果没有缓存数据，从服务获取
        const data = await moonPhaseService.getMonthCalendar(year, month);
        setCalendarData(data);

        // 缓存数据
        localStorage.setItem(cacheKey, JSON.stringify(data));
      } catch (err) {
        setError(err instanceof Error ? err.message : '获取月相数据失败');
      } finally {
        setLoading(false);
      }
    };

    fetchCalendarData();
  }, [year, month]);

  // 更新日期关联数据
  const updateDayAssociations = (
    date: Date,
    projects: string[],
    tarotRecords: string[]
  ) => {
    if (!calendarData) return;

    // 更新服务中的数据
    moonPhaseService.saveDayAssociations(date, projects, tarotRecords);

    // 更新本地状态
    const updatedDays = calendarData.days.map(day => {
      if (day.date.toDateString() === date.toDateString()) {
        return {
          ...day,
          projects,
          tarotRecords
        };
      }
      return day;
    });

    const updatedCalendarData = {
      ...calendarData,
      days: updatedDays
    };

    setCalendarData(updatedCalendarData);

    // 更新缓存
    const cacheKey = `${STORAGE_KEYS.MOON_CALENDAR}${year}_${month}`;
    localStorage.setItem(cacheKey, JSON.stringify(updatedCalendarData));
  };

  return {
    calendarData,
    loading,
    error,
    updateDayAssociations
  };
}; 