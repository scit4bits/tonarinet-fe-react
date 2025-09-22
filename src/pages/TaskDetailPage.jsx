import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useTranslation } from "react-i18next";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Assignment as AssignmentIcon,
  AttachFile as AttachFileIcon,
  Description as DescriptionIcon,
  Edit as EditIcon,
  ExpandMore as ExpandMoreIcon,
  Grade as GradeIcon,
  List as ListIcon,
  Person as PersonIcon,
  Save as SaveIcon,
  Schedule as ScheduleIcon,
  Upload as UploadIcon,
} from "@mui/icons-material";
import {
  checkTaskManagementEligibility,
  getTaskById,
  updateTaskScore,
} from "../utils/task";
import RichTextEditor from "../components/RichTextEditor";
import "react-quill-new/dist/quill.snow.css";
import { createSubmission, getTaskSubmissions } from "../utils/submission";
import { TranslatableText } from "../components/TranslatableText";

export default function TaskDetailPage() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Management eligibility state
  const [canManage, setCanManage] = useState(false);
  const [managementLoading, setManagementLoading] = useState(false);

  // Edit score state
  const [editScoreOpen, setEditScoreOpen] = useState(false);
  const [newScore, setNewScore] = useState("");
  const [newFeedback, setNewFeedback] = useState("");
  const [scoreError, setScoreError] = useState("");
  const [updatingScore, setUpdatingScore] = useState(false);

  // Submission state
  const [submissionContent, setSubmissionContent] = useState("");
  const [submissionFiles, setSubmissionFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // Submissions list state
  const [submissions, setSubmissions] = useState([]);
  const [submissionsLoading, setSubmissionsLoading] = useState(false);

  // Fetch task details
  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        setLoading(true);
        const taskData = await getTaskById(taskId);
        setTask(taskData);
      } catch (error) {
        console.error("Failed to fetch task details:", error);
        setError(t("common.failedToLoadTaskDetails"));
      } finally {
        setLoading(false);
      }
    };

    const fetchSubmissions = async () => {
      try {
        setSubmissionsLoading(true);
        const submissionsData = await getTaskSubmissions(taskId);
        setSubmissions(submissionsData);
      } catch (error) {
        console.error("Failed to fetch submissions:", error);
      } finally {
        setSubmissionsLoading(false);
      }
    };

    const checkManagementEligibility = async () => {
      try {
        setManagementLoading(true);
        const eligibilityData = await checkTaskManagementEligibility(taskId);
        setCanManage(eligibilityData || false);
      } catch (error) {
        console.error("Failed to check management eligibility:", error);
        setCanManage(false);
      } finally {
        setManagementLoading(false);
      }
    };

    if (taskId) {
      fetchTaskDetails();
      fetchSubmissions();
      checkManagementEligibility();
    }
  }, [taskId]);

  // Handle file upload for submission
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSubmissionFiles((prev) => [...prev, ...files]);
  };

  // Remove file from submission
  const removeFile = (index) => {
    setSubmissionFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle submission
  const handleSubmission = async () => {
    try {
      if (!submitting) {
        setSubmitting(true);
        await createSubmission({
          taskId,
          contents: submissionContent,
          files: submissionFiles,
        });
        navigate(0);
      }
    } catch (error) {
      console.error("Failed to submit:", error);
      setError(t("common.failedToSubmitTask"));
    } finally {
      setSubmitting(false);
    }
  };

  // Handle score editing
  const handleEditScore = () => {
    setNewScore(task.score !== null ? task.score.toString() : "");
    setNewFeedback(task.feedback || "");
    setScoreError("");
    setEditScoreOpen(true);
  };

  const handleScoreChange = (event) => {
    const value = event.target.value;
    setNewScore(value);

    // Validate score
    if (value === "") {
      setScoreError("");
      return;
    }

    const numericValue = parseFloat(value);
    if (isNaN(numericValue)) {
      setScoreError(t("common.pleaseEnterValidNumber"));
    } else if (numericValue < 0) {
      setScoreError(t("common.scoreCannotBeNegative"));
    } else if (numericValue > task.maxScore) {
      setScoreError(
        `${t("common.scoreCannotExceedMax", { maxScore: task.maxScore })}`
      );
    } else {
      setScoreError("");
    }
  };

  const handleUpdateScore = async () => {
    if (scoreError || newScore === "") {
      return;
    }

    try {
      setUpdatingScore(true);
      const numericScore = parseFloat(newScore);
      await updateTaskScore(taskId, numericScore, newFeedback || null);

      // Update the local task state
      setTask((prev) => ({
        ...prev,
        score: numericScore,
        feedback: newFeedback || null,
      }));
      setEditScoreOpen(false);
      setNewScore("");
      setNewFeedback("");
    } catch (error) {
      console.error("Failed to update score:", error);
      setScoreError(t("common.failedToUpdateScore"));
    } finally {
      setUpdatingScore(false);
    }
  };

  const handleCancelScoreEdit = () => {
    setEditScoreOpen(false);
    setNewScore("");
    setNewFeedback("");
    setScoreError("");
  };

  // Date formatting
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString();
  };

  const formatDateOnly = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString();
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
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          variant="outlined"
        >
          {t("common.goBack")}
        </Button>
      </Container>
    );
  }

  if (!task) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography>{t("common.taskNotFound")}</Typography>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          variant="outlined"
          sx={{ mt: 2 }}
        >
          {t("common.goBack")}
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ color: "primary.main" }}>
          <ArrowBackIcon fontSize="large" />
        </IconButton>
        <Typography
          variant="h4"
          component="h1"
          sx={{ fontWeight: "bold", color: "primary.main", flexGrow: 1 }}
        >
          {t("common.taskDetails")}
        </Typography>
      </Box>

      {/* Task Details Section */}
      <Paper elevation={2} sx={{ p: 4, mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
          <AssignmentIcon fontSize="large" color="primary" />
          <TranslatableText>
            <Typography variant="h5" component="h2" fontWeight="bold">
              {task.name}
            </Typography>
          </TranslatableText>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Basic Information Grid */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Box>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                {t("common.taskId")}
              </Typography>
              <Typography variant="h6">{task.id}</Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Box>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                {t("common.taskGroupId")}
              </Typography>
              <Typography variant="h6">{task.taskGroupId}</Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Box>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                {t("common.maxScore")}
              </Typography>
              <Chip
                label={`${task.maxScore} ${t("common.points")}`}
                color="info"
                size="medium"
              />
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Box>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                {t("common.currentScore")}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Chip
                  label={
                    task.score !== null
                      ? `${task.score} / ${task.maxScore}`
                      : t("common.notGraded")
                  }
                  color={task.score !== null ? "success" : "default"}
                  size="medium"
                />
                {canManage && (
                  <IconButton
                    size="small"
                    onClick={handleEditScore}
                    color="primary"
                    title={t("common.editScore")}
                    sx={{ ml: 1 }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ mb: 3 }} />

        {/* Assignment Information */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={task.feedback ? 4 : 6}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <PersonIcon color="primary" />
              <Typography variant="subtitle1" fontWeight="medium">
                {t("common.assignmentInformation")}
              </Typography>
            </Box>
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <Avatar
                    sx={{ width: 32, height: 32, bgcolor: "primary.main" }}
                  >
                    {task.assignedUserName
                      ? task.assignedUserName[0]
                      : task.teamName
                      ? "T"
                      : "?"}
                  </Avatar>
                </ListItemIcon>
                <ListItemText
                  primary={
                    task.assignedUserName
                      ? `${t("common.assignedTo")}: ${task.assignedUserName}`
                      : task.teamName
                      ? `${t("common.assignedToTeam")}: ${task.teamName}`
                      : t("common.unassigned")
                  }
                  secondary={
                    task.assignedUserName
                      ? t("common.individualAssignment")
                      : task.teamName
                      ? t("common.teamAssignment")
                      : t("common.noAssignment")
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText
                  primary={`${t("common.createdBy")}: ${task.createdByName}`}
                  secondary={`${t("common.userId")}: ${task.createdById}`}
                />
              </ListItem>
            </List>
          </Grid>

          <Grid item xs={12} md={task.feedback ? 4 : 6}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <ScheduleIcon color="primary" />
              <Typography variant="subtitle1" fontWeight="medium">
                {t("common.timeline")}
              </Typography>
            </Box>
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <ScheduleIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary={t("common.created")}
                  secondary={formatDate(task.createdAt)}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <ScheduleIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary={t("common.lastUpdated")}
                  secondary={formatDate(task.updatedAt)}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <GradeIcon fontSize="small" color="error" />
                </ListItemIcon>
                <ListItemText
                  primary={t("common.dueDate")}
                  secondary={
                    <Chip
                      label={formatDate(task.dueDate)}
                      color="warning"
                      size="small"
                      variant="outlined"
                    />
                  }
                />
              </ListItem>
            </List>
          </Grid>

          {/* Feedback Section */}
          {task.feedback && (
            <Grid item xs={12} md={4}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
              >
                <DescriptionIcon color="primary" />
                <Typography variant="subtitle1" fontWeight="medium">
                  {t("common.feedback")}
                </Typography>
              </Box>
              <Card variant="outlined" sx={{ height: "fit-content" }}>
                <CardContent>
                  <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                    {task.feedback}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>

        <Divider sx={{ mb: 3 }} />

        {/* Task Content */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <DescriptionIcon />
            {t("common.taskContent")}
          </Typography>
          <Card variant="outlined">
            <CardContent>
              {task.contents ? (
                <Box
                  sx={{
                    "& .ql-editor": {
                      border: "none",
                      padding: 0,
                      fontSize: "1rem",
                      lineHeight: 1.6,
                    },
                    "& img": {
                      maxWidth: "100%",
                      height: "auto",
                    },
                  }}
                >
                  <TranslatableText>
                    <div
                      className="ql-editor"
                      dangerouslySetInnerHTML={{
                        __html: task.contents,
                      }}
                    />
                  </TranslatableText>
                </Box>
              ) : (
                <Typography color="text.secondary" fontStyle="italic">
                  {t("common.noContentProvided")}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Box>
      </Paper>

      {/* Submission Section */}
      <Paper elevation={2} sx={{ p: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
          <UploadIcon fontSize="large" color="secondary" />
          <Typography variant="h5" component="h2" fontWeight="bold">
            {t("common.taskSubmission")}
          </Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Submission Form */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            {t("common.submissionContent")}
          </Typography>
          <RichTextEditor
            value={submissionContent}
            onChange={setSubmissionContent}
            placeholder={t("common.enterSubmissionContent")}
            readOnly={submitting}
            minHeight="300px"
            showImageUpload={true}
          />
        </Box>

        {/* File Upload */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            {t("common.attachmentFiles")}
          </Typography>
          <Button
            component="label"
            variant="outlined"
            startIcon={<UploadIcon />}
            disabled={submitting}
            sx={{ mb: 2 }}
          >
            {t("common.uploadFiles")}
            <input type="file" hidden multiple onChange={handleFileChange} />
          </Button>

          {/* Display attached files */}
          {submissionFiles.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                {t("common.attachedFiles")}:
              </Typography>
              <List>
                {submissionFiles.map((file, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <DescriptionIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={file.name}
                      secondary={`${(file.size / 1024 / 1024).toFixed(2)} MB`}
                    />
                    <Button
                      size="small"
                      color="error"
                      onClick={() => removeFile(index)}
                      disabled={submitting}
                    >
                      {t("common.remove")}
                    </Button>
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </Box>

        {/* Submit Button */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button
            variant="outlined"
            onClick={() => navigate(-1)}
            disabled={submitting}
          >
            {t("common.cancel")}
          </Button>
          <Button
            variant="contained"
            startIcon={
              submitting ? <CircularProgress size={20} /> : <SaveIcon />
            }
            onClick={handleSubmission}
            disabled={submitting || !submissionContent.trim()}
            size="large"
          >
            {submitting ? t("common.submitting") : t("common.submitTask")}
          </Button>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Submissions List Section */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
            <ListIcon fontSize="large" color="info" />
            <Typography variant="h5" component="h2" fontWeight="bold">
              {t("common.taskSubmissions")}
            </Typography>
            <Badge badgeContent={submissions.length} color="primary" showZero>
              <Chip label={t("common.total")} size="small" variant="outlined" />
            </Badge>
          </Box>

          {submissionsLoading ? (
            <Box display="flex" justifyContent="center" p={4}>
              <CircularProgress />
            </Box>
          ) : submissions.length === 0 ? (
            <Card variant="outlined">
              <CardContent>
                <Typography color="text.secondary" textAlign="center">
                  {t("common.noSubmissionsFound")}
                </Typography>
              </CardContent>
            </Card>
          ) : (
            <Box>
              {submissions.map((submission) => (
                <Accordion key={submission.id} sx={{ mb: 2 }}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`submission-${submission.id}-content`}
                    id={`submission-${submission.id}-header`}
                    sx={{
                      bgcolor: "background.paper",
                      "&:hover": {
                        bgcolor: "action.hover",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        width: "100%",
                      }}
                    >
                      <Avatar
                        sx={{ width: 32, height: 32, bgcolor: "primary.main" }}
                      >
                        {submission.createdBy.name[0]}
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle1" fontWeight="medium">
                          {submission.createdBy.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {t("common.submittedOn")}{" "}
                          {formatDate(submission.createdAt)}
                        </Typography>
                      </Box>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        {submission.fileAttachments &&
                          submission.fileAttachments.length > 0 && (
                            <Chip
                              icon={<AttachFileIcon />}
                              label={`${submission.fileAttachments.length} ${t(
                                "common.files"
                              )}`}
                              size="small"
                              color="secondary"
                              variant="outlined"
                            />
                          )}
                        <Chip
                          label={`ID: ${submission.id}`}
                          size="small"
                          color="info"
                          variant="outlined"
                        />
                      </Box>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 3 }}
                    >
                      {/* Submission Content */}
                      <Box>
                        <Typography
                          variant="h6"
                          gutterBottom
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <DescriptionIcon />
                          {t("common.submissionContent")}
                        </Typography>
                        <Card variant="outlined">
                          <CardContent>
                            {submission.contents ? (
                              <Box
                                sx={{
                                  "& .ql-editor": {
                                    border: "none",
                                    padding: 0,
                                    fontSize: "0.9rem",
                                    lineHeight: 1.5,
                                  },
                                  "& img": {
                                    maxWidth: "100%",
                                    height: "auto",
                                  },
                                }}
                              >
                                <TranslatableText>
                                  <div
                                    className="ql-editor"
                                    dangerouslySetInnerHTML={{
                                      __html: submission.contents,
                                    }}
                                  />
                                </TranslatableText>
                              </Box>
                            ) : (
                              <Typography
                                color="text.secondary"
                                fontStyle="italic"
                              >
                                {t("common.noContentProvided")}
                              </Typography>
                            )}
                          </CardContent>
                        </Card>
                      </Box>

                      {/* File Attachments */}
                      {submission.fileAttachments &&
                        submission.fileAttachments.length > 0 && (
                          <Box>
                            <Typography
                              variant="h6"
                              gutterBottom
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <AttachFileIcon />
                              {t("common.attachedFiles")} (
                              {submission.fileAttachments.length})
                            </Typography>
                            <List dense>
                              {submission.fileAttachments.map((file) => (
                                <ListItem
                                  key={file.id}
                                  sx={{
                                    border: "1px solid #e0e0e0",
                                    borderRadius: 1,
                                    mb: 1,
                                  }}
                                >
                                  <ListItemIcon>
                                    <DescriptionIcon />
                                  </ListItemIcon>
                                  <ListItemText
                                    primary={file.originalFilename}
                                    secondary={
                                      <Box>
                                        <Typography
                                          variant="caption"
                                          color="text.secondary"
                                        >
                                          {t("common.size")}:{" "}
                                          {(
                                            file.filesize /
                                            1024 /
                                            1024
                                          ).toFixed(2)}{" "}
                                          MB
                                        </Typography>
                                        <br />
                                        <Typography
                                          variant="caption"
                                          color="text.secondary"
                                        >
                                          {t("common.uploadedBy")}:{" "}
                                          {file.uploadedByName}{" "}
                                          {t("common.createdAt")}{" "}
                                          {formatDateOnly(file.uploadedAt)}
                                        </Typography>
                                      </Box>
                                    }
                                  />
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    href={`${
                                      import.meta.env.VITE_API_BASE_URL ||
                                      "http://localhost:8999/api"
                                    }/files/${file.id}/download`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {t("common.downloadFile")}
                                  </Button>
                                </ListItem>
                              ))}
                            </List>
                          </Box>
                        )}

                      {/* Submitter Details */}
                      <Box>
                        <Typography
                          variant="h6"
                          gutterBottom
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <PersonIcon />
                          {t("common.submitterDetails")}
                        </Typography>
                        <Card variant="outlined">
                          <CardContent>
                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={6}>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  {t("common.name")}
                                </Typography>
                                <Typography variant="body1">
                                  {submission.createdBy.name}
                                </Typography>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  {t("common.email")}
                                </Typography>
                                <Typography variant="body1">
                                  {submission.createdBy.email}
                                </Typography>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  {t("common.nickname")}
                                </Typography>
                                <Typography variant="body1">
                                  {submission.createdBy.nickname ||
                                    t("common.notProvided")}
                                </Typography>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  {t("common.status")}
                                </Typography>
                                <Chip
                                  label={
                                    submission.createdBy.role ||
                                    t("common.member")
                                  }
                                  size="small"
                                  color={
                                    submission.createdBy.isAdmin
                                      ? "error"
                                      : "default"
                                  }
                                />
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card>
                      </Box>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          )}
        </Box>
      </Paper>

      {/* Edit Score Dialog */}
      <Dialog
        open={editScoreOpen}
        onClose={handleCancelScoreEdit}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography
            variant="h6"
            component="div"
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <EditIcon />
            {t("common.editTaskScore")}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {t("common.task")}: {task?.name}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              gutterBottom
              sx={{ mb: 3 }}
            >
              {t("common.maxScore")}: {task?.maxScore} {t("common.points")}
            </Typography>

            <TextField
              autoFocus
              label={t("common.score")}
              type="number"
              fullWidth
              variant="outlined"
              value={newScore}
              onChange={handleScoreChange}
              error={!!scoreError}
              helperText={
                scoreError ||
                t("common.enterScoreBetween", { maxScore: task?.maxScore })
              }
              inputProps={{
                min: 0,
                max: task?.maxScore,
                step: 0.1,
              }}
              disabled={updatingScore}
              sx={{ mb: 3 }}
            />

            <TextField
              label={t("common.feedback")}
              multiline
              rows={4}
              fullWidth
              variant="outlined"
              value={newFeedback}
              onChange={(e) => setNewFeedback(e.target.value)}
              placeholder={t("common.enterFeedback")}
              disabled={updatingScore}
              helperText={t("common.feedbackOptional")}
            />

            {task?.score !== null && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                {t("common.currentScore")}: {task.score} / {task.maxScore}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleCancelScoreEdit} disabled={updatingScore}>
            {t("common.cancel")}
          </Button>
          <Button
            onClick={handleUpdateScore}
            variant="contained"
            disabled={!!scoreError || newScore === "" || updatingScore}
            startIcon={
              updatingScore ? <CircularProgress size={20} /> : <SaveIcon />
            }
          >
            {updatingScore ? t("common.updating") : t("common.updateScore")}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
