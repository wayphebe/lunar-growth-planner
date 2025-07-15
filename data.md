# Lunar Growth Planner 数据设计文档

## 技术栈概览

### 统一框架
```
前端: Next.js + React (UI构建)
↓
API层: tRPC (类型安全的API调用)
↓
数据库: PostgreSQL + Prisma (数据存储和查询)
↓
缓存层: Redis (性能优化)
```

### 为什么选择这个技术栈？

1. **Next.js + React**
   - 优秀的开发体验
   - 服务端渲染支持
   - 完整的路由系统
   - 活跃的社区支持

2. **tRPC**
   - 端到端类型安全
   - 自动类型推断
   - 简化API调用
   - 开发效率提升

3. **PostgreSQL + Prisma**
   - 强大的关系型数据库
   - 类型安全的ORM
   - JSON数据支持
   - 简单的数据迁移

4. **Redis**
   - 高性能缓存
   - 支持复杂数据结构
   - 可设置过期时间
   - 减轻数据库压力

## 数据库设计

### 1. 用户系统

```sql
users {
  id: UUID (主键)
  email: VARCHAR(255) (唯一)
  username: VARCHAR(100)
  password_hash: VARCHAR(255)
  role: ENUM('user', 'reader', 'admin')
  profile: JSONB
  preferences: JSONB
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
}
```

### 2. 项目管理模块

#### 项目表 (Projects)
```sql
projects {
  id: UUID (主键)
  user_id: UUID (外键 -> users.id)
  title: VARCHAR(255)
  description: TEXT
  moon_phase: VARCHAR(50)
  start_date: DATE
  target_date: DATE
  actual_completion_date: DATE
  progress: INTEGER DEFAULT 0
  status: ENUM('active', 'completed', 'paused', 'cancelled')
  priority: ENUM('low', 'medium', 'high')
  category: VARCHAR(100)
  color: VARCHAR(7)
  is_archived: BOOLEAN DEFAULT FALSE
  metadata: JSONB
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
}
```

#### 项目里程碑 (Project_Milestones)
```sql
project_milestones {
  id: UUID (主键)
  project_id: UUID (外键 -> projects.id)
  title: VARCHAR(255)
  description: TEXT
  target_date: DATE
  completion_date: DATE
  status: ENUM('pending', 'in_progress', 'completed', 'cancelled')
  order_index: INTEGER
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
}
```

#### 项目任务 (Project_Tasks)
```sql
project_tasks {
  id: UUID (主键)
  project_id: UUID (外键 -> projects.id)
  milestone_id: UUID (外键 -> project_milestones.id)
  title: VARCHAR(255)
  description: TEXT
  status: ENUM('todo', 'in_progress', 'completed', 'cancelled')
  priority: ENUM('low', 'medium', 'high')
  due_date: DATE
  completion_date: DATE
  order_index: INTEGER
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
}
```

### 3. 塔罗牌模块

#### 塔罗记录 (Tarot_Records)
```sql
tarot_records {
  id: UUID (主键)
  user_id: UUID (外键 -> users.id)
  project_id: UUID (外键 -> projects.id, 可为空)
  reader_id: UUID (外键 -> users.id, 可为空)
  session_token: VARCHAR(255)
  question: TEXT
  cards: JSONB
  interpretation: TEXT
  moon_phase: VARCHAR(50)
  is_professional: BOOLEAN
  status: ENUM('pending', 'completed', 'shared')
  expires_at: TIMESTAMP
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
}
```

#### 塔罗师资料 (Reader_Profiles)
```sql
reader_profiles {
  id: UUID (主键)
  user_id: UUID (外键 -> users.id)
  display_name: VARCHAR(100)
  bio: TEXT
  specialties: JSONB
  rating: DECIMAL(3,2)
  price_per_reading: DECIMAL(10,2)
  availability: JSONB
  is_active: BOOLEAN
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
}
```

### 4. 月相相关

#### 月相数据 (Moon_Phases)
```sql
moon_phases {
  id: UUID (主键)
  date: DATE
  phase_name: VARCHAR(50)
  illumination: DECIMAL(5,2)
  emoji: VARCHAR(10)
  description: TEXT
  energy_guidance: TEXT
}
```

#### 月相能量记录 (Moon_Energy_Records)
```sql
moon_energy_records {
  id: UUID (主键)
  user_id: UUID (外键 -> users.id)
  project_id: UUID (外键 -> projects.id)
  date: DATE
  moon_phase: VARCHAR(50)
  energy_level: INTEGER
  productivity: INTEGER
  motivation: INTEGER
  focus: INTEGER
  notes: TEXT
  created_at: TIMESTAMP
}
```

## Prisma Schema 示例

