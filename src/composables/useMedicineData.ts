import { ref } from "vue";

export interface MedicineData {
  lastMealTime: string;
  lastMedicineTime: string;
}

const STORAGE_KEY = "medicine-tracker-data";

// Check if we're running in development or production
const isDev = import.meta.env.DEV;

export function useMedicineData() {
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const saveData = async (data: MedicineData): Promise<void> => {
    isLoading.value = true;
    error.value = null;

    try {
      if (isDev) {
        // Use localStorage in development
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } else {
        // Use Netlify Blobs in production
        const response = await fetch("/.netlify/blobs/medicine-data", {
          method: "PUT",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to save to Netlify Blobs: ${response.statusText}`);
        }
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to save data";
      console.error("Save error:", err);

      // Fallback to localStorage if Netlify Blobs fails
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (fallbackErr) {
        console.error("Fallback save error:", fallbackErr);
      }
    } finally {
      isLoading.value = false;
    }
  };

  const loadData = async (): Promise<MedicineData | null> => {
    isLoading.value = true;
    error.value = null;

    try {
      let data: MedicineData | null = null;

      if (isDev) {
        // Use localStorage in development
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          data = JSON.parse(saved);
        }
      } else {
        // Use Netlify Blobs in production
        try {
          const response = await fetch("/.netlify/blobs/medicine-data");

          if (response.ok) {
            data = await response.json();
          } else if (response.status === 404) {
            // No data exists yet, which is fine
            data = null;
          } else {
            throw new Error(`Failed to load from Netlify Blobs: ${response.statusText}`);
          }
        } catch (netlifyError) {
          // Fallback to localStorage if Netlify Blobs fails
          console.warn("Netlify Blobs failed, falling back to localStorage:", netlifyError);
          const saved = localStorage.getItem(STORAGE_KEY);
          if (saved) {
            data = JSON.parse(saved);
          }
        }
      }

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
