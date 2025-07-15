// 月相相关的类型定义

// 月相基本信息
export interface MoonPhase {
  name: string;
  illumination: number;
  emoji: string;
  nextDate?: Date;
}

// 月相日历数据结构
export interface MoonCalendarDay {
  date: Date;
  moonPhase: MoonPhase;
  projects: string[];  // 项目ID列表
  tarotRecords: string[];  // 塔罗记录ID列表
}

// 月相日历月份数据
export interface MoonCalendarMonth {
  year: number;
  month: number;  // 0-11
  days: MoonCalendarDay[];
}

// 月相提醒设置
export interface MoonPhaseAlert {
  id: string;
  userId: string;
  phaseType: string;  // 'NEW_MOON' | 'FULL_MOON' | 'FIRST_QUARTER' | 'LAST_QUARTER'
  notifyBefore: number;  // 提前通知的小时数
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// 月相分析数据
export interface MoonPhaseAnalytics {
  userId: string;
  period: {
    start: Date;
    end: Date;
  };
  projectStats: {
    phaseType: string;
    projectCount: number;
    completionRate: number;
  }[];
  tarotStats: {
    phaseType: string;
    recordCount: number;
  }[];
  createdAt: Date;
  updatedAt: Date;
} 