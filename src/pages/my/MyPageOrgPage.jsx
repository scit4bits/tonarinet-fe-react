import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { Business, LocationOn, Search, Settings } from "@mui/icons-material";
import taxios from "../../utils/taxios";
import { getMyOrganizations } from "../../utils/organization";

export default function MyPageOrgPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [organizations, setOrganizations] = useState([]);

  useEffect(() => {
    getMyOrganizations().then((data) => {
      setOrganizations({ data: data || [] });
      setLoading(false);
    });
  }, []);

  const handleLeaveOrganization = async (orgId) => {
    if (window.confirm(t("common.confirmLeaveOrganization"))) {
      try {
        await taxios.post(`/organization/leave?organizationId=${orgId}`);
        setOrganizations(organizations.filter((org) => org.id !== orgId));
        alert(t("common.successfullyLeftOrganization"));
      } catch (error) {
        console.error("Failed to leave organization:", error);
        alert(t("common.errorLeavingOrganization"));
      }
    }
  };

  const getOrgTypeLabel = (type) => {
    const types = {
      COMPANY: t("pages.myPage.organizationType.company"),
      SCHOOL: t("pages.myPage.organizationType.school"),
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
      admin: t("pages.myPage.role.admin"),
      user: t("pages.myPage.role.user"),
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
          {t("common.myOrganizations")}
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
              {t("common.noOrganizationsJoined")}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {t("common.searchAndJoinOrganizations")}
            </Typography>
            <Button
              variant="contained"
              startIcon={<Search />}
              onClick={() => navigate("/org/list")}
              sx={{ px: 3, py: 1 }}
            >
              {t("common.searchOrganizations")}
            </Button>
          </Box>
        ) : (
          <Box>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 3 }}
            >
              <Typography variant="h6" color="text.primary">
                {t("common.myOrganizations")}
              </Typography>
              <Button
                variant="outlined"
                startIcon={<Search />}
                onClick={() => navigate("/org/list")}
              >
                {t("common.searchOrganizations")}
              </Button>
            </Box>
            <Grid container spacing={3}>
              {organizations.data.map((org) => (
                <Grid key={org.id} xs={12} sm={6} md={4}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      opacity: org.isGranted === false ? 0.6 : 1,
                      backgroundColor:
                        org.isGranted === false
                          ? "action.disabled"
                          : "background.paper",
                      cursor:
                        org.isGranted === false ? "not-allowed" : "default",
                      "&:hover":
                        org.isGranted !== false
                          ? {
                              transform: "translateY(-4px)",
                              boxShadow: (theme) => theme.shadows[8],
                            }
                          : {},
                    }}
                    onClick={() => {
                      navigate(`/org/${org.id}`);
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
                        <Avatar
                          sx={{
                            bgcolor:
                              org.isGranted === false
                                ? "action.disabled"
                                : "primary.main",
                            color:
                              org.isGranted === false
                                ? "text.disabled"
                                : "white",
                          }}
                        >
                          <Business />
                        </Avatar>
                        <Stack direction="row" spacing={1}>
                          <Chip
                            label={getOrgTypeLabel(org.type)}
                            color={getOrgTypeColor(org.type)}
                            size="small"
                            variant="outlined"
                            disabled={org.isGranted === false}
                          />
                          {org.isGranted === false && (
                            <Chip
                              label={t("common.pendingApproval") || "Pending"}
                              color="warning"
                              size="small"
                              variant="outlined"
                            />
                          )}
                        </Stack>
                      </Box>

                      <Typography
                        variant="h6"
                        component="h2"
                        gutterBottom
                        sx={{
                          color:
                            org.isGranted === false
                              ? "text.disabled"
                              : "text.primary",
                        }}
                      >
                        {org.name}
                      </Typography>

                      {org.description && (
                        <Typography
                          variant="body2"
                          color={
                            org.isGranted === false
                              ? "text.disabled"
                              : "text.secondary"
                          }
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
                            <Typography
                              variant="caption"
                              color={
                                org.isGranted === false
                                  ? "text.disabled"
                                  : "text.secondary"
                              }
                            >
                              {org.countryCode}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </CardContent>

                    <CardActions sx={{ p: 2, pt: 0 }}>
                      <Stack direction="row" spacing={1} sx={{ width: "100%" }}>
                        {org.role === "admin" && org.isGranted !== false && (
                          <Button
                            startIcon={<Settings />}
                            variant="contained"
                            size="small"
                            sx={{ flexGrow: 1 }}
                            onClick={() => {
                              window.location.href = `/orgadmin/${org.id}`;
                            }}
                          >
                            {t("common.manage")}
                          </Button>
                        )}
                        {org.isGranted === false && (
                          <Typography
                            variant="caption"
                            color="text.disabled"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: "100%",
                              fontStyle: "italic",
                            }}
                          >
                            {t("common.awaitingApproval") ||
                              "Awaiting approval from organization admin"}
                          </Typography>
                        )}
                      </Stack>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Container>
    </Box>
  );
}
