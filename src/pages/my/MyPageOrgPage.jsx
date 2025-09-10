import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Stack,
  Typography,
  Button,
  Chip,
  CircularProgress,
  Container,
  Grid,
  Avatar,
} from "@mui/material";
import {
  Business,
  LocationOn,
  People,
  ExitToApp,
  Settings,
} from "@mui/icons-material";
import taxios from "../../utils/taxios";
import useOrganizationList from "../../hooks/useOrganizationList";
import { getMyOrganizations } from "../../utils/organization";

export default function MyPageOrgPage() {
  const [loading, setLoading] = useState(true);
  const [organizations, setOrganizations] = useState([]);

  useEffect(() => {
    getMyOrganizations().then((data) => {
      setOrganizations({ data: data || [] });
      setLoading(false);
    });
  }, []);

  const handleLeaveOrganization = async (orgId) => {
    if (window.confirm("정말로 이 조직을 떠나시겠습니까?")) {
      try {
        await taxios.post(`/organization/leave?organizationId=${orgId}`);
        setOrganizations(organizations.filter((org) => org.id !== orgId));
        alert("조직에서 성공적으로 탈퇴했습니다.");
      } catch (error) {
        console.error("Failed to leave organization:", error);
        alert("조직 탈퇴 중 오류가 발생했습니다.");
      }
    }
  };

  const getOrgTypeLabel = (type) => {
    const types = {
      COMPANY: "회사",
      SCHOOL: "학교",
    };
    return types[type] || type;
  };

  const getOrgTypeColor = (type) => {
    const colors = {
      COMPANY: "primary",
      SCHOOL: "secondary",
    };
    return colors[type] || "default";
  };

  const getRoleLabel = (role) => {
    const roles = {
      admin: "관리자",
      user: "유저",
    };
    return roles[role] || role;
  };

  const getRoleColor = (role) => {
    const colors = {
      admin: "error",
      user: "default",
    };
    return colors[role] || "default";
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
        sx={{ flexGrow: 1 }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
          내 조직
        </Typography>

        {organizations.data.length === 0 ? (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="300px"
            sx={{ textAlign: "center" }}
          >
            <Business sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              가입한 조직이 없습니다
            </Typography>
            <Typography variant="body2" color="text.secondary">
              새로운 조직을 검색하고 가입해보세요!
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {organizations.data.map((org) => (
              <Grid key={org.id} xs={12} sm={6} md={4}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: (theme) => theme.shadows[8],
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      gap={3}
                      mb={2}
                    >
                      <Avatar sx={{ bgcolor: "primary.main" }}>
                        <Business />
                      </Avatar>
                      <Stack direction="row" spacing={1}>
                        <Chip
                          label={getOrgTypeLabel(org.type)}
                          color={getOrgTypeColor(org.type)}
                          size="small"
                          variant="outlined"
                        />
                      </Stack>
                    </Box>

                    <Typography variant="h6" component="h2" gutterBottom>
                      {org.name}
                    </Typography>

                    {org.description && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 2,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {org.description}
                      </Typography>
                    )}

                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      gap={2}
                    >
                      {org.countryCode && (
                        <Box display="flex" alignItems="center" gap={0.5}>
                          <LocationOn
                            sx={{ fontSize: 16, color: "text.secondary" }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {org.countryCode}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </CardContent>

                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Stack direction="row" spacing={1} sx={{ width: "100%" }}>
                      {org.role === "admin" && (
                        <Button
                          startIcon={<Settings />}
                          variant="contained"
                          size="small"
                          sx={{ flexGrow: 1 }}
                          onClick={()=>{window.location.href=`/orgadmin/${org.id}`}}
                        >
                          관리
                        </Button>
                      )}
                    </Stack>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}
