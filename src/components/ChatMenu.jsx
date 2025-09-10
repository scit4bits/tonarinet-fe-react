import React from "react";
import { IconButton, Badge } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import { useNavigate } from "react-router";

export default function ChatMenu({ badgeCount = 0 }) {
  const navigate = useNavigate();

  const handleChatClick = () => {
    navigate("/chat");
  };

  return (
    <IconButton onClick={handleChatClick}>
      <Badge badgeContent={badgeCount} color="error">
        <ChatIcon />
      </Badge>
    </IconButton>
  );
}
