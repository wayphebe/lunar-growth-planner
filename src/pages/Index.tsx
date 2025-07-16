
import React from 'react';
import { MoonPhaseDisplay } from '@/components/MoonPhaseDisplay';
import { ProjectOverview } from '@/components/ProjectOverview';
import { TarotRecordPreview } from '@/components/TarotRecordPreview';
import { MoonCalendar } from '@/components/MoonCalendar';
import { Button } from '@/components/ui/button';
import { Plus, Calendar, Sparkles, Users, Star } from 'lucide-react';
import { ProjectModal } from '@/components/ProjectModal';
import { TarotModal } from '@/components/TarotModal';
import { ProfessionalTarotModal } from '@/components/professional/ProfessionalTarotModal';
import { useMoonPhase } from '@/hooks/useMoonPhase';
import { TarotRecord } from '@/lib/types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NetworkStatus from '@/components/NetworkStatus';

const Index: React.FC = () => {
  const { currentPhase } = useMoonPhase();
  const navigate = useNavigate();
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [tarotModalOpen, setTarotModalOpen] = useState(false);
  const [professionalTarotModalOpen, setProfessionalTarotModalOpen] = useState(false);
  const [editingTarotRecord, setEditingTarotRecord] = useState<TarotRecord | null>(null);

  const handleEditTarotRecord = (record: TarotRecord) => {
    setEditingTarotRecord(record);
    setTarotModalOpen(true);
  };

  const handleTarotModalClose = (open: boolean) => {
    setTarotModalOpen(open);
    if (!open) {
      setEditingTarotRecord(null);
    }
  };

  return (
    <div className="min-h-screen bg-white/90">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Network Status */}
        <NetworkStatus />
        
        {/* Moon Phase Bar */}
        <div className="bg-white/50 rounded-lg border border-gray-200 p-4">
          <MoonPhaseDisplay />
        </div>

        {/* Action Bar */}
        <div className="flex flex-wrap gap-4">
          <Button 
            className="bg-white hover:bg-gray-50"
            onClick={() => setProjectModalOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            新建项目
          </Button>
          <Button 
            variant="outline" 
            className="border-gray-200 hover:bg-gray-50"
            onClick={() => setTarotModalOpen(true)}
          >
            <Sparkles className="h-4 w-4 mr-2" />
            塔罗记录
          </Button>
          <Button 
            variant="outline" 
            className="border-gray-200 hover:bg-gray-50"
            onClick={() => setProfessionalTarotModalOpen(true)}
          >
            <Star className="h-4 w-4 mr-2" />
            专业咨询
          </Button>
          <Button 
            variant="outline" 
            className="border-gray-200 hover:bg-gray-50"
            onClick={() => navigate('/clients')}
          >
            <Users className="h-4 w-4 mr-2" />
            客户管理
          </Button>
        </div>

        {/* Calendar View */}
        <div className="bg-white/50 rounded-lg border border-gray-200 shadow">
          <MoonCalendar />
        </div>

        {/* Timeline and Overview Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="bg-white/50 rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-light mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                项目概览
              </h2>
              <ProjectOverview />
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-white/50 rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-light mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                塔罗记录
              </h2>
              <TarotRecordPreview onEditRecord={handleEditTarotRecord} />
            </div>
          </div>
        </div>

        {/* Modals */}
        <ProjectModal 
          open={projectModalOpen} 
          onOpenChange={setProjectModalOpen}
          currentPhase={currentPhase}
        />
        <TarotModal 
          open={tarotModalOpen} 
          onOpenChange={handleTarotModalClose}
          currentPhase={currentPhase}
          editRecord={editingTarotRecord}
        />
        <ProfessionalTarotModal 
          open={professionalTarotModalOpen} 
          onOpenChange={setProfessionalTarotModalOpen}
          currentPhase={currentPhase}
        />
      </div>
    </div>
  );
};

export default Index;
