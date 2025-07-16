import { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { cleanFirebaseData } from '@/lib/utils';
import { ClientProfile } from '@/lib/types';

// 安全的日期转换函数
const safeDateConversion = (dateValue: any): Date | undefined => {
  if (!dateValue) return undefined;
  
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
  
  return undefined;
};

export const useClients = () => {
  const [clients, setClients] = useState<ClientProfile[]>([]);

  useEffect(() => {
    // 从 Firebase 加载客户数据
    const unsubscribe = onSnapshot(
      collection(db, 'clients'),
      (snapshot) => {
        const clientsData: ClientProfile[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          clientsData.push({
            id: doc.id,
            name: data.name,
            email: data.email,
            phone: data.phone,
            notes: data.notes,
            createdAt: safeDateConversion(data.createdAt) || new Date(),
            lastConsultation: safeDateConversion(data.lastConsultation),
            totalConsultations: data.totalConsultations || 0,
            isActive: data.isActive !== false
          });
        });
        setClients(clientsData);
      },
      (error) => {
        console.error('❌ useClients: 加载客户数据失败:', error);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const addClient = async (client: Omit<ClientProfile, 'id' | 'createdAt' | 'totalConsultations' | 'isActive'>) => {
    const clientData = cleanFirebaseData({
      ...client,
      createdAt: new Date(),
      totalConsultations: 0,
      isActive: true
    });

    try {
      const docRef = await addDoc(collection(db, 'clients'), clientData);
      return {
        id: docRef.id,
        ...clientData
      };
    } catch (error) {
      console.error('添加客户失败:', error);
      throw error;
    }
  };

  const updateClient = async (id: string, updates: Partial<ClientProfile>) => {
    try {
      const docRef = doc(db, 'clients', id);
      await updateDoc(docRef, updates);
    } catch (error) {
      console.error('更新客户失败:', error);
      throw error;
    }
  };

  const deleteClient = async (id: string) => {
    try {
      const docRef = doc(db, 'clients', id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('删除客户失败:', error);
      throw error;
    }
  };

  const getClient = (id: string) => {
    const found = clients.find(client => client.id === id);
    return found;
  };

  const updateClientConsultation = async (id: string) => {
    const client = clients.find(c => c.id === id);
    if (client) {
      try {
        await updateClient(id, {
          lastConsultation: new Date(),
          totalConsultations: client.totalConsultations + 1
        });
      } catch (error) {
        console.error('更新客户咨询次数失败:', error);
      }
    }
  };

  const searchClients = (query: string) => {
    if (!query) return clients;
    return clients.filter(client =>
      client.name.toLowerCase().includes(query.toLowerCase()) ||
      client.email?.toLowerCase().includes(query.toLowerCase()) ||
      client.phone?.includes(query)
    );
  };

  return {
    clients,
    addClient,
    updateClient,
    deleteClient,
    getClient,
    updateClientConsultation,
    searchClients
  };
}; 