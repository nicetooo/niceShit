<script lang="ts">
	import Video from './VideoItem.svelte';
	import { streams } from '../store/stream';

	let focusId = '';
	let userIds: string[] = [];

	function handleFocus(e: any) {
		focusId = e.target.id;
	}

	$: {
		userIds = Object.keys($streams);
		if (focusId) {
			userIds.sort(function (x, y) {
				return x === focusId ? -1 : y === focusId ? 1 : 0;
			});
		}
	}
	$: console.log({ userIds });
</script>

<div class="videos" on:click={handleFocus}>
	{#each userIds as userId, i}
		<Video
			srcObject={$streams[userId]}
			focus={focusId === userId || userIds.length === 1}
			{userId}
		/>
	{/each}
</div>

<style>
	.videos {
		width: 90vh;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-wrap: wrap;
	}
</style>
