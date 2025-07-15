# 塔罗占卜客户端方案设计

## 概述

本文档描述了塔罗占卜客户端的设计方案，作为现有月相项目规划器的扩展功能，专注于占卜师-客户互动场景。

## 1. 业务流程设计

### 1.1 业务场景分析

**当前产品定位**：个人成长与月相规划工具
**新增需求**：将塔罗占卜功能扩展为服务客户的专业工具

**目标用户**：
- **占卜师/咨询师**：提供塔罗服务的专业人士
- **客户**：寻求塔罗指导的用户

### 1.2 完整业务流程

#### 占卜师端流程
```
1. 创建客户档案
   ↓
2. 进行塔罗占卜
   ↓
3. 记录占卜结果
   ↓
4. 美化和编辑
   ↓
5. 生成分享链接
   ↓
6. 发送给客户
```

#### 客户端流程
```
1. 收到分享链接
   ↓
2. 访问专属页面
   ↓
3. 查看占卜结果
   ↓
4. 互动反馈
   ↓
5. 保存或分享
```

## 2. 界面设计方案

### 2.1 占卜师工作台增强

#### 客户管理模块
```typescript
interface ClientProfile {
  id: string;
  name: string;
  avatar?: string;
  email?: string;
  phone?: string;
  notes?: string;
  createdAt: Date;
  lastConsultation?: Date;
  totalConsultations: number;
}
```

**界面特点**：
- 客户列表：展示所有客户信息
- 快速搜索：支持按姓名、邮箱搜索
- 历史记录：查看与客户的所有占卜记录
- 添加客户：简单的表单添加新客户

#### 专业塔罗记录界面
```typescript
interface ProfessionalTarotRecord extends TarotRecord {
  clientId: string;
  isForClient: boolean;
  consultationFee?: number;
  shareSettings: {
    isPublic: boolean;
    allowDownload: boolean;
    expiryDate?: Date;
    password?: string;
  };
  presentation: {
    theme: 'classic' | 'modern' | 'mystical';
    includeAdvice: boolean;
    includeNextSteps: boolean;
  };
}
```

**新增功能**：
- **客户选择**：选择为哪个客户做占卜
- **专业模板**：选择展示模板和风格
- **隐私设置**：配置分享权限和有效期
- **增强编辑**：支持富文本编辑，添加图片

#### 分享管理界面
```typescript
interface ShareLink {
  id: string;
  tarotRecordId: string;
  clientId: string;
  url: string;
  accessCode?: string;
  views: number;
  lastViewed?: Date;
  isActive: boolean;
  expiresAt?: Date;
  createdAt: Date;
}
```

**功能特点**：
- **链接生成**：一键生成美观的分享链接
- **访问统计**：查看客户访问次数和时间
- **链接管理**：启用/禁用链接，设置有效期
- **批量操作**：批量生成或管理多个分享链接

### 2.2 客户端展示页面

#### 专属占卜结果页面
**URL设计**：`/tarot-reading/{shareId}`

**页面结构**：
```jsx
const ClientTarotReading = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <Header consultantName="占卜师名称" />
      
      {/* Moon Phase Context */}
      <MoonPhaseContext moonPhase={record.moonPhase} />
      
      {/* Question Section */}
      <QuestionDisplay question={record.question} />
      
      {/* Tarot Cards Display */}
      <TarotCardsLayout cards={record.cards} />
      
      {/* Interpretation */}
      <InterpretationSection interpretation={record.interpretation} />
      
      {/* Next Steps & Advice */}
      <NextStepsSection advice={record.advice} />
      
      {/* Footer */}
      <Footer />
    </div>
  );
};
```

#### 设计特色
- **沉浸式体验**：深色神秘主题，星空背景
- **动画效果**：卡片翻转、渐现动画
- **响应式设计**：完美适配手机和桌面
- **无障碍访问**：支持屏幕阅读器
- **打印友好**：支持PDF导出

## 3. 数据库设计

### 3.1 核心数据表

