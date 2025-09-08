# Real-time Chat System

This React application now includes a fully functional real-time chatting system built with Spring Boot WebSocket and STOMP protocol.

## Features

- **Real-time messaging**: Messages are sent and received instantly via WebSocket connections
- **Chat room support**: Users can join multiple chat rooms and switch between them
- **Message history**: Previous messages are loaded from REST API when entering a room
- **Read status**: Messages are automatically marked as read when viewing a room
- **Connection status**: Visual indicators show WebSocket connection status
- **Responsive UI**: Mobile-friendly chat interface built with Material-UI
- **Internationalization**: Support for Korean and Japanese languages

## API Endpoints

### REST APIs

- `GET /chatroom/my` - Get user's chat rooms
- `GET /chat/room/{roomId}/messages/all` - Get all messages for a room
- `POST /room/{roomId}/read` - Mark messages as read

### WebSocket/STOMP

- **Connection URL**: `import.meta.env.VITE_WS_URL`
- **Send endpoint**: `/app/chat/send/{roomId}`
- **Subscribe topic**: `/topic/chat/room/{roomId}`

## Message Format

When sending a message via STOMP:

```javascript
{
    chatroomId: Integer,
    message: String
}
```

## How It Works

1. **Initialization**: When the chat page loads, it:

   - Connects to the WebSocket server using the configured URL
   - Loads the user's chat rooms from the REST API
   - Auto-selects the first available room

2. **Room Selection**: When a user clicks on a chat room:

   - Unsubscribes from the previous room's topic
   - Loads message history for the new room
   - Subscribes to the new room's topic for real-time updates
   - Marks messages as read

3. **Sending Messages**: When a user sends a message:

   - The message is published to `/app/chat/send/{roomId}`
   - The server processes it and broadcasts to all subscribers
   - The UI is updated in real-time for all connected users

4. **Receiving Messages**: When a new message arrives:
   - It's received via the subscribed topic
   - Added to the message list in real-time
   - Chat room list is updated with the latest message

## Components

- **ChatPage.jsx**: Main chat interface component
- **useChat.js**: Custom hook managing chat state and WebSocket logic
- **websocket.js**: WebSocket service wrapper for STOMP client

## Environment Variables

Make sure to set the following environment variable:

```
VITE_WS_URL=ws://your-backend-server:port/ws
```

## Usage

The chat system is automatically initialized when users navigate to the chat page. All WebSocket connections are properly cleaned up when leaving the page.

## Error Handling

- Connection failures are displayed to users
- Automatic reconnection attempts with 5-second intervals
- Graceful handling of API errors
- User-friendly error messages in multiple languages
