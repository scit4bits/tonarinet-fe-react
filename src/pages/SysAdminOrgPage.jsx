import React from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  AvatarGroup,
  Box,
} from "@mui/material";

export default function SysAdminOrgPage() {
  const mockGroups = [
    {
      id: 1,
      title: "Development Team",
      description: "Fros workinures",
      members: [
        { id: 1, name: "John Doe", avatar: "/avatars/john.jpg" },
        { id: 2, name: "Jane Smith", avatar: "/avatars/jane.jpg" },
        { id: 3, name: "Bob Wilson", avatar: "/avatars/bob.jpg" },
        { id: 4, name: "Alice Brown", avatar: "/avatars/alice.jpg" },
      ],
    },
    {
      id: 2,
      title: "Development Team",
      description: "Frons work features",
      members: [
        { id: 1, name: "John Doe", avatar: "/avatars/john.jpg" },
        { id: 2, name: "Jane Smith", avatar: "/avatars/jane.jpg" },
        { id: 3, name: "Bob Wilson", avatar: "/avatars/bob.jpg" },
        { id: 4, name: "Alice Brown", avatar: "/avatars/alice.jpg" },
      ],
    },
    {
      id: 3,
      title: "Development Team",
      description: "Frotures",
      members: [
        { id: 1, name: "John Doe", avatar: "/avatars/john.jpg" },
        { id: 2, name: "Jane Smith", avatar: "/avatars/jane.jpg" },
        { id: 3, name: "Bob Wilson", avatar: "/avatars/bob.jpg" },
        { id: 4, name: "Alice Brown", avatar: "/avatars/alice.jpg" },
      ],
    },
    {
      id: 4,
      title: "Development Team",
      description: "Fron on core features",
      members: [
        { id: 1, name: "John Doe", avatar: "/avatars/john.jpg" },
        { id: 2, name: "Jane Smith", avatar: "/avatars/jane.jpg" },
        { id: 3, name: "Bob Wilson", avatar: "/avatars/bob.jpg" },
        { id: 4, name: "Alice Brown", avatar: "/avatars/alice.jpg" },
      ],
    },
    {
      id: 5,
      title: "Development Team",
      description: "Frg on core features",
      members: [
        { id: 1, name: "John Doe", avatar: "/avatars/john.jpg" },
        { id: 2, name: "Jane Smith", avatar: "/avatars/jane.jpg" },
        { id: 3, name: "Bob Wilson", avatar: "/avatars/bob.jpg" },
        { id: 4, name: "Alice Brown", avatar: "/avatars/alice.jpg" },
      ],
    },
    {
      id: 6,
      title: "Development Team",
      description: "Frontend and backend developers weorking on core features",
      members: [
        { id: 1, name: "John Doe", avatar: "/avatars/john.jpg" },
        { id: 2, name: "Jane Smith", avatar: "/avatars/jane.jpg" },
        { id: 3, name: "Bob Wilson", avatar: "/avatars/bob.jpg" },
        { id: 4, name: "Alice Brown", avatar: "/avatars/alice.jpg" },
      ],
    },
    // Add more mock data as needed
  ];

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        조직 관리
      </Typography>
      <Grid container spacing={3}>
        {mockGroups.map((group) => (
          <Grid key={group.id}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                width: "300px",
              }}
              elevation={5}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="h2" gutterBottom>
                  {group.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  {group.description}
                </Typography>
                <AvatarGroup max={3} sx={{ justifyContent: "flex-start" }}>
                  {group.members.map((member) => (
                    <Avatar
                      key={member.id}
                      alt={member.name}
                      src={member.avatar}
                      sx={{ width: 32, height: 32 }}
                    />
                  ))}
                </AvatarGroup>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