#### 客户表 (clients)
```sql
CREATE TABLE clients (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    avatar_url VARCHAR(500),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);
```

#### 专业塔罗记录表 (professional_tarot_records)
```sql
CREATE TABLE professional_tarot_records (
    id VARCHAR(36) PRIMARY KEY,
    client_id VARCHAR(36) NOT NULL,
    consultant_id VARCHAR(36) NOT NULL,
    date TIMESTAMP NOT NULL,
    moon_phase VARCHAR(20) NOT NULL,
    question TEXT NOT NULL,
    cards JSON NOT NULL,
    interpretation TEXT NOT NULL,
    advice TEXT,
    next_steps TEXT,
    consultation_fee DECIMAL(10,2),
    theme VARCHAR(20) DEFAULT 'classic',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (client_id) REFERENCES clients(id),
    INDEX idx_client_date (client_id, date),
    INDEX idx_consultant_date (consultant_id, date)
);
```

#### 分享链接表 (share_links)
```sql
CREATE TABLE share_links (
    id VARCHAR(36) PRIMARY KEY,
    tarot_record_id VARCHAR(36) NOT NULL,
    client_id VARCHAR(36) NOT NULL,
    share_code VARCHAR(20) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    is_public BOOLEAN DEFAULT FALSE,
    allow_download BOOLEAN DEFAULT TRUE,
    views_count INT DEFAULT 0,
    last_viewed_at TIMESTAMP,
    expires_at TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (tarot_record_id) REFERENCES professional_tarot_records(id),
    FOREIGN KEY (client_id) REFERENCES clients(id),
    INDEX idx_share_code (share_code),
    INDEX idx_expires_at (expires_at)
);
```

#### 访问日志表 (access_logs)
```sql
CREATE TABLE access_logs (
    id VARCHAR(36) PRIMARY KEY,
    share_link_id VARCHAR(36) NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    accessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (share_link_id) REFERENCES share_links(id),
    INDEX idx_share_link_date (share_link_id, accessed_at)
);
```

### 3.2 本地存储扩展 (前期快速实现)

```typescript
interface LocalStorageData {
  tarotRecords: TarotRecord[];
  professionalTarotRecords: ProfessionalTarotRecord[];
  clients: ClientProfile[];
  shareLinks: ShareLink[];
  settings: {
    consultantName: string;
    defaultTheme: string;
    businessInfo: BusinessInfo;
  };
}
```

## 4. 技术实现方案

### 4.1 前端架构

#### 新增页面和组件
```
src/
├── pages/
│   ├── ClientTarotReading.tsx     # 客户端展示页面
│   └── ClientManagement.tsx       # 客户管理页面
├── components/
│   ├── client/
│   │   ├── ClientProfile.tsx      # 客户档案组件
│   │   ├── ClientSelector.tsx     # 客户选择器
│   │   └── ClientHistory.tsx      # 客户历史记录
│   ├── professional/
│   │   ├── ProfessionalTarotModal.tsx  # 专业版塔罗记录模态框
│   │   ├── ShareLinkGenerator.tsx      # 分享链接生成器
│   │   └── ShareLinkManager.tsx        # 分享链接管理
│   └── shared/
│       ├── TarotCardDisplay.tsx    # 塔罗牌展示组件
│       ├── MoonPhaseContext.tsx    # 月相背景组件
│       └── ThemeSelector.tsx       # 主题选择器
```

#### 新增Hooks
```typescript
// src/hooks/useClients.ts
export const useClients = () => {
  const [clients, setClients] = useState<ClientProfile[]>([]);
  
  const addClient = (client: Omit<ClientProfile, 'id'>) => {
    // 添加客户逻辑
  };
  
  const updateClient = (id: string, updates: Partial<ClientProfile>) => {
    // 更新客户逻辑
  };
  
  return { clients, addClient, updateClient };
};

// src/hooks/useShareLinks.ts
export const useShareLinks = () => {
  const [shareLinks, setShareLinks] = useState<ShareLink[]>([]);
  
  const generateShareLink = (tarotRecordId: string, settings: ShareSettings) => {
    // 生成分享链接逻辑
  };
  
  return { shareLinks, generateShareLink };
};
```

