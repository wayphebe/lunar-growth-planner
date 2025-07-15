
import React from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Calendar, Target, Sparkles } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  startDate: Date;
  moonPhase: string;
  status: 'active' | 'completed' | 'paused';
}

interface TarotRecord {
  id: string;
  date: Date;
  moonPhase: string;
  question: string;
  cards: string[];
  projectId?: string;
}

interface TimelineItem {
  id: string;
  date: Date;
  type: 'project' | 'tarot';
  moonPhase: string;
  title: string;
  status?: string;
  cards?: string[];
}

interface MoonTimelineProps {
  projects: Project[];
  tarotRecords: TarotRecord[];
}

export const MoonTimeline: React.FC<MoonTimelineProps> = ({ projects = [], tarotRecords = [] }) => {
  // 合并并排序时间轴项目
  const timelineItems: TimelineItem[] = [
    ...projects.map(project => ({
      id: project.id,
      date: project.startDate,
      type: 'project' as const,
      moonPhase: project.moonPhase,
      title: project.title,
      status: project.status
    })),
    ...tarotRecords.map(record => ({
      id: record.id,
      date: record.date,
      type: 'tarot' as const,
      moonPhase: record.moonPhase,
      title: record.question,
      cards: record.cards
    }))
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  const getMoonPhaseEmoji = (phase: string) => {
    switch (phase) {
      case '新月': return '🌑';
      case '上弦月': return '🌓';
      case '满月': return '🌕';
      case '下弦月': return '🌗';
      default: return '🌙';
    }
  };

  const getTypeIcon = (type: string) => {
    return type === 'project' ? Target : Sparkles;
  };

  const getTypeColor = (type: string) => {
    return type === 'project' ? 'bg-primary/20 text-primary-foreground' : 'bg-secondary/20 text-secondary-foreground';
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active': return 'border-primary/30';
      case 'completed': return 'border-secondary/30';
      case 'paused': return 'border-muted/30';
      default: return 'border-border/30';
    }
  };

  if (timelineItems.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-card/60 backdrop-blur-sm flex items-center justify-center">
          <Calendar className="h-12 w-12 text-foreground/40" />
        </div>
        <h3 className="text-xl font-light tracking-wide text-foreground/90 mb-2">时间轴为空</h3>
        <p className="text-foreground/70 font-light">创建项目或记录塔罗占卜来构建你的月相时间轴</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center space-x-3 mb-8">
        <Calendar className="h-6 w-6 text-foreground/70" />
        <h2 className="text-2xl font-light tracking-wide text-foreground/90">月相时间轴</h2>
      </div>

      <div className="space-y-6">
        {timelineItems.map((item) => (
          <Card 
            key={item.id} 
            className={`p-6 group border-l-4 ${getStatusColor(item.status)}`}
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <Badge className={`${getTypeColor(item.type)} font-light`}>
                  {React.createElement(getTypeIcon(item.type), { className: 'h-4 w-4' })}
                </Badge>
              </div>

              <div className="flex-grow space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-xl filter drop-shadow-sm">{getMoonPhaseEmoji(item.moonPhase)}</span>
                  <span className="text-foreground/60 text-sm font-light">{item.moonPhase}</span>
                </div>

                <h3 className="text-lg font-light tracking-wide text-foreground/90">
                  {item.title}
                </h3>

                {item.cards && (
                  <div className="flex flex-wrap gap-2">
                    {item.cards.map((card, index) => (
                      <Badge 
                        key={index} 
                        variant="outline"
                        className="bg-card/60 text-foreground/70 border-border/30 font-light"
                      >
                        {card}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="text-sm text-foreground/60 font-light">
                  {item.date.toLocaleDateString('zh-CN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
