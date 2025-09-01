import React, { useEffect, useState } from "react";

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
import {
  getMyNotification,
  readAllNotification,
  readOneNotification,
} from "../utils/notification";

export default function NotificationMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const open = Boolean(anchorEl);

  // // Sample notification data
  // const notifications = [
  //   {
  //     id: 1,
  //     icon: <CircleIcon color="primary" />,
  //     title: "New Message",
  //     description: "You have received a new message from John",
  //     url: "/messages/123",
  //   },
  //   {
  //     id: 2,
  //     icon: <CircleIcon color="warning" />,
  //     title: "System Update",
  //     description: "System maintenance scheduled for tonight",
  //     url: "/system/updates",
  //   },
  //   {
  //     id: 3,
  //     icon: <CircleIcon color="error" />,
  //     title: "Alert",
  //     description: "Your subscription expires in 3 days",
  //     url: "/billing",
  //   },
  // ];

  const handleClick = async (event) => {
    const eventCapture = event.currentTarget; // capturing
    setNotifications(await getMyNotification());
    setAnchorEl(eventCapture);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = async (notiId, url) => {
    if (url) {
      window.location.href = url;
    }

    const result = await readOneNotification(notiId);
    if (result) {
      setNotifications(await getMyNotification());
    }

    handleClose();
  };

  const handleMarkAllAsRead = async () => {
    const result = await readAllNotification();
    if (result) {
      setNotifications(await getMyNotification());
    }
  };

  return (
    <>
      <IconButton onClick={handleClick} size="large" aria-label="notifications">
        <Badge
          badgeContent={notifications.filter((n) => !n.isRead).length}
          color="error"
        >
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
        disableScrollLock={true}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <MenuItem
              key={notification.id}
              onClick={() =>
                handleNotificationClick(notification.id, notification.link)
              }
              sx={{
                py: 2,
                opacity: notification.isRead ? 0.5 : 1,
                backgroundColor: notification.isRead
                  ? "rgba(0, 0, 0, 0.05)"
                  : "transparent",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                <Avatar sx={{ width: 24, height: 24 }} />
                <Box>
                  <Typography
                    variant="subtitle2"
                    fontWeight={notification.isRead ? "normal" : "bold"}
                    sx={{
                      color: notification.isRead
                        ? "text.secondary"
                        : "text.primary",
                    }}
                  >
                    {notification.contents}
                  </Typography>
                </Box>
              </Box>
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled>
            <Typography variant="body2" color="text.secondary">
              There is no notifications
            </Typography>
          </MenuItem>
        )}
        <MenuItem onClick={handleMarkAllAsRead}>
          <Typography variant="body1" color="text.primary">
            Mark all as read
          </Typography>
        </MenuItem>
      </Menu>
    </>
  );
}
