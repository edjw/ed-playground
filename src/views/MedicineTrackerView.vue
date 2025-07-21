<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { toast } from "vue-sonner";
import { useNow, useCountdown, useDateFormat } from "@vueuse/core";
import { Clock, Utensils, Pill, Loader2, Edit3 } from "lucide-vue-next";
import { useMedicineData } from "@/composables/useMedicineData";
import AppLayout from "@/components/AppLayout.vue";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const { saveData, loadData, isLoading, error } = useMedicineData();

// State
const lastMealTime = ref<string>("");
const lastMedicineTime = ref<string>("");
const currentTime = useNow();

// Manual time setting
const editingMealTime = ref(false);
const editingMedicineTime = ref(false);
const tempMealTime = ref<string>("");
const tempMedicineTime = ref<string>("");

// Countdown timers
const medicineCountdownTarget = ref<number>(0);
const eatingCountdownTarget = ref<number>(0);

const medicineCountdown = useCountdown(medicineCountdownTarget, { interval: 1000 });
const eatingCountdown = useCountdown(eatingCountdownTarget, { interval: 1000 });

// Computed countdown displays
const medicineCountdownDisplay = computed(() => {
  if (!medicineCountdown.isActive.value || medicineCountdownTarget.value <= 0) return null;
  const now = Date.now();
  const remaining = Math.max(0, medicineCountdownTarget.value - now);
  if (remaining <= 0) return null;

  const totalMinutes = Math.floor(remaining / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);
  return `${totalMinutes}:${String(seconds).padStart(2, "0")}`;
});

const eatingCountdownDisplay = computed(() => {
  if (!eatingCountdown.isActive.value || eatingCountdownTarget.value <= 0) return null;
  const now = Date.now();
  const remaining = Math.max(0, eatingCountdownTarget.value - now);
  if (remaining <= 0) return null;

  const totalMinutes = Math.floor(remaining / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);
  return `${totalMinutes}:${String(seconds).padStart(2, "0")}`;
});

// Reactive date formatters
const formatTime = (dateString: string) => {
  if (!dateString) return "Not recorded";
  const formatted = useDateFormat(dateString, "HH:mm");
  return formatted.value;
};

// Format relative time
const getRelativeTime = (dateString: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = currentTime.value;
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 60) {
    return `${diffMins} minutes ago`;
  }
  const diffHours = Math.floor(diffMins / 60);
  const remainingMins = diffMins % 60;
  return `${diffHours}h ${remainingMins}m ago`;
};

// Calculate if medicine can be taken
const canTakeMedicine = computed(() => {
  const now = currentTime.value;

  // Check medicine-to-medicine constraint (must be at least 1 hour before next meal if taken)
  if (lastMedicineTime.value) {
    const medicineTime = new Date(lastMedicineTime.value);

    // If there's a recent meal, we need to check meal timing too
    if (lastMealTime.value) {
      const mealTime = new Date(lastMealTime.value);
      const timeSinceMeal = now.getTime() - mealTime.getTime();
      const hoursSinceMeal = timeSinceMeal / (1000 * 60 * 60);

      // Can only take if it's been 2+ hours since meal
      if (hoursSinceMeal < 2) {
        const progressPercentage = Math.floor((hoursSinceMeal / 2) * 100);
        return {
          allowed: false,
          reason: "Too soon after eating",
          progress: progressPercentage,
          constraint: "meal",
        };
      }
    }

    // Medicine already taken - show appropriate message
    return {
      allowed: false,
      reason: "Already taken - wait for next dose time",
      progress: 100,
      constraint: "dose",
    };
  }

  // No medicine taken yet - check meal constraint
  if (lastMealTime.value) {
    const mealTime = new Date(lastMealTime.value);
    const timeSinceMeal = now.getTime() - mealTime.getTime();
    const hoursSinceMeal = timeSinceMeal / (1000 * 60 * 60);

    // Can take medicine 2+ hours after eating
    if (hoursSinceMeal >= 2) {
      return { allowed: true, reason: "Ready for next dose", progress: 100 };
    }

    const progressPercentage = Math.floor((hoursSinceMeal / 2) * 100);
    return {
      allowed: false,
      reason: "Too soon after eating",
      progress: progressPercentage,
      constraint: "meal",
    };
  }

  // No constraints - can take anytime
  return { allowed: true, reason: "Ready for next dose", progress: 100 };
});

