<script lang="ts">
	import {
		connectPeer,
		connectSocket,
		disconnectMediaStream,
		disconnectPeer,
		disconnectSocket,
		getMyStream,
		joinRoom
	} from '../connection';
	import { myCode, myConnId, myStream, mySocket, streams, myPeer } from '../store/stream';
	import { onMount } from 'svelte';

	let showBtn = !!$myConnId || $myCode.length > 7;
	let isValid = $myConnId && $myCode.length > 7;
	let connReady = !!$myConnId && !isValid;
	let fullScreen = true;
	$: calling = false;

	$: {
		showBtn = !!$myConnId || $myCode.length > 7;
		isValid = $myConnId && $myCode.length > 7;
		connReady = !!$myConnId && !isValid;
	}

	async function initCall() {
		const start = Date.now();
		calling = true;
		const myStream = await getMyStream();
		if ($myConnId && $myCode && myStream) {
			joinRoom();
		}
		const end = Date.now();
		console.log('cost ', end - start);
		calling = false;
	}

	async function recall() {
		calling = true;
		disconnectConns();
		await initConnections();
		joinRoom();
		calling = false;
	}

	async function handleJoinClick() {
		if (fullScreen) {
			await initCall();
			fullScreen = false;
		}
	}

	async function handleHangClick() {
		calling = true;
		fullScreen = true;
		disconnectMediaStream();
		disconnectConns();
		await initConnections();
		calling = false;
	}

	async function initConnections() {
		try {
			await connectSocket();
			await connectPeer();
		} catch (err) {
			console.error('connection error', err);
			disconnectConns();

			setTimeout(() => {
				initConnections();
			}, 1000);
		}
	}

	function disconnectConns() {
		disconnectPeer();
		disconnectSocket();
	}

	onMount(async () => {
		await initConnections();
	});
</script>

<button id="hang-btn" disabled={!isValid && fullScreen} on:click={handleHangClick}>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		id="Layer_1"
		data-name="Layer 1"
		viewBox="0 0 24 24"
		width="100%"
		height="100%"
		><path
			d="M15,19c0,.552-.447,1-1,1H5C2.244,20,0,17.757,0,15v-6C0,8.152,.217,7.314,.625,6.577c.269-.482,.877-.655,1.36-.389,.483,.268,.657,.877,.389,1.36-.245,.441-.374,.943-.374,1.452v6c0,1.654,1.346,3,3,3H14c.553,0,1,.448,1,1Zm3.637-2.125c-.033,.081-.08,.151-.129,.218l5.2,5.2c.391,.391,.391,1.023,0,1.414-.195,.195-.451,.293-.707,.293s-.512-.098-.707-.293L4.294,5.707h0L.293,1.707C-.097,1.316-.097,.684,.293,.293S1.317-.098,1.708,.293l3.707,3.707H14c2.618,0,4.748,2.03,4.959,4.594l1.757-1.772c.034-.034,.07-.066,.109-.096,.604-.454,1.399-.526,2.078-.188,.677,.338,1.097,1.018,1.097,1.775v7.319c0,.757-.42,1.437-1.097,1.775-.283,.141-.587,.211-.889,.211-.421,0-.837-.135-1.189-.399-.037-.028-.073-.059-.106-.092l-1.754-1.752c-.038,.516-.134,1.022-.328,1.501Zm.363-4.292l3.026,3.022-.026-7.238-3,3.027v1.189Zm-2-3.583c0-1.654-1.346-3-3-3H7.414l9.535,9.535c.031-.175,.051-.353,.051-.535v-6Z"
		/></svg
	>
