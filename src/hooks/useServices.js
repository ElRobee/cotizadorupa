import { useCollection } from "./useFirestore";
import { addDocument, updateDocument, deleteDocument } from "../services/firestoreService";

export const useServices = () => {
  const { data: services, loading, error } = useCollection("services");

  const addService = (service) => addDocument("services", service);
  const updateService = (id, service) => updateDocument("services", id, service);
  const deleteService = (id) => deleteDocument("services", id);

  return { services, loading, error, addService, updateService, deleteService };
};
