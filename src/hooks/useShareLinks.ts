import { useState, useEffect } from 'react';
import { ShareLink, ShareSettings } from '@/lib/types';

export const useShareLinks = () => {
  const [shareLinks, setShareLinks] = useState<ShareLink[]>([]);

  useEffect(() => {
    // 从本地存储加载分享链接
    const savedLinks = localStorage.getItem('shareLinks');
    if (savedLinks) {
      const parsed = JSON.parse(savedLinks);
      // 转换日期字符串回Date对象
      const linksWithDates = parsed.map((link: any) => ({
        ...link,
        createdAt: new Date(link.createdAt),
        expiresAt: link.expiresAt ? new Date(link.expiresAt) : undefined,
        lastViewed: link.lastViewed ? new Date(link.lastViewed) : undefined
      }));
      setShareLinks(linksWithDates);
    } else {
      // 初始化示例数据
      const sampleLinks: ShareLink[] = [
        {
          id: 'share-1',
          tarotRecordId: 'prof-tarot-1',
          clientId: 'client-1',
          url: '/tarot-reading/ABC123',
          accessCode: 'ABC123',
          views: 5,
          lastViewed: new Date('2024-01-21'),
          isActive: true,
          expiresAt: new Date('2024-02-20'),
          createdAt: new Date('2024-01-20')
        },
        {
          id: 'share-2',
          tarotRecordId: 'prof-tarot-2',
          clientId: 'client-2',
          url: '/tarot-reading/DEF456',
          accessCode: 'DEF456',
          views: 3,
          lastViewed: new Date('2024-01-26'),
          isActive: true,
          createdAt: new Date('2024-01-25')
        }
      ];
      setShareLinks(sampleLinks);
      localStorage.setItem('shareLinks', JSON.stringify(sampleLinks));
    }
  }, []);

  const generateShareLink = (tarotRecordId: string, clientId: string, settings?: ShareSettings) => {
    // 生成唯一的访问码
    const accessCode = generateAccessCode();
    
    const newLink: ShareLink = {
      id: 'share-' + Date.now().toString(),
      tarotRecordId,
      clientId,
      url: `/tarot-reading/${accessCode}`,
      accessCode,
      views: 0,
      isActive: true,
      expiresAt: settings?.expiryDate,
      createdAt: new Date()
    };

    const updatedLinks = [newLink, ...shareLinks];
    setShareLinks(updatedLinks);
    localStorage.setItem('shareLinks', JSON.stringify(updatedLinks));
    return newLink;
  };

  const updateShareLink = (id: string, updates: Partial<ShareLink>) => {
    const updatedLinks = shareLinks.map(link =>
      link.id === id ? { ...link, ...updates } : link
    );
    setShareLinks(updatedLinks);
    localStorage.setItem('shareLinks', JSON.stringify(updatedLinks));
  };

  const deleteShareLink = (id: string) => {
    const updatedLinks = shareLinks.filter(link => link.id !== id);
    setShareLinks(updatedLinks);
    localStorage.setItem('shareLinks', JSON.stringify(updatedLinks));
  };

  const getShareLink = (id: string) => {
    return shareLinks.find(link => link.id === id);
  };

  const getShareLinkByAccessCode = (accessCode: string) => {
    return shareLinks.find(link => link.accessCode === accessCode && link.isActive);
  };

  const getShareLinksByRecord = (tarotRecordId: string) => {
    return shareLinks.filter(link => link.tarotRecordId === tarotRecordId);
  };

  const getShareLinksByClient = (clientId: string) => {
    return shareLinks.filter(link => link.clientId === clientId);
  };

  const recordView = (accessCode: string) => {
    const link = getShareLinkByAccessCode(accessCode);
    if (link) {
      updateShareLink(link.id, {
        views: link.views + 1,
        lastViewed: new Date()
      });
    }
  };

  const deactivateShareLink = (id: string) => {
    updateShareLink(id, { isActive: false });
  };

  const activateShareLink = (id: string) => {
    updateShareLink(id, { isActive: true });
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

// 生成访问码的辅助函数
const generateAccessCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}; 