
import React from 'react';
import { useProjects } from '@/hooks/useProjects';
import { Badge } from '@/components/ui/badge';
import { Target, Calendar, ArrowRight, Moon } from 'lucide-react';
import { format } from 'date-fns';
import { Progress } from '@/components/ui/progress';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export const ProjectOverview: React.FC = () => {
  const { projects } = useProjects();

  if (!projects.length) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-foreground/5 backdrop-blur-sm flex items-center justify-center">
          <Target className="w-8 h-8 text-foreground/30" />
        </div>
        <p className="text-foreground/70 font-light">还没有创建任何项目</p>
        <p className="text-sm text-foreground/50 mt-2">点击"新建项目"开始你的月相之旅</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-foreground/15 text-foreground';
      case 'completed':
        return 'bg-foreground/10 text-foreground/70';
      default:
        return 'bg-foreground/5 text-foreground/50';
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

  return (
    <div className="space-y-4">
      {projects.map(project => (
        <HoverCard key={project.id}>
          <HoverCardTrigger asChild>
            <div className="group bg-background/30 backdrop-blur-sm rounded-lg border border-border/10 p-4 hover:bg-background/40 transition-all duration-200 cursor-pointer">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-foreground/10 flex items-center justify-center">
                      <Target className="h-4 w-4 text-foreground/70" />
                    </div>
                    <h3 className="font-light text-lg group-hover:text-foreground/90 transition-colors">
                      {project.title}
                    </h3>
                  </div>
                  <p className="text-sm text-foreground/70 line-clamp-2">
                    {project.description}
                  </p>
                </div>
                <Badge
                  className={`${getStatusColor(project.status)} font-light`}
                >
                  {project.status === 'active' ? '进行中' : '已完成'}
                </Badge>
              </div>

              <div className="mt-4 space-y-3">
                <div className="flex flex-wrap gap-4 text-sm text-foreground/70">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {format(project.startDate, 'MM/dd')}
                      {project.targetDate && (
                        <>
                          <ArrowRight className="inline h-4 w-4 mx-1" />
                          {format(project.targetDate, 'MM/dd')}
                        </>
                      )}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Moon className="h-4 w-4" />
                    <span>{project.moonPhase}</span>
                    <span className="text-lg filter drop-shadow-sm">
                      {getMoonPhaseEmoji(project.moonPhase)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Progress value={project.progress} className="flex-grow" />
                  <span className="text-sm text-foreground/70 min-w-[3ch]">
                    {project.progress}%
                  </span>
                </div>
              </div>
            </div>
          </HoverCardTrigger>
          <HoverCardContent 
            className="w-80 bg-background/95 backdrop-blur-xl border-border/20"
          >
            <div className="space-y-2">
              <h4 className="font-medium">{project.title}</h4>
              <p className="text-sm text-foreground/70">{project.description}</p>
              <div className="pt-2 border-t border-border/10">
                <div className="text-sm text-foreground/70">
                  创建于 {format(project.startDate, 'yyyy年MM月dd日')}
                  <br />
                  {project.moonPhase}期间
                </div>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      ))}
    </div>
  );
};
