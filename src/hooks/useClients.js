import { useCollection } from "./useFirestore";
import { addDocument, updateDocument, deleteDocument } from "../services/firestoreService";

export const useClients = () => {
  const { data: clients, loading, error } = useCollection("clients");

  const addClient = (client) => addDocument("clients", client);
  const updateClient = (id, client) => updateDocument("clients", id, client);
  const deleteClient = (id) => deleteDocument("clients", id);

  return { clients, loading, error, addClient, updateClient, deleteClient };
};
