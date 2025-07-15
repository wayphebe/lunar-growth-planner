import React, { useState } from 'react';
import { ClientProfile, ProfessionalTarotRecord } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Calendar, 
  Moon, 
  Sparkles, 
  Eye, 
  DollarSign,
  Search,
  Filter,
  ArrowUpDown
} from 'lucide-react';
import { format } from 'date-fns';
import { useProfessionalTarotRecords } from '@/hooks/useProfessionalTarotRecords';
import { useShareLinks } from '@/hooks/useShareLinks';

interface ClientHistoryProps {
  client: ClientProfile;
  onRecordSelect?: (record: ProfessionalTarotRecord) => void;
}

export const ClientHistory: React.FC<ClientHistoryProps> = ({ 
  client, 
  onRecordSelect 
}) => {
  const { getClientTarotRecords } = useProfessionalTarotRecords();
  const { getShareLinksByClient } = useShareLinks();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'fee'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedRecord, setSelectedRecord] = useState<ProfessionalTarotRecord | null>(null);

  const clientRecords = getClientTarotRecords(client.id);
  const clientShareLinks = getShareLinksByClient(client.id);

  // 搜索过滤
  const filteredRecords = clientRecords.filter(record => 
    record.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.interpretation.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.cards.some(card => card.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // 排序
  const sortedRecords = [...filteredRecords].sort((a, b) => {
    if (sortBy === 'date') {
      return sortOrder === 'desc' 
        ? new Date(b.date).getTime() - new Date(a.date).getTime()
        : new Date(a.date).getTime() - new Date(b.date).getTime();
    } else {
      const aFee = a.consultationFee || 0;
      const bFee = b.consultationFee || 0;
      return sortOrder === 'desc' ? bFee - aFee : aFee - bFee;
    }
  });

  const getMoonPhaseEmoji = (phase: string) => {
    switch (phase) {
      case '新月': return '🌑';
      case '上弦月': return '🌓';
      case '满月': return '🌕';
      case '下弦月': return '🌗';
      default: return '🌙';
    }
  };

  const getRecordShareLink = (recordId: string) => {
    return clientShareLinks.find(link => link.tarotRecordId === recordId);
  };

  const totalFees = clientRecords.reduce((sum, record) => sum + (record.consultationFee || 0), 0);

  return (
    <div className="space-y-4">
      {/* 统计信息 */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-white/50 border-gray-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{clientRecords.length}</div>
            <div className="text-sm text-gray-600">总咨询次数</div>
          </CardContent>
        </Card>
        <Card className="bg-white/50 border-gray-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">¥{totalFees}</div>
            <div className="text-sm text-gray-600">总收入</div>
          </CardContent>
        </Card>
        <Card className="bg-white/50 border-gray-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{clientShareLinks.length}</div>
            <div className="text-sm text-gray-600">分享链接</div>
          </CardContent>
        </Card>
      </div>

      {/* 搜索和排序 */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="搜索记录..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/70"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => {
            if (sortBy === 'date') {
              setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
            } else {
              setSortBy('date');
              setSortOrder('desc');
            }
          }}
          className="flex items-center gap-2"
        >
          <Calendar className="h-4 w-4" />
          日期
          <ArrowUpDown className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            if (sortBy === 'fee') {
              setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
            } else {
              setSortBy('fee');
              setSortOrder('desc');
            }
          }}
          className="flex items-center gap-2"
        >
          <DollarSign className="h-4 w-4" />
          费用
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      </div>

      {/* 记录列表 */}
      <div className="space-y-3">
        {sortedRecords.length > 0 ? (
          sortedRecords.map((record) => {
            const shareLink = getRecordShareLink(record.id);
            
            return (
              <Card key={record.id} className="bg-white/50 border-gray-200 hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {format(record.date, 'yyyy/MM/dd HH:mm')}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <Moon className="h-4 w-4" />
                          {record.moonPhase}
                          <span className="text-lg">{getMoonPhaseEmoji(record.moonPhase)}</span>
                        </div>
                        {record.consultationFee && (
                          <Badge variant="secondary" className="bg-green-100 text-green-700">
                            ¥{record.consultationFee}
                          </Badge>
                        )}
                      </div>

                      <h3 className="font-medium text-gray-900 mb-2">{record.question}</h3>

                      <div className="flex flex-wrap gap-1 mb-2">
                        {record.cards.map((card, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {card}
                          </Badge>
                        ))}
                      </div>

                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                        {record.interpretation}
                      </p>

                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        {shareLink && (
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            <span>{shareLink.views} 次浏览</span>
                          </div>
                        )}
                        {record.advice && (
                          <Badge variant="outline" className="text-xs">
                            包含建议
                          </Badge>
                        )}
                        {record.nextSteps && (
                          <Badge variant="outline" className="text-xs">
                            包含步骤
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setSelectedRecord(record)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-white/95 backdrop-blur-xl max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>占卜记录详情</DialogTitle>
                          </DialogHeader>
                          {selectedRecord && (
                            <div className="space-y-4">
                              <div className="flex items-center gap-4 p-3 bg-purple-50 rounded">
                                <div className="text-2xl">{getMoonPhaseEmoji(selectedRecord.moonPhase)}</div>
                                <div>
                                  <div className="font-medium">{selectedRecord.moonPhase}</div>
                                  <div className="text-sm text-gray-600">
                                    {format(selectedRecord.date, 'yyyy年MM月dd日 HH:mm')}
                                  </div>
                                </div>
                              </div>

                              <div>
                                <h4 className="font-medium mb-2">占卜问题</h4>
                                <p className="text-gray-700">{selectedRecord.question}</p>
                              </div>

                              <div>
                                <h4 className="font-medium mb-2">选择的牌</h4>
                                <div className="flex flex-wrap gap-2">
                                  {selectedRecord.cards.map((card, index) => (
                                    <Badge key={index} variant="secondary">
                                      {card}
                                    </Badge>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <h4 className="font-medium mb-2">解读</h4>
                                <p className="text-gray-700">{selectedRecord.interpretation}</p>
                              </div>

                              {selectedRecord.advice && (
                                <div>
                                  <h4 className="font-medium mb-2">建议</h4>
                                  <p className="text-gray-700">{selectedRecord.advice}</p>
                                </div>
                              )}

                              {selectedRecord.nextSteps && (
                                <div>
                                  <h4 className="font-medium mb-2">下一步行动</h4>
                                  <p className="text-gray-700">{selectedRecord.nextSteps}</p>
                                </div>
                              )}

                              {shareLink && (
                                <div className="p-3 bg-gray-50 rounded">
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <div className="font-medium">分享链接</div>
                                      <div className="text-sm text-gray-600">
                                        访问码: {shareLink.accessCode}
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <div className="text-sm text-gray-600">
                                        {shareLink.views} 次浏览
                                      </div>
                                      {shareLink.lastViewed && (
                                        <div className="text-xs text-gray-500">
                                          最后浏览: {format(shareLink.lastViewed, 'MM/dd HH:mm')}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>

                      {onRecordSelect && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => onRecordSelect(record)}
                        >
                          <Sparkles className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card className="bg-white/50 border-gray-200">
            <CardContent className="p-8 text-center">
              <Sparkles className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">
                {searchQuery ? '未找到匹配的记录' : '暂无咨询记录'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}; 