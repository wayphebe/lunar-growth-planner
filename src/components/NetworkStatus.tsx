import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { getConnectionStatus, checkFirebaseConnection } from '@/lib/firebase';

const NetworkStatus: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    const checkConnection = () => {
      const status = getConnectionStatus();
      setIsConnected(status);
    };

    // 初始检查
    checkConnection();

    // 定期检查连接状态
    const interval = setInterval(checkConnection, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleRetry = async () => {
    setIsChecking(true);
    try {
      await checkFirebaseConnection();
      // 等待一下再检查状态
      setTimeout(() => {
        setIsConnected(getConnectionStatus());
        setIsChecking(false);
      }, 1000);
    } catch (error) {
      setIsChecking(false);
    }
  };

  // 如果连接正常，不显示任何内容
  if (isConnected === null || isConnected) {
    return null;
  }

  return (
    <Alert className="mb-4 border-red-200 bg-red-50">
      <WifiOff className="h-4 w-4 text-red-600" />
      <AlertDescription className="text-red-800">
        <div className="flex items-center justify-between">
          <div>
            <strong>网络连接问题</strong>
            <p className="text-sm text-red-600 mt-1">
              无法连接到 Firebase 服务器。这可能是由于网络限制导致的。
            </p>
            <div className="text-xs text-red-500 mt-2">
              <p>• 请检查网络连接</p>
              <p>• 如果在中国大陆，可能需要使用 VPN</p>
              <p>• 或者稍后再试</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRetry}
            disabled={isChecking}
            className="ml-4"
          >
            {isChecking ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            重试
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default NetworkStatus; 