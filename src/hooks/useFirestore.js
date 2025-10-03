import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { collection, onSnapshot, doc } from "firebase/firestore";

export const useCollection = (path) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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
  }, [path]);

  return { data, loading, error };
};

export const useDocument = (path, id) => {
  const [docData, setDocData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const unsub = onSnapshot(doc(db, path, id), (snap) => {
      setDocData(snap.exists() ? { id: snap.id, ...snap.data() } : null);
      setLoading(false);
    });
    return () => unsub();
  }, [path, id]);

  return { docData, loading };
};
