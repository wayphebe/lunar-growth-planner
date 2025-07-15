
import React, { useState } from 'react';
import { MoonPhaseDisplay } from '../components/MoonPhaseDisplay';
import { ProjectOverview } from '../components/ProjectOverview';
import { TarotRecordPreview } from '../components/TarotRecordPreview';
import { MoonTimeline } from '../components/MoonTimeline';
import { ProjectModal } from '../components/ProjectModal';
import { TarotModal } from '../components/TarotModal';
import { Button } from '../components/ui/button';
import { Plus, Sparkles } from 'lucide-react';
import { useMoonPhase } from '../hooks/useMoonPhase';
import { useProjects } from '../hooks/useProjects';
import { useTarotRecords } from '../hooks/useTarotRecords';

const Index = () => {
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showTarotModal, setShowTarotModal] = useState(false);
  const { currentPhase, nextSignificantPhase } = useMoonPhase();
  const { projects } = useProjects();
  const { tarotRecords } = useTarotRecords();

  return (
    <div className="min-h-screen bg-background">
      {/* 星空背景效果 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(white_1px,transparent_1px)] [background-size:50px_50px] opacity-10"></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* 头部标题 */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-extralight tracking-wider text-foreground/90 mb-4">
            月相项目规划器
          </h1>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto font-light tracking-wide">
            跟随月亮的节律，用宇宙的能量指引你的项目与成长
          </p>
        </div>

        {/* 主要内容区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* 月相显示 */}
          <div className="lg:col-span-2">
            <MoonPhaseDisplay
              currentPhase={currentPhase}
              nextSignificantPhase={nextSignificantPhase}
              onClick={() => setShowTarotModal(true)}
            />
          </div>

          {/* 快速操作面板 */}
          <div className="space-y-6">
            <div className="bg-card/80 backdrop-blur-sm rounded-lg border border-border/30 p-6">
              <h3 className="text-xl font-light tracking-wide text-foreground/90 mb-6">快速操作</h3>
              <div className="space-y-4">
                <Button
                  onClick={() => setShowProjectModal(true)}
                  className="w-full"
                  size="lg"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  创建新项目
                </Button>
                <Button
                  onClick={() => setShowTarotModal(true)}
                  variant="secondary"
                  className="w-full"
                  size="lg"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  记录塔罗占卜
                </Button>
              </div>
            </div>

            {/* 月相建议 */}
            <div className="bg-card/80 backdrop-blur-sm rounded-lg border border-border/30 p-6">
              <h3 className="text-lg font-light tracking-wide text-foreground/90 mb-4">月相指引</h3>
              <p className="text-foreground/70 text-sm leading-relaxed font-light tracking-wide">
                {currentPhase?.name === '新月' && "新月是播种新想法的完美时机。设立新目标，开始新项目。"}
                {currentPhase?.name === '满月' && "满月是收获与反思的时刻。回顾项目进展，进行塔罗占卜。"}
                {currentPhase?.name === '上弦月' && "上弦月时要保持行动力。推进项目，克服挑战。"}
                {currentPhase?.name === '下弦月' && "下弦月是释放和清理的时期。整理项目，放下不必要的负担。"}
              </p>
            </div>
          </div>
        </div>

        {/* 项目概览 */}
        <div className="mb-16">
          <ProjectOverview projects={projects} />
        </div>

        {/* 塔罗记录预览 */}
        <div className="mb-16">
          <TarotRecordPreview records={tarotRecords} />
        </div>

        {/* 月相时间轴 */}
        <div>
          <MoonTimeline projects={projects} tarotRecords={tarotRecords} />
        </div>
      </div>

      {/* 模态框 */}
      <ProjectModal 
        open={showProjectModal} 
        onOpenChange={setShowProjectModal}
        currentPhase={currentPhase}
      />
      <TarotModal 
        open={showTarotModal} 
        onOpenChange={setShowTarotModal}
        currentPhase={currentPhase}
      />
    </div>
  );
};

export default Index;
