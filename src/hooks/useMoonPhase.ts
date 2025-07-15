
import { useState, useEffect } from 'react';

interface MoonPhase {
  name: string;
  illumination: number;
  emoji: string;
  nextDate?: Date;
}

// 定义月相常量
const MOON_PHASES = {
  NEW_MOON: { name: '新月', emoji: '🌑' },
  WAXING_CRESCENT: { name: '峨眉月', emoji: '🌒' },
  FIRST_QUARTER: { name: '上弦月', emoji: '🌓' },
  WAXING_GIBBOUS: { name: '盈凸月', emoji: '🌔' },
  FULL_MOON: { name: '满月', emoji: '🌕' },
  WANING_GIBBOUS: { name: '亏凸月', emoji: '🌖' },
  LAST_QUARTER: { name: '下弦月', emoji: '🌗' },
  WANING_CRESCENT: { name: '残月', emoji: '🌘' }
} as const;

export const useMoonPhase = () => {
  const [currentPhase, setCurrentPhase] = useState<MoonPhase | null>(null);
  const [nextSignificantPhase, setNextSignificantPhase] = useState<MoonPhase | null>(null);

  useEffect(() => {
    const calculateMoonPhase = () => {
      const now = new Date();
      
      // 简化的月相计算（实际应用中可以使用更精确的天文计算库）
      const daysSinceNewMoon = Math.floor((now.getTime() - new Date('2024-01-11').getTime()) / (1000 * 60 * 60 * 24)) % 29.5;
      
      let phase: MoonPhase;
      let nextPhase: MoonPhase;
      
      if (daysSinceNewMoon < 1) {
        phase = { ...MOON_PHASES.NEW_MOON, illumination: 0 };
        nextPhase = { ...MOON_PHASES.FIRST_QUARTER, illumination: 50, nextDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) };
      } else if (daysSinceNewMoon < 7) {
        phase = { ...MOON_PHASES.WAXING_CRESCENT, illumination: (daysSinceNewMoon / 7) * 50 };
        nextPhase = { ...MOON_PHASES.FIRST_QUARTER, illumination: 50, nextDate: new Date(now.getTime() + (7 - daysSinceNewMoon) * 24 * 60 * 60 * 1000) };
      } else if (daysSinceNewMoon < 8) {
        phase = { ...MOON_PHASES.FIRST_QUARTER, illumination: 50 };
        nextPhase = { ...MOON_PHASES.FULL_MOON, illumination: 100, nextDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) };
      } else if (daysSinceNewMoon < 14) {
        phase = { ...MOON_PHASES.WAXING_GIBBOUS, illumination: 50 + ((daysSinceNewMoon - 7) / 7) * 50 };
        nextPhase = { ...MOON_PHASES.FULL_MOON, illumination: 100, nextDate: new Date(now.getTime() + (14 - daysSinceNewMoon) * 24 * 60 * 60 * 1000) };
      } else if (daysSinceNewMoon < 15) {
        phase = { ...MOON_PHASES.FULL_MOON, illumination: 100 };
        nextPhase = { ...MOON_PHASES.LAST_QUARTER, illumination: 50, nextDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) };
      } else if (daysSinceNewMoon < 21) {
        phase = { ...MOON_PHASES.WANING_GIBBOUS, illumination: 100 - ((daysSinceNewMoon - 14) / 7) * 50 };
        nextPhase = { ...MOON_PHASES.LAST_QUARTER, illumination: 50, nextDate: new Date(now.getTime() + (21 - daysSinceNewMoon) * 24 * 60 * 60 * 1000) };
      } else if (daysSinceNewMoon < 22) {
        phase = { ...MOON_PHASES.LAST_QUARTER, illumination: 50 };
        nextPhase = { ...MOON_PHASES.NEW_MOON, illumination: 0, nextDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) };
      } else {
        phase = { ...MOON_PHASES.WANING_CRESCENT, illumination: 50 - ((daysSinceNewMoon - 21) / 8) * 50 };
        nextPhase = { ...MOON_PHASES.NEW_MOON, illumination: 0, nextDate: new Date(now.getTime() + (29.5 - daysSinceNewMoon) * 24 * 60 * 60 * 1000) };
      }
      
      setCurrentPhase(phase);
      setNextSignificantPhase(nextPhase);
    };

    calculateMoonPhase();
    const interval = setInterval(calculateMoonPhase, 60000); // 每分钟更新一次

    return () => clearInterval(interval);
  }, []);

  return { currentPhase, nextSignificantPhase };
};
