<script setup lang="ts">
import { RouterLink } from "vue-router";
import AppLayout from "@/components/AppLayout.vue";
import { Badge } from "@/components/ui/badge";

interface PlaygroundApp {
	id: string;
	name: string;
	description: string;
	route: string;
	icon: string;
	status?: "stable" | "beta" | "new";
}

const apps: PlaygroundApp[] = [
	{
		id: "medicine-tracker",
		name: "Medicine Tracker",
		description: "Track medicine intake timing with meals",
		route: "/medicine-tracker",
		icon: "💊",
		status: "new",
	},
];

const getStatusVariant = (status?: string) => {
	switch (status) {
		case "new": return "default";
		case "beta": return "secondary";
		case "stable": return "outline";
		default: return "outline";
	}
};
</script>

<template>
	<AppLayout title="Ed's Playground">
		<div class="container mx-auto px-4 py-8 max-w-4xl">
			<div class="text-center mb-8">
				<h2 class="text-2xl font-bold text-gray-900 mb-2">Welcome to the Playground</h2>
				<p class="text-gray-600">A collection of useful mini-apps and experiments</p>
			</div>
			
			<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				<RouterLink
					v-for="app in apps"
					:key="app.id"
					:to="app.route"
					class="group block p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 hover:border-gray-300"
				>
					<div class="flex items-start justify-between mb-4">
						<div class="text-3xl">{{ app.icon }}</div>
						<Badge 
							v-if="app.status" 
							:variant="getStatusVariant(app.status)"
							class="text-xs"
						>
							{{ app.status }}
						</Badge>
					</div>
					<h3 class="text-lg font-semibold mb-2 group-hover:text-blue-600 transition-colors">
						{{ app.name }}
					</h3>
					<p class="text-gray-600 text-sm">{{ app.description }}</p>
				</RouterLink>
			</div>
			
			<div class="mt-12 text-center text-sm text-gray-500">
				<p>More apps coming soon...</p>
			</div>
		</div>
	</AppLayout>
</template>
