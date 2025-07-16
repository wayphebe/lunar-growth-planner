import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// 您的 Firebase 配置
const firebaseConfig = {
  apiKey: "AIzaSyAOOAB0yDmCRM0Zae0iz_QC_3lZEluejP4",
  authDomain: "lunar-growth-planner.firebaseapp.com",
  projectId: "lunar-growth-planner",
  storageBucket: "lunar-growth-planner.firebasestorage.app",
  messagingSenderId: "156950079132",
  appId: "1:156950079132:web:50b35e89948f5892232f59"
};

// 初始化 Firebase
const app = initializeApp(firebaseConfig);

// 获取 Firestore 实例
export const db = getFirestore(app);

export default app; 