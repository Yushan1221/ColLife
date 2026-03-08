'use client';

import { useState } from 'react';
import { useAuth } from '@/src/hooks/useAuth';
import { getCanvas, saveCanvas } from '@/src/utils/canvasOperations';
import { CanvasDocument, CanvasElement } from '@/src/types/CanvasTypes';
import LoadingPage from '@/src/components/loading/LoadingPage';

export default function TestCanvasOperations() {
  const { user, loading: authLoading } = useAuth();
  const [testResult, setTestResult] = useState<string>('等待測試開始...');
  const [currentCanvas, setCurrentCanvas] = useState<CanvasDocument | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  const runTest = async () => {
    if (!user) {
      setTestResult('錯誤：請先登入後再進行測試。');
      return;
    }

    setIsTesting(true);
    setTestResult('🚀 開始測試流程...');
    
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    
    try {
      // 1. 檢查資料是否存在
      setTestResult((prev) => prev + `\n\n[步驟 1] 檢查今日資料 (日期: ${today})...`);
      const existingCanvas = await getCanvas(user.uid, today);
      
      let initialElements: CanvasElement[] = [];

      if (!existingCanvas) {
        setTestResult((prev) => prev + '\n   🔍 狀態：當天無資料。準備執行【第一次新增】...');
        
        // 2. 第一次新增資料
        initialElements = [
          {
            id: 'test-1',
            type: 'text',
            content: '這是第一次新增的文字',
            x: 50,
            y: 50,
            rotation: 0,
            scale: 1,
            zIndex: 1
          }
        ];
        
        setTestResult((prev) => prev + '\n   📡 呼叫 saveCanvas(..., isNew: true)');
        await saveCanvas(user.uid, today, initialElements, true, '#FDFBF7');
        setTestResult((prev) => prev + '\n   ✅ 結果：第一次新增資料成功！');
      } else {
        setTestResult((prev) => prev + '\n   🔍 狀態：當天已有資料。跳過新增步驟。');
        setCurrentCanvas(existingCanvas);
        initialElements = existingCanvas.elements;
      }

      // 3. 上傳 (更新) 資料
      setTestResult((prev) => prev + '\n\n[步驟 2] 準備執行【上傳更新】...');
      
      const updatedElements: CanvasElement[] = [
        ...initialElements.map(el => ({
          ...el,
          content: '已更新的文字 ' + new Date().toLocaleTimeString(),
          x: el.x + 50,
          y: el.y + 50
        })),
        {
          id: 'test-sticker-' + Date.now(),
          type: 'sticker',
          src: '/assets/stickers/dancing.svg',
          x: 200,
          y: 200,
          rotation: 15,
          scale: 1.2,
          zIndex: 2
        }
      ];

      setTestResult((prev) => prev + '\n   📡 呼叫 saveCanvas(..., isNew: false)');
      await saveCanvas(user.uid, today, updatedElements, false, '#EBE3D5');
      setTestResult((prev) => prev + '\n   ✅ 結果：資料上傳更新成功！');

      // 4. 驗證最終結果
      setTestResult((prev) => prev + '\n\n[步驟 3] 從資料庫重新讀取以驗證內容...');
      const finalCanvas = await getCanvas(user.uid, today);
      
      if (finalCanvas) {
        setCurrentCanvas(finalCanvas);
        setTestResult((prev) => prev + '\n   🎊 測試圓滿完成！');
        setTestResult((prev) => prev + '\n   📊 最終狀態：');
        setTestResult((prev) => prev + `\n      - 物件數量: ${finalCanvas.elements.length}`);
        setTestResult((prev) => prev + `\n      - 更新時間: ${finalCanvas.updatedAt?.toDate().toLocaleString()}`);
        console.log('Final Canvas Data:', finalCanvas);
      } else {
        setTestResult((prev) => prev + '\n   ❌ 測試失敗：無法取得最終資料。');
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '發生未知錯誤';
      console.error('測試過程中發生錯誤:', error);
      setTestResult((prev) => prev + `\n\n❌ 測試出錯：${errorMessage}`);
    } finally {
      setIsTesting(false);
    }
  };

  if (authLoading) return <LoadingPage />;

  return (
    <div className="p-8 font-mono bg-background text-foreground min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
          <span className="bg-color-primary text-white p-2 rounded-lg text-sm">TEST</span>
          Canvas Operations 測試頁面
        </h1>
        
        <div className="mb-8 p-6 bg-white rounded-xl border border-color-border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-color-muted font-bold uppercase tracking-wider">Current User</p>
              <p className="text-lg font-medium">{user ? user.email : '未登入 (請先從導覽列登入)'}</p>
            </div>
            <button 
              onClick={runTest}
              disabled={!user || isTesting}
              className="px-8 py-3 bg-color-primary text-white rounded-full hover:bg-color-primary-hover disabled:opacity-50 transition-all font-bold shadow-md active:scale-95"
            >
              {isTesting ? '🚀 執行中...' : '開始執行完整測試'}
            </button>
          </div>
          {!user && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
              請務必先進行登入，否則 Firebase Firestore 無法正確寫入資料。
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col">
            <h2 className="text-sm text-color-muted font-bold uppercase tracking-wider mb-2">測試 Log</h2>
            <pre className="p-5 bg-stone-900 text-green-400 rounded-xl overflow-auto h-[450px] text-sm whitespace-pre-wrap leading-relaxed border-4 border-stone-800 shadow-inner">
              {testResult}
            </pre>
          </div>

          <div className="flex flex-col">
            <h2 className="text-sm text-color-muted font-bold uppercase tracking-wider mb-2">資料庫即時內容 (JSON)</h2>
            <div className="p-5 bg-white border border-color-border rounded-xl h-[450px] overflow-auto shadow-sm">
              {currentCanvas ? (
                <pre className="text-xs text-color-foreground leading-tight">
                  {JSON.stringify(currentCanvas, null, 2)}
                </pre>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-color-muted italic">尚未取得資料內容</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center text-xs text-color-muted">
          本頁面僅供開發者進行 Firebase Firestore 讀寫邏輯驗證使用
        </div>
      </div>
    </div>
  );
}
