import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { 
  Sparkles, 
  Moon, 
  Calendar, 
  Download, 
  Share2, 
  Eye,
  Star,
  Heart,
  Zap,
  Shield,
  Key,
  ArrowRight,
  CheckCircle,
  Info,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { ProfessionalTarotRecord } from '@/lib/types';
import { useProfessionalTarotRecords } from '@/hooks/useProfessionalTarotRecords';
import { useShareLinks } from '@/hooks/useShareLinks';
import { useClients } from '@/hooks/useClients';

const ClientTarotReading: React.FC = () => {
  const { shareId } = useParams<{ shareId: string }>();
  const navigate = useNavigate();
  const { getProfessionalTarotRecord } = useProfessionalTarotRecords();
  const { getShareLinkByAccessCode, recordView } = useShareLinks();
  const { getClient } = useClients();
  
  const [shareLink, setShareLink] = useState<any>(null);
  const [record, setRecord] = useState<ProfessionalTarotRecord | null>(null);
  const [client, setClient] = useState<any>(null);
  const [consultant, setConsultant] = useState<any>(null);
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (shareId) {
      loadTarotReading();
    }
  }, [shareId]);

  const loadTarotReading = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      // 查找分享链接
      const link = getShareLinkByAccessCode(shareId!);
      if (!link) {
        setError('分享链接不存在或已失效');
        return;
      }
      
      // 检查链接是否已过期
      if (link.expiresAt && new Date() > link.expiresAt) {
        setError('分享链接已过期');
        return;
      }
      
      // 检查链接是否被禁用
      if (!link.isActive) {
        setError('分享链接已被禁用');
        return;
      }
      
      setShareLink(link);
      
      // 获取塔罗记录
      const tarotRecord = getProfessionalTarotRecord(link.tarotRecordId);
      if (!tarotRecord) {
        setError('占卜记录不存在');
        return;
      }
      
      setRecord(tarotRecord);
      
      // 获取客户信息
      const clientData = getClient(link.clientId);
      setClient(clientData);
      
      // 设置顾问信息（暂时使用示例数据）
      setConsultant({
        name: '月相占卜师',
        description: '专业塔罗咨询师，擅长结合月相能量解读人生指引',
        contact: 'consultant@example.com'
      });
      
      // 检查是否需要密码
      if (tarotRecord.shareSettings.password) {
        setIsPasswordProtected(true);
      } else {
        setIsAuthenticated(true);
        // 记录访问
        recordView(shareId!);
      }
      
    } catch (error) {
      console.error('加载塔罗记录失败:', error);
      setError('加载失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!record || !shareLink) return;
    
    if (password === record.shareSettings.password) {
      setIsAuthenticated(true);
      setPasswordError('');
      recordView(shareId!);
    } else {
      setPasswordError('密码错误，请重试');
    }
  };

  const getMoonPhaseEmoji = (phase: string) => {
    switch (phase) {
      case '新月': return '🌑';
      case '上弦月': return '🌓';
      case '满月': return '🌕';
      case '下弦月': return '🌗';
      case '峨眉月': return '🌒';
      case '盈凸月': return '🌔';
      case '亏凸月': return '🌖';
      case '残月': return '🌘';
      default: return '🌙';
    }
  };

  const getThemeStyles = (theme: string) => {
    switch (theme) {
      case 'modern':
        return {
          bg: 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900',
          card: 'bg-white/10 backdrop-blur-xl border-white/20',
          text: 'text-white',
          accent: 'text-purple-300'
        };
      case 'mystical':
        return {
          bg: 'bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900',
          card: 'bg-white/10 backdrop-blur-xl border-purple-300/20',
          text: 'text-white',
          accent: 'text-purple-200'
        };
      default: // classic
        return {
          bg: 'bg-gradient-to-br from-amber-50 via-orange-50 to-red-50',
          card: 'bg-white/80 backdrop-blur-sm border-amber-200/50',
          text: 'text-gray-900',
          accent: 'text-amber-700'
        };
    }
  };

  const downloadAsPDF = () => {
    // 这里可以实现PDF下载功能
    // 简单实现：使用浏览器的打印功能
    window.print();
  };

  const shareReading = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: '塔罗占卜结果',
        text: `查看我的塔罗占卜结果：${record?.question}`,
        url: url,
      });
    } else {
      navigator.clipboard.writeText(url);
      // 可以添加复制成功提示
    }
  };

  // 加载中状态
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <Sparkles className="h-12 w-12 mx-auto mb-4 animate-pulse" />
          <p className="text-lg">正在加载占卜结果...</p>
        </div>
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <div className="text-center text-white max-w-md">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-400" />
          <h1 className="text-2xl font-bold mb-2">访问受限</h1>
          <p className="text-gray-300 mb-4">{error}</p>
          <Button onClick={() => navigate('/')} variant="outline" className="text-white border-white hover:bg-white hover:text-gray-900">
            返回首页
          </Button>
        </div>
      </div>
    );
  }

  // 密码验证
  if (isPasswordProtected && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <Card className="bg-white/10 backdrop-blur-xl border-white/20 max-w-md w-full mx-4">
          <CardHeader className="text-center">
            <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-purple-100/20 flex items-center justify-center">
              <Key className="h-8 w-8 text-purple-300" />
            </div>
            <CardTitle className="text-white text-xl">访问验证</CardTitle>
            <p className="text-gray-300 text-sm">此占卜记录需要密码才能访问</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">访问密码</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="请输入密码"
                  className="bg-white/20 border-white/30 text-white placeholder:text-gray-300"
                />
                {passwordError && (
                  <p className="text-red-400 text-sm">{passwordError}</p>
                )}
              </div>
              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                验证访问
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!record || !client || !isAuthenticated) {
    return null;
  }

  const styles = getThemeStyles(record.presentation.theme);

  return (
    <div className={`min-h-screen ${styles.bg}`}>
      {/* 顶部装饰 */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black/20 to-transparent"></div>
      
      {/* 主要内容 */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        {/* 头部 */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className={`h-8 w-8 ${styles.accent}`} />
            <h1 className={`text-3xl font-light ${styles.text}`}>
              塔罗占卜结果
            </h1>
            <Sparkles className={`h-8 w-8 ${styles.accent}`} />
          </div>
          <p className={`${styles.text} opacity-80`}>
            {consultant.name} 为您解读
          </p>
        </div>

        {/* 月相信息 */}
        <Card className={`${styles.card} mb-8`}>
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center gap-4 mb-4">
              <Moon className={`h-6 w-6 ${styles.accent}`} />
              <span className={`text-lg ${styles.text}`}>占卜月相</span>
            </div>
            <div className="text-4xl mb-2">{getMoonPhaseEmoji(record.moonPhase)}</div>
            <div className={`text-xl font-medium ${styles.text} mb-2`}>
              {record.moonPhase}
            </div>
            <div className={`text-sm ${styles.text} opacity-70`}>
              {format(record.date, 'yyyy年MM月dd日')}
            </div>
          </CardContent>
        </Card>

        {/* 占卜问题 */}
        <Card className={`${styles.card} mb-8`}>
          <CardHeader>
            <CardTitle className={`${styles.text} flex items-center gap-2`}>
              <Info className="h-5 w-5" />
              占卜问题
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`${styles.text} text-lg leading-relaxed`}>
              {record.question}
            </p>
          </CardContent>
        </Card>

        {/* 抽取的塔罗牌 */}
        <Card className={`${styles.card} mb-8`}>
          <CardHeader>
            <CardTitle className={`${styles.text} flex items-center gap-2`}>
              <Star className="h-5 w-5" />
              抽取的塔罗牌
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3 justify-center">
              {record.cards.map((card, index) => (
                <div key={index} className="relative">
                  <Badge 
                    variant="secondary" 
                    className={`${styles.card} ${styles.text} px-4 py-2 text-base border-2 border-opacity-30`}
                  >
                    {card}
                  </Badge>
                  {index < record.cards.length - 1 && (
                    <ArrowRight className={`absolute -right-4 top-1/2 transform -translate-y-1/2 h-4 w-4 ${styles.accent}`} />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 牌面解读 */}
        <Card className={`${styles.card} mb-8`}>
          <CardHeader>
            <CardTitle className={`${styles.text} flex items-center gap-2`}>
              <Eye className="h-5 w-5" />
              牌面解读
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`${styles.text} text-lg leading-relaxed whitespace-pre-wrap`}>
              {record.interpretation}
            </div>
          </CardContent>
        </Card>

        {/* 建议内容 */}
        {record.presentation.includeAdvice && record.advice && (
          <Card className={`${styles.card} mb-8`}>
            <CardHeader>
              <CardTitle className={`${styles.text} flex items-center gap-2`}>
                <Heart className="h-5 w-5" />
                建议与指导
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`${styles.text} text-lg leading-relaxed whitespace-pre-wrap`}>
                {record.advice}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 下一步行动 */}
        {record.presentation.includeNextSteps && record.nextSteps && (
          <Card className={`${styles.card} mb-8`}>
            <CardHeader>
              <CardTitle className={`${styles.text} flex items-center gap-2`}>
                <Zap className="h-5 w-5" />
                下一步行动
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`${styles.text} text-lg leading-relaxed whitespace-pre-wrap`}>
                {record.nextSteps}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 操作按钮 */}
        <div className="flex justify-center gap-4 mb-8">
          {record.shareSettings.allowDownload && (
            <Button
              onClick={downloadAsPDF}
              variant="outline"
              className={`${styles.text} border-current hover:bg-white/10`}
            >
              <Download className="h-4 w-4 mr-2" />
              保存为PDF
            </Button>
          )}
          <Button
            onClick={shareReading}
            variant="outline"
            className={`${styles.text} border-current hover:bg-white/10`}
          >
            <Share2 className="h-4 w-4 mr-2" />
            分享
          </Button>
        </div>

        {/* 底部信息 */}
        <Card className={`${styles.card}`}>
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Shield className={`h-5 w-5 ${styles.accent}`} />
              <span className={`${styles.text} font-medium`}>
                {consultant.name}
              </span>
            </div>
            <p className={`${styles.text} opacity-70 text-sm mb-2`}>
              {consultant.description}
            </p>
            <p className={`${styles.text} opacity-50 text-xs`}>
              此占卜结果仅供参考，请结合实际情况理性判断
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 底部装饰 */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/20 to-transparent"></div>
    </div>
  );
};

export default ClientTarotReading; 