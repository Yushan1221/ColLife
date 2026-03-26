import { storage, db } from "@/src/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  serverTimestamp,
  Timestamp
} from "firebase/firestore";

/**
 * 上傳圖片到 firebase storage，並且在 firebase firestore 紀錄一筆圖片資料
 */
export const uploadUserImage = async (userId: string, file: File) => {
  try {

    const fileName = `${Date.now()}_${file.name}`;
    const storageRef = ref(storage, `users/${userId}/images/${fileName}`);

    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);

    // (users/{userId}/images)
    await addDoc(collection(db, "users", userId, "images"), {
      url: downloadURL,
      fileName: fileName,
      createdAt: serverTimestamp(),
    });

    return downloadURL;
  } catch (error) {
    console.error("Failed to upload image:", error);
    throw error;
  }
};

/**
 * 抓特定使用者的照片列表
 */
export const getUserImages = async (userId: string) => {
  try {
    const imagesRef = collection(db, "users", userId, "images");
    const q = query(imagesRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as { id: string; url: string; fileName: string; createdAt: Timestamp }[];
  } catch (error) {
    console.error("Failed to fetch image list:", error);
    throw error;
  }
};
