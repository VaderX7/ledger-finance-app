import { db, auth } from './firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export async function saveUserNameToCloud(uid: string, name: string): Promise<void> {
  try {
    await setDoc(doc(db, 'users', uid), { displayName: name }, { merge: true });
  } catch (e) {
    console.error('Error saving display name to Firestore:', e);
  }
}

export async function loadUserNameFromCloud(uid: string): Promise<string | null> {
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (snap.exists()) {
      const data = snap.data();
      if (data.displayName && typeof data.displayName === 'string') {
        return data.displayName;
      }
    }
    return null;
  } catch (e) {
    console.error('Error loading display name from Firestore:', e);
    return null;
  }
}
