import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Divider,
  Avatar,
  Button,
} from "@mui/material";
import {
  Assignment,
  Notifications,
  Event,
  CheckCircle,
  Schedule,
  Person,
  ArrowForward,
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

  // Enrollment status - simplified to show only D+ days
  const [enrollmentStatus] = useState({
    daysRemaining: 15, // This can be calculated from a target date
  });

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
          taxios.get("/board/0/articles")
        ]);

        // Handle tasks
        if (tasksResponse.status === 'fulfilled') {
          const tasksData = tasksResponse.value.data || [];
          setTasks(tasksData);
          setTasksCount(tasksData.length);
        }

        // Handle notices
        if (noticesResponse.status === 'fulfilled') {
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
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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
        <Typography>로딩 중...</Typography>
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
          borderBottom: { xs: "1px solid #e0e0e0", md: "none" }
        }}
      >
        <Box className="p-6">
          {/* Profile Section */}
          <Box className="flex flex-col items-center mb-6">
            {user && (
              <>
                <Avatar
                  src={user?.profilePicture || null}
                  sx={{ width: 100, height: 100, mb: 2 }}
                >
                  <Person sx={{ fontSize: 40 }} />
                </Avatar>
                <Typography
                  variant="h6"
                  className="font-semibold text-center"
                >
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
                    Pending Tasks
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
                    New Notices
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
          Dashboard
        </Typography>

        {/* Main Dashboard Content */}
        <Box 
          className="flex flex-col xl:flex-row gap-6"
          sx={{ 
            display: 'flex',
            flexDirection: { xs: 'column', xl: 'row' },
            gap: 3,
            width: '100%'
          }}
        >
          {/* Left Side */}
          <Box 
            className="flex-1 min-w-0"
            sx={{ 
              flex: { xs: '1 1 auto', xl: '1 1 50%' },
              minWidth: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: 2
            }}
          >
            {/* Enrollment Status - Simplified */}
            <Paper elevation={3}>
              <CardHeader
                avatar={<Event color="primary" />}
                title="Enrollment Status"
                subheader={`${formatDaysRemaining(
                  enrollmentStatus.daysRemaining
                )} days remaining`}
              />
              <CardContent>
                <Typography variant="body1" color="text.secondary">
                  Have a good day.
                </Typography>
              </CardContent>
            </Paper>

            {/* Tasks List - Similar to MyPageMainPage */}
            <Paper elevation={3}>
              <CardHeader
                avatar={<Assignment color="primary" />}
                title="My Tasks"
                subheader={`${tasksCount} pending tasks`}
                action={
                  <Button
                    size="small"
                    endIcon={<ArrowForward />}
                    onClick={() => navigate("/my/tasks")}
                  >
                    모두 보기
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
                          <Typography variant="subtitle2" className="font-medium">
                            {task.title || task.name}
                          </Typography>
                          <Chip
                            label={task.status || "진행중"}
                            size="small"
                            color={getStatusColor(task.status || "진행중")}
                            variant="outlined"
                          />
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          마감일: {formatDate(task.dueDate)}
                        </Typography>
                        {task.score !== undefined && task.maxScore !== undefined && (
                          <Typography variant="caption" color="text.secondary" className="ml-2">
                            점수: {task.score}/{task.maxScore}
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
                      등록된 과제가 없습니다.
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
              flex: { xs: '1 1 auto', xl: '1 1 50%' },
              minWidth: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: 2
            }}
          >
            {/* Latest Notices - From API */}
            <Paper elevation={3}>
              <CardHeader
                avatar={<Notifications color="primary" />}
                title="Latest Notices"
                subheader={`${noticesCount} recent announcements`}
              />
              <CardContent className="pt-0">
                <List>
                  {notices.map((notice, index) => (
                    <div key={notice.id}>
                      <ListItem className="px-0 py-3">
                        <ListItemText
                          primary={
                            <Typography
                              variant="body1"
                              className="font-medium mb-1"
                            >
                              {notice.title}
                            </Typography>
                          }
                          secondary={
                            <span>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                className="mb-1 block"
                              >
                                {notice.content?.slice(0, 100) || ""}
                                {notice.content?.length > 100 && "..."}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                className="block"
                              >
                                {formatDate(notice.createdAt || notice.date)}
                              </Typography>
                            </span>
                          }
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
                      공지사항이 없습니다.
                    </Typography>
                  )}
                </List>
              </CardContent>
            </Paper>

            {/* Calendar - Remains as mockup */}
            <Paper elevation={3}>
              <CardHeader
                avatar={<Event color="primary" />}
                title="Upcoming Events"
                subheader="Important dates and deadlines"
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
                          primary={
                            <Typography variant="body1" className="font-medium">
                              {event.title}
                            </Typography>
                          }
                          secondary={
                            <span className="flex justify-between items-center">
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {new Date(event.date).toLocaleDateString(
                                  "en-US",
                                  {
                                    weekday: "short",
                                    month: "short",
                                    day: "numeric",
                                  }
                                )}
                              </Typography>
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
                            </span>
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
