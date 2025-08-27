import React, { useState } from "react";

import {
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Box,
  Badge,
  Avatar,
} from "@mui/material";

import {
  Notifications as NotificationsIcon,
  Circle as CircleIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router";

const Notification = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const open = Boolean(anchorEl);

  // Sample notification data
  const notifications = [
    {
      id: 1,
      icon: <CircleIcon color="primary" />,
      title: "New Message",
      description: "You have received a new message from John",
      url: "/messages/123",
    },
    {
      id: 2,
      icon: <CircleIcon color="warning" />,
      title: "System Update",
      description: "System maintenance scheduled for tonight",
      url: "/system/updates",
    },
    {
      id: 3,
      icon: <CircleIcon color="error" />,
      title: "Alert",
      description: "Your subscription expires in 3 days",
      url: "/billing",
    },
  ];

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (url) => {
    navigate(url);
    handleClose();
  };

  return (
    <>
      <IconButton onClick={handleClick} size="large" aria-label="notifications">
        <Badge badgeContent={notifications.length} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          sx: {
            maxHeight: 600,
            maxWidth: 500,
            overflow: "auto",
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {notifications.map((notification) => (
          <MenuItem
            key={notification.id}
            onClick={() => handleNotificationClick(notification.url)}
            sx={{ py: 2 }}
          >
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
              <Avatar sx={{ width: 24, height: 24 }}>
                {notification.icon}
              </Avatar>
              <Box>
                <Typography variant="subtitle2" fontWeight="bold">
                  {notification.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {notification.description}
                </Typography>
              </Box>
            </Box>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default Notification;
