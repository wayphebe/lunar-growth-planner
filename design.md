# Lunar Growth Planner 设计系统

## 用户画像

### 主要用户群体
- 25-40岁的职业女性
- 关注个人成长和自我提升
- 对月相周期和能量变化感兴趣
- 喜欢规划和记录生活
- 追求内在平衡和心灵成长
- 对塔罗牌和占卜持开放态度

### 用户需求
1. 核心需求
   - 希望通过月相周期来规划个人目标
   - 需要一个优雅且直观的方式记录成长历程
   - 寻求灵性指引和自我反思的工具
   - 想要将塔罗牌解读与生活目标结合

2. 情感需求
   - 追求平静和内在和谐
   - 渴望个人成长的可视化反馈
   - 希望获得精神层面的支持和指引
   - 重视仪式感和个人时刻的记录

## 用户流程

### 核心流程
1. 项目创建流程
   ```mermaid
   graph LR
   A[查看当前月相] --> B[创建新项目]
   B --> C[设置项目信息]
   C --> D[选择关联月相]
   D --> E[设定目标日期]
   E --> F[获取月相建议]
   F --> G[完成创建]
   ```

2. 塔罗记录流程
   ```mermaid
   graph LR
   A[选择项目] --> B[进行塔罗占卜]
   B --> C[记录问题]
   C --> D[选择塔罗牌]
   D --> E[书写解读]
   E --> F[保存记录]
   ```

3. 项目追踪流程
   ```mermaid
   graph LR
   A[查看项目概览] --> B[更新项目进度]
   B --> C[添加塔罗记录]
   C --> D[调整目标]
   D --> E[完成项目]
   ```

## 设计系统

### 设计理念：Moonlight Serenity
- 简约优雅的月光美学
- 强调空间和留白
- 注重层次和深度
- 柔和的视觉过渡
- 自然流畅的交互体验

### 颜色系统

1. 主色调
```css
--background: 220 25% 9%;      /* 深夜蓝黑色背景 */
--foreground: 220 25% 96%;     /* 月光银白色前景 */
--border: 220 25% 96%;         /* 边框色 */
--ring: 220 25% 96%;           /* 焦点环色 */
```

2. 透明度变化
```css
--background/95: 95% 透明度背景
--background/70: 70% 透明度背景
--background/50: 50% 透明度背景
--foreground/70: 70% 透明度前景
--foreground/40: 40% 透明度前景
--foreground/20: 20% 透明度前景
--foreground/10: 10% 透明度前景
--foreground/5: 5% 透明度前景
```

3. 状态颜色
```css
--primary: 220 25% 96%;        /* 主要操作 */
--secondary: 220 25% 96%;      /* 次要操作 */
--muted: 220 25% 96%;          /* 静音状态 */
--accent: 220 25% 96%;         /* 强调 */
```

### 字体系统

1. 字体家族
```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
```

2. 字重规范
```css
--font-extralight: 200;    /* 特细，用于大标题和强调文本 */
--font-light: 300;         /* 细体，用于正文和次要信息 */
--font-normal: 400;        /* 常规，用于按钮和交互元素 */
```

3. 文字大小
```css
--text-xs: 0.75rem;       /* 12px, 用于辅助信息 */
--text-sm: 0.875rem;      /* 14px, 用于次要文本 */
--text-base: 1rem;        /* 16px, 用于正文 */
--text-lg: 1.125rem;      /* 18px, 用于小标题 */
--text-xl: 1.25rem;       /* 20px, 用于中标题 */
--text-2xl: 1.5rem;       /* 24px, 用于大标题 */
```

### 间距系统

1. 组件间距
```css
--space-2: 0.5rem;        /* 8px, 最小间距 */
--space-3: 0.75rem;       /* 12px, 内部元素间距 */
--space-4: 1rem;          /* 16px, 常规间距 */
--space-6: 1.5rem;        /* 24px, 组件内边距 */
--space-8: 2rem;          /* 32px, 组件间距 */
--space-16: 4rem;         /* 64px, 区块间距 */
```

2. 布局网格
```css
grid-cols-1                /* 移动端单列 */
md:grid-cols-2            /* 平板双列 */
lg:grid-cols-3            /* 桌面三列 */
gap-6                     /* 1.5rem 网格间距 */
```

### 卡片样式

1. 基础卡片
```css
.card {
  @apply bg-background/95;
  @apply backdrop-blur-xl;
  @apply border border-border/20;
  @apply rounded-lg;
  @apply shadow-lg;
  @apply transition-all duration-300;
}
```

