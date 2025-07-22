import { ref } from "vue";

export interface MedicineData {
  lastMealTime: string;
  lastMedicineTime: string;
}

export function useMedicineData() {
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const saveData = async (data: MedicineData): Promise<void> => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await fetch("/api/blobs/medicine-data/data/set", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save data");
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to save data";
      console.error("Save error:", err);
    } finally {
      isLoading.value = false;
    }
  };

  const loadData = async (): Promise<MedicineData | null> => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await fetch("/api/blobs/medicine-data/data/get");
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to load data");
      }

      const data = await response.json();
      return data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to load data";
      console.error("Load error:", err);
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    isLoading,
    error,
    saveData,
    loadData,
  };
}
