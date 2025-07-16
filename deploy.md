# 部署配置和操作指南

## 部署平台

### 1. Vercel 部署
- **访问地址**: https://lunar-growth-planner-xxx.vercel.app
- **配置**: 使用环境变量配置 Firebase
- **路由**: 使用 BrowserRouter

### 2. GitHub Pages 部署
- **访问地址**: https://wayphebe.github.io/lunar-growth-planner
- **配置**: 使用 GitHub Actions 自动部署
- **路由**: 使用 HashRouter

## 环境变量配置

### Vercel 环境变量
在 Vercel 项目设置中添加以下环境变量：
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### GitHub Secrets
在 GitHub 仓库 Settings > Secrets and variables > Actions 中添加：
```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
```

## 配置文件

### vite.config.ts
```typescript
export default defineConfig(({ mode }) => ({
  // 根据部署平台智能设置base路径
  base: process.env.VERCEL ? '/' : (mode === 'production' ? '/lunar-growth-planner/' : '/'),
  server: {
    host: "::",
    port: 5173,
  },
  // 添加构建优化
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          firebase: ['firebase/app', 'firebase/firestore'],
        },
      },
    },
  },
}));
```

### App.tsx 路由配置
```typescript
// 优化QueryClient配置
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// 根据部署平台选择路由类型
const Router = process.env.VERCEL ? BrowserRouter : HashRouter;

<Router>
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/clients" element={<ClientManagement />} />
    <Route path="/tarot-reading/:shareId" element={<ClientTarotReading />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
</Router>
```

### vercel.json 配置
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## GitHub Actions 工作流

### .github/workflows/deploy.yml
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    
    steps:
    - name: Checkout
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build
      run: npm run build
      env:
        VITE_FIREBASE_API_KEY: ${{ secrets.VITE_FIREBASE_API_KEY }}
        VITE_FIREBASE_AUTH_DOMAIN: ${{ secrets.VITE_FIREBASE_AUTH_DOMAIN }}
        VITE_FIREBASE_PROJECT_ID: ${{ secrets.VITE_FIREBASE_PROJECT_ID }}
        VITE_FIREBASE_STORAGE_BUCKET: ${{ secrets.VITE_FIREBASE_STORAGE_BUCKET }}
        VITE_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.VITE_FIREBASE_MESSAGING_SENDER_ID }}
        VITE_FIREBASE_APP_ID: ${{ secrets.VITE_FIREBASE_APP_ID }}
        
    - name: Setup Pages
      uses: actions/configure-pages@v4
      
    - name: Upload artifact
      uses: actions/upload-pages-artifact@v3
      with:
        path: './dist'
        
    - name: Deploy to GitHub Pages
      id: deployment
      uses: actions/deploy-pages@v4
      
    - name: Output deployment URL
      run: echo "Deployed to ${{ steps.deployment.outputs.page_url }}"
```

## 部署操作流程

### 自动部署（推荐）
1. 使用 GitHub Desktop 推送代码到 `main` 分支
2. GitHub Actions 自动检测推送并运行部署流程
3. 在 GitHub 仓库的 "Actions" 标签页查看部署进度
4. 部署完成后访问 GitHub Pages 地址

### 手动部署（如需要）
```bash
# 本地构建
npm run build

# 推送到 GitHub
git add .
git commit -m "Update deployment"
git push origin main
```

## 常见问题解决

### 1. 404 错误
- **原因**: GitHub Pages 不支持 BrowserRouter
- **解决**: 使用 HashRouter 进行路由

### 2. 资源加载错误
- **原因**: base 路径配置不正确
- **解决**: 根据部署平台设置正确的 base 路径

### 3. Firebase 连接错误
- **原因**: 中国网络限制导致无法访问 Google 服务器
- **解决**: 
  - 使用 VPN 访问
  - 部署到国内服务器/CDN
  - 应用已添加网络状态检测和重试机制
  - 显示友好的错误提示和重试按钮

### 4. 环境变量未生效
- **检查**: 确保在正确的平台设置了环境变量
- **验证**: 检查构建日志中的环境变量是否正确传递

## 部署状态检查

### GitHub Actions 状态
- 访问仓库的 "Actions" 标签页
- 查看最新的 workflow 运行状态
- 检查构建和部署日志

### 网站访问测试
- Vercel: https://lunar-growth-planner-xxx.vercel.app
- GitHub Pages: https://wayphebe.github.io/lunar-growth-planner
- 测试分享链接功能
- 验证 Firebase 数据同步

## 更新记录

### 2024-12-19
- 配置双平台部署（Vercel + GitHub Pages）
- 优化路由配置，根据平台选择 BrowserRouter 或 HashRouter
- 添加环境变量配置
- 设置 GitHub Actions 自动部署
- 解决 404 错误和资源加载问题
- 添加构建优化配置
- 修复 Vercel 分享链接跳转到首页的问题
- 添加 Firebase 连接状态检测和错误处理
- 创建网络状态提示组件，提供友好的错误信息和重试功能

## 注意事项

1. **数据共享**: 两个平台共享同一个 Firebase 数据库
2. **路由差异**: Vercel 使用 BrowserRouter，GitHub Pages 使用 HashRouter
3. **环境变量**: 需要在两个平台分别配置
4. **网络限制**: 中国用户访问 Firebase 可能需要 VPN
5. **自动部署**: 推送代码到 main 分支会自动触发部署 