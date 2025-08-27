import React, { useState } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  TextField,
  Paper,
  Typography,
  Divider,
  IconButton,
  Avatar,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

export default function ChatPage() {
  const [selectedRoom, setSelectedRoom] = useState(0);
  const [message, setMessage] = useState("");

  const chatRooms = [
    { id: 1, name: "General", lastMessage: "Hello everyone!" },
    { id: 2, name: "Development", lastMessage: "Code review needed" },
    { id: 3, name: "Random", lastMessage: "Good morning!" },
  ];

  const messages = [
    { id: 1, user: "John", text: "Hello everyone!", time: "10:30" },
    { id: 2, user: "Jane", text: "How are you doing?", time: "10:32" },
    {
      id: 3,
      user: "Bob",
      text: "Great! Working on the new feature",
      time: "10:35",
    },
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      // Handle sending message logic here
      setMessage("");
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* Left side - Chat rooms list */}
      <Paper sx={{ width: 300, borderRadius: 0 }}>
        <Typography variant="h6" sx={{ p: 2 }}>
          Chat Rooms
        </Typography>
        <Divider />
        <List>
          {chatRooms.map((room, index) => (
            <ListItemButton
              key={room.id}
              selected={selectedRoom === index}
              onClick={() => setSelectedRoom(index)}
            >
              <ListItem>
                <Avatar sx={{ mr: 2 }}>{room.name[0]}</Avatar>
                <ListItemText
                  primary={room.name}
                  secondary={room.lastMessage}
                />
              </ListItem>
            </ListItemButton>
          ))}
        </List>
      </Paper>

      {/* Right side - Messages */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <Paper sx={{ p: 2, borderRadius: 0 }}>
          <Typography variant="h6">{chatRooms[selectedRoom]?.name}</Typography>
        </Paper>

        {/* Messages area */}
        <Box sx={{ flex: 1, p: 2, overflowY: "auto" }}>
          {messages.map((msg) => (
            <Box key={msg.id} sx={{ mb: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                <Avatar sx={{ width: 32, height: 32, mr: 1 }}>
                  {msg.user[0]}
                </Avatar>
                <Typography variant="subtitle2" sx={{ mr: 1 }}>
                  {msg.user}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {msg.time}
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ ml: 5 }}>
                {msg.text}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Message input */}
        <Paper sx={{ p: 2, borderRadius: 0 }}>
          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField
              fullWidth
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <IconButton onClick={handleSendMessage} color="primary">
              <SendIcon />
            </IconButton>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
