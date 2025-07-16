import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Share2, 
  Copy, 
  Check, 
  Eye, 
  EyeOff, 
  Calendar,
  Link,
  Settings,
  QrCode,
  Download
} from 'lucide-react';
import { ProfessionalTarotRecord, ShareLink } from '@/lib/types';
import { useShareLinks } from '@/hooks/useShareLinks';
import { useClients } from '@/hooks/useClients';

interface ShareLinkGeneratorProps {
  record: ProfessionalTarotRecord;
  onLinkGenerated?: (link: ShareLink) => void;
}

export const ShareLinkGenerator: React.FC<ShareLinkGeneratorProps> = ({ 
  record, 
  onLinkGenerated 
}) => {
  const { generateShareLink, getShareLinksByRecord } = useShareLinks();
  const { getClient } = useClients();
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  
  // 分享设置
  const [allowDownload, setAllowDownload] = useState(record.shareSettings.allowDownload);
  const [sharePassword, setSharePassword] = useState(record.shareSettings.password || '');
  const [expiryDate, setExpiryDate] = useState(
    record.shareSettings.expiryDate ? 
      new Date(record.shareSettings.expiryDate).toISOString().split('T')[0] : ''
  );

  const client = getClient(record.clientId);
  const existingLinks = getShareLinksByRecord(record.id);

  const handleGenerateLink = async () => {
    if (!client) return;
    
    setIsGenerating(true);
    
    try {
      const settings = {
        isPublic: true,
        allowDownload,
        expiryDate: expiryDate ? new Date(expiryDate) : undefined,
        password: sharePassword || undefined,
        theme: record.presentation.theme,
        includeAdvice: record.presentation.includeAdvice,
        includeNextSteps: record.presentation.includeNextSteps
      };

      const newLink = await generateShareLink(record.id, record.clientId, settings);
      
      if (onLinkGenerated) {
        onLinkGenerated(newLink);
      }
      
      setShowSettings(false);
    } catch (error) {
      console.error('生成分享链接失败:', error);
    } finally {
      setIsGenerating(false);
    }
  };

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

  const generateQRCode = (url: string) => {
    // 这里可以集成QR码生成库
    const fullUrl = `${window.location.origin}${url}`;
    // 简单实现：打开QR码生成网站
    window.open(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(fullUrl)}`, '_blank');
  };

  const isLinkExpired = (link: ShareLink) => {
    if (!link.expiresAt) return false;
    return new Date() > link.expiresAt;
  };

  return (
    <div className="space-y-4">
      {/* 记录信息 */}
      <Card className="bg-white/50 border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Share2 className="h-5 w-5 text-purple-600" />
            分享占卜记录
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-purple-100 text-purple-700">
              {client?.name}
            </Badge>
            <Badge variant="secondary" className="bg-gray-100 text-gray-700">
              {record.moonPhase}
            </Badge>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">
            {record.question}
          </p>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Calendar className="h-3 w-3" />
            {new Date(record.date).toLocaleDateString()}
          </div>
        </CardContent>
      </Card>

      {/* 现有链接 */}
      {existingLinks.length > 0 && (
        <Card className="bg-white/50 border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">现有分享链接</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {existingLinks.map((link) => (
              <div key={link.id} className="p-3 bg-gray-50 rounded border">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Link className="h-4 w-4 text-gray-600" />
                    <span className="font-mono text-sm">{link.accessCode}</span>
                    <Badge 
                      variant={link.isActive && !isLinkExpired(link) ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {link.isActive && !isLinkExpired(link) ? '有效' : '无效'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1">
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
                      onClick={() => generateQRCode(link.url)}
                      className="h-8 w-8 p-0"
                    >
                      <QrCode className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <Eye className="h-3 w-3" />
                    <span>{link.views} 次浏览</span>
                  </div>
                  <div>
                    创建于 {new Date(link.createdAt).toLocaleDateString()}
                  </div>
                </div>
                {link.lastViewed && (
                  <div className="text-xs text-gray-500 mt-1">
                    最后浏览: {new Date(link.lastViewed).toLocaleString()}
                  </div>
                )}
                {link.expiresAt && (
                  <div className="text-xs text-gray-500 mt-1">
                    过期时间: {new Date(link.expiresAt).toLocaleString()}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* 生成新链接 */}
      <Card className="bg-white/50 border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">生成新的分享链接</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 快速生成 */}
          <div className="flex items-center gap-2">
            <Button
              onClick={handleGenerateLink}
              disabled={isGenerating}
              className="flex-1"
            >
              {isGenerating ? '生成中...' : '快速生成链接'}
            </Button>
            <Dialog open={showSettings} onOpenChange={setShowSettings}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white/95 backdrop-blur-xl">
                <DialogHeader>
                  <DialogTitle>分享设置</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  {/* 下载权限 */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div>
                      <div className="font-medium">允许下载</div>
                      <div className="text-sm text-gray-600">客户可以保存和下载内容</div>
                    </div>
                    <Switch
                      checked={allowDownload}
                      onCheckedChange={setAllowDownload}
                    />
                  </div>

                  {/* 访问密码 */}
                  <div className="space-y-2">
                    <Label htmlFor="password">访问密码 (可选)</Label>
                    <Input
                      id="password"
                      type="password"
                      value={sharePassword}
                      onChange={(e) => setSharePassword(e.target.value)}
                      placeholder="设置访问密码"
                      className="bg-white/70"
                    />
                  </div>

                  {/* 过期时间 */}
                  <div className="space-y-2">
                    <Label htmlFor="expiry">过期时间 (可选)</Label>
                    <Input
                      id="expiry"
                      type="date"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      className="bg-white/70"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  {/* 按钮 */}
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowSettings(false)}>
                      取消
                    </Button>
                    <Button onClick={handleGenerateLink} disabled={isGenerating}>
                      {isGenerating ? '生成中...' : '生成链接'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* 提示信息 */}
          <Alert>
            <AlertDescription className="text-sm">
              生成的链接将包含完整的占卜记录，客户可以通过链接查看详细内容。
              您可以通过设置密码和过期时间来控制访问权限。
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}; 