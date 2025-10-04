import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export const useUserRoles = (userId) => {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setUserRole(null);
      setLoading(false);
      return;
    }

    const fetchUserRole = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserRole(userData.role || 'user');
        } else {
          // Si el usuario no existe en Firestore, crear con rol 'user' por defecto
          // Excepto si es el primer usuario (admin)
          const allUsersSnapshot = await getDoc(doc(db, 'settings', 'userCount'));
          const isFirstUser = !allUsersSnapshot.exists() || allUsersSnapshot.data().count === 0;
          
          const newRole = isFirstUser ? 'admin' : 'user';
          
          await setDoc(doc(db, 'users', userId), {
            role: newRole,
            createdAt: new Date().toISOString()
          });

          // Actualizar contador si es el primer usuario
          if (isFirstUser) {
            await setDoc(doc(db, 'settings', 'userCount'), { count: 1 });
          } else {
            const currentCount = allUsersSnapshot.data()?.count || 0;
            await setDoc(doc(db, 'settings', 'userCount'), { count: currentCount + 1 });
          }
          
          setUserRole(newRole);
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
        setUserRole('user'); // Default fallback
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [userId]);

  const updateUserRole = async (newRole) => {
    if (!userId) return false;
    
    try {
      await setDoc(doc(db, 'users', userId), {
        role: newRole,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      
      setUserRole(newRole);
      return true;
    } catch (error) {
      console.error('Error updating user role:', error);
      return false;
    }
  };

  const isAdmin = () => userRole === 'admin';
  const canEditCompany = () => userRole === 'admin';
  const canCreateContent = () => ['admin', 'user'].includes(userRole);

  return {
    userRole,
    loading,
    updateUserRole,
    isAdmin,
    canEditCompany,
    canCreateContent
  };
};