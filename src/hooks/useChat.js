import { useState, useEffect, useRef, useCallback } from 'react';
import WebSocketService from '../utils/websocket';
import taxios from '../utils/taxios';

export const useChat = () => {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [chatRooms, setChatRooms] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wsConnected, setWsConnected] = useState(false);
  const currentSubscription = useRef(null);

  // Load messages for a specific room
  const loadMessages = async (roomId) => {
    try {
      const response = await taxios.get(`/chat/room/${roomId}/messages/all`);
      setMessages(response.data);
    } catch (err) {
      console.error("Failed to load messages:", err);
      setError("Failed to load messages");
    }
  };

  // Subscribe to real-time messages for a room
  const subscribeToRoom = (roomId) => {
    if (!WebSocketService.isConnected()) {
      console.warn("WebSocket not connected, cannot subscribe");
      return;
    }

    const subscription = WebSocketService.subscribe(
      `/topic/chat/room/${roomId}`,
      (message) => {
        const newMessage = JSON.parse(message.body);
        setMessages(prev => [...prev, newMessage]);
        
        // Update last message in chat rooms list
        setChatRooms(prev => 
          prev.map(room => 
            room.id === roomId 
              ? { ...room, lastMessage: newMessage.message }
              : room
          )
        );
      }
    );

    currentSubscription.current = subscription;
  };

  // Mark messages as read
  const markMessagesAsRead = async (roomId) => {
    try {
      await taxios.post(`/chat/room/${roomId}/read`);
    } catch (err) {
      console.error("Failed to mark messages as read:", err);
    }
  };

  // Load chat rooms from API
  const loadChatRooms = useCallback(async () => {
    try {
      const response = await taxios.get("/chatroom/my");
      setChatRooms(response.data);
      return response.data;
    } catch (err) {
      console.error("Failed to load chat rooms:", err);
      setError("Failed to load chat rooms");
      return [];
    }
  }, []);

  // Select a chat room and load its messages
  const selectChatRoom = useCallback(async (room) => {
    try {
      // Unsubscribe from previous room
      if (currentSubscription.current) {
        currentSubscription.current.unsubscribe();
        currentSubscription.current = null;
      }

      setSelectedRoom(room);
      
      // Load messages for the selected room
      await loadMessages(room.id);
      
      // Subscribe to new messages for this room
      if (WebSocketService.isConnected()) {
        subscribeToRoom(room.id);
      }

      // Mark messages as read
      await markMessagesAsRead(room.id);
    } catch (err) {
      console.error("Failed to select chat room:", err);
    }
  }, []);

  // Send a message
  const sendMessage = (message) => {
    if (message.trim() && selectedRoom && WebSocketService.isConnected()) {
      const messagePayload = {
        chatroomId: selectedRoom.id,
        message: message.trim()
      };

      WebSocketService.publish(
        `/app/chat/send/${selectedRoom.id}`,
        messagePayload
      );

      return true;
    }
    return false;
  };

  // Initialize WebSocket connection and load chat rooms
  useEffect(() => {
    const initializeChat = async () => {
      try {
        // Connect to WebSocket
        WebSocketService.connect(
          import.meta.env.VITE_WS_URL,
          (frame) => {
            console.log("WebSocket connected:", frame);
            setWsConnected(true);
          },
          (error) => {
            console.error("WebSocket connection error:", error);
            setError("Failed to connect to chat server");
          }
        );

        // Load chat rooms
        const rooms = await loadChatRooms();
        
        // Auto-select first room if available
        if (rooms.length > 0) {
          await selectChatRoom(rooms[0]);
        }
      } catch (err) {
        console.error("Failed to initialize chat:", err);
        setError("Failed to initialize chat");
      } finally {
        setLoading(false);
      }
    };

    initializeChat();

    // Cleanup on unmount
    return () => {
      if (currentSubscription.current) {
        currentSubscription.current.unsubscribe();
      }
      WebSocketService.disconnect();
    };
  }, [loadChatRooms, selectChatRoom]);

  return {
    selectedRoom,
    chatRooms,
    messages,
    loading,
    error,
    wsConnected,
    selectChatRoom,
    sendMessage,
    loadChatRooms
  };
};
