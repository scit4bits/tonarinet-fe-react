import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Box,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Card,
  CardContent,
  CardActions,
  Button,
  Divider,
  Chip,
  Grid,
} from "@mui/material";
import {
  Business,
  Group,
  Groups,
  Assignment,
  Psychology,
  ArrowForward,
  Person,
} from "@mui/icons-material";
import { getMe } from "../../utils/user";
import taxios from "../../utils/taxios";
import { getMyOrganizations } from "../../utils/organization";

export default function MyPageMainPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [counsels, setCounsels] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [teams, setTeams] = useState([]);
  const [parties, setParties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user profile
        const userData = await getMe();
        setUser(userData);

        // Fetch all user-related data in parallel
        const [tasksResponse, counselsResponse, orgsResponse, teamsResponse, partiesResponse] = await Promise.allSettled([
          taxios.get("/task/my"),
          taxios.get("/user/mycounsels"),
          getMyOrganizations(),
          taxios.get("/team/my"),
          taxios.get("/party/my")
        ]);

        // Handle tasks
        if (tasksResponse.status === 'fulfilled') {
          setTasks(tasksResponse.value.data || []);
        }

        // Handle counsels
        if (counselsResponse.status === 'fulfilled') {
          setCounsels(counselsResponse.value.data || []);
        }

        // Handle organizations
        if (orgsResponse.status === 'fulfilled') {
          setOrganizations(orgsResponse.value || []);
        }

        // Handle teams
        if (teamsResponse.status === 'fulfilled') {
          setTeams(teamsResponse.value.data || []);
        }

        // Handle parties
        if (partiesResponse.status === 'fulfilled') {
          setParties(partiesResponse.value.data || []);
        }

      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
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
      case "예정":
      case "SCHEDULED":
      case "scheduled":
        return "info";
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

  const getTaskStatus = (task) => {
    // Check if task has a specific status field, otherwise derive from dates
    if (task.status) return task.status;
    if (task.submissionTime) return "완료";
    if (task.dueDate && new Date(task.dueDate) < new Date()) return "지연";
    return "진행중";
  };

  const getCounselStatus = (counsel) => {
    // Adapt based on actual counsel data structure
    if (counsel.status) return counsel.status;
    const counselDate = new Date(counsel.date || counsel.scheduledDate);
    const now = new Date();
    
    if (counselDate < now) return "완료";
    return "예정";
  };

  const handleTaskClick = (taskId) => {
    navigate(`/task/${taskId}`);
  };

  const handleCounselClick = () => {
    navigate(`/my/counsel`); // Navigate to counsel list page since individual counsel view might not exist
  };

  if (loading) {
    return (
      <Box className="flex justify-center items-center min-h-96">
        <Typography>로딩 중...</Typography>
      </Box>
    );
  }

  return (
    <Box className="flex-1 p-6">
      <Box className="max-w-4xl">
        {/* User Description */}
        <Paper elevation={1} className="p-6 mb-6">
          <Typography variant="h5" className="mb-4 font-semibold">
            프로필
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            className="leading-relaxed"
          >
            {user?.description ||
              "아직 자기소개가 작성되지 않았습니다. 프로필을 수정하여 자신을 소개해보세요."}
          </Typography>
        </Paper>

        <Grid container spacing={3}>
          {/* Summary Stats Section */}
          <Grid xs={12}>
            <Paper elevation={1} className="p-6 mb-6">
              <Typography variant="h6" className="font-semibold mb-4">
                활동 요약
              </Typography>
              <Grid container spacing={3}>
                <Grid xs={12} sm={6} md={3}>
                  <Card variant="outlined" className="text-center p-4">
                    <Business color="primary" sx={{ fontSize: 40 }} />
                    <Typography variant="h5" className="font-bold mt-2">
                      {organizations.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      소속 조직
                    </Typography>
                  </Card>
                </Grid>
                <Grid xs={12} sm={6} md={3}>
                  <Card variant="outlined" className="text-center p-4">
                    <Groups color="primary" sx={{ fontSize: 40 }} />
                    <Typography variant="h5" className="font-bold mt-2">
                      {teams.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      참여 팀
                    </Typography>
                  </Card>
                </Grid>
                <Grid xs={12} sm={6} md={3}>
                  <Card variant="outlined" className="text-center p-4">
                    <Group color="secondary" sx={{ fontSize: 40 }} />
                    <Typography variant="h5" className="font-bold mt-2">
                      {parties.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      참여 파티
                    </Typography>
                  </Card>
                </Grid>
                <Grid xs={12} sm={6} md={3}>
                  <Card variant="outlined" className="text-center p-4">
                    <Assignment color="success" sx={{ fontSize: 40 }} />
                    <Typography variant="h5" className="font-bold mt-2">
                      {tasks.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      할당된 과제
                    </Typography>
                  </Card>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Tasks Section */}
          <Grid xs={12} md={6}>
            <Paper elevation={1} className="p-6">
              <Box className="flex justify-between items-center mb-4">
                <Typography variant="h6" className="font-semibold">
                  내 과제
                </Typography>
                <Button
                  size="small"
                  endIcon={<ArrowForward />}
                  onClick={() => navigate("/my/task")}
                >
                  모두 보기
                </Button>
              </Box>

              <Box className="space-y-3">
                {tasks.slice(0, 3).map((task) => (
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
                          label={getTaskStatus(task)}
                          size="small"
                          color={getStatusColor(getTaskStatus(task))}
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
            </Paper>
          </Grid>

          {/* Counsels Section */}
          <Grid xs={12} md={6}>
            <Paper elevation={1} className="p-6">
              <Box className="flex justify-between items-center mb-4">
                <Typography variant="h6" className="font-semibold">
                  내 상담
                </Typography>
                <Button
                  size="small"
                  endIcon={<ArrowForward />}
                  onClick={() => navigate("/my/counsel")}
                >
                  모두 보기
                </Button>
              </Box>

              <Box className="space-y-3">
                {counsels.slice(0, 3).map((counsel) => (
                  <Card
                    key={counsel.id}
                    variant="outlined"
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleCounselClick()}
                  >
                    <CardContent className="pb-2">
                      <Box className="flex justify-between items-start mb-2">
                        <Typography variant="subtitle2" className="font-medium">
                          {counsel.title}
                        </Typography>
                        <Chip
                          label={getCounselStatus(counsel)}
                          size="small"
                          color={getStatusColor(getCounselStatus(counsel))}
                          variant="outlined"
                        />
                      </Box>
                      {counsel.counselor && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          className="mb-1"
                        >
                          상담사: {counsel.counselor}
                        </Typography>
                      )}
                      <Typography variant="caption" color="text.secondary">
                        일정: {formatDate(counsel.date || counsel.scheduledDate || counsel.createdAt)}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}

                {counsels.length === 0 && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    className="text-center py-4"
                  >
                    예정된 상담이 없습니다.
                  </Typography>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
