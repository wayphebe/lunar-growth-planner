
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { CalendarIcon, Moon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../lib/utils';
import { useProjects } from '../hooks/useProjects';

interface MoonPhase {
  name: string;
  illumination: number;
  emoji: string;
}

interface ProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPhase: MoonPhase | null;
  editProject?: any;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ 
  open, 
  onOpenChange, 
  currentPhase,
  editProject 
}) => {
  const { addProject, updateProject } = useProjects();
  const [title, setTitle] = useState(editProject?.title || '');
  const [description, setDescription] = useState(editProject?.description || '');
  const [moonPhase, setMoonPhase] = useState(editProject?.moonPhase || currentPhase?.name || '新月');
  const [targetDate, setTargetDate] = useState<Date | undefined>(editProject?.targetDate);
  const [status, setStatus] = useState(editProject?.status || 'active');

  const moonPhases = [
    { name: '新月', emoji: '🌑' },
    { name: '上弦月', emoji: '🌓' },
    { name: '满月', emoji: '🌕' },
    { name: '下弦月', emoji: '🌗' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;

    const projectData = {
      title: title.trim(),
      description: description.trim(),
      moonPhase,
      startDate: editProject?.startDate || new Date(),
      targetDate,
      progress: editProject?.progress || 0,
      status: status as 'active' | 'completed' | 'paused',
      tarotRecords: editProject?.tarotRecords || []
    };

    if (editProject) {
      updateProject(editProject.id, projectData);
    } else {
      addProject(projectData);
    }

    // 重置表单
    setTitle('');
    setDescription('');
    setMoonPhase(currentPhase?.name || '新月');
    setTargetDate(undefined);
    setStatus('active');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background/95 backdrop-blur-xl border border-border/20 text-foreground max-w-md shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-extralight tracking-wide text-center flex items-center justify-center gap-3">
            <Moon className="h-6 w-6 text-foreground/70" strokeWidth={1.5} />
            {editProject ? '编辑项目' : '创建新项目'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 项目标题 */}
          <div className="space-y-3">
            <Label htmlFor="title" className="text-foreground/70 font-light">项目标题</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="输入项目标题..."
              className="bg-background/50 border-border/20 text-foreground placeholder:text-foreground/40 font-light transition-all duration-300 hover:bg-background/70 focus:bg-background/70"
              required
            />
          </div>

          {/* 项目描述 */}
          <div className="space-y-3">
            <Label htmlFor="description" className="text-foreground/70 font-light">项目描述</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="描述你的项目目标和计划..."
              className="bg-background/50 border-border/20 text-foreground placeholder:text-foreground/40 font-light min-h-[100px] transition-all duration-300 hover:bg-background/70 focus:bg-background/70"
              rows={3}
            />
          </div>

          {/* 月相选择 */}
          <div className="space-y-3">
            <Label className="text-foreground/70 font-light">关联月相</Label>
            <Select value={moonPhase} onValueChange={setMoonPhase}>
              <SelectTrigger className="bg-background/50 border-border/20 text-foreground font-light transition-all duration-300 hover:bg-background/70">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-background/95 backdrop-blur-xl border-border/20">
                {moonPhases.map((phase) => (
                  <SelectItem 
                    key={phase.name} 
                    value={phase.name} 
                    className="text-foreground hover:bg-foreground/5 font-light"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{phase.emoji}</span>
                      <span>{phase.name}</span>
                      {phase.name === currentPhase?.name && (
                        <span className="text-xs text-foreground/50">(当前)</span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 目标日期 */}
          <div className="space-y-3">
            <Label className="text-foreground/70 font-light">目标完成日期 (可选)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-light bg-background/50 border-border/20 text-foreground transition-all duration-300 hover:bg-background/70",
                    !targetDate && "text-foreground/40"
                  )}
                >
                  <CalendarIcon className="mr-3 h-4 w-4" strokeWidth={1.5} />
                  {targetDate ? format(targetDate, 'yyyy年MM月dd日') : <span>选择目标日期</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-background/95 backdrop-blur-xl border-border/20" align="start">
                <Calendar
                  mode="single"
                  selected={targetDate}
                  onSelect={setTargetDate}
                  initialFocus
                  className="rounded-md border-0"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* 状态选择 (仅编辑时显示) */}
          {editProject && (
            <div className="space-y-3">
              <Label className="text-foreground/70 font-light">项目状态</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="bg-background/50 border-border/20 text-foreground font-light transition-all duration-300 hover:bg-background/70">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background/95 backdrop-blur-xl border-border/20">
                  <SelectItem value="active" className="text-foreground hover:bg-foreground/5 font-light">进行中</SelectItem>
                  <SelectItem value="paused" className="text-foreground hover:bg-foreground/5 font-light">已暂停</SelectItem>
                  <SelectItem value="completed" className="text-foreground hover:bg-foreground/5 font-light">已完成</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* 月相建议 */}
          <div className="bg-foreground/5 backdrop-blur-sm rounded-lg p-6 border border-border/20">
            <div className="flex items-center gap-3 mb-3">
              <Moon className="h-5 w-5 text-foreground/60" strokeWidth={1.5} />
              <span className="text-sm font-light text-foreground/70">月相能量指引</span>
            </div>
            <p className="text-sm text-foreground/60 leading-relaxed font-extralight">
              {moonPhase === '新月' && "新月是播种新想法的时机，适合开始新项目和设定意图。"}
              {moonPhase === '上弦月' && "上弦月带来行动的能量，适合推进项目和克服挑战。"}
              {moonPhase === '满月' && "满月是收获和反思的时期，适合完成项目和总结经验。"}
              {moonPhase === '下弦月' && "下弦月是释放和清理的阶段，适合整理项目和放下阻碍。"}
            </p>
          </div>

          {/* 提交按钮 */}
          <div className="flex gap-4 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 border-border/20 text-foreground/70 hover:bg-foreground/5 font-light transition-all duration-300"
            >
              取消
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-foreground/10 hover:bg-foreground/15 text-foreground font-light transition-all duration-300"
            >
              {editProject ? '更新项目' : '创建项目'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
