import { ref, computed, watch } from "vue";
import { useDebounceFn } from "@vueuse/core";

export interface NetlifyBlobsOptions {
  store: string;
  key: string;
  autoSync?: boolean;
  debounceMs?: number;
}

export function useNetlifyBlobs<T>(options: NetlifyBlobsOptions) {
  const { store, key, autoSync = false, debounceMs = 500 } = options;
  
  const data = ref<T | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const isDirty = ref(false);
  
  const apiBase = import.meta.env.DEV 
    ? `http://localhost:8888/api/blobs/${store}/${key}`
    : `/api/blobs/${store}/${key}`;
  
  const load = async (): Promise<T | null> => {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await fetch(`${apiBase}/get`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to load data");
      }
      
      const result = await response.json();
      data.value = result;
      isDirty.value = false;
      return result;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to load data";
      console.error("Load error:", err);
      return null;
    } finally {
      isLoading.value = false;
    }
  };
  
  const save = async (newData?: T): Promise<boolean> => {
    const dataToSave = newData || data.value;
    if (!dataToSave) return false;
    
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await fetch(`${apiBase}/set`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSave)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save data");
      }
      
      if (newData) {
        data.value = newData;
      }
      isDirty.value = false;
      return true;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to save data";
      console.error("Save error:", err);
      return false;
    } finally {
      isLoading.value = false;
    }
  };
  
  const debouncedSave = useDebounceFn(() => {
    if (data.value) {
      save();
    }
  }, debounceMs);
  
  const update = (newData: T) => {
    data.value = newData;
    isDirty.value = true;
    
    if (autoSync) {
      debouncedSave();
    }
  };
  
  const remove = async (): Promise<boolean> => {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await fetch(`${apiBase}/delete`, {
        method: "DELETE"
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete data");
      }
      
      data.value = null;
      isDirty.value = false;
      return true;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to delete data";
      console.error("Delete error:", err);
      return false;
    } finally {
      isLoading.value = false;
    }
  };
  
  // Auto-sync watcher
  if (autoSync) {
    watch(data, () => {
      if (data.value && isDirty.value) {
        debouncedSave();
      }
    }, { deep: true });
  }
  
  const isOnline = computed(() => !isLoading.value && !error.value);
  const hasData = computed(() => data.value !== null);
  
  return {
    // State
    data,
    isLoading,
    error,
    isDirty,
    isOnline,
    hasData,
    
    // Actions
    load,
    save,
    update,
    remove,
  };
}