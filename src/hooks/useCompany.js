import { useDocument } from "./useFirestore";
import { getDocument, updateDocument } from "../services/firestoreService";

const COMPANY_COLLECTION = "company";
const COMPANY_DOC_ID = "main"; // 🔑 puedes usar "main", "default" o el ID que elijas

export const useCompany = () => {
  const { docData: company, loading } = useDocument(COMPANY_COLLECTION, COMPANY_DOC_ID);

  const getCompany = () => getDocument(COMPANY_COLLECTION, COMPANY_DOC_ID);
  const updateCompany = (data) => updateDocument(COMPANY_COLLECTION, COMPANY_DOC_ID, data);

  return { company, loading, getCompany, updateCompany };
};
