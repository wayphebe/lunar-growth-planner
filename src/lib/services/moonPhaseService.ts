import { Moon } from 'lunarphase-js';
import { startOfMonth, endOfMonth, eachDayOfInterval, format } from 'date-fns';
import type { MoonPhase, MoonCalendarMonth, MoonCalendarDay } from '../types';
import { MOON_PHASES } from '../constants';

class MoonPhaseService {
  private static instance: MoonPhaseService;

  private constructor() {}

  public static getInstance(): MoonPhaseService {
    if (!MoonPhaseService.instance) {
      MoonPhaseService.instance = new MoonPhaseService();
    }
    return MoonPhaseService.instance;
  }

  // 计算指定日期的月相
  public calculateMoonPhase(date: Date): MoonPhase {
    const phase = Moon.lunarPhase(date);
    const illumination = Moon.lunarAgePercent(date) * 100;
    const emoji = Moon.lunarPhaseEmoji(date);
    
    // 根据月相名称确定月相类型
    let moonPhase: MoonPhase;
    switch (phase) {
      case 'NEW':
        moonPhase = { ...MOON_PHASES.NEW_MOON, illumination, emoji };
        break;
      case 'WAXING_CRESCENT':
        moonPhase = { ...MOON_PHASES.WAXING_CRESCENT, illumination, emoji };
        break;
      case 'FIRST_QUARTER':
        moonPhase = { ...MOON_PHASES.FIRST_QUARTER, illumination, emoji };
        break;
      case 'WAXING_GIBBOUS':
        moonPhase = { ...MOON_PHASES.WAXING_GIBBOUS, illumination, emoji };
        break;
      case 'FULL':
        moonPhase = { ...MOON_PHASES.FULL_MOON, illumination, emoji };
        break;
      case 'WANING_GIBBOUS':
        moonPhase = { ...MOON_PHASES.WANING_GIBBOUS, illumination, emoji };
        break;
      case 'LAST_QUARTER':
        moonPhase = { ...MOON_PHASES.LAST_QUARTER, illumination, emoji };
        break;
      case 'WANING_CRESCENT':
        moonPhase = { ...MOON_PHASES.WANING_CRESCENT, illumination, emoji };
        break;
      default:
        moonPhase = { ...MOON_PHASES.NEW_MOON, illumination, emoji };
    }

    // 计算下一个重要月相的日期
    const nextPhaseDate = this.getNextPhaseDate(date);
    if (nextPhaseDate) {
      moonPhase.nextDate = nextPhaseDate;
    }

    return moonPhase;
  }

  // 获取指定月份的月相日历数据
  public async getMonthCalendar(year: number, month: number): Promise<MoonCalendarMonth> {
    const startDate = startOfMonth(new Date(year, month));
    const endDate = endOfMonth(startDate);
    
    // 获取月份中的所有日期
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    
    // 计算每一天的月相
    const calendarDays: MoonCalendarDay[] = await Promise.all(
      days.map(async (date) => {
        const moonPhase = this.calculateMoonPhase(date);
        
        // 从本地存储获取关联的项目和塔罗记录
        const dayKey = format(date, 'yyyy-MM-dd');
        const storedData = localStorage.getItem(`moonDay_${dayKey}`);
        const { projects = [], tarotRecords = [] } = storedData ? JSON.parse(storedData) : {};
        
        return {
          date,
          moonPhase,
          projects,
          tarotRecords
        };
      })
    );

    return {
      year,
      month,
      days: calendarDays
    };
  }

  // 保存日期关联数据
  public saveDayAssociations(date: Date, projects: string[], tarotRecords: string[]) {
    const dayKey = format(date, 'yyyy-MM-dd');
    localStorage.setItem(`moonDay_${dayKey}`, JSON.stringify({ projects, tarotRecords }));
  }

  // 获取下一个特定月相的日期
  private getNextPhaseDate(currentDate: Date): Date | undefined {
    // 计算未来30天内的月相
    let checkDate = new Date(currentDate);
    let daysToCheck = 30;
    
    while (daysToCheck > 0) {
      checkDate.setDate(checkDate.getDate() + 1);
      const phase = Moon.lunarPhase(checkDate);
      
      // 只关注主要月相（新月、满月、上弦月、下弦月）
      if (['NEW', 'FULL', 'FIRST_QUARTER', 'LAST_QUARTER'].includes(phase)) {
        return checkDate;
      }
      
      daysToCheck--;
    }
    
    return undefined;
  }

  // 缓存未来3个月的月相数据
  public async cacheNextThreeMonths() {
    const currentDate = new Date();
    const months = [];
    
    for (let i = 0; i < 3; i++) {
      const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + i);
      const monthData = await this.getMonthCalendar(targetDate.getFullYear(), targetDate.getMonth());
      months.push(monthData);
      
      // 存储到本地缓存
      localStorage.setItem(
        `moonCalendar_${monthData.year}_${monthData.month}`,
        JSON.stringify(monthData)
      );
    }
    
    return months;
  }
}

export const moonPhaseService = MoonPhaseService.getInstance(); 