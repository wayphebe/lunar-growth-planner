
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Sparkles, Moon, Plus, X } from 'lucide-react';
import { useTarotRecords } from '../hooks/useTarotRecords';
import { useProjects } from '../hooks/useProjects';

interface MoonPhase {
  name: string;
  illumination: number;
  emoji: string;
}

interface TarotModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPhase: MoonPhase | null;
  editRecord?: any;
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
  const [projectId, setProjectId] = useState(editRecord?.projectId || '');

  const handleAddCard = () => {
    if (newCard.trim() && !selectedCards.includes(newCard.trim())) {
      setSelectedCards([...selectedCards, newCard.trim()]);
      setNewCard('');
    }
  };

  const handleRemoveCard = (card: string) => {
    setSelectedCards(selectedCards.filter(c => c !== card));
  };

  const handleQuickAddCard = (card: string) => {
    if (!selectedCards.includes(card)) {
      setSelectedCards([...selectedCards, card]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!question.trim() || selectedCards.length === 0) return;

    const recordData = {
      date: editRecord?.date || new Date(),
      moonPhase: currentPhase?.name || '新月',
      question: question.trim(),
      cards: selectedCards,
      interpretation: interpretation.trim(),
      projectId: projectId || undefined
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
    setProjectId('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900 border-purple-500/30 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center flex items-center justify-center space-x-2">
            <Sparkles className="h-6 w-6 text-purple-400" />
            <span>{editRecord ? '编辑塔罗记录' : '记录塔罗占卜'}</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 当前月相显示 */}
          {currentPhase && (
            <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-500/30 text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Moon className="h-5 w-5 text-purple-300" />
                <span className="text-purple-200">当前月相</span>
              </div>
              <div className="text-2xl mb-1">{currentPhase.emoji}</div>
              <div className="text-white font-medium">{currentPhase.name}</div>
              <div className="text-sm text-purple-300 mt-2">
                {currentPhase.name === '新月' && "新月适合询问新开始和设定意图的问题"}
                {currentPhase.name === '满月' && "满月适合询问完成、收获和反思的问题"}
                {currentPhase.name === '上弦月' && "上弦月适合询问行动和克服挑战的问题"}
                {currentPhase.name === '下弦月' && "下弦月适合询问释放和清理的问题"}
              </div>
            </div>
          )}

          {/* 占卜问题 */}
          <div className="space-y-2">
            <Label htmlFor="question" className="text-purple-200">占卜问题</Label>
            <Textarea
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="输入你想要占卜的问题..."
              className="bg-white/10 border-purple-500/30 text-white placeholder:text-purple-300 min-h-[80px]"
              rows={3}
              required
            />
          </div>

          {/* 选择塔罗牌 */}
          <div className="space-y-3">
            <Label className="text-purple-200">抽取的塔罗牌</Label>
            
            {/* 当前选择的牌 */}
            {selectedCards.length > 0 && (
              <div className="space-y-2">
                <div className="text-sm text-purple-300">已选择的牌:</div>
                <div className="flex flex-wrap gap-2">
                  {selectedCards.map((card, index) => (
                    <Badge key={index} variant="secondary" className="bg-purple-600 text-white pr-1">
                      {card}
                      <button
                        type="button"
                        onClick={() => handleRemoveCard(card)}
                        className="ml-2 text-purple-200 hover:text-white"
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
                className="bg-white/10 border-purple-500/30 text-white placeholder:text-purple-300"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCard())}
              />
              <Button
                type="button"
                onClick={handleAddCard}
                className="bg-purple-600 hover:bg-purple-700"
                disabled={!newCard.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* 常用塔罗牌快选 */}
            <div className="space-y-2">
              <div className="text-sm text-purple-300">常用塔罗牌:</div>
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
                        : 'bg-white/10 text-purple-200 border-purple-500/30 hover:bg-purple-600/20'
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
            <Label htmlFor="interpretation" className="text-purple-200">牌面解读</Label>
            <Textarea
              id="interpretation"
              value={interpretation}
              onChange={(e) => setInterpretation(e.target.value)}
              placeholder="记录你对这次占卜的解读和感受..."
              className="bg-white/10 border-purple-500/30 text-white placeholder:text-purple-300 min-h-[120px]"
              rows={5}
            />
          </div>

          {/* 关联项目 */}
          <div className="space-y-2">
            <Label className="text-purple-200">关联项目 (可选)</Label>
            <Select value={projectId} onValueChange={setProjectId}>
              <SelectTrigger className="bg-white/10 border-purple-500/30 text-white">
                <SelectValue placeholder="选择要关联的项目" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-purple-500/30">
                <SelectItem value="" className="text-white hover:bg-purple-600/20">不关联项目</SelectItem>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id} className="text-white hover:bg-purple-600/20">
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
              className="flex-1 border-purple-500/30 text-purple-200 hover:bg-purple-600/20"
            >
              取消
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              disabled={!question.trim() || selectedCards.length === 0}
            >
              {editRecord ? '更新记录' : '保存占卜'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
