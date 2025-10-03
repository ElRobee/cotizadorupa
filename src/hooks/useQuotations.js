import { useCollection } from "./useFirestore";
import { addDocument, updateDocument, deleteDocument } from "../services/firestoreService";

export const useQuotations = () => {
  const { data: quotations, loading, error } = useCollection("quotations");

  const addQuotation = (quotation) => addDocument("quotations", quotation);
  const updateQuotation = (id, quotation) => updateDocument("quotations", id, quotation);
  const deleteQuotation = (id) => deleteDocument("quotations", id);

  return { quotations, loading, error, addQuotation, updateQuotation, deleteQuotation };
};
