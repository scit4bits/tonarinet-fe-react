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

export default function MyPageMainPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [counsels, setCounsels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getMe();
        setUser(userData);

        // Mock data for tasks and counsels - replace with actual API calls
        setTasks([
          {
            id: 1,
            title: "프로젝트 기획서 작성",
            status: "진행중",
            dueDate: "2025-09-15",
          },
          {
            id: 2,
            title: "시스템 요구사항 분석",
            status: "완료",
            dueDate: "2025-09-05",
          },
          {
            id: 3,
            title: "UI/UX 디자인 검토",
            status: "대기",
            dueDate: "2025-09-20",
          },
        ]);

        setCounsels([
          {
            id: 1,
            title: "진로 상담",
            counselor: "김상담사",
            date: "2025-09-10",
            status: "완료",
          },
          {
            id: 2,
            title: "스트레스 관리 상담",
            counselor: "이상담사",
            date: "2025-09-12",
            status: "예정",
          },
        ]);
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
        return "success";
      case "진행중":
        return "primary";
      case "대기":
        return "warning";
      case "예정":
        return "info";
      default:
        return "default";
    }
  };

  const handleTaskClick = (taskId) => {
    navigate(`/task/${taskId}`);
  };

  const handleCounselClick = (counselId) => {
    navigate(`/counsel/${counselId}`);
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
                  onClick={() => navigate("/my-tasks")}
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
                          {task.title}
                        </Typography>
                        <Chip
                          label={task.status}
                          size="small"
                          color={getStatusColor(task.status)}
                          variant="outlined"
                        />
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        마감일: {task.dueDate}
                      </Typography>
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
                  onClick={() => navigate("/my-counsels")}
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
                    onClick={() => handleCounselClick(counsel.id)}
                  >
                    <CardContent className="pb-2">
                      <Box className="flex justify-between items-start mb-2">
                        <Typography variant="subtitle2" className="font-medium">
                          {counsel.title}
                        </Typography>
                        <Chip
                          label={counsel.status}
                          size="small"
                          color={getStatusColor(counsel.status)}
                          variant="outlined"
                        />
                      </Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        className="mb-1"
                      >
                        상담사: {counsel.counselor}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        일정: {counsel.date}
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
