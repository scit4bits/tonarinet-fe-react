import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Grid,
  CircularProgress,
  Alert,
  Container,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Assignment,
  Group,
  Person,
  Schedule,
  Score,
  CalendarToday,
  Visibility,
  StarBorder,
} from "@mui/icons-material";
import taxios from "../../utils/taxios";

export default function MyPageTaskPage() {
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
      setError(err.response?.data?.message || "Failed to fetch tasks");
      console.error("Error fetching tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString("ko-KR", {
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
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
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
          다시 시도
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: "bold" }}>
          <Assignment sx={{ verticalAlign: "middle", mr: 2, fontSize: "inherit" }} />
          내 할일 목록
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          총 {tasks.length}개의 할일이 있습니다
        </Typography>
      </Box>

      {tasks.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Assignment sx={{ fontSize: 64, color: "text.disabled", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            할당된 할일이 없습니다
          </Typography>
          <Typography variant="body2" color="text.disabled">
            새로운 할일이 할당되면 여기에 표시됩니다
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
                  border: isOverdue(task.dueDate) ? "2px solid" : "1px solid",
                  borderColor: isOverdue(task.dueDate) ? "error.main" : "divider",
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                    <Typography variant="h6" component="h2" sx={{ fontWeight: "bold", flexGrow: 1 }}>
                      {task.name}
                    </Typography>
                    {isOverdue(task.dueDate) && (
                      <Chip label="마감" size="small" color="error" sx={{ ml: 1 }} />
                    )}
                  </Box>

                  <List dense sx={{ py: 0 }}>
                    <ListItem disablePadding>
                      <Person sx={{ mr: 1, color: "text.secondary", fontSize: 20 }} />
                      <ListItemText
                        primary={
                          <Typography variant="body2" color="text.secondary">
                            담당자: {task.assignedUserName}
                          </Typography>
                        }
                      />
                    </ListItem>

                    <ListItem disablePadding>
                      <Person sx={{ mr: 1, color: "text.secondary", fontSize: 20 }} />
                      <ListItemText
                        primary={
                          <Typography variant="body2" color="text.secondary">
                            작성자: {task.createdByName}
                          </Typography>
                        }
                      />
                    </ListItem>

                    {task.teamName && (
                      <ListItem disablePadding>
                        <Group sx={{ mr: 1, color: "text.secondary", fontSize: 20 }} />
                        <ListItemText
                          primary={
                            <Typography variant="body2" color="text.secondary">
                              팀: {task.teamName}
                            </Typography>
                          }
                        />
                      </ListItem>
                    )}

                    <ListItem disablePadding>
                      <CalendarToday sx={{ mr: 1, color: "text.secondary", fontSize: 20 }} />
                      <ListItemText
                        primary={
                          <Typography variant="body2" color="text.secondary">
                            마감일: {formatDate(task.dueDate)}
                          </Typography>
                        }
                      />
                    </ListItem>

                    <ListItem disablePadding>
                      <Schedule sx={{ mr: 1, color: "text.secondary", fontSize: 20 }} />
                      <ListItemText
                        primary={
                          <Typography variant="body2" color="text.secondary">
                            생성일: {formatDateTime(task.createdAt)}
                          </Typography>
                        }
                      />
                    </ListItem>
                  </List>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Score sx={{ mr: 1, color: "text.secondary", fontSize: 20 }} />
                        <Chip
                        label={`${task.score || "TBD"}/${task.maxScore}`}
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
                    상세보기
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
        <Button variant="outlined" onClick={fetchTasks} startIcon={<Assignment />}>
          새로고침
        </Button>
      </Box>
    </Container>
  );
}
