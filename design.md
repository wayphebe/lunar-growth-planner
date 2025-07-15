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