</button>
<button id="recall-btn" disabled={calling} on:click={recall}>
	{#if calling}
		<svg
			class:calling
			id="Layer_1"
			viewBox="0 0 24 24"
			height="80%"
			width="80%"
			xmlns="http://www.w3.org/2000/svg"
			data-name="Layer 1"
			><path
				d="m12 4a1 1 0 0 1 -1-1v-2a1 1 0 0 1 2 0v2a1 1 0 0 1 -1 1zm1 19v-2a1 1 0 0 0 -2 0v2a1 1 0 0 0 2 0zm-9-11a1 1 0 0 0 -1-1h-2a1 1 0 0 0 0 2h2a1 1 0 0 0 1-1zm20 0a1 1 0 0 0 -1-1h-2a1 1 0 0 0 0 2h2a1 1 0 0 0 1-1zm-6.621-7.285 1-1.731a1 1 0 0 0 -1.731-1l-1 1.731a1 1 0 0 0 .365 1.366.987.987 0 0 0 .5.135 1 1 0 0 0 .866-.501zm-10.03 17.3 1-1.731a1 1 0 0 0 -1.731-1l-1 1.731a1 1 0 0 0 .364 1.366.989.989 0 0 0 .5.135 1 1 0 0 0 .867-.498zm-2.27-14.028a1 1 0 0 0 -.364-1.366l-1.731-1a1 1 0 0 0 -1 1.731l1.731 1a1 1 0 0 0 1.366-.365zm17.3 10.031a1 1 0 0 0 -.364-1.367l-1.731-1a1 1 0 0 0 -1 1.731l1.731 1a.987.987 0 0 0 .5.135 1 1 0 0 0 .867-.499zm-14.392-12.939a1 1 0 0 0 .365-1.366l-1-1.731a1 1 0 0 0 -1.731 1l1 1.731a1 1 0 0 0 .866.5.987.987 0 0 0 .5-.134zm10.031 17.3a1 1 0 0 0 .364-1.366l-1-1.731a1 1 0 0 0 -1.731 1l1 1.731a1 1 0 0 0 1.367.364zm2.269-14.03 1.731-1a1 1 0 0 0 -1-1.731l-1.731 1a1 1 0 0 0 1 1.731zm-17.3 10.03 1.731-1a1 1 0 0 0 -1-1.731l-1.731 1a1 1 0 0 0 .5 1.866.987.987 0 0 0 .497-.132z"
			/></svg
		>
	{:else}
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="80%" width="80%"
			><g id="_01_align_center" data-name="01 align center"
				><path
					d="M12,2a10.032,10.032,0,0,1,7.122,3H15V7h5.143A1.859,1.859,0,0,0,22,5.143V0H20V3.078A11.982,11.982,0,0,0,0,12H2A10.011,10.011,0,0,1,12,2Z"
				/><path
					d="M22,12A9.986,9.986,0,0,1,4.878,19H9V17H3.857A1.859,1.859,0,0,0,2,18.857V24H4V20.922A11.982,11.982,0,0,0,24,12Z"
				/></g
			></svg
		>
	{/if}
</button>
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
			disabled={(!isValid && fullScreen) || calling}
			on:click={handleJoinClick}
		>
			{#if calling}
				<svg
					class:calling
					id="Layer_1"
					viewBox="0 0 24 24"
					height="80%"
					width="80%"
					xmlns="http://www.w3.org/2000/svg"
					data-name="Layer 1"
					><path
						d="m12 4a1 1 0 0 1 -1-1v-2a1 1 0 0 1 2 0v2a1 1 0 0 1 -1 1zm1 19v-2a1 1 0 0 0 -2 0v2a1 1 0 0 0 2 0zm-9-11a1 1 0 0 0 -1-1h-2a1 1 0 0 0 0 2h2a1 1 0 0 0 1-1zm20 0a1 1 0 0 0 -1-1h-2a1 1 0 0 0 0 2h2a1 1 0 0 0 1-1zm-6.621-7.285 1-1.731a1 1 0 0 0 -1.731-1l-1 1.731a1 1 0 0 0 .365 1.366.987.987 0 0 0 .5.135 1 1 0 0 0 .866-.501zm-10.03 17.3 1-1.731a1 1 0 0 0 -1.731-1l-1 1.731a1 1 0 0 0 .364 1.366.989.989 0 0 0 .5.135 1 1 0 0 0 .867-.498zm-2.27-14.028a1 1 0 0 0 -.364-1.366l-1.731-1a1 1 0 0 0 -1 1.731l1.731 1a1 1 0 0 0 1.366-.365zm17.3 10.031a1 1 0 0 0 -.364-1.367l-1.731-1a1 1 0 0 0 -1 1.731l1.731 1a.987.987 0 0 0 .5.135 1 1 0 0 0 .867-.499zm-14.392-12.939a1 1 0 0 0 .365-1.366l-1-1.731a1 1 0 0 0 -1.731 1l1 1.731a1 1 0 0 0 .866.5.987.987 0 0 0 .5-.134zm10.031 17.3a1 1 0 0 0 .364-1.366l-1-1.731a1 1 0 0 0 -1.731 1l1 1.731a1 1 0 0 0 1.367.364zm2.269-14.03 1.731-1a1 1 0 0 0 -1-1.731l-1.731 1a1 1 0 0 0 1 1.731zm-17.3 10.03 1.731-1a1 1 0 0 0 -1-1.731l-1.731 1a1 1 0 0 0 .5 1.866.987.987 0 0 0 .497-.132z"
					/></svg
				>
			{:else}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					id="Layer_1"
					data-name="Layer 1"
					viewBox="0 0 24 24"
					width="100%"
					height="100%"
					><path
						d="M22.903,6.538c-.676-.338-1.473-.267-2.077,.188-.039,.029-.076,.062-.11,.096l-1.757,1.773c-.211-2.565-2.341-4.594-4.959-4.594H5C2.243,4,0,6.243,0,9v6c0,2.757,2.243,5,5,5H14c2.629,0,4.768-2.047,4.962-4.627l1.756,1.754c.034,.033,.069,.063,.107,.092,.352,.264,.768,.398,1.188,.398,.303,0,.606-.069,.89-.211,.677-.338,1.097-1.019,1.097-1.774v-7.318c0-.757-.42-1.437-1.097-1.775Zm-8.903,11.462H5c-1.654,0-3-1.346-3-3v-6c0-1.654,1.346-3,3-3H14c1.654,0,3,1.346,3,3v6c0,1.654-1.346,3-3,3Zm5-5.417v-1.189l3-3.028,.025,7.238-3.025-3.022Z"
					/></svg
				>
			{/if}
		</button>
	</div>
</div>

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
		display: none;
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
		display: flex;
		justify-content: center;
		align-items: center;
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
		width: 100px;
		margin-right: 12px;
		padding: 10px;
	}

	/* .bottom #call-btn {
		position: fixed;
		bottom: 10px;
		right: 10px;
		width: 100px;
		height: 60px;
	} */

	#call-btn:disabled {
		height: 4rem;
		transform: scale(0.9);
		color: var(--font-color);
		background-color: var(--bg-color2);
	}

	#call-btn.connReady {
		background-color: var(--bg-decoration);
	}

	#hang-btn {
		position: fixed;
		bottom: 10px;
		left: 10px;
		width: 60px;
		height: 60px;
		border: none;
		color: var(--bg-color2);
		background-color: var(--bg-decoration);
		border-radius: 50%;
		margin-left: 12px;
		padding: 10px;
	}

	#recall-btn {
		position: fixed;
		bottom: 10px;
		right: 10px;
		width: 60px;
		height: 60px;
		border: none;
		color: var(--bg-color2);
		background-color: var(--bg-call);
		border-radius: 50%;
		margin-right: 12px;
		padding: 10px;
	}

	.calling {
		animation: rotation 2s infinite linear;
	}

	@keyframes rotation {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(359deg);
		}
	}
</style>
