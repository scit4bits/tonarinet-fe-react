import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Avatar,
  Box,
  CircularProgress,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useChat } from "../hooks/useChat";
import useAuth from "../hooks/useAuth";
import { TranslatableText } from "../components/TranslatableText";

export default function ChatPage() {
  const { t } = useTranslation();
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);
  const { user } = useAuth();

  const {
    selectedRoom,
    chatRooms,
    messages,
    loading,
    error,
    wsConnected,
    selectChatRoom,
    sendMessage,
  } = useChat();

  // Message Bubble Component
  const MessageBubble = ({
    msg,
    isOwnMessage,
    isFirstInGroup,
    isLastInGroup,
  }) => {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: isOwnMessage ? "flex-end" : "flex-start",
          mb: isLastInGroup ? 2 : 0.5,
          alignItems: "flex-end",
        }}
      >
        {/* Avatar for other users (left side) - only show for last message in group */}
        {!isOwnMessage && (
          <Avatar
            src={
              msg?.senderProfileFileId
                ? `${import.meta.env.VITE_API_BASE_URL}/files/${
                    msg?.senderProfileFileId
                  }/download`
                : null
            }
            sx={{
              width: 32,
              height: 32,
              mr: 1,
              mb: 0.5,
              visibility: isLastInGroup ? "visible" : "hidden",
            }}
          >
            {msg.senderNickname?.[0] ||
              msg.sender?.name?.[0] ||
              msg.user?.[0] ||
              "U"}
          </Avatar>
        )}

        {/* Message Content */}
        <Box
          sx={{
            maxWidth: "70%",
            display: "flex",
            flexDirection: "column",
            alignItems: isOwnMessage ? "flex-end" : "flex-start",
          }}
        >
          {/* Sender name and time (only for other users and first message in group) */}
          {!isOwnMessage && isFirstInGroup && (
            <Box sx={{ display: "flex", alignItems: "center", mb: 0.5, ml: 1 }}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontWeight: 500 }}
              >
                {msg.sender?.nickname ||
                  msg.senderNickname ||
                  msg.user?.nickname ||
                  t("common.unknown")}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ ml: 1 }}
              >
                {msg.createdAt
                  ? new Date(msg.createdAt).toLocaleTimeString()
                  : msg.time}
              </Typography>
            </Box>
          )}

          {/* Message Bubble */}
          <Paper
            elevation={1}
            sx={{
              p: 1.5,
              borderRadius: 2,
              backgroundColor: isOwnMessage
                ? "primary.main"
                : "background.paper",
              color: isOwnMessage ? "primary.contrastText" : "text.primary",
              borderTopRightRadius: isOwnMessage
                ? isFirstInGroup
                  ? 4
                  : 16
                : 16,
              borderTopLeftRadius: isOwnMessage ? 16 : isFirstInGroup ? 4 : 16,
              borderBottomRightRadius: isOwnMessage
                ? isLastInGroup
                  ? 4
                  : 16
                : 16,
              borderBottomLeftRadius: isOwnMessage
                ? 16
                : isLastInGroup
                ? 4
                : 16,
              boxShadow: isOwnMessage
                ? "0 2px 8px rgba(25, 118, 210, 0.15)"
                : "0 2px 8px rgba(0, 0, 0, 0.1)",
              transition: "all 0.2s ease",
              "&:hover": {
                boxShadow: isOwnMessage
                  ? "0 4px 12px rgba(25, 118, 210, 0.2)"
                  : "0 4px 12px rgba(0, 0, 0, 0.15)",
              },
            }}
          >
            <TranslatableText>
              <Typography
                variant="body1"
                sx={{
                  wordBreak: "break-word",
                  whiteSpace: "pre-wrap",
                  fontSize: "0.95rem",
                  lineHeight: 1.4,
                }}
              >
                {msg.message || msg.text}
              </Typography>
            </TranslatableText>
          </Paper>

          {/* Time for own messages (bottom right) - only show for last in group */}
          {isOwnMessage && isLastInGroup && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                mt: 0.5,
                mr: 1,
                fontSize: "0.7rem",
              }}
            >
              {msg.createdAt
                ? new Date(msg.createdAt).toLocaleTimeString()
                : msg.time}
            </Typography>
          )}
        </Box>

        {/* Avatar for own messages (right side) - only show for last message in group */}
        {isOwnMessage && (
          <Avatar
            src={
              user?.profileFileId
                ? `${import.meta.env.VITE_API_BASE_URL}/files/${
                    user?.profileFileId
                  }/download`
                : null
            }
            sx={{
              width: 32,
              height: 32,
              ml: 1,
              mb: 0.5,
              backgroundColor: "primary.main",
              visibility: isLastInGroup ? "visible" : "hidden",
            }}
          >
            {user?.name?.[0] || t("common.me")}
          </Avatar>
        )}
      </Box>
    );
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Send a message
  const handleSendMessage = () => {
    if (sendMessage(message)) {
      setMessage("");
    }
  };

  // Handle mobile back navigation
  const handleBackToRooms = () => {
    // Just trigger a re-render by setting selected room to null
    // The chat hook will handle the cleanup
    window.history.pushState(null, "", "/chat");
    window.location.reload();
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        height: "70vh",
        overflow: "hidden",
        backgroundColor: "background.default",
      }}
    >
      <title>{t("pages.chat.title")}</title>

      {/* Left side - Chat rooms list */}
      <Paper
        sx={{
          width: { xs: "100%", sm: 300 },
          borderRadius: 0,
          display: { xs: selectedRoom ? "none" : "flex", sm: "flex" },
          flexDirection: "column",
          borderRight: "1px solid #e0e0e0",
        }}
      >
        <Box
          sx={{
            p: 2,
            display: "flex",
            alignItems: "center",
            gap: 1,
            borderBottom: "1px solid #e0e0e0",
            backgroundColor: "primary.main",
            color: "primary.contrastText",
          }}
        >
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {t("pages.chat.chatRooms")}
          </Typography>
          {/* Connection status indicator */}
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: wsConnected ? "success.main" : "error.main",
              boxShadow: wsConnected
                ? "0 0 8px rgba(76, 175, 80, 0.4)"
                : "0 0 8px rgba(244, 67, 54, 0.4)",
              transition: "all 0.3s ease",
            }}
            title={
              wsConnected
                ? t("pages.chat.connected")
                : t("pages.chat.disconnectedStatus")
            }
          />
        </Box>
        <Divider />
        <List sx={{ flex: 1, overflow: "auto", p: 0 }}>
          {chatRooms.map((room) => (
            <ListItemButton
              key={room.id}
              selected={selectedRoom?.id === room.id}
              onClick={() => selectChatRoom(room)}
              sx={{
                py: 2,
                px: 2,
                "&.Mui-selected": {
                  backgroundColor: "primary.light",
                  "&:hover": {
                    backgroundColor: "primary.light",
                  },
                },
                "&:hover": {
                  backgroundColor: "action.hover",
                },
              }}
            >
              <Avatar
                sx={{
                  mr: 2,
                  backgroundColor:
                    selectedRoom?.id === room.id ? "primary.main" : "grey.400",
                }}
              >
                {room.title[0] || "C"}
              </Avatar>
              <ListItemText
                primary={room.title}
                secondary={room.description || t("pages.chat.noMessages")}
                primaryTypographyProps={{
                  variant: "subtitle1",
                  sx: {
                    fontWeight: selectedRoom?.id === room.id ? 600 : 400,
                    color:
                      selectedRoom?.id === room.id
                        ? "primary.main"
                        : "text.primary",
                  },
                }}
                secondaryTypographyProps={{
                  variant: "body2",
                  color: "text.secondary",
                  sx: {
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  },
                }}
              />
            </ListItemButton>
          ))}
          {chatRooms.length === 0 && (
            <ListItem sx={{ py: 4 }}>
              <ListItemText
                primary={t("pages.chat.noRooms")}
                secondary={t("pages.chat.noRoomsDescription")}
                primaryTypographyProps={{
                  variant: "body1",
                  color: "text.secondary",
                  align: "center",
                }}
                secondaryTypographyProps={{
                  variant: "body2",
                  color: "text.secondary",
                  align: "center",
                }}
              />
            </ListItem>
          )}
        </List>
      </Paper>

      {/* Right side - Messages */}
      <Box
        sx={{
          flex: 1,
          display: { xs: selectedRoom ? "flex" : "none", sm: "flex" },
          flexDirection: "column",
          minWidth: 0, // Prevent flex overflow
        }}
      >
        {selectedRoom ? (
          <>
            {/* Header */}
            <Paper
              sx={{
                p: 2,
                borderRadius: 0,
                borderBottom: "1px solid #e0e0e0",
                backgroundColor: "background.paper",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                {/* Back button for mobile */}
                <IconButton
                  sx={{
                    display: { xs: "block", sm: "none" },
                    color: "primary.main",
                  }}
                  onClick={() => handleBackToRooms()}
                >
                  <ArrowBackIcon />
                </IconButton>

                <Avatar sx={{ backgroundColor: "primary.main" }}>
                  {selectedRoom.title[0] || "C"}
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {selectedRoom.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {wsConnected
                      ? t("pages.chat.connected")
                      : t("pages.chat.disconnectedStatus")}
                  </Typography>
                </Box>
                {/* Online indicator */}
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: wsConnected
                      ? "success.main"
                      : "error.main",
                  }}
                />
              </Box>
            </Paper>

            {/* Messages area */}
            <Box
              sx={{
                flex: 1,
                p: 2,
                overflowY: "auto",
                backgroundColor: "#f8f9fa",
                backgroundImage:
                  "linear-gradient(45deg, #f8f9fa 25%, transparent 25%), linear-gradient(-45deg, #f8f9fa 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f8f9fa 75%), linear-gradient(-45deg, transparent 75%, #f8f9fa 75%)",
                backgroundSize: "20px 20px",
                backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
                textAlign: "left",
              }}
            >
              {messages.map((msg, index) => {
                const isOwnMessage =
                  msg.senderId === user?.id || msg.sender?.id === user?.id;
                const prevMsg = index > 0 ? messages[index - 1] : null;
                const nextMsg =
                  index < messages.length - 1 ? messages[index + 1] : null;

                const prevIsFromSameSender =
                  prevMsg &&
                  (prevMsg.senderId === msg.senderId ||
                    prevMsg.sender?.id === msg.sender?.id);
                const nextIsFromSameSender =
                  nextMsg &&
                  (nextMsg.senderId === msg.senderId ||
                    nextMsg.sender?.id === msg.sender?.id);

                const isFirstInGroup = !prevIsFromSameSender;
                const isLastInGroup = !nextIsFromSameSender;

                return (
                  <MessageBubble
                    key={msg.id || index}
                    msg={msg}
                    isOwnMessage={isOwnMessage}
                    isFirstInGroup={isFirstInGroup}
                    isLastInGroup={isLastInGroup}
                  />
                );
              })}
              {messages.length === 0 && (
                <Box sx={{ textAlign: "center", mt: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    {t("pages.chat.noMessagesDescription")}
                  </Typography>
                </Box>
              )}
              <div ref={messagesEndRef} />
            </Box>

            {/* Message input */}
            <Paper
              sx={{
                p: 2,
                borderRadius: 0,
                borderTop: "1px solid #e0e0e0",
                backgroundColor: "background.paper",
              }}
            >
              <Box sx={{ display: "flex", gap: 1, alignItems: "flex-end" }}>
                <TextField
                  fullWidth
                  placeholder={t("pages.chat.typePlaceholder")}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  disabled={!wsConnected}
                  multiline
                  maxRows={4}
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 3,
                      backgroundColor: "background.default",
                      "& fieldset": {
                        borderColor: "divider",
                      },
                      "&:hover fieldset": {
                        borderColor: "primary.main",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "primary.main",
                      },
                    },
                  }}
                />
                <IconButton
                  onClick={handleSendMessage}
                  color="primary"
                  disabled={!wsConnected || !message.trim()}
                  sx={{
                    backgroundColor: "primary.main",
                    color: "primary.contrastText",
                    "&:hover": {
                      backgroundColor: "primary.dark",
                    },
                    "&.Mui-disabled": {
                      backgroundColor: "action.disabled",
                      color: "action.disabled",
                    },
                    width: 48,
                    height: 48,
                    mb: 0.5,
                  }}
                >
                  <SendIcon />
                </IconButton>
              </Box>
              {!wsConnected && (
                <Alert severity="warning" sx={{ mt: 1 }}>
                  {t("pages.chat.disconnected")}
                </Alert>
              )}
            </Paper>
          </>
        ) : (
          <Box
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="h6" color="text.secondary">
              {t("pages.chat.selectRoom")}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
