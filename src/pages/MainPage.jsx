import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Divider,
  LinearProgress,
  Avatar,
} from "@mui/material";
import {
  Assignment,
  Notifications,
  Event,
  School,
  Group,
  CheckCircle,
  Schedule,
  TrendingUp,
  Person,
  Business,
} from "@mui/icons-material";
import useOrganizationList from "../hooks/useOrganizationList";
import useAuth from "../hooks/useAuth";
import { getMyOrganizations } from "../utils/organization";

export default function MainPage() {
  const { t } = useTranslation();
  const { user, loading: userLoading } = useAuth();
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrganization, setSelectedOrganization] = useState("");
  const [selectedOrgProfile, setSelectedOrgProfile] = useState(null);

  useEffect(() => {
    getMyOrganizations().then((data) => {
      setOrganizations(data);
      setLoading(false);
    });
  }, []);

  // Mock data for dashboard - replace with real API calls
  const [enrollmentStatus, setEnrollmentStatus] = useState({
    daysRemaining: 15,
    progress: 75,
    totalSteps: 8,
    completedSteps: 6,
    nextDeadline: "2025-09-15",
  });

  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Complete registration documents",
      priority: "high",
      dueDate: "2025-09-03",
      status: "pending",
    },
    {
      id: 2,
      title: "Attend orientation meeting",
      priority: "medium",
      dueDate: "2025-09-05",
      status: "in-progress",
    },
    {
      id: 3,
      title: "Submit health certificate",
      priority: "low",
      dueDate: "2025-09-10",
      status: "completed",
    },
  ]);

  const [notices, setNotices] = useState([
    {
      id: 1,
      title: "Welcome to the new semester",
      date: "2025-08-30",
      summary: "Important information about the upcoming semester...",
    },
    {
      id: 2,
      title: "Schedule changes for next week",
      date: "2025-08-28",
      summary: "Please note the following schedule modifications...",
    },
    {
      id: 3,
      title: "New facility guidelines",
      date: "2025-08-25",
      summary: "Updated guidelines for using campus facilities...",
    },
  ]);

  const [calendarEvents, setCalendarEvents] = useState([
    { date: "2025-09-03", title: "Document Submission", type: "deadline" },
    { date: "2025-09-05", title: "Orientation", type: "meeting" },
    { date: "2025-09-10", title: "Health Check", type: "appointment" },
    { date: "2025-09-15", title: "Registration Deadline", type: "deadline" },
  ]);

  const handleOrganizationChange = (event) => {
    const orgId = event.target.value;
    setSelectedOrganization(orgId);

    if (orgId) {
      const selectedOrg = organizations.find((org) => org.id === orgId);
      setSelectedOrgProfile(selectedOrg);
    } else {
      setSelectedOrgProfile(null);
    }

    // Here you would typically fetch data specific to the selected organization
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "error";
      case "medium":
        return "warning";
      case "low":
        return "success";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle color="success" />;
      case "in-progress":
        return <Schedule color="warning" />;
      default:
        return <Assignment color="action" />;
    }
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

  return (
    <Box className="flex w-full min-h-screen bg-gray-50">
      <title>{t("pages.main.title")}</title>

      {/* Sidebar */}
      <Paper
        elevation={1}
        className="w-80 bg-white"
        sx={{ borderRadius: 0, borderRight: "1px solid #e0e0e0" }}
      >
        <Box className="p-6">
          {/* Organization Selection at the top */}
          <Box className="mb-6">
            <FormControl fullWidth variant="outlined">
              <InputLabel id="organization-select-label">
                Select Organization
              </InputLabel>
              <Select
                labelId="organization-select-label"
                value={selectedOrganization}
                onChange={handleOrganizationChange}
                label="Select Organization"
                disabled={loading}
              >
                <MenuItem value="">
                  <em>Personal Dashboard</em>
                </MenuItem>
                {organizations.map((org) => (
                  <MenuItem key={org.id} value={org.id}>
                    {org.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Profile Section */}
          <Box className="flex flex-col items-center mb-6">
            {selectedOrgProfile ? (
              // Organization Profile
              <>
                <Avatar
                  src={selectedOrgProfile.logo || null}
                  sx={{ width: 100, height: 100, mb: 2 }}
                >
                  <Business sx={{ fontSize: 40 }} />
                </Avatar>
                <Typography variant="h6" className="font-semibold text-center">
                  {selectedOrgProfile.name}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  className="text-center"
                >
                  {selectedOrgProfile.description || "Organization"}
                </Typography>
                {selectedOrgProfile.memberCount && (
                  <Chip
                    icon={<Group />}
                    label={`${selectedOrgProfile.memberCount} members`}
                    size="small"
                    variant="outlined"
                    className="mt-2"
                  />
                )}
              </>
            ) : (
              // User Profile (Default)
              user && (
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
              )
            )}
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Dashboard Stats */}
          <Box className="space-y-3">
            <Paper className="p-3 bg-blue-50" elevation={0}>
              <Box className="flex items-center justify-between">
                <Box className="flex items-center">
                  <School color="primary" className="mr-2" />
                  <Typography variant="body2" className="font-medium">
                    Enrollment Progress
                  </Typography>
                </Box>
                <Typography variant="h6" color="primary">
                  {enrollmentStatus.progress}%
                </Typography>
              </Box>
            </Paper>

            <Paper className="p-3 bg-orange-50" elevation={0}>
              <Box className="flex items-center justify-between">
                <Box className="flex items-center">
                  <Assignment color="warning" className="mr-2" />
                  <Typography variant="body2" className="font-medium">
                    Pending Tasks
                  </Typography>
                </Box>
                <Typography variant="h6" color="warning">
                  {tasks.filter((task) => task.status !== "completed").length}
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
                  {notices.length}
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
        <Grid container spacing={3}>
          {/* Left Side */}
          <Grid item xs={12} lg={6}>
            {/* Enrollment Status */}
            <Paper className="mb-4" elevation={3}>
              <CardHeader
                avatar={<School color="primary" />}
                title="Enrollment Status"
                subheader={`${formatDaysRemaining(
                  enrollmentStatus.daysRemaining
                )} days remaining`}
              />
              <CardContent>
                <Box className="mb-4">
                  <Box className="flex justify-between items-center mb-2">
                    <Typography variant="body2" color="text.secondary">
                      Progress: {enrollmentStatus.completedSteps}/
                      {enrollmentStatus.totalSteps} steps completed
                    </Typography>
                    <Chip
                      label={`${enrollmentStatus.progress}%`}
                      color="primary"
                      size="small"
                    />
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={enrollmentStatus.progress}
                    className="h-2 rounded"
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Next deadline:{" "}
                  {new Date(enrollmentStatus.nextDeadline).toLocaleDateString()}
                </Typography>
              </CardContent>
            </Paper>

            {/* Tasks List */}
            <Paper elevation={3}>
              <CardHeader
                avatar={<Assignment color="primary" />}
                title="Tasks"
                subheader={`${
                  tasks.filter((task) => task.status !== "completed").length
                } pending tasks`}
              />
              <CardContent className="pt-0">
                <List>
                  {tasks.map((task, index) => (
                    <div key={task.id}>
                      <ListItem className="px-0">
                        <ListItemIcon>
                          {getStatusIcon(task.status)}
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box className="flex justify-between items-center">
                              <Typography
                                variant="body1"
                                className={
                                  task.status === "completed"
                                    ? "line-through text-gray-500"
                                    : ""
                                }
                              >
                                {task.title}
                              </Typography>
                              <Chip
                                label={task.priority}
                                color={getPriorityColor(task.priority)}
                                size="small"
                                variant="outlined"
                              />
                            </Box>
                          }
                          secondary={`Due: ${new Date(
                            task.dueDate
                          ).toLocaleDateString()}`}
                        />
                      </ListItem>
                      {index < tasks.length - 1 && <Divider />}
                    </div>
                  ))}
                </List>
              </CardContent>
            </Paper>
          </Grid>

          {/* Right Side */}
          <Grid item xs={12} lg={6}>
            {/* Latest Notices */}
            <Paper className="mb-4" elevation={3}>
              <CardHeader
                avatar={<Notifications color="primary" />}
                title="Latest Notices"
                subheader={`${notices.length} recent announcements`}
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
                            <Box>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                className="mb-1"
                              >
                                {notice.summary}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {new Date(notice.date).toLocaleDateString()}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < notices.length - 1 && <Divider />}
                    </div>
                  ))}
                </List>
              </CardContent>
            </Paper>

            {/* Calendar */}
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
                            <Box className="flex justify-between items-center">
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
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < calendarEvents.length - 1 && <Divider />}
                    </div>
                  ))}
                </List>
              </CardContent>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
