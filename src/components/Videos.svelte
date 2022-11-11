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

	$: mainUid = userIds[0];
</script>

<Video srcObject={$streams[mainUid]} focus={true} userId={mainUid} />
<div class="videos" on:click={handleFocus}>
	{#each userIds as userId, i}
		{#if i !== 0}
			<Video srcObject={$streams[userId]} {userId} />
		{/if}
	{/each}
</div>

<style>
	.videos {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		display: flex;
		overflow-y: scroll;
	}
</style>
