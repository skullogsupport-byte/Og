import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const saveOrderToFirestore = async (orderData: any) => {
  try {
    const ordersRef = collection(db, 'orders');
    await addDoc(ordersRef, {
      ...orderData,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Failed to save order to Firestore:", error);
  }
};
