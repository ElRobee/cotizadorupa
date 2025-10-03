import { db } from "../lib/firebase";
import { collection, doc, addDoc, updateDoc, deleteDoc, getDoc, getDocs } from "firebase/firestore";

export const getCollection = async (path) => {
  const snapshot = await getDocs(collection(db, path));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getDocument = async (path, id) => {
  const snap = await getDoc(doc(db, path, id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

export const addDocument = async (path, data) => {
  const ref = await addDoc(collection(db, path), data);
  return ref.id;
};

export const updateDocument = async (path, id, data) => {
  await updateDoc(doc(db, path, id), data);
};

export const deleteDocument = async (path, id) => {
  await deleteDoc(doc(db, path, id));
};
