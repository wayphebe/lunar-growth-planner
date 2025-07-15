
import React from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Calendar, Target, Sparkles, Moon } from 'lucide-react';

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
}

interface MoonTimelineProps {
  projects: Project[];
  tarotRecords: TarotRecord[];
}

interface TimelineItem {
  id: string;
  date: Date;
  type: 'project' | 'tarot';
  moonPhase: string;
  title: string;
  subtitle?: string;
  status?: string;
  cards?: string[];
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
    return type === 'project' ? 'bg-blue-600' : 'bg-purple-600';
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active': return 'border-green-500';
      case 'completed': return 'border-blue-500';
      case 'paused': return 'border-yellow-500';
      default: return 'border-gray-500';
    }
  };

  if (timelineItems.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white/10 flex items-center justify-center">
          <Calendar className="h-12 w-12 text-purple-300" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">时间轴为空</h3>
        <p className="text-purple-200">创建项目或记录塔罗占卜来构建你的月相时间轴</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center space-x-3 mb-6">
        <Calendar className="h-6 w-6 text-purple-300" />
        <h2 className="text-2xl font-bold text-white">月相时间轴</h2>
        <Badge variant="secondary" className="bg-purple-600/80 text-white">
          {timelineItems.length} 个事件
        </Badge>
      </div>

      <div className="relative">
        {/* 时间轴线 */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 via-blue-500 to-purple-500 opacity-50"></div>

        <div className="space-y-6">
          {timelineItems.map((item, index) => {
            const Icon = getTypeIcon(item.type);
            return (
              <div key={item.id} className="relative flex items-start space-x-6">
                {/* 时间轴节点 */}
                <div className={`flex-shrink-0 w-16 h-16 rounded-full ${getTypeColor(item.type)} flex items-center justify-center border-4 ${getStatusColor(item.status)} shadow-lg z-10`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>

                {/* 内容卡片 */}
                <Card className={`flex-1 bg-white/10 backdrop-blur-md border-white/20 p-6 ${index === 0 ? 'ring-2 ring-purple-500/50' : ''}`}>
                  <div className="space-y-3">
                    {/* 标题行 */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                        <Badge className={getTypeColor(item.type)} style={{ backgroundColor: item.type === 'project' ? '#2563eb' : '#9333ea' }}>
                          {item.type === 'project' ? '项目' : '塔罗'}
                        </Badge>
                      </div>
                      {index === 0 && (
                        <Badge variant="outline" className="border-purple-400 text-purple-200">
                          最新
                        </Badge>
                      )}
                    </div>

                    {/* 月相和日期 */}
                    <div className="flex items-center space-x-4 text-sm text-purple-200">
                      <div className="flex items-center space-x-2">
                        <Moon className="h-4 w-4" />
                        <span>{getMoonPhaseEmoji(item.moonPhase)} {item.moonPhase}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>{item.date.toLocaleDateString('zh-CN', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}</span>
                      </div>
                    </div>

                    {/* 项目状态或塔罗牌 */}
                    {item.type === 'project' && item.status && (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-purple-300">状态:</span>
                        <Badge variant="outline" className={`text-xs ${getStatusColor(item.status).replace('border-', 'border-')}`}>
                          {item.status === 'active' ? '进行中' : item.status === 'completed' ? '已完成' : '已暂停'}
                        </Badge>
                      </div>
                    )}

                    {item.type === 'tarot' && item.cards && item.cards.length > 0 && (
                      <div>
                        <span className="text-sm text-purple-300 block mb-2">抽取的牌:</span>
                        <div className="flex flex-wrap gap-1">
                          {item.cards.slice(0, 3).map((card, cardIndex) => (
                            <Badge key={cardIndex} variant="outline" className="text-xs border-purple-400 text-purple-200">
                              {card}
                            </Badge>
                          ))}
                          {item.cards.length > 3 && (
                            <Badge variant="outline" className="text-xs border-purple-400 text-purple-200">
                              +{item.cards.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
