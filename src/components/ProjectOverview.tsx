
import React from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Plus } from 'lucide-react';
import { useProjects } from '@/hooks/useProjects';

export const ProjectOverview: React.FC = () => {
  const { projects } = useProjects();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">活跃项目</h3>
          <p className="text-sm text-muted-foreground">
            当前有 {projects.filter(p => p.status === 'active').length} 个进行中的项目
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          新项目
        </Button>
      </div>

      <div className="grid gap-4">
        {projects.map(project => (
          <Card key={project.id} className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-medium">{project.title}</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {project.description}
                </p>
              </div>
              <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
                {project.status === 'active' ? '进行中' : '已完成'}
              </Badge>
            </div>

            <div className="mt-4 flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">月相:</span>
                <Badge variant="outline">{project.moonPhase}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">进度:</span>
                <div className="w-32 h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
                <span className="text-sm">{project.progress}%</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