// Calculate eating restrictions based on last medicine (1 hour after taking medicine)
const eatingRestriction = computed(() => {
  if (!lastMedicineTime.value) return null;

  const medicineTime = new Date(lastMedicineTime.value);
  const now = currentTime.value;
  const timeSinceMedicine = now.getTime() - medicineTime.getTime();
  const hoursSinceMedicine = timeSinceMedicine / (1000 * 60 * 60);

  // Can eat 1+ hour after taking medicine
  if (hoursSinceMedicine >= 1) {
    return null; // Can eat now
  }

  const oneHourAfter = new Date(medicineTime.getTime() + 60 * 60 * 1000);
  const formattedTime = useDateFormat(oneHourAfter, "HH:mm");

  return {
    canEat: false,
    message: `Can eat at ${formattedTime.value}`,
    targetTime: oneHourAfter,
  };
});

// Update countdown targets when times change
watch(
  [lastMealTime, lastMedicineTime],
  () => {
    // Update medicine countdown target based on constraint type
    if (
      !canTakeMedicine.value.allowed &&
      canTakeMedicine.value.constraint === "meal" &&
      lastMealTime.value
    ) {
      const mealTime = new Date(lastMealTime.value);
      medicineCountdownTarget.value = mealTime.getTime() + 2 * 60 * 60 * 1000;
    } else {
      medicineCountdownTarget.value = 0;
    }

    // Update eating countdown target
    if (eatingRestriction.value) {
      eatingCountdownTarget.value = eatingRestriction.value.targetTime.getTime();
    } else {
      eatingCountdownTarget.value = 0;
    }
  },
  { immediate: true },
);

// Next allowed time based on constraint type
const nextAllowedTime = computed(() => {
  if (canTakeMedicine.value.allowed) return null;

  if (canTakeMedicine.value.constraint === "meal" && lastMealTime.value) {
    const mealTime = new Date(lastMealTime.value);
    const twoHoursAfter = new Date(mealTime.getTime() + 2 * 60 * 60 * 1000);
    const formattedTime = useDateFormat(twoHoursAfter, "HH:mm");
    return formattedTime.value;
  }

  // For dose constraint, suggest taking before next meal
  return null;
});

// Actions
const recordMeal = async () => {
  lastMealTime.value = new Date().toISOString();

  await saveData({
    lastMealTime: lastMealTime.value,
    lastMedicineTime: lastMedicineTime.value,
  });

  if (error.value) {
    toast.error("Failed to save meal", {
      description: error.value,
    });
  } else {
    toast.success("Meal recorded successfully", {
      description: "Medicine can be taken in 2 hours",
    });
  }
};

const recordMedicine = async () => {
  if (!canTakeMedicine.value.allowed) {
    let description = "Please wait until the appropriate time";
    if (canTakeMedicine.value.constraint === "meal") {
      description = "Please wait until 2 hours after your meal";
    } else if (canTakeMedicine.value.constraint === "dose") {
      description = "You've already taken your dose - take next dose before your next meal";
    }

    toast.error("Cannot take medicine yet", {
      description,
    });
    return;
  }

  lastMedicineTime.value = new Date().toISOString();

  await saveData({
    lastMealTime: lastMealTime.value,
    lastMedicineTime: lastMedicineTime.value,
  });

  if (error.value) {
    toast.error("Failed to save medicine intake", {
      description: error.value,
    });
  } else {
    toast.success("Medicine intake recorded", {
      description: "Remember to wait 1 hour before your next meal",
    });
  }
};

// Manual time editing
const startEditMealTime = () => {
  const now = new Date();
  if (lastMealTime.value) {
    const date = new Date(lastMealTime.value);
    tempMealTime.value = date.toISOString().slice(0, 16);
  } else {
    tempMealTime.value = new Date(now.getTime() - 30 * 60000).toISOString().slice(0, 16); // 30 minutes ago
  }
  editingMealTime.value = true;
};