2. 交互状态
```css
.card:hover {
  @apply bg-background/70;
  @apply transform;
  @apply scale-[1.02];
  @apply shadow-xl;
}
```

3. 卡片内容
```css
.card-content {
  @apply p-6;
  @apply space-y-4;
}
```

### 组件规范

1. 按钮
```css
.button {
  @apply font-light;
  @apply transition-all duration-300;
  @apply rounded-md;
  @apply px-4 py-2;
}

.button-primary {
  @apply bg-foreground/10;
  @apply hover:bg-foreground/15;
  @apply text-foreground;
}

.button-outline {
  @apply border-border/20;
  @apply text-foreground/70;
  @apply hover:bg-foreground/5;
}
```

2. 输入框
```css
.input {
  @apply bg-background/50;
  @apply border-border/20;
  @apply text-foreground;
  @apply placeholder:text-foreground/40;
  @apply font-light;
  @apply transition-all duration-300;
  @apply hover:bg-background/70;
  @apply focus:bg-background/70;
}
```

3. 选择器
```css
.select {
  @apply bg-background/50;
  @apply border-border/20;
  @apply text-foreground;
  @apply font-light;
}

.select-content {
  @apply bg-background/95;
  @apply backdrop-blur-xl;
  @apply border-border/20;
}
```

### 交互规范

1. 动画持续时间
```css
--duration-300: 300ms;    /* 标准过渡时间 */
--duration-500: 500ms;    /* 强调动画时间 */
```

2. 过渡效果
```css
.transition {
  @apply transition-all;
  @apply duration-300;
  @apply ease-in-out;
}
```

3. 悬停反馈
- 背景透明度增加 20%
- 轻微缩放 (1.02)
- 阴影加深

4. 焦点状态
- 显示轻微边框光晕
- 背景色加深
- 不使用强烈的轮廓线

5. 加载状态
- 使用优雅的淡入淡出效果
- 保持界面其他部分可交互
- 避免突兀的加载指示器

### 响应式设计

1. 断点
```css
--sm: 640px;     /* 手机横屏 */
--md: 768px;     /* 平板竖屏 */
--lg: 1024px;    /* 平板横屏 */
--xl: 1280px;    /* 桌面显示器 */
```

2. 布局适配
- 移动端：单列布局，全宽组件
- 平板：双列网格，适度留白
- 桌面：三列网格，最大宽度限制

3. 触摸优化
- 按钮和可点击区域最小 44x44px
- 增加移动端的点击区域
- 优化触摸手势的交互反馈

## 设计原则

1. 简约优雅
- 减少视觉噪音
- 强调内容的层次感
- 保持界面的清爽整洁

2. 自然流畅
- 平滑的动画过渡
- 符合直觉的交互方式
- 渐进式的信息展示

3. 情感共鸣
- 通过视觉设计传达平静感
- 营造月光般柔和的氛围
- 强化仪式感和个人连接

4. 可访问性
- 保持足够的对比度
- 提供清晰的视觉反馈
- 支持键盘导航和屏幕阅读 

## 日历视图迭代设计 (Calendar View Iteration)

### 1. 首页核心布局

#### 月历主视图
```css
/* 页面容器 */
.page-container {
  @apply min-h-screen;
  @apply bg-gradient-to-b;
  @apply from-background/30;
  @apply to-background/10;
  @apply backdrop-blur-sm;
}

/* 月历容器 */
.calendar-container {
  @apply max-w-7xl;
  @apply mx-auto;
  @apply px-4;
  @apply py-6;
  @apply space-y-6;
}

/* 月历网格 */
.calendar-grid {
  @apply grid;
  @apply grid-cols-7;
  @apply gap-1;
  @apply bg-background/30;
  @apply backdrop-blur-md;
  @apply p-4;
  @apply rounded-lg;
  @apply border;
  @apply border-border/10;
  @apply shadow-xl;
}

/* 日期格子 */
.date-cell {
  @apply relative;
  @apply min-h-[120px];
  @apply p-2;
  @apply border;
  @apply border-border/10;
  @apply rounded-md;
  @apply transition-all;
  @apply duration-300;
  @apply bg-background/20;
  @apply backdrop-blur-sm;
  @apply hover:bg-background/30;
  @apply hover:border-border/20;
}

/* 日期数字 */
.date-number {
  @apply font-light;
  @apply text-xl;
  @apply text-foreground/90;
}

/* 农历日期 */
.lunar-date {
  @apply text-xs;
  @apply text-foreground/60;
}

/* 月相图标 */
.moon-phase-icon {
  @apply absolute;
  @apply top-2;
  @apply right-2;
  @apply w-4;
  @apply h-4;
  @apply opacity-80;
}

/* 今日标记 */
.today-cell {
  @apply ring-2;
  @apply ring-primary/30;
  @apply ring-offset-2;
  @apply ring-offset-background/10;
}

/* 非当月日期 */
.other-month {
  @apply opacity-50;
}
```

