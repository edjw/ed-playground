<script setup lang="ts">
import { ref, nextTick } from "vue";
import AppLayout from "@/components/AppLayout.vue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Shuffle, RotateCcw } from "lucide-vue-next";

interface Letter {
	id: string;
	char: string;
	originalIndex: number;
	x: number;
	y: number;
	isDragging: boolean;
	dragOffset: { x: number; y: number };
}

const word = ref("");
const letters = ref<Letter[]>([]);
const dragContainer = ref<HTMLElement>();

const initializeLetters = () => {
	const chars = word.value.toUpperCase().split("");
	
	letters.value = chars.map((char, index) => ({
		id: `letter-${index}-${Date.now()}`,
		char,
		originalIndex: index,
		x: index * 70 + 20,
		y: 100,
		isDragging: false,
		dragOffset: { x: 0, y: 0 }
	}));
};

const shuffleLetters = () => {
	const containerWidth = 500;
	const containerHeight = 300;
	const letterSize = 60; // 56px + some padding
	const minDistance = 70; // Minimum distance between letter centers
	
	const occupiedPositions: { x: number; y: number }[] = [];
	
	letters.value.forEach((letter) => {
		let attempts = 0;
		let validPosition = false;
		let newX = 0;
		let newY = 0;
		
		// Try to find a non-overlapping position
		while (!validPosition && attempts < 50) {
			newX = Math.random() * (containerWidth - letterSize);
			newY = Math.random() * (containerHeight - letterSize) + 20;
			
			// Check if this position overlaps with any existing letters
			const overlaps = occupiedPositions.some(pos => {
				const distance = Math.sqrt(
					Math.pow(newX + letterSize/2 - pos.x, 2) + 
					Math.pow(newY + letterSize/2 - pos.y, 2)
				);
				return distance < minDistance;
			});
			
			if (!overlaps) {
				validPosition = true;
			}
			attempts++;
		}
		
		// If we couldn't find a valid position after 50 attempts, use the last generated position
		letter.x = newX;
		letter.y = newY;
		occupiedPositions.push({ x: newX + letterSize/2, y: newY + letterSize/2 });
	});
};

const resetLetters = () => {
	letters.value.forEach((letter) => {
		letter.x = letter.originalIndex * 70 + 20;
		letter.y = 100;
	});
};

const handleMouseDown = (event: MouseEvent, letter: Letter) => {
	event.preventDefault();
	const rect = dragContainer.value?.getBoundingClientRect();
	if (!rect) return;
	
	letter.isDragging = true;
	letter.dragOffset.x = event.clientX - rect.left - letter.x;
	letter.dragOffset.y = event.clientY - rect.top - letter.y;
	
	document.addEventListener('mousemove', handleMouseMove);
	document.addEventListener('mouseup', handleMouseUp);
};

const handleMouseMove = (event: MouseEvent) => {
	const draggingLetter = letters.value.find(l => l.isDragging);
	if (!draggingLetter || !dragContainer.value) return;
	
	const rect = dragContainer.value.getBoundingClientRect();
	const newX = event.clientX - rect.left - draggingLetter.dragOffset.x;
	const newY = event.clientY - rect.top - draggingLetter.dragOffset.y;
	
	// Keep within bounds
	draggingLetter.x = Math.max(0, Math.min(newX, rect.width - 60));
	draggingLetter.y = Math.max(0, Math.min(newY, rect.height - 60));
};

const handleMouseUp = () => {
	letters.value.forEach(letter => {
		letter.isDragging = false;
	});
	
	document.removeEventListener('mousemove', handleMouseMove);
	document.removeEventListener('mouseup', handleMouseUp);
};

const handleSubmit = () => {
	if (word.value.trim()) {
		initializeLetters();
	}
};

const getLetterStyle = (letter: Letter) => {
	return {
		left: `${letter.x}px`,
		top: `${letter.y}px`,
		zIndex: letter.isDragging ? 1000 : 1,
		transform: letter.isDragging ? 'scale(1.05)' : 'scale(1)',
	};
};
</script>

<template>
	<AppLayout title="Anagram Finder">
		<div class="container mx-auto px-4 py-8 max-w-4xl">
			<Card>
				<CardHeader>
					<CardTitle>Anagram Finder</CardTitle>
					<CardDescription>
						Enter a word and drag the letters around to find anagrams
					</CardDescription>
				</CardHeader>
				<CardContent class="space-y-6">
					<!-- Word Input -->
					<div class="space-y-2">
						<Label for="word-input">Enter a word</Label>
						<div class="flex gap-2">
							<Input
								id="word-input"
								v-model="word"
								placeholder="Type a word..."
								@keyup.enter="handleSubmit"
								class="max-w-xs"
							/>
							<Button @click="handleSubmit">
								Set Word
							</Button>
						</div>
					</div>
					
					<!-- Draggable Letters Area -->
					<div v-if="letters.length > 0" class="space-y-4">
						<!-- Controls -->
						<div class="flex gap-2">
							<Button
								@click="shuffleLetters"
								variant="outline"
								size="sm"
							>
								<Shuffle class="w-4 h-4 mr-2" />
								Shuffle
							</Button>
							<Button
								@click="resetLetters"
								variant="outline"
								size="sm"
							>
								<RotateCcw class="w-4 h-4 mr-2" />
								Reset
							</Button>
						</div>
						
						<!-- Drag Area -->
						<div 
							ref="dragContainer"
							class="relative bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 h-[400px] overflow-hidden select-none"
						>
							<div
								v-for="letter in letters"
								:key="letter.id"
								:style="getLetterStyle(letter)"
								class="absolute cursor-grab active:cursor-grabbing transition-transform duration-100"
								@mousedown="handleMouseDown($event, letter)"
							>
								<div 
									class="w-14 h-14 bg-white border-2 border-gray-400 rounded-lg shadow-md flex items-center justify-center hover:shadow-lg transition-all hover:border-blue-400"
									:class="{ 'shadow-lg border-blue-500': letter.isDragging }"
								>
									<span class="text-2xl font-bold text-gray-800 pointer-events-none select-none">{{ letter.char }}</span>
								</div>
							</div>
						</div>
					</div>
					
					<!-- Instructions -->
					<div v-if="!letters.length" class="text-center py-8 text-gray-500">
						<p>Enter a word above to start finding anagrams</p>
					</div>
				</CardContent>
			</Card>
		</div>
	</AppLayout>
</template>

<style scoped>
.select-none {
	-webkit-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
}

.cursor-grab {
	cursor: grab;
}

.cursor-grab:active {
	cursor: grabbing;
}
</style>