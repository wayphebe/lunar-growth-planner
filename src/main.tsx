import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
// 导入Firebase配置以确保初始化
import './lib/firebase.ts'

// 检查是否已经存在根容器
const container = document.getElementById("root")!;
if (!container._reactRootContainer) {
  createRoot(container).render(<App />);
}
