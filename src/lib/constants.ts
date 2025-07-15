import type { MoonPhase } from './types';

// 定义月相常量
export const MOON_PHASES: Record<string, Omit<MoonPhase, 'illumination' | 'nextDate'>> = {
  NEW_MOON: { name: '新月', emoji: '🌑' },
  WAXING_CRESCENT: { name: '峨眉月', emoji: '🌒' },
  FIRST_QUARTER: { name: '上弦月', emoji: '🌓' },
  WAXING_GIBBOUS: { name: '盈凸月', emoji: '🌔' },
  FULL_MOON: { name: '满月', emoji: '🌕' },
  WANING_GIBBOUS: { name: '亏凸月', emoji: '🌖' },
  LAST_QUARTER: { name: '下弦月', emoji: '🌗' },
  WANING_CRESCENT: { name: '残月', emoji: '🌘' }
} as const;

// 月相提醒类型
export const MOON_PHASE_TYPES = {
  NEW_MOON: 'NEW_MOON',
  FULL_MOON: 'FULL_MOON',
  FIRST_QUARTER: 'FIRST_QUARTER',
  LAST_QUARTER: 'LAST_QUARTER'
} as const;

// 本地存储键前缀
export const STORAGE_KEYS = {
  MOON_DAY: 'moonDay_',
  MOON_CALENDAR: 'moonCalendar_'
} as const; 