
import React from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Sparkles, Calendar, Moon } from 'lucide-react';

interface TarotRecord {
  id: string;
  date: Date;
  moonPhase: string;
  question: string;
  cards: string[];
  interpretation: string;
  projectId?: string;
}

interface TarotRecordPreviewProps {
  records: TarotRecord[];
}

export const TarotRecordPreview: React.FC<TarotRecordPreviewProps> = ({ records = [] }) => {
  const getMoonPhaseEmoji = (phase: string) => {
    switch (phase) {
      case '新月': return '🌑';
      case '满月': return '🌕';
      case '上弦月': return '🌓';
      case '下弦月': return '🌗';
      default: return '🌙';
    }
  };

  const getMoonPhaseColor = (phase: string) => {
    switch (phase) {
      case '新月': return 'bg-slate-600';
      case '满月': return 'bg-yellow-600';
      case '上弦月': return 'bg-blue-600';
      case '下弦月': return 'bg-purple-600';
      default: return 'bg-gray-600';
    }
  };

  const recentRecords = records.slice(0, 3);

  if (records.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white/10 flex items-center justify-center">
          <Sparkles className="h-12 w-12 text-purple-300" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">还没有塔罗记录</h3>
        <p className="text-purple-200">在新月或满月时进行塔罗占卜，获得宇宙的指引</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center space-x-3 mb-6">
        <Sparkles className="h-6 w-6 text-purple-300" />
        <h2 className="text-2xl font-bold text-white">塔罗记录</h2>
        <Badge variant="secondary" className="bg-purple-600/80 text-white">
          {records.length} 次占卜
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recentRecords.map((record) => (
          <Card key={record.id} className="bg-white/10 backdrop-blur-md border-white/20 p-6 hover:bg-white/15 transition-all duration-300">
            <div className="space-y-4">
              {/* 日期和月相 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-purple-300" />
                  <span className="text-purple-200 text-sm">
                    {record.date.toLocaleDateString('zh-CN')}
                  </span>
                </div>
                <Badge className={`${getMoonPhaseColor(record.moonPhase)} text-white`}>
                  {getMoonPhaseEmoji(record.moonPhase)} {record.moonPhase}
                </Badge>
              </div>

              {/* 问题 */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">占卜问题</h3>
                <p className="text-purple-200 text-sm line-clamp-2">{record.question}</p>
              </div>

              {/* 牌面 */}
              <div>
                <h4 className="text-sm font-medium text-purple-300 mb-2">抽取的牌</h4>
                <div className="flex flex-wrap gap-1">
                  {record.cards.map((card, index) => (
                    <Badge key={index} variant="outline" className="text-xs border-purple-400 text-purple-200">
                      {card}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* 解读预览 */}
              <div>
                <h4 className="text-sm font-medium text-purple-300 mb-2">解读</h4>
                <p className="text-purple-200 text-sm line-clamp-3">{record.interpretation}</p>
              </div>

              {/* 关联项目 */}
              {record.projectId && (
                <div className="flex items-center space-x-2 text-sm text-purple-300 pt-2 border-t border-white/10">
                  <Moon className="h-4 w-4" />
                  <span>已关联项目</span>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {records.length > 3 && (
        <div className="text-center mt-6">
          <button className="text-purple-300 hover:text-white transition-colors text-sm">
            查看全部 {records.length} 次占卜记录 →
          </button>
        </div>
      )}
    </div>
  );
};
