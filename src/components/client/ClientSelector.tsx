import React, { useState } from 'react';
import { ClientProfile } from '@/lib/types';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Plus, User, Search } from 'lucide-react';
import { useClients } from '@/hooks/useClients';

interface ClientSelectorProps {
  selectedClientId?: string;
  onClientSelect: (clientId: string) => void;
  placeholder?: string;
  showAddButton?: boolean;
}

export const ClientSelector: React.FC<ClientSelectorProps> = ({
  selectedClientId,
  onClientSelect,
  placeholder = "选择客户",
  showAddButton = true
}) => {
  const { clients, addClient, searchClients } = useClients();
  const [isAddingClient, setIsAddingClient] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    phone: '',
    notes: ''
  });

  const filteredClients = searchClients(searchQuery);

  const handleAddClient = () => {
    if (newClient.name.trim()) {
      const client = addClient(newClient);
      onClientSelect(client.id);
      setNewClient({ name: '', email: '', phone: '', notes: '' });
      setIsAddingClient(false);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const selectedClient = clients.find(c => c.id === selectedClientId);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <Select value={selectedClientId} onValueChange={onClientSelect}>
            <SelectTrigger className="bg-white/70 border-gray-300">
              <SelectValue placeholder={placeholder}>
                {selectedClient && (
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={selectedClient.avatar} />
                      <AvatarFallback className="bg-purple-100 text-purple-600 text-xs">
                        {getInitials(selectedClient.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span>{selectedClient.name}</span>
                  </div>
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-white border-gray-200">
              {/* 搜索框 */}
              <div className="p-2 border-b">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="搜索客户..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white/70"
                  />
                </div>
              </div>
              
              {/* 客户列表 */}
              <div className="max-h-60 overflow-y-auto">
                {filteredClients.length > 0 ? (
                  filteredClients.map((client) => (
                    <SelectItem 
                      key={client.id} 
                      value={client.id}
                      className="text-gray-900 hover:bg-gray-100"
                    >
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={client.avatar} />
                          <AvatarFallback className="bg-purple-100 text-purple-600 text-xs">
                            {getInitials(client.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{client.name}</div>
                          <div className="text-xs text-gray-500">
                            {client.totalConsultations} 次咨询
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    {searchQuery ? '未找到匹配的客户' : '暂无客户'}
                  </div>
                )}
              </div>
            </SelectContent>
          </Select>
        </div>

        {/* 添加新客户按钮 */}
        {showAddButton && (
          <Dialog open={isAddingClient} onOpenChange={setIsAddingClient}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-1" />
                新客户
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white/95 backdrop-blur-xl">
              <DialogHeader>
                <DialogTitle>添加新客户</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">姓名 *</Label>
                  <Input
                    id="name"
                    value={newClient.name}
                    onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                    placeholder="请输入客户姓名"
                    className="bg-white/70"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">邮箱</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newClient.email}
                    onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                    placeholder="请输入邮箱地址"
                    className="bg-white/70"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">电话</Label>
                  <Input
                    id="phone"
                    value={newClient.phone}
                    onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                    placeholder="请输入电话号码"
                    className="bg-white/70"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">备注</Label>
                  <Textarea
                    id="notes"
                    value={newClient.notes}
                    onChange={(e) => setNewClient({ ...newClient, notes: e.target.value })}
                    placeholder="客户相关备注信息..."
                    className="bg-white/70"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsAddingClient(false)}
                  >
                    取消
                  </Button>
                  <Button 
                    onClick={handleAddClient}
                    disabled={!newClient.name.trim()}
                  >
                    添加客户
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* 已选客户信息 */}
      {selectedClient && (
        <div className="flex items-center gap-2 p-2 bg-purple-50 rounded border border-purple-200">
          <Avatar className="h-8 w-8">
            <AvatarImage src={selectedClient.avatar} />
            <AvatarFallback className="bg-purple-100 text-purple-600 text-xs">
              {getInitials(selectedClient.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium text-purple-900">{selectedClient.name}</div>
            <div className="text-xs text-purple-600">
              {selectedClient.totalConsultations} 次咨询
              {selectedClient.lastConsultation && (
                <span className="ml-2">
                  最近: {new Date(selectedClient.lastConsultation).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 