import React, { useState } from 'react';
import { ClientProfile as ClientProfileType } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Edit2, 
  Trash2, 
  MessageCircle,
  TrendingUp
} from 'lucide-react';
import { format } from 'date-fns';
import { useClients } from '@/hooks/useClients';
import { useProfessionalTarotRecords } from '@/hooks/useProfessionalTarotRecords';

interface ClientProfileProps {
  client: ClientProfileType;
  onEdit?: (client: ClientProfileType) => void;
  onDelete?: (clientId: string) => void;
}

export const ClientProfile: React.FC<ClientProfileProps> = ({ 
  client, 
  onEdit, 
  onDelete 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(client);
  const { updateClient } = useClients();
  const { getClientTarotRecords } = useProfessionalTarotRecords();

  const clientRecords = getClientTarotRecords(client.id);

  const handleSave = () => {
    updateClient(client.id, editForm);
    setIsEditing(false);
    if (onEdit) onEdit(editForm);
  };

  const handleCancel = () => {
    setEditForm(client);
    setIsEditing(false);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Card className="bg-white/50 border-gray-200 hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={client.avatar} />
              <AvatarFallback className="bg-purple-100 text-purple-600">
                {getInitials(client.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{client.name}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  {client.isActive ? '活跃' : '不活跃'}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {client.totalConsultations} 次咨询
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <Dialog open={isEditing} onOpenChange={setIsEditing}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Edit2 className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white/95 backdrop-blur-xl">
                <DialogHeader>
                  <DialogTitle>编辑客户信息</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">姓名</Label>
                    <Input
                      id="name"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="bg-white/70"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">邮箱</Label>
                    <Input
                      id="email"
                      type="email"
                      value={editForm.email || ''}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="bg-white/70"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">电话</Label>
                    <Input
                      id="phone"
                      value={editForm.phone || ''}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      className="bg-white/70"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">备注</Label>
                    <Textarea
                      id="notes"
                      value={editForm.notes || ''}
                      onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                      className="bg-white/70"
                      rows={3}
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={handleCancel}>
                      取消
                    </Button>
                    <Button onClick={handleSave}>
                      保存
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            {onDelete && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onDelete(client.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* 联系信息 */}
        <div className="space-y-2">
          {client.email && (
            <div className="flex items-center text-sm text-gray-600">
              <Mail className="h-4 w-4 mr-2" />
              {client.email}
            </div>
          )}
          {client.phone && (
            <div className="flex items-center text-sm text-gray-600">
              <Phone className="h-4 w-4 mr-2" />
              {client.phone}
            </div>
          )}
        </div>

        {/* 统计信息 */}
        <div className="grid grid-cols-2 gap-4 py-3 border-t border-gray-200">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <TrendingUp className="h-4 w-4 text-blue-600 mr-1" />
              <span className="text-sm text-gray-600">总咨询</span>
            </div>
            <div className="text-xl font-semibold text-blue-600">
              {client.totalConsultations}
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Calendar className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-sm text-gray-600">最近咨询</span>
            </div>
            <div className="text-sm text-green-600">
              {client.lastConsultation 
                ? format(client.lastConsultation, 'MM/dd')
                : '暂无'
              }
            </div>
          </div>
        </div>

        {/* 备注 */}
        {client.notes && (
          <div className="pt-3 border-t border-gray-200">
            <div className="flex items-center mb-2">
              <MessageCircle className="h-4 w-4 text-gray-500 mr-2" />
              <span className="text-sm font-medium text-gray-700">备注</span>
            </div>
            <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
              {client.notes}
            </p>
          </div>
        )}

        {/* 最近记录 */}
        {clientRecords.length > 0 && (
          <div className="pt-3 border-t border-gray-200">
            <div className="flex items-center mb-2">
              <span className="text-sm font-medium text-gray-700">最近记录</span>
            </div>
            <div className="space-y-1">
              {clientRecords.slice(0, 2).map((record) => (
                <div key={record.id} className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                  <div className="flex items-center justify-between">
                    <span>{format(record.date, 'MM/dd')}</span>
                    <span className="text-purple-600">{record.moonPhase}</span>
                  </div>
                  <p className="truncate mt-1">{record.question}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 创建时间 */}
        <div className="text-xs text-gray-400 pt-2 border-t border-gray-200">
          创建于 {format(client.createdAt, 'yyyy/MM/dd')}
        </div>
      </CardContent>
    </Card>
  );
}; 