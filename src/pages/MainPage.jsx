import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import {
  ArrowForward,
  Assignment,
  Event,
  Notifications,
  Person,
} from "@mui/icons-material";
import useAuth from "../hooks/useAuth";
import taxios from "../utils/taxios";
import { useNavigate } from "react-router";

export default function MainPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [notices, setNotices] = useState([]);
  const [tasksCount, setTasksCount] = useState(0);
  const [noticesCount, setNoticesCount] = useState(0);

  // Calendar events remain as mockup
  const [calendarEvents] = useState([
    { date: "2025-09-10", title: "Document Submission", type: "deadline" },
    { date: "2025-09-12", title: "Orientation", type: "meeting" },
    { date: "2025-09-15", title: "Health Check", type: "appointment" },
    { date: "2025-09-20", title: "Registration Deadline", type: "deadline" },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all data in parallel
        const [tasksResponse, noticesResponse] = await Promise.allSettled([
          taxios.get("/task/my"),
          taxios.get("/board/0/articles"),
        ]);

        // Handle tasks
        if (tasksResponse.status === "fulfilled") {
          const tasksData = tasksResponse.value.data || [];
          setTasks(tasksData);
          setTasksCount(tasksData.filter((task) => !task.score).length);
        }

        // Handle notices
        if (noticesResponse.status === "fulfilled") {
          const noticesData = noticesResponse.value.data.data || [];
          setNotices(noticesData);
          setNoticesCount(noticesData.length);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "완료":
      case "COMPLETED":
      case "completed":
        return "success";
      case "진행중":
      case "IN_PROGRESS":
      case "in_progress":
        return "primary";
      case "대기":
      case "PENDING":
      case "pending":
        return "warning";
      case "지연":
      case "OVERDUE":
      case "overdue":
        return "error";
      default:
        return "default";
    }
  };

  const formatDate = (dateString) => {
    return dateString.replace("T", " ");
  };

  const formatDaysRemaining = (days) => {
    if (days > 0) {
      return `D+${days}`;
    } else if (days === 0) {
      return "D-Day";
    } else {
      return `D${days}`;
    }
  };

  const handleTaskClick = (taskId) => {
    navigate(`/task/${taskId}`);
  };

  if (loading) {
    return (
      <Box className="flex justify-center items-center min-h-96">
        <Typography>{t("common.loading")}</Typography>
      </Box>
    );
  }

  return (
    <Box className="flex flex-col md:flex-row w-full min-h-screen bg-gray-50">
      <title>{t("pages.main.title")}</title>

      {/* Sidebar */}
      <Paper
        elevation={1}
        className="w-full md:w-80 bg-white"
        sx={{
          borderRadius: 0,
          borderRight: { md: "1px solid #e0e0e0" },
          borderBottom: { xs: "1px solid #e0e0e0", md: "none" },
        }}
      >
        <Box className="p-6">
          {/* Profile Section */}
          <Box className="flex flex-col items-center mb-6">
            {user && (
              <>
                <Avatar
                  src={
                    `${import.meta.env.VITE_API_BASE_URL}/files/${
                      user?.profileFileId
                    }/download` || null
                  }
                  sx={{ width: 100, height: 100, mb: 2 }}
                >
                  <Person sx={{ fontSize: 40 }} />
                </Avatar>
                <Typography variant="h6" className="font-semibold text-center">
                  {user?.name || "User"}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  className="text-center"
                >
                  {user?.email}
                </Typography>
              </>
            )}
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Dashboard Stats */}
          <Box className="space-y-3">
            <Paper className="p-3 bg-orange-50" elevation={0}>
              <Box className="flex items-center justify-between">
                <Box className="flex items-center">
                  <Assignment color="warning" className="mr-2" />
                  <Typography variant="body2" className="font-medium">
                    {t("common.pendingTasks")}
                  </Typography>
                </Box>
                <Typography variant="h6" color="warning">
                  {tasksCount}
                </Typography>
              </Box>
            </Paper>

            <Paper className="p-3 bg-green-50" elevation={0}>
              <Box className="flex items-center justify-between">
                <Box className="flex items-center">
                  <Notifications color="success" className="mr-2" />
                  <Typography variant="body2" className="font-medium">
                    {t("common.notices")}
                  </Typography>
                </Box>
                <Typography variant="h6" color="success">
                  {noticesCount}
                </Typography>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Paper>

      {/* Main Content */}
      <Box className="flex-1 p-6">
        <Typography variant="h4" className="font-bold text-gray-800 mb-6">
          {t("common.dashboard")}
        </Typography>

        {/* Main Dashboard Content */}
        <Box
          className="flex flex-col xl:flex-row gap-6"
          sx={{
            display: "flex",
            flexDirection: { xs: "column", xl: "row" },
            gap: 3,
            width: "100%",
          }}
        >
          {/* Left Side */}
          <Box
            className="flex-1 min-w-0"
            sx={{
              flex: { xs: "1 1 auto", xl: "1 1 50%" },
              minWidth: 0,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {/* Enrollment Status - Simplified */}
            <Paper elevation={3}>
              <CardHeader
                avatar={<Event color="primary" />}
                title={t("Welcome")}
                subheader={`Since ${user.createdAt.split("T")[0]}`}
              />
              <CardContent>
                <Typography variant="body1" color="text.secondary">
                  {t("common.haveGoodDay")}
                </Typography>
              </CardContent>
            </Paper>

            {/* Tasks List - Similar to MyPageMainPage */}
            <Paper elevation={3}>
              <CardHeader
                avatar={<Assignment color="primary" />}
                title={t("common.myTasks")}
                subheader={t("common.pendingTasksCount", { count: tasksCount })}
                action={
                  <Button
                    size="small"
                    endIcon={<ArrowForward />}
                    onClick={() => navigate("/my/tasks")}
                  >
                    {t("common.viewAll")}
                  </Button>
                }
              />
              <CardContent className="pt-0">
                <Box className="space-y-3">
                  {tasks.map((task) => (
                    <Card
                      key={task.id}
                      variant="outlined"
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => handleTaskClick(task.id)}
                    >
                      <CardContent className="pb-2">
                        <Box className="flex justify-between items-start mb-2">
                          <Typography
                            variant="subtitle2"
                            className="font-medium"
                          >
                            {task.title || task.name}
                          </Typography>
                          <Chip
                            label={
                              task.score
                                ? t("common.completed")
                                : t("common.inProgress")
                            }
                            size="small"
                            color={getStatusColor(
                              task.score ? "completed" : "inProgress"
                            )}
                            variant="outlined"
                          />
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          {t("common.deadline")}: {formatDate(task.dueDate)}
                        </Typography>
                        {task.score !== undefined &&
                          task.maxScore !== undefined && (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              className="ml-2"
                            >
                              {t("common.score")}: {task.score}/{task.maxScore}
                            </Typography>
                          )}
                      </CardContent>
                    </Card>
                  ))}

                  {tasks.length === 0 && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      className="text-center py-4"
                    >
                      {t("common.noTasksRegistered")}
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Paper>
          </Box>

          {/* Right Side */}
          <Box
            className="flex-1 min-w-0"
            sx={{
              flex: { xs: "1 1 auto", xl: "1 1 50%" },
              minWidth: 0,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {/* Latest Notices - From API */}
            <Paper elevation={3}>
              <CardHeader
                avatar={<Notifications color="primary" />}
                title={t("common.latestNotices")}
                subheader={`${noticesCount} ${t("common.announcements")}`}
              />
              <CardContent className="pt-0">
                <List>
                  {notices.map((notice, index) => (
                    <div key={notice.id}>
                      <ListItem
                        className="px-0 py-3 cursor-pointer hover:bg-gray-50 transition-colors rounded"
                        onClick={() => navigate(`/board/view/${notice.id}`)}
                      >
                        <ListItemText
                          primary={notice.title}
                          secondary={`${notice.content?.slice(0, 100) || ""}${
                            notice.content?.length > 100 ? "..." : ""
                          } • ${formatDate(notice.createdAt || notice.date)}`}
                          primaryTypographyProps={{
                            variant: "body1",
                            className: "font-medium mb-1",
                          }}
                          secondaryTypographyProps={{
                            variant: "body2",
                            color: "text.secondary",
                          }}
                        />
                      </ListItem>
                      {index < notices.slice(0, 3).length - 1 && <Divider />}
                    </div>
                  ))}
                  {notices.length === 0 && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      className="text-center py-4"
                    >
                      {t("common.noNoticesAvailable")}
                    </Typography>
                  )}
                </List>
              </CardContent>
            </Paper>

            {/* Calendar - Remains as mockup */}
            <Paper elevation={3}>
              <CardHeader
                avatar={<Event color="primary" />}
                title={t("common.upcomingEvents")}
                subheader={t("pages.main.dashboard.importantDates")}
              />
              <CardContent className="pt-0">
                <List>
                  {calendarEvents.map((event, index) => (
                    <div key={index}>
                      <ListItem className="px-0">
                        <ListItemIcon>
                          <Avatar
                            className={`w-8 h-8 text-xs ${
                              event.type === "deadline"
                                ? "bg-red-100 text-red-600"
                                : event.type === "meeting"
                                ? "bg-blue-100 text-blue-600"
                                : "bg-green-100 text-green-600"
                            }`}
                          >
                            {new Date(event.date).getDate()}
                          </Avatar>
                        </ListItemIcon>
                        <ListItemText
                          primary={event.title}
                          secondary={new Date(event.date).toLocaleDateString(
                            "en-US",
                            {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                          primaryTypographyProps={{
                            variant: "body1",
                            className: "font-medium",
                          }}
                          secondaryTypographyProps={{
                            variant: "body2",
                            color: "text.secondary",
                          }}
                        />
                        <Chip
                          label={event.type}
                          size="small"
                          variant="outlined"
                          color={
                            event.type === "deadline"
                              ? "error"
                              : event.type === "meeting"
                              ? "primary"
                              : "success"
                          }
                        />
                      </ListItem>
                      {index < calendarEvents.length - 1 && <Divider />}
                    </div>
                  ))}
                </List>
              </CardContent>
            </Paper>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
