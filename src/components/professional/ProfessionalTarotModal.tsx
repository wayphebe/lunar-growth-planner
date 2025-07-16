import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Switch } from '../ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Sparkles, 
  Moon, 
  Plus, 
  X, 
  AlertTriangle, 
  DollarSign, 
  Calendar,
  Eye,
  EyeOff,
  Settings,
  Palette,
  Share2,
  Link
} from 'lucide-react';
import { MoonPhase, ProfessionalTarotRecord, ShareSettings } from '@/lib/types';
import { ClientSelector } from '@/components/client/ClientSelector';
import { useProfessionalTarotRecords } from '@/hooks/useProfessionalTarotRecords';
import { useShareLinks } from '@/hooks/useShareLinks';
import { useClients } from '@/hooks/useClients';

interface ProfessionalTarotModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPhase: MoonPhase | null;
  editRecord?: ProfessionalTarotRecord | null;
}

const commonTarotCards = [
  '愚者', '魔术师', '女祭司', '皇后', '皇帝', '教皇', '恋人', '战车',
  '力量', '隐者', '命运之轮', '正义', '倒吊人', '死神', '节制', '恶魔',
  '塔', '星星', '月亮', '太阳', '审判', '世界'
];

export const ProfessionalTarotModal: React.FC<ProfessionalTarotModalProps> = ({ 
  open, 
  onOpenChange, 
  currentPhase,
  editRecord 
}) => {
  const { addProfessionalTarotRecord, updateProfessionalTarotRecord } = useProfessionalTarotRecords();
  const { generateShareLink } = useShareLinks();
  const { updateClientConsultation } = useClients();
  
  const [clientId, setClientId] = useState(editRecord?.clientId || '');
  const [question, setQuestion] = useState(editRecord?.question || '');
  const [selectedCards, setSelectedCards] = useState<string[]>(editRecord?.cards || []);
  const [newCard, setNewCard] = useState('');
  const [interpretation, setInterpretation] = useState(editRecord?.interpretation || '');
  const [advice, setAdvice] = useState(editRecord?.advice || '');
  const [nextSteps, setNextSteps] = useState(editRecord?.nextSteps || '');
  const [consultationFee, setConsultationFee] = useState(editRecord?.consultationFee?.toString() || '');
  
  // 展示设置
  const [presentationTheme, setPresentationTheme] = useState<'classic' | 'modern' | 'mystical'>(
    editRecord?.presentation.theme || 'classic'
  );
  const [includeAdvice, setIncludeAdvice] = useState(editRecord?.presentation.includeAdvice ?? true);
  const [includeNextSteps, setIncludeNextSteps] = useState(editRecord?.presentation.includeNextSteps ?? true);
  
  // 分享设置
  const [isPublic, setIsPublic] = useState(editRecord?.shareSettings.isPublic ?? true);
  const [allowDownload, setAllowDownload] = useState(editRecord?.shareSettings.allowDownload ?? true);
  const [sharePassword, setSharePassword] = useState(editRecord?.shareSettings.password || '');
  const [expiryDate, setExpiryDate] = useState(
    editRecord?.shareSettings.expiryDate ? 
      new Date(editRecord.shareSettings.expiryDate).toISOString().split('T')[0] : ''
  );
  
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  const handleAddCard = () => {
    if (newCard.trim() && !selectedCards.includes(newCard.trim())) {
      setSelectedCards([...selectedCards, newCard.trim()]);
      setNewCard('');
      if (errors.cards) {
        setErrors(prev => ({ ...prev, cards: '' }));
      }
    }
  };

  const handleRemoveCard = (card: string) => {
    setSelectedCards(selectedCards.filter(c => c !== card));
  };

  const handleQuickAddCard = (card: string) => {
    if (!selectedCards.includes(card)) {
      setSelectedCards([...selectedCards, card]);
      if (errors.cards) {
        setErrors(prev => ({ ...prev, cards: '' }));
      }
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!clientId) {
      newErrors.clientId = '请选择客户';
    }
    
    if (!question.trim()) {
      newErrors.question = '请输入占卜问题';
    } else if (question.trim().length < 5) {
      newErrors.question = '问题至少需要5个字符';
    }
    
    if (selectedCards.length === 0) {
      newErrors.cards = '请至少选择一张塔罗牌';
    }
    
    if (!interpretation.trim()) {
      newErrors.interpretation = '请输入解读内容';
    } else if (interpretation.trim().length < 10) {
      newErrors.interpretation = '解读内容至少需要10个字符';
    }
    
    if (includeAdvice && !advice.trim()) {
      newErrors.advice = '请输入建议内容';
    }
    
    if (includeNextSteps && !nextSteps.trim()) {
      newErrors.nextSteps = '请输入下一步行动';
    }
    
    if (consultationFee && (isNaN(Number(consultationFee)) || Number(consultationFee) < 0)) {
      newErrors.consultationFee = '请输入有效的费用';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const shareSettings: ShareSettings = {
        isPublic,
        allowDownload,
        expiryDate: expiryDate ? new Date(expiryDate) : undefined,
        password: sharePassword || undefined,
        theme: presentationTheme,
        includeAdvice,
        includeNextSteps
      };

      const recordData: Omit<ProfessionalTarotRecord, 'id'> = {
        clientId,
        isForClient: true,
        date: editRecord?.date || new Date(),
        moonPhase: currentPhase?.name || '新月',
        question: question.trim(),
        cards: selectedCards,
        interpretation: interpretation.trim(),
        advice: includeAdvice ? advice.trim() : undefined,
        nextSteps: includeNextSteps ? nextSteps.trim() : undefined,
        consultationFee: consultationFee ? Number(consultationFee) : undefined,
        shareSettings,
        presentation: {
          theme: presentationTheme,
          includeAdvice,
          includeNextSteps
        }
      };

      let savedRecord: ProfessionalTarotRecord;
      
      if (editRecord) {
        updateProfessionalTarotRecord(editRecord.id, recordData);
        savedRecord = { ...editRecord, ...recordData };
      } else {
        savedRecord = addProfessionalTarotRecord(recordData);
        // 更新客户咨询次数
        updateClientConsultation(clientId);
      }

      // 生成分享链接
      if (isPublic) {
        try {
          await generateShareLink(savedRecord.id, clientId, shareSettings);
        } catch (error) {
          console.error('生成分享链接失败:', error);
        }
      }

      // 重置表单
      resetForm();
      onOpenChange(false);
    } catch (error) {
      console.error('保存专业塔罗记录时出错:', error);
      setErrors({ submit: '保存失败，请重试' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setClientId('');
    setQuestion('');
    setSelectedCards([]);
    setNewCard('');
    setInterpretation('');
    setAdvice('');
    setNextSteps('');
    setConsultationFee('');
    setPresentationTheme('classic');
    setIncludeAdvice(true);
    setIncludeNextSteps(true);
    setIsPublic(true);
    setAllowDownload(true);
    setSharePassword('');
    setExpiryDate('');
    setErrors({});
    setActiveTab('basic');
  };

  const getMoonPhaseGuidance = (phase: string) => {
    switch (phase) {
      case '新月':
        return "新月能量适合询问新开始、设定意图和规划未来的问题";
      case '满月':
        return "满月能量适合询问完成、收获、成果和反思的问题";
      case '上弦月':
        return "上弦月能量适合询问行动、决策和克服挑战的问题";
      case '下弦月':
        return "下弦月能量适合询问释放、清理和结束的问题";
      default:
        return "根据月相能量调整占卜问题和解读方向";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white/95 backdrop-blur-xl border-gray-200 text-gray-900 max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-light text-center flex items-center justify-center space-x-2">
            <Sparkles className="h-6 w-6 text-purple-600" />
            <span>{editRecord ? '编辑专业塔罗记录' : '创建专业塔罗记录'}</span>
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600">
            为客户创建专业的塔罗占卜记录，包含详细解读和分享设置。
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 错误提示 */}
          {errors.submit && (
            <Alert className="border-red-200 bg-red-50/80">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {errors.submit}
              </AlertDescription>
            </Alert>
          )}

          {/* 当前月相显示 */}
          {currentPhase && (
            <Card className="bg-purple-50/50 border-purple-200/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Moon className="h-5 w-5 text-purple-600" />
                  <span className="text-purple-700">当前月相</span>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-1">{currentPhase.emoji}</div>
                  <div className="text-gray-800 font-medium">{currentPhase.name}</div>
                  <div className="text-sm text-purple-600 mt-2">
                    {getMoonPhaseGuidance(currentPhase.name)}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">基础信息</TabsTrigger>
              <TabsTrigger value="presentation">展示设置</TabsTrigger>
              <TabsTrigger value="sharing">分享设置</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              {/* 客户选择 */}
              <div className="space-y-2">
                <Label className="text-gray-700">选择客户</Label>
                <ClientSelector
                  selectedClientId={clientId}
                  onClientSelect={setClientId}
                  placeholder="选择要为其占卜的客户"
                />
                {errors.clientId && (
                  <p className="text-red-600 text-sm">{errors.clientId}</p>
                )}
              </div>

              {/* 咨询费用 */}
              <div className="space-y-2">
                <Label htmlFor="fee" className="text-gray-700">咨询费用 (可选)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="fee"
                    type="number"
                    value={consultationFee}
                    onChange={(e) => setConsultationFee(e.target.value)}
                    placeholder="0"
                    className="pl-10 bg-white/70 border-gray-300"
                    min="0"
                    step="0.01"
                  />
                </div>
                {errors.consultationFee && (
                  <p className="text-red-600 text-sm">{errors.consultationFee}</p>
                )}
              </div>

              {/* 占卜问题 */}
              <div className="space-y-2">
                <Label htmlFor="question" className="text-gray-700">占卜问题</Label>
                <Textarea
                  id="question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="输入客户的占卜问题..."
                  className="bg-white/70 border-gray-300 min-h-[80px]"
                  rows={3}
                />
                {errors.question && (
                  <p className="text-red-600 text-sm">{errors.question}</p>
                )}
              </div>

              {/* 选择塔罗牌 */}
              <div className="space-y-3">
                <Label className="text-gray-700">抽取的塔罗牌</Label>
                {errors.cards && (
                  <p className="text-red-600 text-sm">{errors.cards}</p>
                )}
                
                {selectedCards.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-sm text-gray-600">已选择的牌:</div>
                    <div className="flex flex-wrap gap-2">
                      {selectedCards.map((card, index) => (
                        <Badge key={index} variant="secondary" className="bg-purple-100 text-purple-800 pr-1">
                          {card}
                          <button
                            type="button"
                            onClick={() => handleRemoveCard(card)}
                            className="ml-2 text-purple-600 hover:text-purple-800"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex space-x-2">
                  <Input
                    value={newCard}
                    onChange={(e) => setNewCard(e.target.value)}
                    placeholder="输入塔罗牌名称..."
                    className="bg-white/70 border-gray-300"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCard())}
                  />
                  <Button
                    type="button"
                    onClick={handleAddCard}
                    disabled={!newCard.trim()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <div className="text-sm text-gray-600">常用塔罗牌:</div>
                  <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                    {commonTarotCards.map((card) => (
                      <button
                        key={card}
                        type="button"
                        onClick={() => handleQuickAddCard(card)}
                        disabled={selectedCards.includes(card)}
                        className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                          selectedCards.includes(card)
                            ? 'bg-purple-600 text-white border-purple-600'
                            : 'bg-white/80 text-purple-700 border-purple-300 hover:bg-purple-50'
                        }`}
                      >
                        {card}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 牌面解读 */}
              <div className="space-y-2">
                <Label htmlFor="interpretation" className="text-gray-700">牌面解读</Label>
                <Textarea
                  id="interpretation"
                  value={interpretation}
                  onChange={(e) => setInterpretation(e.target.value)}
                  placeholder="详细解读这次占卜的牌面含义..."
                  className="bg-white/70 border-gray-300 min-h-[120px]"
                  rows={5}
                />
                {errors.interpretation && (
                  <p className="text-red-600 text-sm">{errors.interpretation}</p>
                )}
              </div>

              {/* 建议 */}
              <div className="space-y-2">
                <Label htmlFor="advice" className="text-gray-700">建议</Label>
                <Textarea
                  id="advice"
                  value={advice}
                  onChange={(e) => setAdvice(e.target.value)}
                  placeholder="给客户的建议和指导..."
                  className="bg-white/70 border-gray-300 min-h-[100px]"
                  rows={4}
                />
                {errors.advice && (
                  <p className="text-red-600 text-sm">{errors.advice}</p>
                )}
              </div>

              {/* 下一步行动 */}
              <div className="space-y-2">
                <Label htmlFor="nextSteps" className="text-gray-700">下一步行动</Label>
                <Textarea
                  id="nextSteps"
                  value={nextSteps}
                  onChange={(e) => setNextSteps(e.target.value)}
                  placeholder="建议客户采取的具体行动步骤..."
                  className="bg-white/70 border-gray-300 min-h-[100px]"
                  rows={4}
                />
                {errors.nextSteps && (
                  <p className="text-red-600 text-sm">{errors.nextSteps}</p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="presentation" className="space-y-4">
              {/* 主题选择 */}
              <div className="space-y-2">
                <Label className="text-gray-700">展示主题</Label>
                <Select value={presentationTheme} onValueChange={(value: 'classic' | 'modern' | 'mystical') => setPresentationTheme(value)}>
                  <SelectTrigger className="bg-white/70 border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200">
                    <SelectItem value="classic">经典主题</SelectItem>
                    <SelectItem value="modern">现代主题</SelectItem>
                    <SelectItem value="mystical">神秘主题</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 内容包含选项 */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <div className="font-medium">包含建议</div>
                    <div className="text-sm text-gray-600">在客户端显示建议内容</div>
                  </div>
                  <Switch
                    checked={includeAdvice}
                    onCheckedChange={setIncludeAdvice}
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <div className="font-medium">包含下一步行动</div>
                    <div className="text-sm text-gray-600">在客户端显示行动步骤</div>
                  </div>
                  <Switch
                    checked={includeNextSteps}
                    onCheckedChange={setIncludeNextSteps}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="sharing" className="space-y-4">
              {/* 分享权限 */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <div className="font-medium">公开分享</div>
                    <div className="text-sm text-gray-600">允许通过链接访问</div>
                  </div>
                  <Switch
                    checked={isPublic}
                    onCheckedChange={setIsPublic}
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <div className="font-medium">允许下载</div>
                    <div className="text-sm text-gray-600">允许客户保存和下载</div>
                  </div>
                  <Switch
                    checked={allowDownload}
                    onCheckedChange={setAllowDownload}
                  />
                </div>
              </div>

              {/* 访问密码 */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700">访问密码 (可选)</Label>
                <Input
                  id="password"
                  type="password"
                  value={sharePassword}
                  onChange={(e) => setSharePassword(e.target.value)}
                  placeholder="设置访问密码..."
                  className="bg-white/70 border-gray-300"
                />
              </div>

              {/* 过期时间 */}
              <div className="space-y-2">
                <Label htmlFor="expiry" className="text-gray-700">过期时间 (可选)</Label>
                <Input
                  id="expiry"
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="bg-white/70 border-gray-300"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </TabsContent>
          </Tabs>

          {/* 提交按钮 */}
          <div className="flex space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              取消
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600"
              disabled={isSubmitting}
            >
              {isSubmitting ? '保存中...' : (editRecord ? '更新记录' : '创建记录')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}; 