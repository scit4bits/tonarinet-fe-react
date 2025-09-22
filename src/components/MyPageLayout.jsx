import {
  Assignment,
  Business,
  Group,
  Groups,
  Person,
  Psychology,
  CameraAlt,
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
  IconButton,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Outlet } from "react-router";
import { getMe } from "../utils/user";
import taxios from "../utils/taxios";

export default function MyPageLayout() {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const sidebarMenuItems = [
    {
      key: "my-profile",
      label: t("sidebar.dashboard"),
      icon: <Person />,
      path: "/my",
    },
    {
      key: "my-organization",
      label: t("sidebar.myOrganization"),
      icon: <Business />,
      path: "/my/org",
    },
    {
      key: "my-team",
      label: t("sidebar.myTeam"),
      icon: <Group />,
      path: "/my/team",
    },
    {
      key: "my-party",
      label: t("sidebar.myParty"),
      icon: <Groups />,
      path: "/my/party",
    },
    {
      key: "my-tasks",
      label: t("sidebar.myTasks"),
      icon: <Assignment />,
      path: "/my/tasks",
    },
    {
      key: "my-counsels",
      label: t("sidebar.myCounsel"),
      icon: <Psychology />,
      path: "/my/counsels",
    },
  ];

  const handleMenuClick = (path) => {
    window.location.href = path;
  };

  const handleAvatarClick = async () => {
    // Create file input programmatically
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";

    fileInput.onchange = async (event) => {
      const file = event.target.files[0];
      if (!file) return;

      try {
        // Create FormData for file upload
        const formData = new FormData();
        formData.append("files", file);

        const jsonPayload = {
          isPrivate: false,
          type: "IMAGE",
        };
        const blobPayload = new Blob([JSON.stringify(jsonPayload)], {
          type: "application/json",
        });
        formData.append("metadata", blobPayload);

        // Upload file to /api/files/upload
        const uploadResponse = await taxios.post("/files/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        // Get the fileId from the response (assuming it's an array with one element)
        const uploadedFiles = uploadResponse.data;
        if (uploadedFiles && uploadedFiles.length > 0) {
          const fileId = uploadedFiles[0].id;

          // Submit fileId to change profile image
          await taxios.post(`/user/change-profile-image?fileId=${fileId}`);

          // Refresh user data
          const userData = await getMe();
          setUser(userData);
        }
      } catch (error) {
        console.error("Failed to upload profile image:", error);
      }
    };

    // Trigger file input click
    fileInput.click();
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
            <Box sx={{ position: "relative", display: "inline-block" }}>
              <Avatar
                src={
                  user?.profileFileId
                    ? `${import.meta.env.VITE_API_BASE_URL}/files/${
                        user?.profileFileId
                      }/download`
                    : null
                }
                sx={{
                  width: 100,
                  height: 100,
                  mb: 2,
                  cursor: "pointer",
                  "&:hover": {
                    opacity: 0.8,
                  },
                }}
                onClick={handleAvatarClick}
              >
                <Person sx={{ fontSize: 40 }} />
              </Avatar>
              <IconButton
                sx={{
                  position: "absolute",
                  bottom: 8,
                  right: 0,
                  width: 32,
                  height: 32,
                  backgroundColor: "primary.main",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "primary.dark",
                  },
                  boxShadow: 2,
                }}
                onClick={handleAvatarClick}
                size="small"
              >
                <CameraAlt sx={{ fontSize: 16 }} />
              </IconButton>
            </Box>
            <Typography variant="h6" className="font-semibold text-center">
              {user?.name || t("sidebar.user")}
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
