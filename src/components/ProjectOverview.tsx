
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
      case 'active': return 'bg-green-600';
      case 'completed': return 'bg-blue-600';
      case 'paused': return 'bg-yellow-600';
      default: return 'bg-gray-600';
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
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white/10 flex items-center justify-center">
          <Target className="h-12 w-12 text-purple-300" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">还没有项目</h3>
        <p className="text-purple-200">创建你的第一个月相项目，开始你的成长之旅</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center space-x-3 mb-6">
        <Target className="h-6 w-6 text-purple-300" />
        <h2 className="text-2xl font-bold text-white">项目概览</h2>
        <Badge variant="secondary" className="bg-purple-600/80 text-white">
          {projects.length} 个项目
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="bg-white/10 backdrop-blur-md border-white/20 p-6 hover:bg-white/15 transition-all duration-300">
            <div className="space-y-4">
              {/* 项目标题和状态 */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">{project.title}</h3>
                  <p className="text-purple-200 text-sm line-clamp-2">{project.description}</p>
                </div>
                <Badge className={`${getStatusColor(project.status)} text-white ml-3`}>
                  {getStatusText(project.status)}
                </Badge>
              </div>

              {/* 月相信息 */}
              <div className="flex items-center space-x-2">
                <span className="text-xl">{getMoonPhaseEmoji(project.moonPhase)}</span>
                <span className="text-purple-200 text-sm">始于{project.moonPhase}</span>
              </div>

              {/* 进度条 */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-purple-200">进度</span>
                  <span className="text-white font-medium">{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2" />
              </div>

              {/* 日期信息 */}
              <div className="flex items-center justify-between text-sm text-purple-300">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{project.startDate.toLocaleDateString('zh-CN')}</span>
                </div>
                {project.targetDate && (
                  <span>目标: {project.targetDate.toLocaleDateString('zh-CN')}</span>
                )}
              </div>

              {/* 塔罗记录指示 */}
              {project.tarotRecords && project.tarotRecords.length > 0 && (
                <div className="flex items-center space-x-2 text-sm text-purple-300">
                  <Sparkles className="h-4 w-4" />
                  <span>{project.tarotRecords.length} 次塔罗占卜</span>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
