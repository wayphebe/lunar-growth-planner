
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Sparkles, Moon, Plus, X, AlertTriangle } from 'lucide-react';
import { useTarotRecords } from '../hooks/useTarotRecords';
import { useProjects } from '../hooks/useProjects';
import { MoonPhase, TarotRecord } from '../lib/types';

interface TarotModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPhase: MoonPhase | null;
  editRecord?: TarotRecord | null;
}

const commonTarotCards = [
  '愚者', '魔术师', '女祭司', '皇后', '皇帝', '教皇', '恋人', '战车',
  '力量', '隐者', '命运之轮', '正义', '倒吊人', '死神', '节制', '恶魔',
  '塔', '星星', '月亮', '太阳', '审判', '世界'
];

export const TarotModal: React.FC<TarotModalProps> = ({ 
  open, 
  onOpenChange, 
  currentPhase,
  editRecord 
}) => {
  const { addTarotRecord, updateTarotRecord } = useTarotRecords();
  const { projects } = useProjects();
  const [question, setQuestion] = useState(editRecord?.question || '');
  const [selectedCards, setSelectedCards] = useState<string[]>(editRecord?.cards || []);
  const [newCard, setNewCard] = useState('');
  const [interpretation, setInterpretation] = useState(editRecord?.interpretation || '');
  const [projectId, setProjectId] = useState(editRecord?.projectId || 'none');
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    
    // 验证问题
    if (!question.trim()) {
      newErrors.question = '请输入占卜问题';
    } else if (question.trim().length < 5) {
      newErrors.question = '问题至少需要5个字符';
    } else if (question.trim().length > 500) {
      newErrors.question = '问题不能超过500个字符';
    }
    
    // 验证塔罗牌
    if (selectedCards.length === 0) {
      newErrors.cards = '请至少选择一张塔罗牌';
    } else if (selectedCards.length > 10) {
      newErrors.cards = '最多只能选择10张牌';
    }
    
    // 验证解读（可选，但如果填写了需要最少字符数）
    if (interpretation.trim() && interpretation.trim().length < 10) {
      newErrors.interpretation = '解读内容至少需要10个字符';
    } else if (interpretation.trim().length > 2000) {
      newErrors.interpretation = '解读内容不能超过2000个字符';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const recordData = {
        date: editRecord?.date || new Date(),
        moonPhase: currentPhase?.name || '新月',
        question: question.trim(),
        cards: selectedCards,
        interpretation: interpretation.trim(),
        projectId: projectId === 'none' ? undefined : projectId
      };

      if (editRecord) {
        updateTarotRecord(editRecord.id, recordData);
      } else {
        addTarotRecord(recordData);
      }

      // 重置表单
      setQuestion('');
      setSelectedCards([]);
      setNewCard('');
      setInterpretation('');
      setProjectId('none');
      setErrors({});
      onOpenChange(false);
    } catch (error) {
      console.error('保存塔罗记录时出错:', error);
      setErrors({ submit: '保存失败，请重试' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white/95 backdrop-blur-xl border-gray-200 text-gray-900 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-light text-center flex items-center justify-center space-x-2">
            <Sparkles className="h-6 w-6 text-purple-600" />
            <span>{editRecord ? '编辑塔罗记录' : '记录塔罗占卜'}</span>
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600">
            记录你的塔罗牌占卜结果，包括问题、抽取的牌和解读。
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
            <div className="bg-purple-50/50 rounded-lg p-4 border border-purple-200/50 text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Moon className="h-5 w-5 text-purple-600" />
                <span className="text-purple-700">当前月相</span>
              </div>
              <div className="text-2xl mb-1">{currentPhase.emoji}</div>
              <div className="text-gray-800 font-medium">{currentPhase.name}</div>
              <div className="text-sm text-purple-600 mt-2">
                {currentPhase.name === '新月' && "新月适合询问新开始和设定意图的问题"}
                {currentPhase.name === '满月' && "满月适合询问完成、收获和反思的问题"}
                {currentPhase.name === '上弦月' && "上弦月适合询问行动和克服挑战的问题"}
                {currentPhase.name === '下弦月' && "下弦月适合询问释放和清理的问题"}
              </div>
            </div>
          )}

          {/* 占卜问题 */}
          <div className="space-y-2">
            <Label htmlFor="question" className="text-gray-700">占卜问题</Label>
            <Textarea
              id="question"
              value={question}
              onChange={(e) => {
                setQuestion(e.target.value);
                if (errors.question) {
                  setErrors(prev => ({ ...prev, question: '' }));
                }
              }}
              placeholder="输入你想要占卜的问题..."
              className={`bg-white/70 border-gray-300 text-gray-900 placeholder:text-gray-400 min-h-[80px] ${
                errors.question ? 'border-red-400' : ''
              }`}
              rows={3}
              required
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
            
            {/* 当前选择的牌 */}
            {selectedCards.length > 0 && (
              <div className="space-y-2">
                <div className="text-sm text-gray-600">已选择的牌:</div>
                <div className="flex flex-wrap gap-2">
                  {selectedCards.map((card, index) => (
                    <Badge key={index} variant="secondary" className="bg-purple-100 text-purple-800 pr-1 border border-purple-200">
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

            {/* 手动添加牌 */}
            <div className="flex space-x-2">
              <Input
                value={newCard}
                onChange={(e) => setNewCard(e.target.value)}
                placeholder="输入塔罗牌名称..."
                className="bg-white/70 border-gray-300 text-gray-900 placeholder:text-gray-400"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCard())}
              />
              <Button
                type="button"
                onClick={handleAddCard}
                className="bg-purple-600 hover:bg-purple-700 text-white"
                disabled={!newCard.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* 常用塔罗牌快选 */}
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
              onChange={(e) => {
                setInterpretation(e.target.value);
                if (errors.interpretation) {
                  setErrors(prev => ({ ...prev, interpretation: '' }));
                }
              }}
              placeholder="记录你对这次占卜的解读和感受..."
              className={`bg-white/70 border-gray-300 text-gray-900 placeholder:text-gray-400 min-h-[120px] ${
                errors.interpretation ? 'border-red-400' : ''
              }`}
              rows={5}
            />
            {errors.interpretation && (
              <p className="text-red-600 text-sm">{errors.interpretation}</p>
            )}
          </div>

          {/* 关联项目 */}
          <div className="space-y-2">
            <Label className="text-gray-700">关联项目 (可选)</Label>
            <Select value={projectId} onValueChange={setProjectId}>
              <SelectTrigger className="bg-white/70 border-gray-300 text-gray-900">
                <SelectValue placeholder="选择要关联的项目" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200">
                <SelectItem value="none" className="text-gray-900 hover:bg-gray-100">不关联项目</SelectItem>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id} className="text-gray-900 hover:bg-gray-100">
                    {project.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 提交按钮 */}
          <div className="flex space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              取消
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? '保存中...' : (editRecord ? '更新记录' : '保存占卜')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
