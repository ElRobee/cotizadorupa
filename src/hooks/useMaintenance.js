import { useCollection } from "./useFirestore";
import { addDocument, updateDocument, deleteDocument } from "../services/firestoreService";

export const useMaintenance = () => {
  const { data: equipments, loading, error } = useCollection("maintenance_equipments");

  const addEquipment = (equipment) => addDocument("maintenance_equipments", equipment);
  const updateEquipment = (id, equipment) => updateDocument("maintenance_equipments", id, equipment);
  const deleteEquipment = (id) => deleteDocument("maintenance_equipments", id);

  return { equipments, loading, error, addEquipment, updateEquipment, deleteEquipment };
};

export const useMaintenanceRecords = () => {
  const { data: records, loading, error } = useCollection("maintenance_records");

  const addMaintenanceRecord = (record) => addDocument("maintenance_records", record);
  const updateMaintenanceRecord = (id, record) => updateDocument("maintenance_records", id, record);
  const deleteMaintenanceRecord = (id) => deleteDocument("maintenance_records", id);

  return { records, loading, error, addMaintenanceRecord, updateMaintenanceRecord, deleteMaintenanceRecord };
};