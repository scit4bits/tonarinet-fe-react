import {
  Assignment,
  Business,
  Group,
  Groups,
  Person,
  Psychology,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Outlet } from "react-router";
import { getMe } from "../utils/user";

export default function MyPageLayout() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const sidebarMenuItems = [
    {
      key: "my-profile",
      label: "대시보드",
      icon: <Person />,
      path: "/my",
    },
    {
      key: "my-organization",
      label: "내 조직",
      icon: <Business />,
      path: "/my/org",
    },
    { key: "my-team", label: "내 팀", icon: <Group />, path: "/my/team" },
    { key: "my-party", label: "내 파티", icon: <Groups />, path: "/my/party" },
    {
      key: "my-tasks",
      label: "내 과제",
      icon: <Assignment />,
      path: "/my/tasks",
    },
    {
      key: "my-counsels",
      label: "내 상담",
      icon: <Psychology />,
      path: "/my/counsels",
    },
  ];

  const handleMenuClick = (path) => {
    window.location.href = path;
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getMe();
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <Box className="flex w-full min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Paper
        elevation={1}
        className="w-80 bg-white"
        sx={{ borderRadius: 0, borderRight: "1px solid #e0e0e0" }}
      >
        <Box className="p-6">
          {/* Profile Picture and Basic Info */}
          <Box className="flex flex-col items-center mb-6">
            <Avatar
              src={user?.profilePicture || null}
              sx={{ width: 100, height: 100, mb: 2 }}
            >
              <Person sx={{ fontSize: 40 }} />
            </Avatar>
            <Typography variant="h6" className="font-semibold text-center">
              {user?.name || "사용자"}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              className="text-center"
            >
              {user?.email}
            </Typography>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Menu Items */}
          <List disablePadding>
            {sidebarMenuItems.map((item) => (
              <ListItemButton
                key={item.key}
                onClick={() => handleMenuClick(item.path)}
                sx={{
                  borderRadius: 1,
                  mb: 1,
                  "&:hover": { backgroundColor: "action.hover" },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ fontSize: "0.95rem" }}
                />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Paper>

      <Outlet />
    </Box>
  );
}
