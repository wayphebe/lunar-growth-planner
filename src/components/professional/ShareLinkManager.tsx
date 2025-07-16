import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { 
  Link, 
  Eye, 
  Copy, 
  Check, 
  MoreVertical,
  Trash2,
  Edit2,
  Share2,
  Calendar,
  Search,
  Filter,
  Download,
  QrCode,
  BarChart3,
  Clock,
  Shield,
  ExternalLink
} from 'lucide-react';
import { format } from 'date-fns';
import { ShareLink, ProfessionalTarotRecord } from '@/lib/types';
import { useShareLinks } from '@/hooks/useShareLinks';
import { useProfessionalTarotRecords } from '@/hooks/useProfessionalTarotRecords';
import { useClients } from '@/hooks/useClients';

interface ShareLinkManagerProps {
  clientId?: string;
  onLinkSelect?: (link: ShareLink) => void;
}

export const ShareLinkManager: React.FC<ShareLinkManagerProps> = ({ 
  clientId, 
  onLinkSelect 
}) => {
  const { 
    shareLinks, 
    deleteShareLink, 
    deactivateShareLink, 
    activateShareLink,
    isShareLinkExpired,
    getActiveShareLinks 
  } = useShareLinks();
  const { getProfessionalTarotRecord } = useProfessionalTarotRecords();
  const { getClient } = useClients();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'expired'>('all');
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [selectedLink, setSelectedLink] = useState<ShareLink | null>(null);

  // 过滤链接
  const filteredLinks = shareLinks.filter(link => {
    // 客户筛选
    if (clientId && link.clientId !== clientId) return false;
    
    // 状态筛选
    if (filterStatus === 'active' && (!link.isActive || isShareLinkExpired(link))) return false;
    if (filterStatus === 'expired' && (link.isActive && !isShareLinkExpired(link))) return false;
    
    // 搜索筛选
    if (searchQuery) {
      const record = getProfessionalTarotRecord(link.tarotRecordId);
      const client = getClient(link.clientId);
      
      const searchText = [
        link.accessCode,
        client?.name,
        record?.question
      ].join(' ').toLowerCase();
      
      return searchText.includes(searchQuery.toLowerCase());
    }
    
    return true;
  });

  const handleCopyLink = async (url: string) => {
    try {
      const fullUrl = `${window.location.origin}${url}`;
      await navigator.clipboard.writeText(fullUrl);
      setCopiedLink(url);
      setTimeout(() => setCopiedLink(null), 2000);
    } catch (error) {
      console.error('复制链接失败:', error);
    }
  };

  const handleDeleteLink = async (linkId: string) => {
    try {
      await deleteShareLink(linkId);
    } catch (error) {
      console.error('删除分享链接失败:', error);
    }
  };

  const handleToggleActive = async (link: ShareLink) => {
    try {
      if (link.isActive) {
        await deactivateShareLink(link.id);
      } else {
        await activateShareLink(link.id);
      }
    } catch (error) {
      console.error('切换分享链接状态失败:', error);
    }
  };

  const generateQRCode = (url: string) => {
    const fullUrl = `${window.location.origin}${url}`;
    window.open(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(fullUrl)}`, '_blank');
  };

  const openLink = (url: string) => {
    const fullUrl = `${window.location.origin}${url}`;
    window.open(fullUrl, '_blank');
  };

  const getLinkStatus = (link: ShareLink) => {
    if (!link.isActive) return { status: 'inactive', color: 'bg-gray-100 text-gray-700' };
    if (isShareLinkExpired(link)) return { status: 'expired', color: 'bg-red-100 text-red-700' };
    return { status: 'active', color: 'bg-green-100 text-green-700' };
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return '有效';
      case 'expired': return '已过期';
      case 'inactive': return '已停用';
      default: return '未知';
    }
  };

  return (
    <div className="space-y-4">
      {/* 搜索和过滤 */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="搜索链接..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/70"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              筛选
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setFilterStatus('all')}>
              所有链接
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterStatus('active')}>
              有效链接
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterStatus('expired')}>
              过期链接
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* 统计信息 */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-white/50 border-gray-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{shareLinks.length}</div>
            <div className="text-sm text-gray-600">总链接数</div>
          </CardContent>
        </Card>
        <Card className="bg-white/50 border-gray-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{getActiveShareLinks().length}</div>
            <div className="text-sm text-gray-600">有效链接</div>
          </CardContent>
        </Card>
        <Card className="bg-white/50 border-gray-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {shareLinks.reduce((sum, link) => sum + link.views, 0)}
            </div>
            <div className="text-sm text-gray-600">总浏览量</div>
          </CardContent>
        </Card>
      </div>

      {/* 链接列表 */}
      <div className="space-y-3">
        {filteredLinks.length > 0 ? (
          filteredLinks.map((link) => {
            const record = getProfessionalTarotRecord(link.tarotRecordId);
            const client = getClient(link.clientId);
            const linkStatus = getLinkStatus(link);
            
            return (
              <Card key={link.id} className="bg-white/50 border-gray-200 hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Link className="h-4 w-4 text-gray-600" />
                        <span className="font-mono text-sm font-medium">{link.accessCode}</span>
                        <Badge className={`text-xs ${linkStatus.color}`}>
                          {getStatusText(linkStatus.status)}
                        </Badge>
                        {link.expiresAt && (
                          <Badge variant="outline" className="text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            {format(link.expiresAt, 'MM/dd')}
                          </Badge>
                        )}
                      </div>

                      <div className="space-y-1 mb-3">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-purple-100 text-purple-700">
                            {client?.name}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {record?.moonPhase}
                          </span>
                        </div>
                        
                        {record && (
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {record.question}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          <span>{link.views} 次浏览</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>创建于 {format(link.createdAt, 'MM/dd')}</span>
                        </div>
                        {link.lastViewed && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>最后浏览 {format(link.lastViewed, 'MM/dd HH:mm')}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyLink(link.url)}
                        className="h-8 w-8 p-0"
                      >
                        {copiedLink === link.url ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openLink(link.url)}
                        className="h-8 w-8 p-0"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => generateQRCode(link.url)}
                        className="h-8 w-8 p-0"
                      >
                        <QrCode className="h-4 w-4" />
                      </Button>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setSelectedLink(link)}>
                            <BarChart3 className="h-4 w-4 mr-2" />
                            查看详情
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleActive(link)}>
                            {link.isActive ? (
                              <>
                                <Shield className="h-4 w-4 mr-2" />
                                停用链接
                              </>
                            ) : (
                              <>
                                <Shield className="h-4 w-4 mr-2" />
                                启用链接
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem 
                                className="text-red-600 focus:text-red-600"
                                onSelect={(e) => e.preventDefault()}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                删除链接
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>确认删除</AlertDialogTitle>
                                <AlertDialogDescription>
                                  确定要删除访问码为 "{link.accessCode}" 的分享链接吗？此操作无法撤销。
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>取消</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteLink(link.id)}>
                                  删除
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card className="bg-white/50 border-gray-200">
            <CardContent className="p-8 text-center">
              <Share2 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">
                {searchQuery || filterStatus !== 'all' ? '未找到匹配的链接' : '暂无分享链接'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* 链接详情对话框 */}
      <Dialog open={!!selectedLink} onOpenChange={() => setSelectedLink(null)}>
        <DialogContent className="bg-white/95 backdrop-blur-xl max-w-2xl">
          <DialogHeader>
            <DialogTitle>链接详情</DialogTitle>
          </DialogHeader>
          {selectedLink && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600">访问码</div>
                  <div className="font-mono text-lg">{selectedLink.accessCode}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">状态</div>
                  <Badge className={`${getLinkStatus(selectedLink).color}`}>
                    {getStatusText(getLinkStatus(selectedLink).status)}
                  </Badge>
                </div>
                <div>
                  <div className="text-sm text-gray-600">浏览次数</div>
                  <div className="text-lg">{selectedLink.views}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">创建时间</div>
                  <div>{format(selectedLink.createdAt, 'yyyy/MM/dd HH:mm')}</div>
                </div>
                {selectedLink.lastViewed && (
                  <div>
                    <div className="text-sm text-gray-600">最后浏览</div>
                    <div>{format(selectedLink.lastViewed, 'yyyy/MM/dd HH:mm')}</div>
                  </div>
                )}
                {selectedLink.expiresAt && (
                  <div>
                    <div className="text-sm text-gray-600">过期时间</div>
                    <div>{format(selectedLink.expiresAt, 'yyyy/MM/dd HH:mm')}</div>
                  </div>
                )}
              </div>
              
              <div className="p-3 bg-gray-50 rounded">
                <div className="text-sm text-gray-600 mb-2">完整链接</div>
                <div className="flex items-center gap-2">
                  <code className="flex-1 p-2 bg-white rounded text-sm">
                    {window.location.origin}{selectedLink.url}
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopyLink(selectedLink.url)}
                  >
                    {copiedLink === selectedLink.url ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}; 