#### 项目卡片样式
```css
/* 项目卡片容器 */
.project-card {
  @apply flex;
  @apply items-center;
  @apply my-1;
  @apply px-2;
  @apply py-1;
  @apply rounded-sm;
  @apply text-sm;
  @apply truncate;
  @apply backdrop-blur-sm;
  @apply transition-all;
  @apply duration-200;
  @apply hover:translate-x-0.5;
}

/* 项目状态样式 */
.project-status {
  &-active {
    @apply bg-foreground/40;
    @apply hover:bg-foreground/50;
  }
  &-completed {
    @apply bg-foreground/20;
    @apply hover:bg-foreground/30;
  }
  &-upcoming {
    @apply bg-foreground/10;
    @apply hover:bg-foreground/20;
  }
}

/* 项目标记 */
.project-marker {
  @apply w-1;
  @apply h-full;
  @apply rounded-full;
  @apply mr-2;
  @apply opacity-80;
}
```

#### 月相节点样式
```css
/* 新月样式 */
.new-moon-cell {
  @apply ring-1;
  @apply ring-primary/40;
  @apply ring-offset-1;
  @apply ring-offset-background/10;
}

/* 满月样式 */
.full-moon-cell {
  @apply bg-background/40;
  @apply backdrop-blur-md;
}

/* 上弦/下弦月样式 */
.quarter-moon-indicator {
  @apply absolute;
  @apply top-1;
  @apply right-1;
  @apply w-3;
  @apply h-3;
  @apply opacity-70;
}
```

### 2. 塔罗记录展示

```css
.tarot-record {
  @apply bg-purple-600/20;
  @apply mt-2;
  @apply p-2;
  @apply rounded-md;
  @apply flex;
  @apply items-center;
  @apply gap-2;
}

.tarot-icon {
  @apply w-4;
  @apply h-4;
  @apply text-purple-400;
}
```

### 3. 下拉详情面板

```css
.detail-panel {
  @apply fixed;
  @apply bottom-0;
  @apply left-0;
  @apply right-0;
  @apply bg-background/95;
  @apply backdrop-blur-xl;
  @apply rounded-t-xl;
  @apply shadow-2xl;
  @apply transition-transform;
  @apply duration-300;
}

.panel-grid {
  @apply grid;
  @apply grid-cols-1;
  @apply md:grid-cols-2;
  @apply gap-6;
  @apply p-6;
}

.project-details {
  @apply space-y-4;
}

.tarot-details {
  @apply space-y-4;
  @apply border-l;
  @apply border-border/20;
  @apply pl-6;
}
```

### 4. 交互规范

#### 月历导航
```css
.calendar-nav {
  @apply flex;
  @apply items-center;
  @apply justify-between;
  @apply px-4;
  @apply py-2;
}

.month-switcher {
  @apply flex;
  @apply items-center;
  @apply gap-4;
}

.today-button {
  @apply button-outline;
  @apply text-sm;
}
```

#### 手势操作
```typescript
interface GestureConfig {
  // 下拉展开阈值
  pullThreshold: 100,
  // 双指缩放比例
  zoomScale: {
    min: 0.8,
    max: 1.2
  },
  // 长按触发时间
  longPressDelay: 500
}
```

#### 响应式布局
```css
/* 移动端 */
@media (max-width: 768px) {
  .detail-panel {
    @apply h-[80vh];
  }
  
  .panel-grid {
    @apply grid-cols-1;
  }
}

/* 平板/桌面 */
@media (min-width: 769px) {
  .detail-panel {
    @apply h-[50vh];
  }
  
  .panel-grid {
    @apply grid-cols-2;
  }
}
```

### 5. 视觉风格

