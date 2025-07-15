
import { useState, useEffect } from 'react';

interface TarotRecord {
  id: string;
  date: Date;
  moonPhase: string;
  question: string;
  cards: string[];
  interpretation: string;
  projectId?: string;
}

export const useTarotRecords = () => {
  const [tarotRecords, setTarotRecords] = useState<TarotRecord[]>([]);

  useEffect(() => {
    // 从本地存储加载塔罗记录
    const savedRecords = localStorage.getItem('tarotRecords');
    if (savedRecords) {
      const parsed = JSON.parse(savedRecords);
      // 转换日期字符串回Date对象
      const recordsWithDates = parsed.map((record: any) => ({
        ...record,
        date: new Date(record.date)
      }));
      setTarotRecords(recordsWithDates);
    } else {
      // 初始化示例数据
      const sampleRecords: TarotRecord[] = [
        {
          id: 'tarot-1',
          date: new Date('2024-01-11'),
          moonPhase: '新月',
          question: '我在学习塔罗的道路上应该注意什么？',
          cards: ['愚者', '魔术师', '女祭司'],
          interpretation: '愚者代表新的开始，魔术师象征着你拥有实现目标的所有工具，女祭司提醒你要相信内在的直觉。这个组合表明你正处于学习的最佳时机。',
          projectId: '1'
        },
        {
          id: 'tarot-2',
          date: new Date('2024-01-25'),
          moonPhase: '满月',
          question: '我的冥想练习如何能更深入？',
          cards: ['隐者', '星星', '月亮'],
          interpretation: '隐者指引你向内寻找智慧，星星带来希望和指引，月亮提醒你要拥抱潜意识的智慧。建议在满月能量下进行深度冥想。',
          projectId: '2'
        },
        {
          id: 'tarot-3',
          date: new Date('2024-02-09'),
          moonPhase: '新月',
          question: '新的月相周期我应该设定什么意图？',
          cards: ['太阳', '世界', '审判'],
          interpretation: '太阳带来积极的能量，世界代表完成和成就，审判象征着重生和新的觉醒。这是一个非常有力的组合，预示着重大的积极转变。'
        }
      ];
      setTarotRecords(sampleRecords);
      localStorage.setItem('tarotRecords', JSON.stringify(sampleRecords));
    }
  }, []);

  const addTarotRecord = (record: Omit<TarotRecord, 'id'>) => {
    const newRecord = {
      ...record,
      id: 'tarot-' + Date.now().toString()
    };
    const updatedRecords = [newRecord, ...tarotRecords];
    setTarotRecords(updatedRecords);
    localStorage.setItem('tarotRecords', JSON.stringify(updatedRecords));
  };

  const updateTarotRecord = (id: string, updates: Partial<TarotRecord>) => {
    const updatedRecords = tarotRecords.map(record =>
      record.id === id ? { ...record, ...updates } : record
    );
    setTarotRecords(updatedRecords);
    localStorage.setItem('tarotRecords', JSON.stringify(updatedRecords));
  };

  const deleteTarotRecord = (id: string) => {
    const updatedRecords = tarotRecords.filter(record => record.id !== id);
    setTarotRecords(updatedRecords);
    localStorage.setItem('tarotRecords', JSON.stringify(updatedRecords));
  };

  return { tarotRecords, addTarotRecord, updateTarotRecord, deleteTarotRecord };
};
