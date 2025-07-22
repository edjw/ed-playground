import { useNetlifyBlobs } from "./useNetlifyBlobs";

export interface MedicineData {
  lastMealTime: string;
  lastMedicineTime: string;
}

export function useMedicineData(options?: { autoSync?: boolean; debounceMs?: number }) {
  const { 
    data, 
    isLoading, 
    error, 
    isDirty,
    load, 
    save, 
    update 
  } = useNetlifyBlobs<MedicineData>({
    store: "medicine-data",
    key: "data",
    autoSync: options?.autoSync || false,
    debounceMs: options?.debounceMs || 500
  });

  const saveData = async (medicineData: MedicineData): Promise<void> => {
    const success = await save(medicineData);
    if (!success && error.value) {
      throw new Error(error.value);
    }
  };

  const loadData = async (): Promise<MedicineData | null> => {
    return await load();
  };

  return {
    data,
    isLoading,
    error,
    isDirty,
    saveData,
    loadData,
    update,
  };
}
