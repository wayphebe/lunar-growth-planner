
import { useState, useEffect } from 'react';

interface Project {
  id: string;
  title: string;
  description: string;
  moonPhase: string;
  startDate: Date;
  targetDate?: Date;
  progress: number;
  status: 'active' | 'completed' | 'paused';
  tarotRecords?: string[];
}

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    // 从本地存储加载项目
    const savedProjects = localStorage.getItem('moonPhaseProjects');
    if (savedProjects) {
      const parsed = JSON.parse(savedProjects);
      // 转换日期字符串回Date对象
      const projectsWithDates = parsed.map((project: any) => ({
        ...project,
        startDate: new Date(project.startDate),
        targetDate: project.targetDate ? new Date(project.targetDate) : undefined
      }));
      setProjects(projectsWithDates);
    } else {
      // 初始化示例数据
      const sampleProjects: Project[] = [
        {
          id: '1',
          title: '学习塔罗牌占卜',
          description: '系统学习塔罗牌的含义和占卜技巧，提升直觉力',
          moonPhase: '新月',
          startDate: new Date('2024-01-11'),
          targetDate: new Date('2024-03-11'),
          progress: 45,
          status: 'active',
          tarotRecords: ['tarot-1', 'tarot-2']
        },
        {
          id: '2',
          title: '冥想练习计划',
          description: '每日冥想30分钟，培养内在平静与觉察力',
          moonPhase: '满月',
          startDate: new Date('2024-01-25'),
          targetDate: new Date('2024-04-25'),
          progress: 72,
          status: 'active',
          tarotRecords: ['tarot-3']
        },
        {
          id: '3',
          title: '月相日记项目',
          description: '记录每个月相周期的感受和洞察',
          moonPhase: '上弦月',
          startDate: new Date('2024-02-02'),
          progress: 100,
          status: 'completed'
        }
      ];
      setProjects(sampleProjects);
      localStorage.setItem('moonPhaseProjects', JSON.stringify(sampleProjects));
    }
  }, []);

  const addProject = (project: Omit<Project, 'id'>) => {
    const newProject = {
      ...project,
      id: Date.now().toString()
    };
    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    localStorage.setItem('moonPhaseProjects', JSON.stringify(updatedProjects));
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    const updatedProjects = projects.map(project =>
      project.id === id ? { ...project, ...updates } : project
    );
    setProjects(updatedProjects);
    localStorage.setItem('moonPhaseProjects', JSON.stringify(updatedProjects));
  };

  const deleteProject = (id: string) => {
    const updatedProjects = projects.filter(project => project.id !== id);
    setProjects(updatedProjects);
    localStorage.setItem('moonPhaseProjects', JSON.stringify(updatedProjects));
  };

  return { projects, addProject, updateProject, deleteProject };
};
