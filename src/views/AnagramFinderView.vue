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
	
	nextTick(() => {
		const containerWidth = dragContainer.value?.clientWidth || 300;
		const letterSize = 70; // 60px + margin
		const lettersPerRow = Math.floor((containerWidth - 40) / letterSize);
		
		letters.value = chars.map((char, index) => {
			const row = Math.floor(index / lettersPerRow);
			const col = index % lettersPerRow;
			
			return {
				id: `letter-${index}-${Date.now()}`,
				char,
				originalIndex: index,
				x: col * letterSize + 20,
				y: row * letterSize + 50,
				isDragging: false,
				dragOffset: { x: 0, y: 0 }
			};
		});
	});
};

const shuffleLetters = () => {
	if (!dragContainer.value) return;
	
	const containerWidth = dragContainer.value.clientWidth;
	const containerHeight = dragContainer.value.clientHeight;
	const letterSize = 60; // 56px + some padding
	const minDistance = 70; // Minimum distance between letter centers
	const margin = 10; // Margin from edges
	
	const occupiedPositions: { x: number; y: number }[] = [];
	
	letters.value.forEach((letter) => {
		let attempts = 0;
		let validPosition = false;
		let newX = 0;
		let newY = 0;
		
		// Try to find a non-overlapping position
		while (!validPosition && attempts < 50) {
			newX = Math.random() * (containerWidth - letterSize - margin * 2) + margin;
			newY = Math.random() * (containerHeight - letterSize - margin * 2) + margin;
			
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
	if (!dragContainer.value) return;
	
	const containerWidth = dragContainer.value.clientWidth;
	const letterSize = 70;
	const lettersPerRow = Math.floor((containerWidth - 40) / letterSize);
	
	letters.value.forEach((letter) => {
		const row = Math.floor(letter.originalIndex / lettersPerRow);
		const col = letter.originalIndex % lettersPerRow;
		
		letter.x = col * letterSize + 20;
		letter.y = row * letterSize + 50;
	});
};

const handleMouseDown = (event: MouseEvent, letter: Letter) => {
	event.preventDefault();
	startDrag(event.clientX, event.clientY, letter);
	
	document.addEventListener('mousemove', handleMouseMove);
	document.addEventListener('mouseup', handleMouseUp);
};

const handleTouchStart = (event: TouchEvent, letter: Letter) => {
	event.preventDefault();
	const touch = event.touches[0];
	startDrag(touch.clientX, touch.clientY, letter);
	
	document.addEventListener('touchmove', handleTouchMove, { passive: false });
	document.addEventListener('touchend', handleTouchEnd);
};

const startDrag = (clientX: number, clientY: number, letter: Letter) => {
	const rect = dragContainer.value?.getBoundingClientRect();
	if (!rect) return;
	
	letter.isDragging = true;
	letter.dragOffset.x = clientX - rect.left - letter.x;
	letter.dragOffset.y = clientY - rect.top - letter.y;
};

const handleMouseMove = (event: MouseEvent) => {
	updateDragPosition(event.clientX, event.clientY);
};

const handleTouchMove = (event: TouchEvent) => {
	event.preventDefault();
	const touch = event.touches[0];
	updateDragPosition(touch.clientX, touch.clientY);
};

const updateDragPosition = (clientX: number, clientY: number) => {
	const draggingLetter = letters.value.find(l => l.isDragging);
	if (!draggingLetter || !dragContainer.value) return;
	
	const rect = dragContainer.value.getBoundingClientRect();
	const newX = clientX - rect.left - draggingLetter.dragOffset.x;
	const newY = clientY - rect.top - draggingLetter.dragOffset.y;
	
	const letterSize = 56; // Actual letter element size
	const margin = 5; // Small margin from edges
	
	// Keep within bounds with proper margin
	draggingLetter.x = Math.max(margin, Math.min(newX, rect.width - letterSize - margin));
	draggingLetter.y = Math.max(margin, Math.min(newY, rect.height - letterSize - margin));
};

const handleMouseUp = () => {
	endDrag();
	document.removeEventListener('mousemove', handleMouseMove);
	document.removeEventListener('mouseup', handleMouseUp);
};

const handleTouchEnd = () => {
	endDrag();
	document.removeEventListener('touchmove', handleTouchMove);
	document.removeEventListener('touchend', handleTouchEnd);
};

const endDrag = () => {
	letters.value.forEach(letter => {
		letter.isDragging = false;
	});
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
								@touchstart="handleTouchStart($event, letter)"
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