#### 配色系统扩展
```css
:root {
  /* 月相标识色 */
  --new-moon: hsla(220, 25%, 96%, 0.1);
  --full-moon: hsla(220, 25%, 96%, 0.3);
  --quarter-moon: hsla(220, 25%, 96%, 0.2);
  
  /* 塔罗记录色 */
  --tarot-purple: hsla(270, 50%, 65%, 0.2);
  --tarot-accent: hsla(270, 50%, 65%, 0.8);
}
```

#### 动效规范
```css
.calendar-transitions {
  /* 月份切换 */
  --month-transition: all 400ms cubic-bezier(0.4, 0, 0.2, 1);
  
  /* 面板展开 */
  --panel-transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1);
  
  /* 卡片悬停 */
  --card-hover: transform 150ms cubic-bezier(0.4, 0, 0.2, 1);
  
  /* 月相旋转 */
  --phase-rotation: rotate 10s linear infinite;
}
```

这个迭代设计方案注重：
1. 清晰的信息层级
2. 优雅的视觉呈现
3. 流畅的交互体验
4. 合理的响应式适配
5. 与现有设计系统的无缝集成

移除了时间线和能量系统，使界面更专注于核心功能的展示，同时保持了良好的可扩展性，为未来功能迭代预留了设计空间。 

## 首页设计优化 (Homepage Design Optimization)

### 1. 页面结构

```css
/* 主页容器 */
.home-container {
  @apply min-h-screen;
  @apply bg-gradient-radial;
  @apply from-background/20;
  @apply via-background/10;
  @apply to-background/5;
  @apply overflow-x-hidden;
}

/* 顶部导航区 */
.top-nav {
  @apply sticky;
  @apply top-0;
  @apply z-50;
  @apply backdrop-blur-lg;
  @apply bg-background/30;
  @apply border-b;
  @apply border-border/10;
}

.nav-content {
  @apply max-w-7xl;
  @apply mx-auto;
  @apply px-4;
  @apply h-16;
  @apply flex;
  @apply items-center;
  @apply justify-between;
}

/* 主要内容区 */
.main-content {
  @apply max-w-7xl;
  @apply mx-auto;
  @apply px-4;
  @apply py-6;
  @apply space-y-8;
}
```

### 2. 顶部信息栏

```css
/* 月相信息条 */
.moon-phase-bar {
  @apply flex;
  @apply items-center;
  @apply justify-between;
  @apply mb-6;
  @apply px-4;
  @apply py-3;
  @apply rounded-lg;
  @apply bg-background/20;
  @apply backdrop-blur-md;
  @apply border;
  @apply border-border/10;
}

/* 当前月相展示 */
.current-phase {
  @apply flex;
  @apply items-center;
  @apply gap-3;
}

.phase-icon {
  @apply w-8;
  @apply h-8;
  @apply opacity-90;
}

.phase-info {
  @apply flex;
  @apply flex-col;
}

.phase-name {
  @apply text-lg;
  @apply font-light;
  @apply text-foreground/90;
}

.phase-date {
  @apply text-sm;
  @apply text-foreground/60;
}

/* 月相切换器 */
.phase-navigation {
  @apply flex;
  @apply items-center;
  @apply gap-4;
}

.nav-button {
  @apply p-2;
  @apply rounded-full;
  @apply bg-background/30;
  @apply hover:bg-background/40;
  @apply transition-colors;
  @apply duration-200;
}
```

### 3. 快捷操作栏

```css
/* 操作按钮组 */
.action-bar {
  @apply flex;
  @apply items-center;
  @apply gap-4;
  @apply mb-6;
}

/* 主要操作按钮 */
.primary-action {
  @apply flex;
  @apply items-center;
  @apply gap-2;
  @apply px-4;
  @apply py-2;
  @apply rounded-lg;
  @apply bg-foreground/10;
  @apply hover:bg-foreground/15;
  @apply transition-all;
  @apply duration-200;
  @apply backdrop-blur-sm;
}

/* 次要操作按钮 */
.secondary-action {
  @apply flex;
  @apply items-center;
  @apply gap-2;
  @apply px-3;
  @apply py-2;
  @apply rounded-lg;
  @apply border;
  @apply border-border/10;
  @apply hover:bg-background/20;
  @apply transition-all;
  @apply duration-200;
}

/* 图标按钮 */
.icon-button {
  @apply p-2;
  @apply rounded-full;
  @apply hover:bg-background/20;
  @apply transition-colors;
  @apply duration-200;
}
```

### 4. 下拉详情面板优化

