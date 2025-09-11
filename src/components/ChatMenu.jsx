import React, { useEffect, useState } from "react";
import { IconButton, Badge } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import { useNavigate } from "react-router";
import taxios from "../utils/taxios";

export default function ChatMenu() {
  const [badgeCount, setBadgeCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchBadgeCount() {
      try {
        const response = await taxios.get("/chatroom/unreadCount");
        setBadgeCount(response.data || 0);
      } catch (error) {
        console.error("Error fetching chat badge count:", error);
      }
    }

    fetchBadgeCount();
  }, []);

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
