
import React from 'react';
import { MoonPhaseDisplay } from '@/components/MoonPhaseDisplay';
import { ProjectOverview } from '@/components/ProjectOverview';
import { TarotRecordPreview } from '@/components/TarotRecordPreview';
import { MoonCalendar } from '@/components/MoonCalendar';
import { Button } from '@/components/ui/button';
import { Plus, Calendar, Sparkles } from 'lucide-react';
import { ProjectModal } from '@/components/ProjectModal';
import { TarotModal } from '@/components/TarotModal';
import { useMoonPhase } from '@/hooks/useMoonPhase';
import { useState } from 'react';

const Index: React.FC = () => {
  const { currentPhase } = useMoonPhase();
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [tarotModalOpen, setTarotModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white/90">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
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
              <TarotRecordPreview />
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
          onOpenChange={setTarotModalOpen}
          currentPhase={currentPhase}
        />
      </div>
    </div>
  );
};

export default Index;
