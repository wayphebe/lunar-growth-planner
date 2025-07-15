import { useState, useEffect } from 'react';
import { ClientProfile } from '@/lib/types';

export const useClients = () => {
  const [clients, setClients] = useState<ClientProfile[]>([]);

  useEffect(() => {
    // 从本地存储加载客户数据
    const savedClients = localStorage.getItem('clients');
    if (savedClients) {
      const parsed = JSON.parse(savedClients);
      // 转换日期字符串回Date对象
      const clientsWithDates = parsed.map((client: any) => ({
        ...client,
        createdAt: new Date(client.createdAt),
        lastConsultation: client.lastConsultation ? new Date(client.lastConsultation) : undefined
      }));
      setClients(clientsWithDates);
    } else {
      // 初始化示例数据
      const sampleClients: ClientProfile[] = [
        {
          id: 'client-1',
          name: '张小雨',
          email: 'zhangxiaoyu@example.com',
          phone: '13800138001',
          notes: '对塔罗牌很感兴趣，经常询问关于事业发展的问题。',
          createdAt: new Date('2024-01-15'),
          lastConsultation: new Date('2024-01-20'),
          totalConsultations: 3,
          isActive: true
        },
        {
          id: 'client-2',
          name: '李晓明',
          email: 'lixiaoming@example.com',
          notes: '关注感情和人际关系方面的问题，希望通过塔罗获得指导。',
          createdAt: new Date('2024-01-18'),
          lastConsultation: new Date('2024-01-25'),
          totalConsultations: 2,
          isActive: true
        },
        {
          id: 'client-3',
          name: '王美美',
          phone: '13900139002',
          notes: '新客户，对塔罗占卜很好奇，主要关心学业和未来规划。',
          createdAt: new Date('2024-01-22'),
          totalConsultations: 1,
          isActive: true
        }
      ];
      setClients(sampleClients);
      localStorage.setItem('clients', JSON.stringify(sampleClients));
    }
  }, []);

  const addClient = (client: Omit<ClientProfile, 'id' | 'createdAt' | 'totalConsultations' | 'isActive'>) => {
    const newClient: ClientProfile = {
      ...client,
      id: 'client-' + Date.now().toString(),
      createdAt: new Date(),
      totalConsultations: 0,
      isActive: true
    };
    const updatedClients = [newClient, ...clients];
    setClients(updatedClients);
    localStorage.setItem('clients', JSON.stringify(updatedClients));
    return newClient;
  };

  const updateClient = (id: string, updates: Partial<ClientProfile>) => {
    const updatedClients = clients.map(client =>
      client.id === id ? { ...client, ...updates } : client
    );
    setClients(updatedClients);
    localStorage.setItem('clients', JSON.stringify(updatedClients));
  };

  const deleteClient = (id: string) => {
    const updatedClients = clients.filter(client => client.id !== id);
    setClients(updatedClients);
    localStorage.setItem('clients', JSON.stringify(updatedClients));
  };

  const getClient = (id: string) => {
    return clients.find(client => client.id === id);
  };

  const updateClientConsultation = (id: string) => {
    const client = clients.find(c => c.id === id);
    if (client) {
      updateClient(id, {
        lastConsultation: new Date(),
        totalConsultations: client.totalConsultations + 1
      });
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