
import React from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Calendar, Target, Sparkles } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  moonPhase: string;
  startDate: Date;
  targetDate?: Date;
  progress: number;
  status: 'active' | 'completed' | 'paused';
  tarotRecords?: string[];
}

interface ProjectOverviewProps {
  projects: Project[];
}

export const ProjectOverview: React.FC<ProjectOverviewProps> = ({ projects = [] }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-primary/20 text-primary-foreground';
      case 'completed': return 'bg-secondary/20 text-secondary-foreground';
      case 'paused': return 'bg-muted/20 text-muted-foreground';
      default: return 'bg-accent/20 text-accent-foreground';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return '进行中';
      case 'completed': return '已完成';
      case 'paused': return '已暂停';
      default: return '未知';
    }
  };

  const getMoonPhaseEmoji = (phase: string) => {
    switch (phase) {
      case '新月': return '🌑';
      case '上弦月': return '🌓';
      case '满月': return '🌕';
      case '下弦月': return '🌗';
      default: return '🌙';
    }
  };

  if (projects.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-card/60 backdrop-blur-sm flex items-center justify-center">
          <Target className="h-12 w-12 text-foreground/40" />
        </div>
        <h3 className="text-xl font-light tracking-wide text-foreground/90 mb-2">还没有项目</h3>
        <p className="text-foreground/70 font-light">创建你的第一个月相项目，开始你的成长之旅</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center space-x-3 mb-8">
        <Target className="h-6 w-6 text-foreground/70" />
        <h2 className="text-2xl font-light tracking-wide text-foreground/90">项目概览</h2>
        <Badge variant="secondary" className="bg-secondary/20 text-secondary-foreground font-light">
          {projects.length} 个项目
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="p-6 group">
            <div className="space-y-4">
              {/* 项目标题和状态 */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-light tracking-wide text-foreground/90 mb-2">{project.title}</h3>
                  <p className="text-foreground/70 text-sm line-clamp-2 font-light">{project.description}</p>
                </div>
                <Badge className={`${getStatusColor(project.status)} ml-3 font-light`}>
                  {getStatusText(project.status)}
                </Badge>
              </div>

              {/* 月相信息 */}
              <div className="flex items-center space-x-2">
                <span className="text-xl filter drop-shadow-sm">{getMoonPhaseEmoji(project.moonPhase)}</span>
                <span className="text-foreground/60 text-sm font-light">始于{project.moonPhase}</span>
              </div>

              {/* 进度条 */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-foreground/60 font-light">进度</span>
                  <span className="text-foreground/80 font-light">{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-1.5" />
              </div>

              {/* 日期信息 */}
              <div className="flex items-center justify-between text-sm text-foreground/60 font-light">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(project.startDate).toLocaleDateString()}</span>
                </div>
                {project.tarotRecords && project.tarotRecords.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <Sparkles className="h-4 w-4" />
                    <span>{project.tarotRecords.length} 次占卜</span>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
