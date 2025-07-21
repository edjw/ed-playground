<script setup lang="ts">
import { computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { Home, ArrowLeft } from "lucide-vue-next";
import { Button } from "@/components/ui/button";

const router = useRouter();
const route = useRoute();

interface Props {
	title?: string;
	showBackButton?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	title: "Ed's Playground",
	showBackButton: false,
});

const isHomePage = computed(() => route.name === "home");

const goBack = () => {
	if (window.history.length > 1) {
		router.back();
	} else {
		router.push("/");
	}
};
</script>

<template>
	<div class="min-h-screen bg-gray-50">
		<!-- Navigation Header -->
		<header class="bg-white border-b border-gray-200 sticky top-0 z-50">
			<nav class="max-w-4xl mx-auto px-4 py-3">
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-3">
						<!-- Back/Home Button -->
						<Button
							v-if="!isHomePage"
							variant="ghost"
							size="sm"
							@click="goBack"
							class="p-2 -ml-2"
						>
							<ArrowLeft class="w-5 h-5" />
						</Button>
						
						<!-- Home Button (always visible) -->
						<Button
							v-if="!isHomePage"
							variant="ghost"
							size="sm"
							@click="router.push('/')"
							class="p-2"
						>
							<Home class="w-5 h-5" />
						</Button>
						
						<!-- Title -->
						<h1 class="text-lg font-semibold text-gray-900">
							{{ title }}
						</h1>
					</div>
					
					<!-- Right side actions slot -->
					<div class="flex items-center gap-2">
						<slot name="actions" />
					</div>
				</div>
			</nav>
		</header>

		<!-- Main Content -->
		<main>
			<slot />
		</main>
		
		<!-- Footer spacer for mobile -->
		<div class="h-16" />
	</div>
</template>