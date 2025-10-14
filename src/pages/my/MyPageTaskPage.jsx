import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n";
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import {
  Assignment,
  CalendarToday,
  Group,
  Person,
  Schedule,
  Score,
  Visibility,
} from "@mui/icons-material";
import taxios from "../../utils/taxios";

export default function MyPageTaskPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await taxios.get("/task/my");
      setTasks(response.data);
    } catch (err) {
      setError(err.response?.data?.message || t("common.failedToFetchTasks"));
      console.error("Error fetching tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const locale =
      i18n.language === "ko"
        ? "ko-KR"
        : i18n.language === "ja"
        ? "ja-JP"
        : "en-US";
    return new Date(dateString).toLocaleDateString(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString) => {
    const locale =
      i18n.language === "ko"
        ? "ko-KR"
        : i18n.language === "ja"
        ? "ja-JP"
        : "en-US";
    return new Date(dateString).toLocaleString(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getScoreColor = (score, maxScore) => {
    if (maxScore === 0) return "default";
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return "success";
    if (percentage >= 60) return "warning";
    return "error";
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  const handleTaskClick = (taskId) => {
    navigate(`/task/${taskId}`);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="400px"
        >
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={fetchTasks}>
          {t("common.tryAgain")}
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ fontWeight: "bold" }}
        >
          <Assignment
            sx={{ verticalAlign: "middle", mr: 2, fontSize: "inherit" }}
          />
          {t("common.myTaskList")}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {t("common.totalTasksCount", { count: tasks.length })}
        </Typography>
      </Box>

      {tasks.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Assignment sx={{ fontSize: 64, color: "text.disabled", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {t("common.noAssignedTasks")}
          </Typography>
          <Typography variant="body2" color="text.disabled">
            {t("common.newTasksWillAppear")}
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {tasks.map((task) => (
            <Grid item xs={12} md={6} lg={4} key={task.id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 4,
                  },
                  border: task.score
                    ? "2px solid"
                    : isOverdue(task.dueDate)
                    ? "2px solid"
                    : "1px solid",
                  borderColor: task.score
                    ? "success.main"
                    : isOverdue(task.dueDate)
                    ? "error.main"
                    : "divider",
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 2,
                    }}
                  >
                    <Typography
                      variant="h6"
                      component="h2"
                      sx={{ fontWeight: "bold", flexGrow: 1 }}
                    >
                      {task.name}
                    </Typography>
                    {task.score ? (
                      <Chip
                        label={t("common.completed")}
                        size="small"
                        color="success"
                        sx={{ ml: 1 }}
                      />
                    ) : (
                      isOverdue(task.dueDate) && (
                        <Chip
                          label={t("common.overdue")}
                          size="small"
                          color="error"
                          sx={{ ml: 1 }}
                        />
                      )
                    )}
                  </Box>

                  <List dense sx={{ py: 0 }}>
                    {task.assignedUserName && (
                      <ListItem disablePadding>
                        <Person
                          sx={{ mr: 1, color: "text.secondary", fontSize: 20 }}
                        />
                        <ListItemText
                          primary={
                            <Typography variant="body2" color="text.secondary">
                              {t("common.assigneeLabel")}:{" "}
                              {task.assignedUserName}
                            </Typography>
                          }
                        />
                      </ListItem>
                    )}

                    {task.teamName && (
                      <ListItem disablePadding>
                        <Group
                          sx={{ mr: 1, color: "text.secondary", fontSize: 20 }}
                        />
                        <ListItemText
                          primary={
                            <Typography variant="body2" color="text.secondary">
                              {t("common.teamLabel")}: {task.teamName}
                            </Typography>
                          }
                        />
                      </ListItem>
                    )}

                    <ListItem disablePadding>
                      <Person
                        sx={{ mr: 1, color: "text.secondary", fontSize: 20 }}
                      />
                      <ListItemText
                        primary={
                          <Typography variant="body2" color="text.secondary">
                            {t("common.createdByLabel")}: {task.createdByName}
                          </Typography>
                        }
                      />
                    </ListItem>

                    <ListItem disablePadding>
                      <CalendarToday
                        sx={{ mr: 1, color: "text.secondary", fontSize: 20 }}
                      />
                      <ListItemText
                        primary={
                          <Typography variant="body2" color="text.secondary">
                            {t("common.dueDate")}: {formatDate(task.dueDate)}
                          </Typography>
                        }
                      />
                    </ListItem>

                    <ListItem disablePadding>
                      <Schedule
                        sx={{ mr: 1, color: "text.secondary", fontSize: 20 }}
                      />
                      <ListItemText
                        primary={
                          <Typography variant="body2" color="text.secondary">
                            {t("common.createdDateLabel")}:{" "}
                            {formatDateTime(task.createdAt)}
                          </Typography>
                        }
                      />
                    </ListItem>
                  </List>

                  <Divider sx={{ my: 2 }} />

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Score
                        sx={{ mr: 1, color: "text.secondary", fontSize: 20 }}
                      />
                      <Chip
                        label={`${task.score || t("common.toBeDetermined")}/${
                          task.maxScore
                        }`}
                        size="small"
                        color={getScoreColor(task.score, task.maxScore)}
                        variant="outlined"
                      />
                    </Box>
                  </Box>
                </CardContent>

                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Visibility />}
                    onClick={() => handleTaskClick(task.id)}
                    sx={{ mr: 1 }}
                  >
                    {t("common.viewDetails")}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
        <Button
          variant="outlined"
          onClick={fetchTasks}
          startIcon={<Assignment />}
        >
          {t("common.refreshTasks")}
        </Button>
      </Box>
    </Container>
  );
}