```css
/* 面板容器 */
.details-panel {
  @apply fixed;
  @apply inset-x-0;
  @apply bottom-0;
  @apply z-40;
  @apply bg-background/80;
  @apply backdrop-blur-xl;
  @apply rounded-t-2xl;
  @apply border-t;
  @apply border-border/10;
  @apply shadow-2xl;
  @apply transition-all;
  @apply duration-300;
  @apply ease-in-out;
  @apply transform;
}

/* 面板拖动条 */
.drag-handle {
  @apply w-12;
  @apply h-1;
  @apply mx-auto;
  @apply mt-3;
  @apply mb-4;
  @apply rounded-full;
  @apply bg-foreground/20;
}

/* 面板内容 */
.panel-content {
  @apply max-w-7xl;
  @apply mx-auto;
  @apply px-4;
  @apply pb-8;
  @apply grid;
  @apply grid-cols-1;
  @apply md:grid-cols-2;
  @apply gap-8;
}

/* 面板标题 */
.panel-section-title {
  @apply text-lg;
  @apply font-light;
  @apply mb-4;
  @apply flex;
  @apply items-center;
  @apply justify-between;
}
```

### 5. 响应式优化

```css
/* 移动端适配 */
@media (max-width: 640px) {
  .moon-phase-bar {
    @apply flex-col;
    @apply items-start;
    @apply gap-3;
  }

  .action-bar {
    @apply grid;
    @apply grid-cols-2;
    @apply gap-2;
  }

  .primary-action {
    @apply col-span-2;
  }
}

/* 平板适配 */
@media (min-width: 641px) and (max-width: 1024px) {
  .action-bar {
    @apply flex-wrap;
  }
}

/* 大屏适配 */
@media (min-width: 1025px) {
  .main-content {
    @apply py-8;
  }

  .details-panel {
    @apply max-h-[70vh];
  }
}
```

### 6. 动效与交互

```css
/* 页面过渡效果 */
.page-transitions {
  /* 页面载入 */
  --page-enter: opacity-0 transform scale-95;
  --page-enter-active: opacity-100 transform scale-100;
  @apply transition-all;
  @apply duration-500;
  @apply ease-out;

  /* 面板滑动 */
  --panel-slide: transform translateY(100%);
  --panel-slide-active: transform translateY(0);
  @apply transition-transform;
  @apply duration-300;
  @apply ease-in-out;
}

/* 内容淡入效果 */
.content-fade {
  @apply animate-in;
  @apply fade-in;
  @apply duration-300;
  @apply ease-out;
}

/* 交互反馈 */
.interaction-feedback {
  /* 点击波纹 */
  --ripple-color: rgb(255 255 255 / 0.1);
  --ripple-duration: 600ms;
  
  /* 悬停提示 */
  --tooltip-bg: rgb(0 0 0 / 0.8);
  --tooltip-color: rgb(255 255 255 / 0.9);
}
```

### 7. 主题与氛围

```css
/* 背景装饰 */
.background-decoration {
  @apply fixed;
  @apply inset-0;
  @apply pointer-events-none;
  @apply z-0;
}

.star-field {
  @apply absolute;
  @apply inset-0;
  @apply opacity-30;
  @apply mix-blend-screen;
}

.ambient-gradient {
  @apply absolute;
  @apply inset-0;
  @apply bg-gradient-to-br;
  @apply from-purple-500/5;
  @apply via-transparent;
  @apply to-blue-500/5;
}

/* 月光效果 */
.moonlight-effect {
  @apply absolute;
  @apply w-[200%];
  @apply h-[200%];
  @apply bg-radial;
  @apply from-foreground/5;
  @apply to-transparent;
  @apply blur-2xl;
  @apply animate-pulse;
  @apply duration-[10000ms];
}
```

这个优化设计方案：

1. **结构优化**
- 清晰的页面层级
- 响应式布局支持
- 模块化的组件结构

2. **视觉提升**
- 渐变背景效果
- 玻璃拟态设计
- 动态光效处理

3. **交互体验**
- 流畅的动画过渡
- 直观的操作反馈
- 优雅的手势支持

4. **性能考虑**
- 优化的动画性能
- 合理的模糊效果
- 响应式图片处理

5. **可访问性**
- 清晰的视觉层级
- 合适的对比度
- 友好的键盘操作

这个设计既保持了原有的月光美学风格，又在实用性和性能上做了优化，为用户提供更好的使用体验。需要我对某个具体部分做更详细的解释吗？ 