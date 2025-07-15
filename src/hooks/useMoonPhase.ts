
import { useState, useEffect } from 'react';

interface MoonPhase {
  name: string;
  illumination: number;
  emoji: string;
  nextDate?: Date;
}

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
        phase = { name: '新月', illumination: 0, emoji: '🌑' };
        nextPhase = { name: '上弦月', illumination: 50, emoji: '🌓', nextDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) };
      } else if (daysSinceNewMoon < 7) {
        phase = { name: '峨眉月', illumination: (daysSinceNewMoon / 7) * 50, emoji: '🌒' };
        nextPhase = { name: '上弦月', illumination: 50, emoji: '🌓', nextDate: new Date(now.getTime() + (7 - daysSinceNewMoon) * 24 * 60 * 60 * 1000) };
      } else if (daysSinceNewMoon < 8) {
        phase = { name: '上弦月', illumination: 50, emoji: '🌓' };
        nextPhase = { name: '满月', illumination: 100, emoji: '🌕', nextDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) };
      } else if (daysSinceNewMoon < 14) {
        phase = { name: '盈凸月', illumination: 50 + ((daysSinceNewMoon - 7) / 7) * 50, emoji: '🌔' };
        nextPhase = { name: '满月', illumination: 100, emoji: '🌕', nextDate: new Date(now.getTime() + (14 - daysSinceNewMoon) * 24 * 60 * 60 * 1000) };
      } else if (daysSinceNewMoon < 15) {
        phase = { name: '满月', illumination: 100, emoji: '🌕' };
        nextPhase = { name: '下弦月', illumination: 50, emoji: '🌗', nextDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) };
      } else if (daysSinceNewMoon < 21) {
        phase = { name: '亏凸月', illumination: 100 - ((daysSinceNewMoon - 14) / 7) * 50, emoji: '🌖' };
        nextPhase = { name: '下弦月', illumination: 50, emoji: '🌗', nextDate: new Date(now.getTime() + (21 - daysSinceNewMoon) * 24 * 60 * 60 * 1000) };
      } else if (daysSinceNewMoon < 22) {
        phase = { name: '下弦月', illumination: 50, emoji: '🌗' };
        nextPhase = { name: '新月', illumination: 0, emoji: '🌑', nextDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) };
      } else {
        phase = { name: '残月', illumination: 50 - ((daysSinceNewMoon - 21) / 8) * 50, emoji: '🌘' };
        nextPhase = { name: '新月', illumination: 0, emoji: '🌑', nextDate: new Date(now.getTime() + (29.5 - daysSinceNewMoon) * 24 * 60 * 60 * 1000) };
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
