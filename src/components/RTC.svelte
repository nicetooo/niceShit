<script lang="ts">
	import { Peer } from 'peerjs';
	import { io, Socket } from 'socket.io-client';
	import { onDestroy, onMount } from 'svelte';
	import { myConnId, myStream, streams, socketStore, myPeer } from '../store/stream';

	let peers: Record<string, any> = {};
	let socket: Socket;

	$myPeer = new Peer({
		host: 'pppserver.up.railway.app',
		path: '/',
		secure: true
	});

	$myPeer.on('open', (id) => {
		myConnId.set(id);
		console.log('conn.id', id);
	});

	$myPeer.on('call', (call) => {
		console.log('on call', call.peer, $streams, $myStream);
		if ($streams[call.peer]) {
			delete $streams[call.peer];
			$streams = { ...$streams };
		}

		if ($myStream) {
			call.answer($myStream);
		} else {
			myStream.subscribe((value) => {
				if (value) {
					call.answer($myStream);
				}
			});
		}

		call.on('stream', (userVideoStream) => {
			handleUserStream(call.peer, userVideoStream);
		});

		peers[call.peer] = call;
	});

	$myPeer.on('disconnected', function () {
		console.log('my peer disconnected');
	});

	$myPeer.on('error', function (err) {
		console.error('my peer on error', err);
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
		console.log('on call', peers, userId);
		if (peers[userId]) {
			peers[userId].close();
		}
		if (!$myPeer) {
			return;
		}
		const call = $myPeer.call(userId, $myStream);
		console.log('on call myPeer', peers, userId, call.peer);
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

	onDestroy(() => {
		console.log('the component is being destroyed');
	});
</script>
