import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot,
  query,
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export const usePaymentStatus = () => {
  const [paymentStatuses, setPaymentStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const q = query(collection(db, 'paymentStatus'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const statusList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPaymentStatuses(statusList);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching payment statuses:', err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const addPaymentStatus = async (statusData) => {
    try {
      // Obtener el último número para el correlativo
      const lastNumber = paymentStatuses.length > 0 
        ? Math.max(...paymentStatuses.map(ps => parseInt(ps.number) || 25))
        : 24;
      
      const newNumber = lastNumber + 1;

      const docRef = await addDoc(collection(db, 'paymentStatus'), {
        ...statusData,
        number: newNumber.toString(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      console.log('Payment status added with ID:', docRef.id);
      return docRef.id;
    } catch (err) {
      console.error('Error adding payment status:', err);
      throw err;
    }
  };

  const updatePaymentStatus = async (id, statusData) => {
    try {
      const docRef = doc(db, 'paymentStatus', id);
      await updateDoc(docRef, {
        ...statusData,
        updatedAt: serverTimestamp()
      });
      console.log('Payment status updated:', id);
    } catch (err) {
      console.error('Error updating payment status:', err);
      throw err;
    }
  };

  const deletePaymentStatus = async (id) => {
    try {
      await deleteDoc(doc(db, 'paymentStatus', id));
      console.log('Payment status deleted:', id);
    } catch (err) {
      console.error('Error deleting payment status:', err);
      throw err;
    }
  };

  return {
    paymentStatuses,
    loading,
    error,
    addPaymentStatus,
    updatePaymentStatus,
    deletePaymentStatus
  };
};
