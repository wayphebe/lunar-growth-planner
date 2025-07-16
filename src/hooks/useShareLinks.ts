import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { cleanFirebaseData } from '@/lib/utils';
import { ShareLink, ShareSettings } from '@/lib/types';

// 生成访问码的函数
const generateAccessCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

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

export const useShareLinks = () => {
  const [shareLinks, setShareLinks] = useState<ShareLink[]>([]);

  useEffect(() => {
    // 从 Firebase 加载分享链接
    const unsubscribe = onSnapshot(
      collection(db, 'shareLinks'),
      (snapshot) => {
        const links: ShareLink[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          links.push({
            id: doc.id,
            tarotRecordId: data.tarotRecordId,
            clientId: data.clientId,
            url: data.url,
            accessCode: data.accessCode,
            views: data.views || 0,
            lastViewed: safeDateConversion(data.lastViewed),
            isActive: data.isActive,
            expiresAt: safeDateConversion(data.expiresAt),
            createdAt: safeDateConversion(data.createdAt) || new Date()
          });
        });
        setShareLinks(links);
      },
      (error) => {
        console.error('❌ useShareLinks: 加载分享链接失败:', error);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const generateShareLink = async (tarotRecordId: string, clientId: string, settings?: ShareSettings) => {
    // 生成唯一的访问码
    const accessCode = generateAccessCode();
    
    const newLinkData = cleanFirebaseData({
      tarotRecordId,
      clientId,
      url: `/tarot-reading/${accessCode}`,
      accessCode,
      views: 0,
      isActive: true,
      expiresAt: settings?.expiryDate,
      createdAt: new Date()
    });

    try {
      const docRef = await addDoc(collection(db, 'shareLinks'), newLinkData);
      return {
        id: docRef.id,
        ...newLinkData
      };
    } catch (error) {
      console.error('生成分享链接失败:', error);
      throw error;
    }
  };

  const updateShareLink = async (id: string, updates: Partial<ShareLink>) => {
    try {
      const docRef = doc(db, 'shareLinks', id);
      await updateDoc(docRef, updates);
    } catch (error) {
      console.error('更新分享链接失败:', error);
      throw error;
    }
  };

  const deleteShareLink = async (id: string) => {
    try {
      const docRef = doc(db, 'shareLinks', id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('删除分享链接失败:', error);
      throw error;
    }
  };

  const getShareLink = (id: string) => {
    return shareLinks.find(link => link.id === id);
  };

  const getShareLinkByAccessCode = (accessCode: string) => {
    const found = shareLinks.find(link => link.accessCode === accessCode && link.isActive);
    return found;
  };

  const getShareLinksByRecord = (tarotRecordId: string) => {
    return shareLinks.filter(link => link.tarotRecordId === tarotRecordId);
  };

  const getShareLinksByClient = (clientId: string) => {
    return shareLinks.filter(link => link.clientId === clientId);
  };

  const recordView = async (accessCode: string) => {
    const link = getShareLinkByAccessCode(accessCode);
    if (link) {
      try {
        await updateShareLink(link.id, {
          views: link.views + 1,
          lastViewed: new Date()
        });
      } catch (error) {
        console.error('记录访问失败:', error);
      }
    }
  };

  const deactivateShareLink = async (id: string) => {
    try {
      await updateShareLink(id, { isActive: false });
    } catch (error) {
      console.error('停用分享链接失败:', error);
    }
  };

  const activateShareLink = async (id: string) => {
    try {
      await updateShareLink(id, { isActive: true });
    } catch (error) {
      console.error('启用分享链接失败:', error);
    }
  };

  const isShareLinkExpired = (link: ShareLink) => {
    if (!link.expiresAt) return false;
    return new Date() > link.expiresAt;
  };

  const getActiveShareLinks = () => {
    return shareLinks.filter(link => link.isActive && !isShareLinkExpired(link));
  };

  return {
    shareLinks,
    generateShareLink,
    updateShareLink,
    deleteShareLink,
    getShareLink,
    getShareLinkByAccessCode,
    getShareLinksByRecord,
    getShareLinksByClient,
    recordView,
    deactivateShareLink,
    activateShareLink,
    isShareLinkExpired,
    getActiveShareLinks
  };
}; 