const startEditMedicineTime = () => {
  const now = new Date();
  if (lastMedicineTime.value) {
    const date = new Date(lastMedicineTime.value);
    tempMedicineTime.value = date.toISOString().slice(0, 16);
  } else {
    tempMedicineTime.value = new Date(now.getTime() - 60 * 60000).toISOString().slice(0, 16); // 1 hour ago
  }
  editingMedicineTime.value = true;
};

const saveMealTime = async () => {
  if (tempMealTime.value) {
    lastMealTime.value = new Date(tempMealTime.value).toISOString();
    await saveData({
      lastMealTime: lastMealTime.value,
      lastMedicineTime: lastMedicineTime.value,
    });

    if (!error.value) {
      toast.success("Meal time updated");
    }
  }
  editingMealTime.value = false;
};

const saveMedicineTime = async () => {
  if (tempMedicineTime.value) {
    lastMedicineTime.value = new Date(tempMedicineTime.value).toISOString();
    await saveData({
      lastMealTime: lastMealTime.value,
      lastMedicineTime: lastMedicineTime.value,
    });

    if (!error.value) {
      toast.success("Medicine time updated");
    }
  }
  editingMedicineTime.value = false;
};

onMounted(async () => {
  const data = await loadData();
  if (data) {
    lastMealTime.value = data.lastMealTime || "";
    lastMedicineTime.value = data.lastMedicineTime || "";
  }

  if (error.value) {
    toast.error("Failed to load data", {
      description: error.value,
    });
  }
});
</script>

