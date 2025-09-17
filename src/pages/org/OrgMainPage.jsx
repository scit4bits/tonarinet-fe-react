import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router";
import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  Typography,
  Avatar,
  Grid,
  CircularProgress,
} from "@mui/material";
import { Announcement, Forum, Groups, Person } from "@mui/icons-material";
import Flag from "react-world-flags";
import { getOrganizationById } from "../../utils/organization";
import { getTeamByOrgId } from "../../utils/team";
import { searchArticles } from "../../utils/board";

// Function to strip HTML tags from text
const stripHtmlTags = (html) => {
  if (!html) return "";
  const tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
};

export default function OrgMainPage() {
  const { t } = useTranslation();
  const { orgId } = useParams();

  const [organization, setOrganization] = useState(null);
  const [notices, setNotices] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch organization data
        const orgData = await getOrganizationById(orgId);
        if (!orgData) {
          setError(t("pages.organization.main.organizationNotFound"));
          return;
        }
        setOrganization(orgData);

        // Fetch notices from board
        if (orgData.boardId) {
          const noticesData = await searchArticles(
            orgData.boardId,
            "notice",
            "all",
            "",
            0,
            10
          );
          if (noticesData?.data) {
            setNotices(noticesData.data);
          }
        }

        // Fetch teams
        const teamsData = await getTeamByOrgId(orgId);
        if (teamsData) {
          setTeams(teamsData);
        }
      } catch (err) {
        console.error("Error fetching organization data:", err);
        setError(t("pages.organization.main.failedToLoadData"));
      } finally {
        setLoading(false);
      }
    };

    if (orgId) {
      fetchData();
    }
  }, [orgId]);

  if (loading) {
    return (
      <Box className="w-full p-6 flex justify-center items-center min-h-96">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !organization) {
    return (
      <Box className="w-full p-6 flex justify-center items-center min-h-96">
        <Typography variant="h6" color="error">
          {error || t("pages.organization.main.organizationNotFound")}
        </Typography>
      </Box>
    );
  }

  return (
    <Box className="w-full p-6 space-y-6">
      <title>
        {t("pages.organization.main.title", { orgName: organization.name })}
      </title>

      {/* Top Information Section */}
      <Card className="w-full">
        <CardContent className="p-6">
          <Box className="flex flex-col md:flex-row gap-6">
            {/* Organization Flag and Basic Info */}
            <Box className="flex flex-col items-center">
              <Box className="w-24 flex items-center justify-center flex-col">
                <Flag
                  code={organization.countryCode}
                  style={{ height: "100%" }}
                />
                <Chip
                  label={organization.type}
                  variant="outlined"
                  size="small"
                  className="mt-2 mb-2"
                />
              </Box>
            </Box>

            {/* Organization Details */}
            <Box className="flex-1 flex flex-col justify-center">
              <Box>
                <Typography
                  variant="h4"
                  component="h1"
                  className="font-bold mb-2"
                >
                  {organization.name}
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  className="mb-4"
                >
                  {organization.description}
                </Typography>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Notices and Teams Row */}
      <Grid container spacing={3}>
        {/* Notice Section */}
        <Grid item size={6}>
          <Card className="w-full" style={{ height: "100%" }}>
            <CardContent className="p-6 h-full flex flex-col">
              <Box className="flex items-center justify-between mb-4">
                <Typography
                  variant="h5"
                  component="h2"
                  className="font-semibold flex items-center gap-2"
                >
                  <Announcement color="primary" />
                  {t("pages.organization.main.noticesAndAnnouncements")}
                </Typography>
                {organization.boardId && (
                  <Button
                    variant="outlined"
                    size="small"
                    component={Link}
                    to={`/board/${organization.boardId}?category=notice`}
                  >
                    {t("pages.organization.main.viewAll")}
                  </Button>
                )}
              </Box>

              <Box className="flex-1">
                {notices.length > 0 ? (
                  <List className="space-y-2">
                    {notices.map((notice, index) => (
                      <Box
                        key={notice.id}
                        component={Link}
                        to={`/board/view/${notice.id}`}
                        sx={{
                          textDecoration: "none",
                          color: "inherit",
                          display: "block",
                          "&:hover": {
                            backgroundColor: "action.hover",
                            cursor: "pointer",
                          },
                        }}
                      >
                        <ListItem className="px-0 items-start">
                          <ListItemIcon>
                            <Announcement color="action" />
                          </ListItemIcon>
                          <Box className="flex-1">
                            <Typography
                              variant="body1"
                              className="font-medium mb-1"
                            >
                              {notice.title}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              className="mb-1"
                              sx={{
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                              }}
                            >
                              {stripHtmlTags(notice.contents)}
                            </Typography>
                            <Box className="flex items-center gap-2">
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {new Date(
                                  notice.createdAt
                                ).toLocaleDateString()}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {t("pages.organization.main.by")}{" "}
                                {notice.createdByName}
                              </Typography>
                            </Box>
                          </Box>
                        </ListItem>
                        {index < notices.length - 1 && <Divider />}
                      </Box>
                    ))}
                  </List>
                ) : (
                  <Box className="flex-1 flex items-center justify-center">
                    <Typography variant="body2" color="text.secondary">
                      {t("pages.organization.main.noNoticesAvailable")}
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Teams Section */}
        <Grid item size={6}>
          <Card className="w-full" style={{ height: "100%" }}>
            <CardContent className="p-6 h-full flex flex-col">
              <Typography
                variant="h5"
                component="h2"
                className="font-semibold flex items-center gap-2 mb-4"
              >
                <Groups color="primary" />
                {t("pages.organization.main.teams")}
              </Typography>

              <Box className="flex-1">
                {teams.length > 0 ? (
                  <Box className="space-y-3">
                    {teams.map((team) => (
                      <Card key={team.id} variant="outlined" className="p-3">
                        <Box className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <Groups />
                          </Avatar>
                          <Box className="flex-1">
                            <Typography variant="body1" className="font-medium">
                              {team.name}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {team.userCount}{" "}
                              {team.userCount === 1
                                ? t("pages.organization.main.member")
                                : t("pages.organization.main.members")}
                            </Typography>
                          </Box>
                        </Box>
                      </Card>
                    ))}
                  </Box>
                ) : (
                  <Box className="flex-1 flex items-center justify-center">
                    <Typography variant="body2" color="text.secondary">
                      {t("pages.organization.main.noTeamsAvailable")}
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Board Link Section */}
      <Card className="w-full">
        <CardContent className="p-6">
          <Box className="flex items-center justify-between">
            <Box>
              <Typography
                variant="h5"
                component="h2"
                className="font-semibold flex items-center gap-2 mb-2"
              >
                <Forum color="primary" />
                {t("pages.organization.main.communityBoard")}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t("pages.organization.main.joinDiscussions")}
              </Typography>
            </Box>
            {organization.boardId && (
              <Button
                variant="contained"
                component={Link}
                to={`/board/${organization.boardId}`}
                size="large"
              >
                {t("pages.organization.main.visitBoard")}
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
