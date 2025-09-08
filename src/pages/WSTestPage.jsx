import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert,
  Stack,
  Chip
} from '@mui/material';
import WebSocketService from '../utils/websocket';

export default function WSTestPage() {
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [destination, setDestination] = useState('/topic/public');
  const [publishDestination, setPublishDestination] = useState('/app/chat');
  const [connectionUrl, setConnectionUrl] = useState('ws://localhost:8080/ws');
  const subscriptionRef = useRef(null);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
      WebSocketService.disconnect();
    };
  }, []);

  const handleConnect = () => {
    WebSocketService.connect(
      connectionUrl,
      (frame) => {
        setConnected(true);
        console.log('WebSocket connected:', frame);
        
        // Subscribe to a topic
        subscriptionRef.current = WebSocketService.subscribe(destination, (message) => {
          const receivedMessage = JSON.parse(message.body);
          console.log(receivedMessage);
          setMessages(prev => [...prev, {
            ...receivedMessage,
            timestamp: new Date().toLocaleTimeString(),
            type: 'received'
          }]);
        });
      },
      (error) => {
        console.error('WebSocket connection error:', error);
        setConnected(false);
      }
    );
  };

  const handleDisconnect = () => {
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
      subscriptionRef.current = null;
    }
    WebSocketService.disconnect();
    setConnected(false);
    setMessages([]);
  };

  const handleSendMessage = () => {
    if (messageInput.trim() && connected) {
      const message = {
        chatRoomId: '1',
        message: messageInput,
      };

      WebSocketService.publish(publishDestination, message);
      
      // Add to local messages for display
      setMessages(prev => [...prev, {
        ...message,
        timestamp: new Date().toLocaleTimeString(),
        type: 'sent'
      }]);
      
      setMessageInput('');
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        WebSocket Test Page
      </Typography>

      {/* Connection Controls */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Connection Settings
        </Typography>
        
        <Stack spacing={2}>
          <TextField
            label="WebSocket URL"
            value={connectionUrl}
            onChange={(e) => setConnectionUrl(e.target.value)}
            fullWidth
            disabled={connected}
          />
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Subscribe Destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              disabled={connected}
              sx={{ flex: 1 }}
            />
            <TextField
              label="Publish Destination"
              value={publishDestination}
              onChange={(e) => setPublishDestination(e.target.value)}
              disabled={connected}
              sx={{ flex: 1 }}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Button
              variant="contained"
              onClick={handleConnect}
              disabled={connected}
              color="success"
            >
              Connect
            </Button>
            <Button
              variant="contained"
              onClick={handleDisconnect}
              disabled={!connected}
              color="error"
            >
              Disconnect
            </Button>
            <Chip 
              label={connected ? 'Connected' : 'Disconnected'} 
              color={connected ? 'success' : 'default'}
            />
          </Box>
        </Stack>
      </Paper>

      {/* Message Input */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Send Message
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            label="Message"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={handleKeyPress}
            fullWidth
            disabled={!connected}
            multiline
            maxRows={3}
          />
          <Button
            variant="contained"
            onClick={handleSendMessage}
            disabled={!connected || !messageInput.trim()}
          >
            Send
          </Button>
        </Box>
      </Paper>

      {/* Messages Display */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Messages ({messages.length})
        </Typography>
        
        {messages.length === 0 ? (
          <Alert severity="info">No messages yet. Connect and start chatting!</Alert>
        ) : (
          <List sx={{ maxHeight: 400, overflow: 'auto' }}>
            {messages.map((msg, index) => (
              <React.Fragment key={index}>
                <ListItem
                  sx={{
                    bgcolor: msg.type === 'sent' ? 'primary.light' : 'grey.100',
                    borderRadius: 1,
                    mb: 1
                  }}
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body1">
                          {msg.message}
                        </Typography>
                        <Chip 
                          label={msg.type} 
                          size="small" 
                          color={msg.type === 'sent' ? 'primary' : 'default'}
                        />
                      </Box>
                    }
                    secondary={
                      <Typography variant="caption">
                        {msg.senderId} - {msg.timestamp}
                      </Typography>
                    }
                  />
                </ListItem>
                {index < messages.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  );
}