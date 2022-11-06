<script lang="ts">
	import { Peer } from 'peerjs';
	import { io, Socket } from 'socket.io-client';
	import { onMount } from 'svelte';
	import { myConnId, myStream, streams, socketStore } from '../store/stream';

	let peers: Record<string, any> = {};
	let socket: Socket;

	const myPeer = new Peer({
		secure: true
	});

	myPeer.on('open', (id) => {
		myConnId.set(id);
		console.log('conn.id', id);
	});

	myPeer.on('call', (call) => {
		if ($streams[call.peer]) return;
		call.answer($myStream);

		call.on('stream', (userVideoStream) => {
			handleUserStream(call.peer, userVideoStream);
		});

		peers[call.peer] = call;
	});

	function handleUserStream(userId: string, userVideoStream: MediaStream) {
		$streams[userId] = userVideoStream;
		$streams = { ...$streams };
	}

	function handleUserDisconnect(userId: string) {
		if (peers[userId]) {
			peers[userId].close();
			delete peers[userId];
			peers = { ...peers };
		}

		if ($streams[userId]) {
			delete $streams[userId];
			$streams = { ...$streams };
		}
	}

	function connectToNewUser(userId: string) {
		if (peers[userId]) return;
		const call = myPeer.call(userId, $myStream);
		call.on('stream', (userVideoStream) => {
			console.log('on stream ', userId);
			handleUserStream(userId, userVideoStream);
		});

		peers[userId] = call;
	}

	onMount(() => {
		console.log('the component has mounted');

		socket = io('wss://niceshit.up.railway.app');

		socket.on('hello', (arg) => {
			console.log(arg);
		});

		socket.on('user-connected', (peerId) => {
			console.log('user-connected', peerId);
			connectToNewUser(peerId);
		});

		socket.on('user-disconnected', (userId) => {
			handleUserDisconnect(userId);
		});

		socket.emit('howdy', 'stranger');

		$socketStore = socket;
	});
</script>
