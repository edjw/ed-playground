import { ref } from "vue";
import { getStore } from "@netlify/blobs";

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
      const store = getStore({ 
        name: "medicine-data",
        siteID: import.meta.env.VITE_NETLIFY_SITE_ID 
      });
      await store.setJSON("data", data);
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
      const store = getStore({ 
        name: "medicine-data",
        siteID: import.meta.env.VITE_NETLIFY_SITE_ID 
      });
      const data = await store.get("data", { type: "json" });
      return data as MedicineData | null;
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
