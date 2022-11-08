import { Peer } from 'peerjs';
import { io, Socket } from 'socket.io-client';
import { get, writable } from 'svelte/store';
import { myCode, myConnId, mySocketId, myPeer, mySocket, myStream, streams } from './store/stream';

const peers: Record<string, any> = {};

export function connectPeer() {
	return new Promise<void>((res, rej) => {
		myPeer.update(() => {
			const peer = new Peer({
				host: 'p.afanti.xyz',
				path: '/',
				secure: true
			});

			peer.on('open', (id) => {
				myConnId.set(id);
				res();
				console.log('conn.id', id);
			});

			peer.on('call', (call) => {
				const $streams = get(streams);
				const $myStream = get(myStream);

				console.log('on call', call.peer, streams, myStream);
				if ($streams[call.peer]) {
					delete $streams[call.peer];
					streams.update(() => $streams);
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

			peer.on('disconnected', function () {
				console.log('my peer disconnected');
			});

			peer.on('error', function (err) {
				rej();
				console.error('my peer on error', err);
			});

			return peer;
		});
	});
}

export function disconnectPeer() {
	console.log('hang');
	const $myPeer = get(myPeer);
	$myPeer?.disconnect();
	myConnId.update(() => '');
}

export function disconnectMediaStream() {
	const $myStream = get(myStream);
	$myStream?.getTracks().forEach((track) => {
		track.stop();
	});
	myStream.update(() => undefined);
}

export function handleUserStream(userId: string, userVideoStream: MediaStream) {
	const $streams = get(streams);
	$streams[userId] = userVideoStream;
	streams.update(() => $streams);
}

export function connectSocket() {
	return new Promise<void>((res, rej) => {
		mySocket.update(() => {
			const socket = io('wss://s.afanti.xyz');

			socket.onAny((event) => {
				console.log('socket.onAny', event);
			});

			socket.on('connect', () => {
				res();
				mySocketId.update(() => socket.id);
				console.log('socket connected', socket.id);
			});

			socket.on('hello', (arg) => {
				console.log(arg, socket.connected);
			});

			socket.on('user-connected', (peerId) => {
				console.log('user-connected', peerId);
				connectToNewUser(peerId);
			});

			socket.on('user-disconnected', (userId) => {
				handleUserDisconnect(userId);
			});

			socket.on('disconnect', () => {
				console.log('socket disconnect');
			});

			socket.on('connect_error', () => {
				rej();
			});

			socket.emit('howdy', 'stranger');
			return socket;
		});
	});
}

export function connectToNewUser(userId: string) {
	console.log('on call', peers, userId);

	const $myPeer = get(myPeer);
	const $myStream = get(myStream);

	if (peers[userId]) {
		peers[userId].close();
	}

	if (!$myPeer || !$myStream) {
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

export function getMyStream() {
	return new Promise(async (res, rej) => {
		let stream: MediaStream | undefined = undefined;
		try {
			stream = await navigator.mediaDevices.getUserMedia({
				video: true,
				audio: true
			});
			myStream.update(() => stream);
			streams.update((value) => {
				value['my-stream'] = stream as MediaStream;
				return value;
			});

			res(stream);
		} catch (error) {
			rej(stream);
			console.error('getMyStream', error);
		}
	});
}

export function joinRoom() {
	const $mySocket = get(mySocket);
	const $myCode = get(myCode);
	const $myConnId = get(myConnId);
	$mySocket?.emit('join-room', $myCode, $myConnId);
	console.log('join-room called');
}

export function disconnectSocket() {
	const $mySocket = get(mySocket);
	$mySocket?.disconnect();
	console.log('leave-room called');
	mySocket.update(() => undefined);
	mySocketId.update(() => '');
}

export function handleUserDisconnect(userId: string) {
	const $streams = get(streams);
	if (peers[userId]) {
		peers[userId].close();
		delete peers[userId];
	}

	if ($streams[userId]) {
		delete $streams[userId];
		streams.update(() => $streams);
	}
}