```prisma
// schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(uuid())
  email         String    @unique
  username      String
  passwordHash  String
  role          UserRole  @default(USER)
  profile       Json?
  preferences   Json?
  projects      Project[]
  tarotRecords  TarotRecord[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Project {
  id          String    @id @default(uuid())
  userId      String
  title       String
  description String?
  moonPhase   String
  startDate   DateTime
  targetDate  DateTime?
  progress    Int       @default(0)
  status      ProjectStatus @default(ACTIVE)
  user        User      @relation(fields: [userId], references: [id])
  tasks       Task[]
  tarotRecords TarotRecord[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model TarotRecord {
  id          String    @id @default(uuid())
  userId      String
  projectId   String?
  question    String
  cards       Json
  interpretation String?
  moonPhase   String
  user        User      @relation(fields: [userId], references: [id])
  project     Project?  @relation(fields: [projectId], references: [id])
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}
```

## API 路由设计

### tRPC 路由示例

```typescript
// src/server/router/index.ts
export const appRouter = createRouter()
  .merge("projects.", projectRouter)
  .merge("tarot.", tarotRouter)
  .merge("users.", userRouter);

// src/server/router/project.ts
export const projectRouter = createRouter()
  .query("getAll", {
    async resolve({ ctx }) {
      return await ctx.prisma.project.findMany({
        where: { userId: ctx.session.userId }
      });
    }
  })
  .mutation("create", {
    input: ProjectCreateSchema,
    async resolve({ ctx, input }) {
      return await ctx.prisma.project.create({
        data: {
          ...input,
          userId: ctx.session.userId
        }
      });
    }
  });

// src/server/router/tarot.ts
export const tarotRouter = createRouter()
  .query("getRecords", {
    async resolve({ ctx }) {
      return await ctx.prisma.tarotRecord.findMany({
        where: { userId: ctx.session.userId }
      });
    }
  })
  .mutation("createRecord", {
    input: TarotRecordCreateSchema,
    async resolve({ ctx, input }) {
      return await ctx.prisma.tarotRecord.create({
        data: {
          ...input,
          userId: ctx.session.userId
        }
      });
    }
  });
```

## 缓存策略

### Redis 缓存设计

```typescript
// 缓存键设计
const cacheKeys = {
  userProjects: (userId: string) => `user:${userId}:projects`,
  projectDetail: (projectId: string) => `project:${projectId}`,
  tarotRecords: (userId: string) => `user:${userId}:tarot`,
  moonPhase: (date: string) => `moon_phase:${date}`
};

// 缓存实现示例
async function getProjectWithCache(projectId: string) {
  const cacheKey = cacheKeys.projectDetail(projectId);
  
  // 尝试从缓存获取
  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);
  
  // 缓存未命中，从数据库获取
  const project = await prisma.project.findUnique({
    where: { id: projectId }
  });
  
  // 存入缓存，设置过期时间
  await redis.setex(cacheKey, 3600, JSON.stringify(project));
  
  return project;
}
```

## 数据迁移和备份

### Prisma 迁移

```bash
# 创建迁移
prisma migrate dev --name init

# 应用迁移
prisma migrate deploy
```

### 数据备份策略

1. **定时备份**
```bash
# PostgreSQL 备份脚本
pg_dump -Fc dbname > backup.dump

# Redis 备份
redis-cli SAVE
```

2. **备份计划**
- 每日增量备份
- 每周完整备份
- 每月归档备份

## 性能优化

### 索引设计

```sql
-- 项目表索引
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_moon_phase ON projects(moon_phase);

-- 塔罗记录表索引
CREATE INDEX idx_tarot_records_user_id ON tarot_records(user_id);
CREATE INDEX idx_tarot_records_project_id ON tarot_records(project_id);
```

### 查询优化

```typescript
// 使用 include 优化关联查询
const projectWithDetails = await prisma.project.findUnique({
  where: { id: projectId },
  include: {
    tasks: true,
    tarotRecords: true,
    moonEnergyRecords: true
  }
});

// 使用 select 优化字段选择
const projectsList = await prisma.project.findMany({
  where: { userId },
  select: {
    id: true,
    title: true,
    progress: true,
    status: true
  }
});
```

## 安全考虑

1. **数据加密**
   - 敏感信息加密存储
   - 传输数据使用 HTTPS
   - 密码使用 bcrypt 加密

2. **访问控制**
   - 基于角色的权限管理
   - API 访问限制
   - 数据隔离

3. **数据验证**
   - 输入数据验证
   - SQL 注入防护
   - XSS 防护

## 扩展性考虑

1. **水平扩展**
   - 数据库分片
   - 读写分离
   - 负载均衡

2. **垂直扩展**
   - 服务拆分
   - 微服务架构
   - 消息队列

3. **功能扩展**
   - 插件系统
   - API 版本控制
   - 第三方集成 