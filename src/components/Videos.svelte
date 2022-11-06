<script lang="ts">
	import Video from './VideoItem.svelte';
	import { streams } from '../store/stream';

	let focusId = '';

	function handleFocus(e: any) {
		focusId = e.target.id;
	}

	$: userIds = Object.keys($streams);
	$: console.log({ userIds });
</script>

<div class="videos" on:click={handleFocus}>
	{#each userIds as userId, i}
		<Video
			srcObject={$streams[userId]}
			focus={focusId === `video-${i}` || userIds.length === 1}
			id={`video-${i}`}
			{userId}
		/>
	{/each}
</div>

<style>
	.videos {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-wrap: wrap;
	}
</style>
