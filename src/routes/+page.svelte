<script lang="ts">
	import { Peer } from 'peerjs';
	import { onMount } from 'svelte';
	import { io, Socket } from 'socket.io-client';
	import Video from '../components/Video.svelte';
	import Call from '../components/Call.svelte';

	const API_PATH = 'https://niceshit.up.railway.app';

	import { writable } from 'svelte/store';

	const myCode = writable('');

	let socket: Socket;
	let myConnId: string;
	let peers: Record<string, any> = {};
	let myStream: MediaStream;

	let streams: Record<string, MediaStream> = {};

	const myPeer = new Peer({
		secure: true
	});

	myPeer.on('open', (id) => {
		myConnId = id;
		console.log('conn.id', id);
	});

	myPeer.on('call', (call) => {
		if (streams[call.peer]) return;
		call.answer(myStream);

		call.on('stream', (userVideoStream) => {
			streams[call.peer] = userVideoStream;
		});

		peers[call.peer] = call;
	});

	onMount(() => {
		console.log('the component has mounted');

		socket = io('wss://niceshit.up.railway.app');
		// socket = io('ws://localhost:3333');

		socket.on('hello', (arg) => {
			console.log(arg);
		});

		socket.on('user-connected', (peerId) => {
			console.log('user-connected', peerId);
			connectToNewUser(peerId);
		});

		socket.emit('howdy', 'stranger');

		// socket.emit('join-room', 1, 2);
	});

	function handleJoin() {
		if (myConnId && socket && $myCode) {
			console.log('joined');
			socket.emit('join-room', $myCode, myConnId);
			navigator.mediaDevices
				.getUserMedia({
					video: true,
					audio: true
				})
				.then((stream) => {
					myStream = stream;
					streams[myConnId] = stream;
				});
		}
	}

	function connectToNewUser(userId: string) {
		if (peers[userId]) return;
		const call = myPeer.call(userId, myStream);
		call.on('stream', (userVideoStream) => {
			console.log('on stream ', userId);
			streams[userId] = userVideoStream;
		});
		call.on('close', () => {
			delete streams[userId];
		});

		peers[userId] = call;
	}
</script>

<svelte:head>
	<title>nice shit</title>
</svelte:head>

<div id="app">
	{#each Object.keys(streams) as userId}
		<Video srcObject={streams[userId]} />
	{/each}

	<Call onJoinClick={handleJoin} code={myCode} connId={myConnId} />
</div>

<style>
	#app {
		display: flex;
		/* flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		width: 100vw;
		height: 100vh; */
	}
	:global(body) {
		width: 100vw;
		height: 100vh;
		padding: 0;
		margin: 0;
		box-sizing: border-box;
		font-size: 20px;
	}
</style>
