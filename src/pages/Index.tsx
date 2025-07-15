
import React from 'react';
import { MoonPhaseDisplay } from '@/components/MoonPhaseDisplay';
import { ProjectOverview } from '@/components/ProjectOverview';
import { TarotRecordPreview } from '@/components/TarotRecordPreview';
import { MoonCalendar } from '@/components/MoonCalendar';

const Index: React.FC = () => {
  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* 月相显示 */}
      <MoonPhaseDisplay />

      {/* 月相日历 */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">月相日历</h2>
        <MoonCalendar />
      </section>

      {/* 项目概览 */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">项目概览</h2>
        <ProjectOverview />
      </section>

      {/* 塔罗记录预览 */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">最近的塔罗记录</h2>
        <TarotRecordPreview />
      </section>
    </div>
  );
};

export default Index;
