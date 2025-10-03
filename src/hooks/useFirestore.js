import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { collection, onSnapshot, doc } from "firebase/firestore";
import { useAuth } from "./useAuth";

export const useCollection = (path) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return; // Esperar a que se determine el estado de autenticación
    
    if (!user) {
      setData([]);
      setLoading(false);
      setError(null);
      return;
    }

    const unsub = onSnapshot(
      collection(db, path),
      (snap) => {
        setData(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );
    return () => unsub();
  }, [path, user, authLoading]);

  return { data, loading, error };
};

export const useDocument = (path, id) => {
  const [docData, setDocData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return;
    
    if (!user || !id) {
      setDocData(null);
      setLoading(false);
      return;
    }

    const unsub = onSnapshot(doc(db, path, id), (snap) => {
      setDocData(snap.exists() ? { id: snap.id, ...snap.data() } : null);
      setLoading(false);
    });
    return () => unsub();
  }, [path, id, user, authLoading]);

  return { docData, loading };
};
