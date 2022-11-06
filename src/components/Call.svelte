<script lang="ts">
	import RTC from '../components/RTC.svelte';
	import { myCode, myConnId, myStream, socketStore, streams, myPeer } from '../store/stream';

	let showBtn = !!$myConnId || $myCode.length > 7;
	let isValid = $myConnId && $myCode.length > 7;
	let connReady = !!$myConnId && !isValid;
	let fullScreen = true;
	$: alive = true;

	$: {
		showBtn = !!$myConnId || $myCode.length > 7;
		isValid = $myConnId && $myCode.length > 7;
		connReady = !!$myConnId && !isValid;
	}

	function initCall() {
		if ($myConnId && $socketStore && $myCode) {
			console.log('joined');
			$socketStore.emit('join-room', $myCode, $myConnId);
			navigator.mediaDevices
				.getUserMedia({
					video: true,
					audio: true
				})
				.then((stream) => {
					$myStream = stream;
					$streams[$myConnId] = stream;
					$streams = { ...$streams };
				});
		}
	}

	function recall() {
		if ($myPeer) {
			$myPeer.destroy();
		}
		alive = false;
		$myPeer = null;
		$myConnId = '';
		$socketStore?.disconnect();
		$socketStore = null;
		$streams = {};
		myConnId.subscribe((value) => {
			if (value) {
				console.log('my new conn', value);
				$streams[value] = $myStream;
				$streams = { ...$streams };
			}
		});

		setTimeout(() => {
			alive = true;
		});
	}

	function handleJoinClick() {
		if (fullScreen) {
			initCall();
			fullScreen = false;
		} else {
			recall();
		}
	}
</script>

<div class={fullScreen ? 'full-screen' : 'bottom'}>
	<div id="call">
		{#if fullScreen}
			<input
				id="input"
				class:isValid
				placeholder="code"
				type="text"
				bind:value={$myCode}
				autocomplete="off"
			/>
		{/if}
		<button
			id="call-btn"
			class:connReady
			class={showBtn ? 'show' : 'hide'}
			disabled={!isValid && fullScreen}
			on:click={handleJoinClick}
		>
			call
		</button>
	</div>
</div>
{#if alive}
	<RTC />
{/if}

<!-- --bg-color: #171717;
--bg-color2: #444444;
--bg-decoration: #da0037;
--font-color: #ededed; -->
<style>
	.full-screen {
		position: fixed;
		top: 0;
		bottom: 0;
		right: 0;
		left: 0;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		background-color: var(--bg-color);
	}

	.bottom {
		position: fixed;
		bottom: 30px;
		right: 30px;
		width: 30px;
		height: 40px;
	}

	.hide {
		transform: scale(0);
		transition: transform 0.2s;
	}

	.show {
		height: 4rem;
		transform: scale(1);
		transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
	}

	#call {
		font-family: monospace;
		width: 100%;
		max-width: 550px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		background-color: var(--bg-color);
	}

	#input {
		font-family: monospace;
		width: 80%;
		padding: 15px;
		margin: 0 12px;
		font-size: 2rem;
		border-radius: 6px;
		border: none;
		color: var(--font-color);
		background-color: #444444;
	}

	button {
		margin: 0;
		padding: 0;
	}

	#input:focus {
		outline: 3px solid #da0037;
	}

	.isValid#input:focus {
		outline: 3px solid #82cd47;
	}

	#call-btn {
		font-family: monospace;
		font-size: 2rem;
		border: none;
		color: var(--bg-color2);
		background-color: var(--bg-call);
		border-radius: 6px;
		margin-right: 12px;
		padding: 6px;
	}

	#call-btn:disabled {
		height: 4rem;
		transform: scale(0.9);
		color: var(--font-color);
		background-color: var(--bg-color2);
	}

	#call-btn.connReady {
		background-color: var(--bg-decoration);
	}
</style>