<template>
  <AppLayout title="Medicine Tracker" :show-back-button="true">
    <div class="px-4 py-6 max-w-md mx-auto">
      <Tabs default-value="status" class="space-y-6">
        <TabsList class="grid w-full grid-cols-2">
          <TabsTrigger value="status">Status</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="status" class="space-y-6">
          <!-- Medicine Status -->
          <Card>
            <CardHeader class="text-center">
              <div class="text-3xl mb-2">💊</div>
              <CardTitle>Medicine</CardTitle>
            </CardHeader>
            <CardContent>
              <div v-if="canTakeMedicine.allowed" class="text-center">
                <Badge variant="default" class="text-lg px-4 py-2"> Ready now </Badge>
                <p class="text-sm text-gray-600 mt-2">
                  {{ canTakeMedicine.reason }}
                </p>
              </div>
              <div v-else class="space-y-4">
                <div class="text-center">
                  <Badge variant="secondary" class="text-lg px-4 py-2 mb-2">
                    {{ canTakeMedicine.reason }}
                  </Badge>
                  <div v-if="canTakeMedicine.constraint === 'meal' && nextAllowedTime">
                    <div class="text-sm text-gray-600 mb-1">Can take at:</div>
                    <div class="text-xl font-semibold">{{ nextAllowedTime }}</div>
                    <div
                      v-if="medicineCountdownDisplay"
                      class="text-2xl font-mono font-bold text-blue-600 mt-2"
                    >
                      {{ medicineCountdownDisplay }}
                    </div>
                  </div>
                  <div v-if="canTakeMedicine.constraint === 'dose'">
                    <div class="text-sm text-gray-600">
                      Take your next dose before your next meal
                    </div>
                  </div>
                </div>
                <Progress
                  v-if="canTakeMedicine.constraint === 'meal'"
                  :model-value="canTakeMedicine.progress"
                  class="h-2"
                />
              </div>
            </CardContent>
          </Card>

          <!-- Next Eating Status -->
          <Card>
            <CardHeader class="text-center">
              <div class="text-3xl mb-2">🍽️</div>
              <CardTitle>Next Meal</CardTitle>
            </CardHeader>
            <CardContent>
              <div v-if="eatingRestriction" class="space-y-4">
                <div class="text-center">
                  <div class="text-sm text-gray-600 mb-1">Don't eat until:</div>
                  <div class="text-xl font-semibold">
                    {{ eatingRestriction.message.replace("Can eat at ", "") }}
                  </div>
                  <div
                    v-if="eatingCountdownDisplay"
                    class="text-2xl font-mono font-bold text-orange-600 mt-2"
                  >
                    {{ eatingCountdownDisplay }}
                  </div>
                </div>
              </div>
              <div v-else class="text-center">
                <Badge variant="outline" class="text-lg px-4 py-2"> OK to eat now </Badge>
              </div>
            </CardContent>
          </Card>

          <!-- Quick Actions -->
          <div class="grid grid-cols-2 gap-4">
            <Button
              @click="recordMeal"
              :disabled="isLoading"
              class="h-20 flex-col gap-2"
              variant="outline"
            >
              <Loader2 v-if="isLoading" class="w-6 h-6 animate-spin" />
              <Utensils v-else class="w-6 h-6" />
              <span>Record Meal</span>
            </Button>

            <Button
              @click="recordMedicine"
              :disabled="!canTakeMedicine.allowed || isLoading"
              class="h-20 flex-col gap-2"
              :variant="canTakeMedicine.allowed ? 'default' : 'secondary'"
            >
              <Loader2 v-if="isLoading" class="w-6 h-6 animate-spin" />
              <Pill v-else class="w-6 h-6" />
              <span>Take Medicine</span>
            </Button>
          </div>

          <!-- Timing Rules -->
          <Alert>
            <Clock class="h-4 w-4" />
            <AlertDescription>
              <strong>Medicine Schedule:</strong><br />
              • Take before breakfast, lunch, dinner, and bedtime<br />
              • Wait 2+ hours after eating to take medicine<br />
              • Wait 1+ hour after medicine to eat<br />
              • Only one dose per meal period
            </AlertDescription>
          </Alert>
        </TabsContent>

        <TabsContent value="history" class="space-y-4">
          <!-- Recent Events -->
          <Card>
            <CardHeader>
              <div class="flex items-center justify-between">
                <CardTitle class="flex items-center gap-2">
                  <Utensils class="w-5 h-5 text-blue-600" />
                  Last Meal
                </CardTitle>
                <Dialog v-model:open="editingMealTime">
                  <DialogTrigger as-child>
                    <Button variant="ghost" size="sm" @click="startEditMealTime">
                      <Edit3 class="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent class="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Edit Meal Time</DialogTitle>
                      <DialogDescription>
                        Set the exact time when you had your meal.
                      </DialogDescription>
                    </DialogHeader>
                    <div class="grid gap-4 py-4">
                      <div class="grid grid-cols-4 items-center gap-4">
                        <Label for="meal-time" class="text-right">Time</Label>
                        <Input
                          id="meal-time"
                          v-model="tempMealTime"
                          type="datetime-local"
                          class="col-span-3"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" @click="editingMealTime = false">Cancel</Button>
                      <Button @click="saveMealTime">Save</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">{{ formatTime(lastMealTime) }}</span>
                <Badge variant="secondary">{{ getRelativeTime(lastMealTime) }}</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div class="flex items-center justify-between">
                <CardTitle class="flex items-center gap-2">
                  <Pill class="w-5 h-5 text-green-600" />
                  Last Medicine
                </CardTitle>
                <Dialog v-model:open="editingMedicineTime">
                  <DialogTrigger as-child>
                    <Button variant="ghost" size="sm" @click="startEditMedicineTime">
                      <Edit3 class="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent class="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Edit Medicine Time</DialogTitle>
                      <DialogDescription>
                        Set the exact time when you took your medicine.
                      </DialogDescription>
                    </DialogHeader>
                    <div class="grid gap-4 py-4">
                      <div class="grid grid-cols-4 items-center gap-4">
                        <Label for="medicine-time" class="text-right">Time</Label>
                        <Input
                          id="medicine-time"
                          v-model="tempMedicineTime"
                          type="datetime-local"
                          class="col-span-3"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" @click="editingMedicineTime = false">Cancel</Button>
                      <Button @click="saveMedicineTime">Save</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">{{ formatTime(lastMedicineTime) }}</span>
                <Badge variant="secondary">{{ getRelativeTime(lastMedicineTime) }}</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  </AppLayout>
</template>
