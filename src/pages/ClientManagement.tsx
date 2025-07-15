import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  TrendingUp, 
  DollarSign,
  Calendar,
  BarChart3,
  Eye,
  Edit2,
  Trash2,
  MoreVertical,
  ArrowLeft,
  Sparkles,
  Link as LinkIcon
} from 'lucide-react';
import { ClientProfile as ClientProfileType, ProfessionalTarotRecord } from '@/lib/types';
import { ClientProfile } from '@/components/client/ClientProfile';
import { ClientHistory } from '@/components/client/ClientHistory';
import { ShareLinkManager } from '@/components/professional/ShareLinkManager';
import { ProfessionalTarotModal } from '@/components/professional/ProfessionalTarotModal';
import { useClients } from '@/hooks/useClients';
import { useProfessionalTarotRecords } from '@/hooks/useProfessionalTarotRecords';
import { useShareLinks } from '@/hooks/useShareLinks';
import { useMoonPhase } from '@/hooks/useMoonPhase';

const ClientManagement: React.FC = () => {
  const { clients, deleteClient } = useClients();
  const { professionalTarotRecords, getClientTarotRecords } = useProfessionalTarotRecords();
  const { shareLinks, getShareLinksByClient } = useShareLinks();
  const { currentPhase } = useMoonPhase();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [selectedClient, setSelectedClient] = useState<ClientProfileType | null>(null);
  const [showTarotModal, setShowTarotModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // 过滤客户
  const filteredClients = clients.filter(client => {
    // 状态筛选
    if (filterStatus === 'active' && !client.isActive) return false;
    if (filterStatus === 'inactive' && client.isActive) return false;
    
    // 搜索筛选
    if (searchQuery) {
      const searchText = [
        client.name,
        client.email,
        client.phone,
        client.notes
      ].join(' ').toLowerCase();
      
      return searchText.includes(searchQuery.toLowerCase());
    }
    
    return true;
  });

  // 统计数据
  const totalRevenue = professionalTarotRecords.reduce((sum, record) => sum + (record.consultationFee || 0), 0);
  const totalConsultations = professionalTarotRecords.length;
  const totalViews = shareLinks.reduce((sum, link) => sum + link.views, 0);

  const handleClientDelete = (clientId: string) => {
    deleteClient(clientId);
  };

  const handleNewConsultation = (client: ClientProfileType) => {
    setSelectedClient(client);
    setShowTarotModal(true);
  };

  const handleBackToList = () => {
    setSelectedClient(null);
    setActiveTab('overview');
  };

  // 主页面视图
  if (!selectedClient) {
    return (
      <div className="min-h-screen bg-white/90">
        <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
          {/* 页面标题 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h1 className="text-2xl font-light">客户管理</h1>
                <p className="text-gray-600">管理您的客户信息和咨询记录</p>
              </div>
            </div>
            <Button 
              onClick={() => setShowTarotModal(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              新建咨询
            </Button>
          </div>

          {/* 统计卡片 */}
          <div className="grid grid-cols-4 gap-4">
            <Card className="bg-white/50 border-gray-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{clients.length}</div>
                <div className="text-sm text-gray-600">总客户数</div>
              </CardContent>
            </Card>
            <Card className="bg-white/50 border-gray-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{totalConsultations}</div>
                <div className="text-sm text-gray-600">总咨询次数</div>
              </CardContent>
            </Card>
            <Card className="bg-white/50 border-gray-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">¥{totalRevenue}</div>
                <div className="text-sm text-gray-600">总收入</div>
              </CardContent>
            </Card>
            <Card className="bg-white/50 border-gray-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">{totalViews}</div>
                <div className="text-sm text-gray-600">总浏览量</div>
              </CardContent>
            </Card>
          </div>

          {/* 搜索和过滤 */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="搜索客户..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/70"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={filterStatus === 'all' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('all')}
                size="sm"
              >
                全部
              </Button>
              <Button
                variant={filterStatus === 'active' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('active')}
                size="sm"
              >
                活跃
              </Button>
              <Button
                variant={filterStatus === 'inactive' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('inactive')}
                size="sm"
              >
                不活跃
              </Button>
            </div>
          </div>

          {/* 客户列表 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredClients.length > 0 ? (
              filteredClients.map((client) => (
                <div key={client.id} className="relative group">
                  <ClientProfile
                    client={client}
                    onDelete={handleClientDelete}
                  />
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setSelectedClient(client)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        查看详情
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleNewConsultation(client)}
                      >
                        <Sparkles className="h-4 w-4 mr-1" />
                        新建咨询
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full">
                <Card className="bg-white/50 border-gray-200">
                  <CardContent className="p-8 text-center">
                    <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">
                      {searchQuery || filterStatus !== 'all' ? '未找到匹配的客户' : '暂无客户'}
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* 专业塔罗记录模态框 */}
          <ProfessionalTarotModal
            open={showTarotModal}
            onOpenChange={setShowTarotModal}
            currentPhase={currentPhase}
          />
        </div>
      </div>
    );
  }

  // 客户详情视图
  return (
    <div className="min-h-screen bg-white/90">
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* 返回按钮和标题 */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={handleBackToList}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            返回客户列表
          </Button>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-light">{selectedClient.name}</h1>
              <p className="text-gray-600">客户详情管理</p>
            </div>
          </div>
          <div className="ml-auto">
            <Button 
              onClick={() => handleNewConsultation(selectedClient)}
              className="bg-gradient-to-r from-purple-600 to-pink-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              新建咨询
            </Button>
          </div>
        </div>

        {/* 客户基本信息 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <ClientProfile
              client={selectedClient}
              onDelete={handleClientDelete}
            />
          </div>
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">概览</TabsTrigger>
                <TabsTrigger value="history">咨询记录</TabsTrigger>
                <TabsTrigger value="shares">分享链接</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card className="bg-white/50 border-gray-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-blue-600" />
                        咨询统计
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">总咨询次数</span>
                          <span className="font-medium">{getClientTarotRecords(selectedClient.id).length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">本月咨询</span>
                          <span className="font-medium">
                            {getClientTarotRecords(selectedClient.id).filter(
                              record => new Date(record.date).getMonth() === new Date().getMonth()
                            ).length}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">总收入</span>
                          <span className="font-medium text-green-600">
                            ¥{getClientTarotRecords(selectedClient.id).reduce((sum, record) => sum + (record.consultationFee || 0), 0)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/50 border-gray-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <LinkIcon className="h-5 w-5 text-purple-600" />
                        分享统计
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">分享链接</span>
                          <span className="font-medium">{getShareLinksByClient(selectedClient.id).length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">总浏览量</span>
                          <span className="font-medium">
                            {getShareLinksByClient(selectedClient.id).reduce((sum, link) => sum + link.views, 0)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">活跃链接</span>
                          <span className="font-medium text-green-600">
                            {getShareLinksByClient(selectedClient.id).filter(link => link.isActive).length}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="history">
                <ClientHistory
                  client={selectedClient}
                  onRecordSelect={(record) => {
                    // 可以在这里处理记录选择
                    console.log('Selected record:', record);
                  }}
                />
              </TabsContent>

              <TabsContent value="shares">
                <ShareLinkManager
                  clientId={selectedClient.id}
                  onLinkSelect={(link) => {
                    // 可以在这里处理链接选择
                    console.log('Selected link:', link);
                  }}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* 专业塔罗记录模态框 */}
        <ProfessionalTarotModal
          open={showTarotModal}
          onOpenChange={setShowTarotModal}
          currentPhase={currentPhase}
        />
      </div>
    </div>
  );
};

export default ClientManagement; 