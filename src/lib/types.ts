// 月相相关的类型定义

// 月相基本信息
export interface MoonPhase {
  name: string;
  illumination: number;
  emoji: string;
  nextDate?: Date;
}

// 塔罗记录相关类型定义
export interface TarotRecord {
  id: string;
  date: Date;
  moonPhase: string;
  question: string;
  cards: string[];
  interpretation: string;
  projectId?: string;
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

// 客户端相关类型定义

// 客户档案
export interface ClientProfile {
  id: string;
  name: string;
  avatar?: string;
  email?: string;
  phone?: string;
  notes?: string;
  createdAt: Date;
  lastConsultation?: Date;
  totalConsultations: number;
  isActive: boolean;
}

// 专业塔罗记录
export interface ProfessionalTarotRecord extends TarotRecord {
  clientId: string;
  isForClient: boolean;
  consultationFee?: number;
  shareSettings: {
    isPublic: boolean;
    allowDownload: boolean;
    expiryDate?: Date;
    password?: string;
  };
  presentation: {
    theme: 'classic' | 'modern' | 'mystical';
    includeAdvice: boolean;
    includeNextSteps: boolean;
  };
  advice?: string;
  nextSteps?: string;
}

// 分享链接
export interface ShareLink {
  id: string;
  tarotRecordId: string;
  clientId: string;
  url: string;
  accessCode: string;
  views: number;
  lastViewed?: Date;
  isActive: boolean;
  expiresAt?: Date;
  createdAt: Date;
}

// 业务信息
export interface BusinessInfo {
  name: string;
  description?: string;
  website?: string;
  contact?: string;
  logo?: string;
}

// 分享设置
export interface ShareSettings {
  isPublic: boolean;
  allowDownload: boolean;
  expiryDate?: Date;
  password?: string;
  theme: 'classic' | 'modern' | 'mystical';
  includeAdvice: boolean;
  includeNextSteps: boolean;
}

// 本地存储数据扩展
export interface LocalStorageData {
  tarotRecords: TarotRecord[];
  professionalTarotRecords: ProfessionalTarotRecord[];
  clients: ClientProfile[];
  shareLinks: ShareLink[];
  settings: {
    consultantName: string;
    defaultTheme: string;
    businessInfo: BusinessInfo;
  };
} 