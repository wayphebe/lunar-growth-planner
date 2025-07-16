import { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { cleanFirebaseData } from '@/lib/utils';
import { ProfessionalTarotRecord } from '@/lib/types';

// 安全的日期转换函数
const safeDateConversion = (dateValue: any): Date => {
  if (!dateValue) return new Date();
  
  // 如果是 Firestore Timestamp
  if (dateValue && typeof dateValue.toDate === 'function') {
    return dateValue.toDate();
  }
  
  // 如果是 Date 对象
  if (dateValue instanceof Date) {
    return dateValue;
  }
  
  // 如果是字符串或数字
  if (typeof dateValue === 'string' || typeof dateValue === 'number') {
    return new Date(dateValue);
  }
  
  return new Date();
};

export const useProfessionalTarotRecords = () => {
  const [professionalTarotRecords, setProfessionalTarotRecords] = useState<ProfessionalTarotRecord[]>([]);

  useEffect(() => {
    // 从 Firebase 加载专业塔罗记录
    const unsubscribe = onSnapshot(
      collection(db, 'professionalTarotRecords'),
      (snapshot) => {
        const records: ProfessionalTarotRecord[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          records.push({
            id: doc.id,
            clientId: data.clientId,
            isForClient: data.isForClient,
            date: safeDateConversion(data.date) || new Date(),
            moonPhase: data.moonPhase,
            question: data.question,
            cards: data.cards || [],
            interpretation: data.interpretation,
            advice: data.advice,
            nextSteps: data.nextSteps,
            consultationFee: data.consultationFee,
            presentation: data.presentation || {
              theme: 'classic',
              layout: 'standard'
            },
            shareSettings: data.shareSettings || {
              isPublic: false,
              password: null,
              expiryDate: null
            }
          });
        });
        setProfessionalTarotRecords(records);
      },
      (error) => {
        console.error('❌ useProfessionalTarotRecords: 加载专业塔罗记录失败:', error);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const addProfessionalTarotRecord = async (record: Omit<ProfessionalTarotRecord, 'id'>) => {
    const recordData = cleanFirebaseData({
      ...record,
      isForClient: true
    });

    try {
      const docRef = await addDoc(collection(db, 'professionalTarotRecords'), recordData);
      return {
        id: docRef.id,
        ...recordData
      };
    } catch (error) {
      console.error('添加专业塔罗记录失败:', error);
      throw error;
    }
  };

  const updateProfessionalTarotRecord = async (id: string, updates: Partial<ProfessionalTarotRecord>) => {
    try {
      const docRef = doc(db, 'professionalTarotRecords', id);
      await updateDoc(docRef, updates);
    } catch (error) {
      console.error('更新专业塔罗记录失败:', error);
      throw error;
    }
  };

  const deleteProfessionalTarotRecord = async (id: string) => {
    try {
      const docRef = doc(db, 'professionalTarotRecords', id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('删除专业塔罗记录失败:', error);
      throw error;
    }
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