### 4.2 路由配置

```typescript
// src/App.tsx 中添加新路由
const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/clients" element={<ClientManagement />} />
      <Route path="/tarot-reading/:shareId" element={<ClientTarotReading />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);
```

### 4.3 后端API设计 (未来扩展)

#### 核心API端点
```typescript
// 客户管理
GET    /api/clients              # 获取客户列表
POST   /api/clients              # 创建新客户
PUT    /api/clients/:id          # 更新客户信息
DELETE /api/clients/:id          # 删除客户

// 专业塔罗记录
GET    /api/tarot-records        # 获取塔罗记录
POST   /api/tarot-records        # 创建新记录
PUT    /api/tarot-records/:id    # 更新记录
DELETE /api/tarot-records/:id    # 删除记录

// 分享链接
POST   /api/share-links          # 生成分享链接
GET    /api/share-links/:code    # 获取分享内容
PUT    /api/share-links/:id      # 更新分享设置
DELETE /api/share-links/:id      # 删除分享链接

// 客户端访问
GET    /api/public/tarot/:code   # 客户端访问占卜结果
POST   /api/public/feedback      # 客户反馈
```

## 5. 用户体验设计

### 5.1 占卜师体验

#### 工作流程优化
- **快速创建**：3步完成专业塔罗记录
- **模板系统**：预设常用占卜模板
- **智能提示**：基于月相的解读建议
- **批量操作**：一次性为多个客户生成记录

#### 专业工具
- **卡牌数据库**：内置完整塔罗牌含义
- **解读助手**：AI辅助解读建议
- **客户档案**：完整的客户关系管理
- **财务统计**：收入和咨询统计

### 5.2 客户体验

#### 访问体验
- **无需注册**：直接访问分享链接
- **个性化页面**：专属的占卜结果页面
- **多种保存方式**：截图、PDF导出、收藏
- **社交分享**：可分享到社交媒体

#### 交互功能
- **卡牌详情**：点击查看每张牌的详细含义
- **语音播放**：支持语音朗读解读内容
- **反馈系统**：客户可以给出反馈和评价
- **预约功能**：直接预约下次咨询

## 6. 安全和隐私考虑

### 6.1 访问控制
- **分享链接加密**：使用UUID和时间戳生成唯一链接
- **访问密码**：可选的访问密码保护
- **IP限制**：限制访问IP范围
- **时效控制**：设置链接有效期

### 6.2 数据保护
- **敏感信息加密**：客户信息加密存储
- **访问日志**：记录所有访问行为
- **数据备份**：定期备份重要数据
- **隐私协议**：明确的隐私政策

## 7. 运营和分析

### 7.1 数据统计
- **访问分析**：客户访问时间、频率统计
- **热门内容**：最受欢迎的占卜类型
- **客户反馈**：满意度和反馈统计
- **收入分析**：咨询收入和趋势分析

### 7.2 业务扩展
- **会员系统**：为高频客户提供会员服务
- **在线支付**：集成支付系统
- **预约系统**：在线预约咨询服务
- **营销工具**：优惠券、推荐奖励等

## 8. 后续规划

### 8.1 第一阶段：基础功能实现
- 实现客户管理基本功能
- 开发专业版塔罗记录界面
- 实现基础分享功能

### 8.2 第二阶段：功能完善
- 添加高级编辑功能
- 实现数据分析功能
- 优化用户体验

### 8.3 第三阶段：商业化
- 集成支付系统
- 实现会员功能
- 开发营销工具

## 9. 注意事项

### 9.1 与现有系统的关系
- 保持与现有月相系统的协同
- 不影响个人用户的使用体验
- 数据结构向后兼容

### 9.2 性能考虑
- 优化图片加载
- 实现懒加载
- 合理使用缓存
- 控制并发访问

### 9.3 可扩展性
- 模块化设计
- 预留API扩展空间
- 支持未来功能扩展 