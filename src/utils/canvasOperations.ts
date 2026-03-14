import { doc, getDoc, setDoc, updateDoc, deleteDoc, serverTimestamp, collection, getDocs } from 'firebase/firestore';
import { db } from '@/src/lib/firebase'; 
import { CanvasDocument, CanvasElement } from '../types/CanvasTypes';

/**
 * 獲取使用者所有已紀錄畫布的日期
 * @param userId 使用者的 Firebase UID
 * @returns 回傳日期字串陣列 ["YYYY-MM-DD", ...]
 */
export async function getRecordedDates(userId: string): Promise<string[]> {
  if (!userId) throw new Error("缺少 userId 參數");

  try {
    const canvasesColRef = collection(db, 'users', userId, 'canvases');
    const querySnapshot = await getDocs(canvasesColRef);
    
    // 取得所有文件的 ID (即日期字串) 並排序
    const dates = querySnapshot.docs.map(doc => doc.id);
    return dates.sort((a, b) => a.localeCompare(b));
  } catch (error) {
    console.error("獲取紀錄日期失敗:", error);
    throw error;
  }
}

/**
 * 讀取特定日期的畫布資料
 * @param userId 使用者的 Firebase UID
 * @param date 畫布日期，格式為 "YYYY-MM-DD"
 * @returns 回傳畫布資料，如果該天還沒有紀錄，則回傳 null
 */
export async function getCanvas(userId: string, date: string): Promise<CanvasDocument | null> {
  if (!userId || !date) throw new Error("缺少 userId 或 date 參數");

  try {
    // 指向 users/{userId}/canvases/{date}
    const canvasRef = doc(db, 'users', userId, 'canvases', date);
    const canvasSnap = await getDoc(canvasRef);

    if (canvasSnap.exists()) {
      return canvasSnap.data() as CanvasDocument;
    } else {
      // 該天還沒有建立過畫布
      return null;
    }
  } catch (error) {
    console.error("讀取畫布失敗:", error);
    throw error;
  }
}

/**
 * 儲存或更新特定日期的畫布資料 (手動存檔)
 * @param userId 使用者的 Firebase UID
 * @param date 畫布日期，格式為 "YYYY-MM-DD"
 * @param elements 畫布上的所有物件陣列
 * @param isNew - 這是否為該日期的「第一次」存檔
 * @param background 畫布背景色 (選填，預設為紙張色)
 */
export async function saveCanvas(
  userId: string, 
  date: string, 
  elements: CanvasElement[],
  isNew: boolean,
  background: string = "#FDFBF7"
): Promise<void> {
  if (!userId || !date) throw new Error("缺少 userId 或 date 參數");

  const canvasRef = doc(db, 'users', userId, 'canvases', date);

  try {
    if (isNew) {
      await setDoc(canvasRef, {
        date,
        background,
        elements,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } else {
      await updateDoc(canvasRef, {
        elements,
        background,
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    console.error("儲存畫布失敗:", error);
    throw error;
  }
}

/**
 * 刪除特定日期的畫布資料
 * @param userId 使用者的 Firebase UID
 * @param date 畫布日期，格式為 "YYYY-MM-DD"
 */
export async function deleteCanvas(userId: string, date: string): Promise<void> {
  if (!userId || !date) throw new Error("缺少 userId 或 date 參數");

  try {
    const canvasRef = doc(db, 'users', userId, 'canvases', date);
    await deleteDoc(canvasRef);
  } catch (error) {
    console.error("刪除畫布失敗:", error);
    throw error;
  }
}