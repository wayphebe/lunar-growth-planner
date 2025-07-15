import { useState, useEffect } from 'react';
import { ProfessionalTarotRecord } from '@/lib/types';

export const useProfessionalTarotRecords = () => {
  const [professionalTarotRecords, setProfessionalTarotRecords] = useState<ProfessionalTarotRecord[]>([]);

  useEffect(() => {
    // 从本地存储加载专业塔罗记录
    const savedRecords = localStorage.getItem('professionalTarotRecords');
    if (savedRecords) {
      const parsed = JSON.parse(savedRecords);
      // 转换日期字符串回Date对象
      const recordsWithDates = parsed.map((record: any) => ({
        ...record,
        date: new Date(record.date),
        shareSettings: {
          ...record.shareSettings,
          expiryDate: record.shareSettings.expiryDate ? new Date(record.shareSettings.expiryDate) : undefined
        }
      }));
      setProfessionalTarotRecords(recordsWithDates);
    } else {
      // 初始化示例数据
      const sampleRecords: ProfessionalTarotRecord[] = [
        {
          id: 'prof-tarot-1',
          clientId: 'client-1',
          isForClient: true,
          date: new Date('2024-01-20'),
          moonPhase: '上弦月',
          question: '我在事业上的发展方向是什么？',
          cards: ['皇帝', '星星', '战车'],
          interpretation: '皇帝代表权威和稳定，暗示你在事业上有很好的领导能力。星星带来希望和指引，表明你的职业道路充满潜力。战车象征着前进和胜利，建议你坚定地朝着目标前进。',
          advice: '建议你在当前的工作中展现更多的领导力，同时保持对未来的积极态度。',
          nextSteps: '1. 主动承担更多责任 2. 制定清晰的职业规划 3. 建立更广泛的人脉网络',
          consultationFee: 200,
          shareSettings: {
            isPublic: true,
            allowDownload: true,
            expiryDate: new Date('2024-02-20'),
            password: undefined
          },
          presentation: {
            theme: 'classic',
            includeAdvice: true,
            includeNextSteps: true
          }
        },
        {
          id: 'prof-tarot-2',
          clientId: 'client-2',
          isForClient: true,
          date: new Date('2024-01-25'),
          moonPhase: '满月',
          question: '我的感情状况会如何发展？',
          cards: ['恋人', '月亮', '太阳'],
          interpretation: '恋人牌表示你在感情中面临重要选择，月亮提醒你要相信直觉，太阳预示着美好的结果。这个组合暗示着经过一段迷茫期后，你会找到真正的幸福。',
          advice: '在感情中要保持真诚和开放的态度，相信自己的内心感受。',
          nextSteps: '1. 主动表达内心想法 2. 增进彼此了解 3. 创造更多共同回忆',
          consultationFee: 150,
          shareSettings: {
            isPublic: true,
            allowDownload: false,
            password: '1234'
          },
          presentation: {
            theme: 'mystical',
            includeAdvice: true,
            includeNextSteps: true
          }
        }
      ];
      setProfessionalTarotRecords(sampleRecords);
      localStorage.setItem('professionalTarotRecords', JSON.stringify(sampleRecords));
    }
  }, []);

  const addProfessionalTarotRecord = (record: Omit<ProfessionalTarotRecord, 'id'>) => {
    const newRecord: ProfessionalTarotRecord = {
      ...record,
      id: 'prof-tarot-' + Date.now().toString(),
      isForClient: true
    };
    const updatedRecords = [newRecord, ...professionalTarotRecords];
    setProfessionalTarotRecords(updatedRecords);
    localStorage.setItem('professionalTarotRecords', JSON.stringify(updatedRecords));
    return newRecord;
  };

  const updateProfessionalTarotRecord = (id: string, updates: Partial<ProfessionalTarotRecord>) => {
    const updatedRecords = professionalTarotRecords.map(record =>
      record.id === id ? { ...record, ...updates } : record
    );
    setProfessionalTarotRecords(updatedRecords);
    localStorage.setItem('professionalTarotRecords', JSON.stringify(updatedRecords));
  };

  const deleteProfessionalTarotRecord = (id: string) => {
    const updatedRecords = professionalTarotRecords.filter(record => record.id !== id);
    setProfessionalTarotRecords(updatedRecords);
    localStorage.setItem('professionalTarotRecords', JSON.stringify(updatedRecords));
  };

  const getProfessionalTarotRecord = (id: string) => {
    return professionalTarotRecords.find(record => record.id === id);
  };

  const getClientTarotRecords = (clientId: string) => {
    return professionalTarotRecords.filter(record => record.clientId === clientId);
  };

  const getRecentRecords = (limit: number = 5) => {
    return professionalTarotRecords.slice(0, limit);
  };

  return {
    professionalTarotRecords,
    addProfessionalTarotRecord,
    updateProfessionalTarotRecord,
    deleteProfessionalTarotRecord,
    getProfessionalTarotRecord,
    getClientTarotRecords,
    getRecentRecords
  };
}; 