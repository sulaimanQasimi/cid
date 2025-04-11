import React, { useState, useEffect, useRef } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Video, Mic, MicOff, VideoOff, PhoneOff, MessageSquare,
  Users, Settings, Share, ScreenShare, Wifi, WifiOff
} from 'lucide-react';
import axios from 'axios';

interface User {
  id: number;
  name: string;
  email: string;
}

interface Participant {
  id: number;
  user: User;
  role: string;
  status: string;
  joined_at: string;
  left_at: string;
}

interface Meeting {
  id: number;
  title: string;
  meeting_code: string;
  offline_enabled: boolean;
  status: string;
  creator: User;
  participants: Participant[];
}

interface Peer {
  id: string;
  user: User;
  connection: RTCPeerConnection | null;
  stream: MediaStream | null;
  videoEl: HTMLVideoElement | null;
  dataChannel: RTCDataChannel | null;
}

interface ChatMessage {
  id: number;
  user_id: number;
  meeting_id: number;
  message: string;
  is_offline: boolean;
  created_at: string;
  user: User;
}

interface RoomProps {
  auth: {
    user: User;
  };
  meeting: Meeting;
  isOfflineEnabled: boolean;
}

// STUN servers for WebRTC connection
const iceServers = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

export default function Room({ auth, meeting, isOfflineEnabled }: RoomProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [peerId, setPeerId] = useState<string>('');
  const [peers, setPeers] = useState<Record<string, Peer>>({});
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [offlineMessages, setOfflineMessages] = useState<any[]>([]);
  const [networkStatus, setNetworkStatus] = useState(navigator.onLine);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Meetings',
      href: route('meetings.index'),
    },
    {
      title: meeting.title,
      href: '#',
    },
  ];

  // Initialize WebRTC
  useEffect(() => {
    // Generate a unique peer ID
    const newPeerId = `peer_${auth.user.id}_${Date.now()}`;
    setPeerId(newPeerId);

    // Check if we're offline
    if (!navigator.onLine && isOfflineEnabled) {
      setIsOfflineMode(true);
      initializeOfflineMode(newPeerId);
    } else {
      // Initialize online mode
      startMedia().then(() => {
        initializeSession(newPeerId);
      });
    }

    // Listen for online/offline events
    window.addEventListener('online', handleNetworkChange);
    window.addEventListener('offline', handleNetworkChange);

    // Cleanup
    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }

      // Cleanup all peer connections
      Object.values(peers).forEach(peer => {
        if (peer.connection) {
          peer.connection.close();
        }
      });

      window.removeEventListener('online', handleNetworkChange);
      window.removeEventListener('offline', handleNetworkChange);

      // End the session if we have one
      if (sessionId) {
        endSession();
      }
    };
  }, []);

  // Scroll chat to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleNetworkChange = () => {
    const isOnline = navigator.onLine;
    setNetworkStatus(isOnline);

    if (isOnline && isOfflineMode) {
      // We were offline, now we're online, sync data
      syncOfflineData();
    } else if (!isOnline && isOfflineEnabled) {
      // We just went offline, switch to offline mode
      setIsOfflineMode(true);
    }
  };

  const startMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      setLocalStream(stream);

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      return stream;
    } catch (err) {
      console.error('Error accessing media devices:', err);
      // Fallback to audio only
      try {
        const audioOnlyStream = await navigator.mediaDevices.getUserMedia({
          video: false,
          audio: true
        });

        setLocalStream(audioOnlyStream);
        setIsVideoEnabled(false);

        return audioOnlyStream;
      } catch (audioErr) {
        console.error('Error accessing audio devices:', audioErr);
        alert('Could not access camera or microphone. Please check your permissions.');
        return null;
      }
    }
  };

  const initializeSession = async (peerIdParam: string) => {
    try {
      const response = await axios.post(route('webrtc.init-session', meeting.id), {
        peer_id: peerIdParam
      });

      setSessionId(response.data.session_id);

      // Connect to existing peers
      response.data.active_peers.forEach((peer: any) => {
        createPeerConnection(peer.peer_id, peer.user);
      });

      // Load chat messages
      loadChatMessages();

      setIsInitialized(true);
    } catch (err) {
      console.error('Failed to initialize session:', err);
      alert('Failed to join the meeting. Please try again.');
    }
  };

  const initializeOfflineMode = (peerIdParam: string) => {
    setPeerId(peerIdParam);
    setIsInitialized(true);

    // Load offline messages from localStorage if available
    const savedMessages = localStorage.getItem(`offline_chat_${meeting.id}`);
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        setOfflineMessages(parsedMessages);
      } catch (e) {
        console.error('Failed to parse offline messages:', e);
      }
    }
  };

  const createPeerConnection = (remotePeerId: string, user: User) => {
    // Create a new RTCPeerConnection
    const peerConnection = new RTCPeerConnection(iceServers);

    // Add the local stream to the connection
    if (localStream) {
      localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream);
      });
    }

    // Create a data channel for messages when offline
    const dataChannel = peerConnection.createDataChannel('messages', {
      negotiated: true,
      id: 0
    });

    dataChannel.onopen = () => {
      console.log(`Data channel with ${remotePeerId} opened`);
    };

    dataChannel.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'chat') {
          handleIncomingChatMessage(data.message, data.user, true);
        }
      } catch (e) {
        console.error('Error parsing data channel message:', e);
      }
    };

    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        sendSignal(remotePeerId, 'candidate', event.candidate);
      }
    };

    // Handle incoming streams
    peerConnection.ontrack = (event) => {
      setPeers(prev => ({
        ...prev,
        [remotePeerId]: {
          ...prev[remotePeerId],
          stream: event.streams[0]
        }
      }));
    };

    // Store the new peer
    setPeers(prev => ({
      ...prev,
      [remotePeerId]: {
        id: remotePeerId,
        user,
        connection: peerConnection,
        stream: null,
        videoEl: null,
        dataChannel
      }
    }));

    // Create an offer if this is a new peer
    createOffer(peerConnection, remotePeerId);

    return peerConnection;
  };

  const createOffer = async (peerConnection: RTCPeerConnection, remotePeerId: string) => {
    try {
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);

      // Send the offer to the remote peer
      sendSignal(remotePeerId, 'offer', offer);
    } catch (err) {
      console.error('Error creating offer:', err);
    }
  };

  const handleIncomingSignal = async (signal: any) => {
    const { sender_peer_id, type, payload } = signal;

    // Check if we already have this peer
    let peer = peers[sender_peer_id];

    if (!peer) {
      // Create a new peer connection if we don't have one
      const peerConnection = new RTCPeerConnection(iceServers);

      // Add the local stream
      if (localStream) {
        localStream.getTracks().forEach(track => {
          peerConnection.addTrack(track, localStream);
        });
      }

      // Handle ICE candidates
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          sendSignal(sender_peer_id, 'candidate', event.candidate);
        }
      };

      // Handle incoming streams
      peerConnection.ontrack = (event) => {
        setPeers(prev => ({
          ...prev,
          [sender_peer_id]: {
            ...prev[sender_peer_id],
            stream: event.streams[0]
          }
        }));
      };

      // Create and store the peer
      peer = {
        id: sender_peer_id,
        user: { id: 0, name: 'Unknown', email: '' },
        connection: peerConnection,
        stream: null,
        videoEl: null,
        dataChannel: null
      };

      setPeers(prev => ({
        ...prev,
        [sender_peer_id]: peer
      }));
    }

    // Handle the signal based on type
    if (type === 'offer') {
      await peer.connection!.setRemoteDescription(new RTCSessionDescription(payload));
      const answer = await peer.connection!.createAnswer();
      await peer.connection!.setLocalDescription(answer);
      sendSignal(sender_peer_id, 'answer', answer);
    } else if (type === 'answer') {
      await peer.connection!.setRemoteDescription(new RTCSessionDescription(payload));
    } else if (type === 'candidate') {
      await peer.connection!.addIceCandidate(new RTCIceCandidate(payload));
    }
  };

  const sendSignal = (receiverPeerId: string, type: string, payload: any) => {
    if (isOfflineMode) {
      // Store for syncing later
      const signal = {
        sender_peer_id: peerId,
        receiver_peer_id: receiverPeerId,
        meeting_id: meeting.id,
        type,
        payload,
        timestamp: new Date().toISOString(),
        is_offline: true
      };

      // Store in local signals array
      localStorage.setItem(
        `offline_signals_${meeting.id}`,
        JSON.stringify([
          ...JSON.parse(localStorage.getItem(`offline_signals_${meeting.id}`) || '[]'),
          signal
        ])
      );

      return;
    }

    // Send via API
    axios.post(route('webrtc.signal'), {
      sender_peer_id: peerId,
      receiver_peer_id: receiverPeerId,
      meeting_id: meeting.id,
      type,
      payload
    }).catch(err => {
      console.error('Error sending signal:', err);
      // If sending fails, we might be going offline
      if (!navigator.onLine && isOfflineEnabled) {
        setIsOfflineMode(true);
      }
    });
  };

  const syncOfflineData = async () => {
    if (!sessionId) return;

    // Get stored offline data
    const offlineSignals = JSON.parse(localStorage.getItem(`offline_signals_${meeting.id}`) || '[]');
    const offlineChatMessages = JSON.parse(localStorage.getItem(`offline_chat_${meeting.id}`) || '[]');

    try {
      // Send to server
      const response = await axios.post(route('webrtc.sync-offline', sessionId), {
        offline_data: {
          signals: offlineSignals
        },
        messages: offlineChatMessages
      });

      // Clear local storage
      localStorage.removeItem(`offline_signals_${meeting.id}`);
      localStorage.removeItem(`offline_chat_${meeting.id}`);

      // Process any pending signals
      if (response.data.pending_signals) {
        response.data.pending_signals.forEach((signal: any) => {
          handleIncomingSignal(signal);
        });
      }

      // Refresh messages
      loadChatMessages();

      // Turn off offline mode
      setIsOfflineMode(false);
    } catch (err) {
      console.error('Failed to sync offline data:', err);
    }
  };

  const loadChatMessages = async () => {
    try {
      const response = await axios.get(route('webrtc.get-messages', meeting.id));
      setChatMessages(response.data.messages);
    } catch (err) {
      console.error('Failed to load chat messages:', err);
    }
  };

  const sendChatMessage = async () => {
    if (!messageInput.trim()) return;

    const message = messageInput.trim();
    setMessageInput('');

    // Add message to UI immediately for better UX
    const tempMessage: ChatMessage = {
      id: Date.now(),
      user_id: auth.user.id,
      meeting_id: meeting.id,
      message,
      is_offline: isOfflineMode,
      created_at: new Date().toISOString(),
      user: auth.user
    };

    setChatMessages(prev => [...prev, tempMessage]);

    if (isOfflineMode) {
      // Store in local storage for later syncing
      const offlineMessage = {
        content: message,
        timestamp: new Date().toISOString(),
        user: auth.user
      };

      const savedMessages = JSON.parse(localStorage.getItem(`offline_chat_${meeting.id}`) || '[]');
      savedMessages.push(offlineMessage);
      localStorage.setItem(`offline_chat_${meeting.id}`, JSON.stringify(savedMessages));

      // Send via data channels if connected to peers
      Object.values(peers).forEach(peer => {
        if (peer.dataChannel && peer.dataChannel.readyState === 'open') {
          peer.dataChannel.send(JSON.stringify({
            type: 'chat',
            message,
            user: auth.user
          }));
        }
      });

      return;
    }

    try {
      await axios.post(route('webrtc.send-message', meeting.id), {
        message,
        is_offline: false
      });
    } catch (err) {
      console.error('Failed to send message:', err);

      // If sending fails, we might be going offline
      if (!navigator.onLine && isOfflineEnabled) {
        setIsOfflineMode(true);

        // Retry as offline message
        const offlineMessage = {
          content: message,
          timestamp: new Date().toISOString(),
          user: auth.user
        };

        const savedMessages = JSON.parse(localStorage.getItem(`offline_chat_${meeting.id}`) || '[]');
        savedMessages.push(offlineMessage);
        localStorage.setItem(`offline_chat_${meeting.id}`, JSON.stringify(savedMessages));
      }
    }
  };

  const handleIncomingChatMessage = (message: string, user: User, isOffline: boolean) => {
    const newMessage: ChatMessage = {
      id: Date.now(),
      user_id: user.id,
      meeting_id: meeting.id,
      message,
      is_offline: isOffline,
      created_at: new Date().toISOString(),
      user
    };

    setChatMessages(prev => [...prev, newMessage]);
  };

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = !isVideoEnabled;
      });
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  const toggleAudio = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !isAudioEnabled;
      });
      setIsAudioEnabled(!isAudioEnabled);
    }
  };

  const endSession = async () => {
    // Notify server that we're leaving
    if (sessionId) {
      try {
        await axios.post(route('webrtc.end-session', sessionId));
      } catch (err) {
        console.error('Error ending session:', err);
      }
    }

    // Stop local media
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }

    // Close all peer connections
    Object.values(peers).forEach(peer => {
      if (peer.connection) {
        peer.connection.close();
      }
    });

    // Redirect to the meetings list
    router.post(route('meetings.leave', meeting.id));
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <Head title={`Meeting: ${meeting.title}`} />

      {/* Meeting header */}
      <div className="bg-white border-b p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold">{meeting.title}</h1>
            <div className="flex items-center text-sm text-gray-500">
              <span className="mr-2">Meeting Code: {meeting.meeting_code}</span>
              {isOfflineMode ? (
                <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200">
                  <WifiOff className="h-3 w-3 mr-1" />
                  Offline Mode
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                  <Wifi className="h-3 w-3 mr-1" />
                  Connected
                </Badge>
              )}
            </div>
          </div>
          <Button variant="destructive" size="sm" onClick={endSession}>
            <PhoneOff className="h-4 w-4 mr-1" />
            Leave Meeting
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video grid */}
        <div className={`flex-1 p-4 ${isChatOpen ? 'hidden md:block md:w-2/3' : 'w-full'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 h-full">
            {/* Local video */}
            <div className="relative rounded-lg overflow-hidden bg-gray-900 min-h-[200px] flex items-center justify-center">
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className={`w-full h-full object-cover ${!isVideoEnabled && 'hidden'}`}
              />
              {!isVideoEnabled && (
                <div className="flex flex-col items-center text-white">
                  <Avatar className="h-20 w-20 mb-2">
                    <AvatarFallback>{auth.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span>{auth.user.name} (You)</span>
                </div>
              )}
              <div className="absolute bottom-2 left-2 text-white text-sm bg-black bg-opacity-50 px-2 py-1 rounded">
                {auth.user.name} (You)
              </div>
            </div>

            {/* Remote videos */}
            {Object.values(peers).map(peer => (
              <div key={peer.id} className="relative rounded-lg overflow-hidden bg-gray-900 min-h-[200px] flex items-center justify-center">
                {peer.stream ? (
                  <video
                    ref={element => {
                      if (element && peer.stream && !peer.videoEl) {
                        element.srcObject = peer.stream;
                        setPeers(prev => ({
                          ...prev,
                          [peer.id]: {
                            ...prev[peer.id],
                            videoEl: element
                          }
                        }));
                      }
                    }}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center text-white">
                    <Avatar className="h-20 w-20 mb-2">
                      <AvatarFallback>{peer.user.name?.charAt(0) || '?'}</AvatarFallback>
                    </Avatar>
                    <span>{peer.user.name || 'Participant'}</span>
                  </div>
                )}
                <div className="absolute bottom-2 left-2 text-white text-sm bg-black bg-opacity-50 px-2 py-1 rounded">
                  {peer.user.name || 'Participant'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat panel */}
        {isChatOpen && (
          <div className="w-full md:w-1/3 flex flex-col bg-white border-l">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="font-semibold">Meeting Chat</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsChatOpen(false)}
                className="md:hidden"
              >
                Close
              </Button>
            </div>

            <div
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-4"
            >
              {chatMessages.map(message => (
                <div
                  key={message.id}
                  className={`flex ${message.user_id === auth.user.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      message.user_id === auth.user.id
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-800'
                    } ${
                      message.is_offline ? 'italic opacity-80' : ''
                    }`}
                  >
                    <div className="font-semibold text-xs mb-1">
                      {message.user_id === auth.user.id ? 'You' : message.user.name}
                      {message.is_offline && ' (sent offline)'}
                    </div>
                    <div>{message.message}</div>
                    <div className="text-xs text-right mt-1 opacity-70">
                      {formatTime(message.created_at)}
                    </div>
                  </div>
                </div>
              ))}

              {offlineMessages.map((msg, index) => (
                <div key={`offline-${index}`} className="flex justify-end">
                  <div className="max-w-[80%] rounded-lg px-4 py-2 bg-blue-500 text-white italic opacity-80">
                    <div className="font-semibold text-xs mb-1">
                      You (offline)
                    </div>
                    <div>{msg.content}</div>
                    <div className="text-xs text-right mt-1 opacity-70">
                      {formatTime(msg.timestamp)}
                    </div>
                  </div>
                </div>
              ))}

              {chatMessages.length === 0 && offlineMessages.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  No messages yet. Start the conversation!
                </div>
              )}
            </div>

            <div className="p-4 border-t">
              <form
                onSubmit={e => {
                  e.preventDefault();
                  sendChatMessage();
                }}
                className="flex items-center space-x-2"
              >
                <Input
                  value={messageInput}
                  onChange={e => setMessageInput(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1"
                />
                <Button type="submit" disabled={!messageInput.trim()}>
                  Send
                </Button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-white border-t p-4">
        <div className="max-w-7xl mx-auto flex justify-center space-x-4">
          <Button
            variant={isAudioEnabled ? "outline" : "destructive"}
            onClick={toggleAudio}
            className="rounded-full w-12 h-12 p-0"
          >
            {isAudioEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
          </Button>

          <Button
            variant={isVideoEnabled ? "outline" : "destructive"}
            onClick={toggleVideo}
            className="rounded-full w-12 h-12 p-0"
          >
            {isVideoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
          </Button>

          <Button
            variant={isChatOpen ? "default" : "outline"}
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="rounded-full w-12 h-12 p-0"
          >
            <MessageSquare className="h-5 w-5" />
          </Button>

          <Button
            variant="outline"
            className="rounded-full w-12 h-12 p-0"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert('Meeting link copied to clipboard');
            }}
          >
            <Share className="h-5 w-5" />
          </Button>

          <Button
            variant="destructive"
            onClick={endSession}
            className="rounded-full w-12 h-12 p-0"
          >
            <PhoneOff className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
