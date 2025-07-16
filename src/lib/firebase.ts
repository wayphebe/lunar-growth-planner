import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, limit, query } from 'firebase/firestore';

// 您的 Firebase 配置
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// 初始化 Firebase
const app = initializeApp(firebaseConfig);

// 获取 Firestore 实例
export const db = getFirestore(app);

// 添加连接状态监听
let isConnected = false;
let connectionRetries = 0;
const maxRetries = 3;

// 检查连接状态
export const checkFirebaseConnection = async () => {
  try {
    // 尝试一个简单的查询来测试连接
    const testCollection = collection(db, 'test');
    const testQuery = query(testCollection, limit(1));
    await getDocs(testQuery);
    isConnected = true;
    connectionRetries = 0;
    console.log('✅ Firebase 连接成功');
    return true;
  } catch (error) {
    console.error('❌ Firebase 连接失败:', error);
    isConnected = false;
    
    if (connectionRetries < maxRetries) {
      connectionRetries++;
      console.log(`🔄 尝试重新连接 Firebase (${connectionRetries}/${maxRetries})`);
      setTimeout(() => {
        checkFirebaseConnection();
      }, 2000 * connectionRetries); // 递增延迟
    } else {
      console.error('🚫 Firebase 连接失败，已达到最大重试次数');
    }
    return false;
  }
};

// 获取连接状态
export const getConnectionStatus = () => isConnected;

// 初始化时检查连接
if (typeof window !== 'undefined') {
  // 只在浏览器环境中执行
  setTimeout(() => {
    checkFirebaseConnection();
  }, 1000);
}

export default app; 