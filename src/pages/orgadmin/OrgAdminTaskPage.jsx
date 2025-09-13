import { useTranslation } from "react-i18next";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  Typography,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableSortLabel,
  CircularProgress,
  TablePagination,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete,
  Chip,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import InfoIcon from "@mui/icons-material/Info";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import useOrgTaskList from "../../hooks/useOrgTaskList";
import useOrgMemberList from "../../hooks/useOrgMemberList";
import { useParams, useNavigate } from "react-router";
import { useState, useEffect, useCallback } from "react";
import { createTask, getTaskGroupById, getAITaskRecommendation } from "../../utils/task";
import { getTeamByOrgId } from "../../utils/team";
import RichTextEditor from "../../components/RichTextEditor";
import "react-quill-new/dist/quill.snow.css";

// 조직 관리자: 과제 관리 페이지
export default function OrgAdminTaskPage() {
  const { t } = useTranslation();
  const { orgId } = useParams();
  const navigate = useNavigate();
  const {
    tasks,
    loading,
    search,
    setSearch,
    searchBy,
    setSearchBy,
    page,
    setPage,
    pageSize,
    setPageSize,
    sortBy,
    setSortBy,
    sortDirection,
    setSortDirection,
    refresh,
  } = useOrgTaskList(orgId);

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [teams, setTeams] = useState([]);
  const [teamsLoading, setTeamsLoading] = useState(false);

  // AI Prompt Dialog state
  const [aiDialogOpen, setAiDialogOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  // Task details dialog state
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskDetailsLoading, setTaskDetailsLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    contents: "",
    dueDate: "",
    maxScore: "",
    assignedUsers: [],
    assignedTeams: [],
  });

  // Get organization members for user selection
  const { users: orgMembers, loading: membersLoading } = useOrgMemberList(
    orgId,
    "all",
    "",
    0,
    1000
  );

  // Fetch teams when dialog opens
  const fetchTeams = useCallback(async () => {
    try {
      setTeamsLoading(true);
      const teamsData = await getTeamByOrgId(orgId);
      setTeams(teamsData || []);
    } catch (error) {
      console.error("Failed to fetch teams:", error);
      setTeams([]);
    } finally {
      setTeamsLoading(false);
    }
  }, [orgId]);

  useEffect(() => {
    if (dialogOpen && orgId) {
      fetchTeams();
    }
  }, [dialogOpen, orgId, fetchTeams]);

  // Handle dialog open/close
  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setFormData({
      title: "",
      contents: "",
      dueDate: "",
      maxScore: "",
      assignedUsers: [],
      assignedTeams: [],
    });
  };

  // Handle AI dialog open/close
  const handleOpenAiDialog = () => {
    setAiDialogOpen(true);
  };

  const handleCloseAiDialog = () => {
    setAiDialogOpen(false);
    setAiPrompt("");
  };

  // Handle AI recommendation
  const handleAiRecommendation = async () => {
    if (!aiPrompt.trim()) return;
    
    try {
      setAiLoading(true);
      const response = await getAITaskRecommendation(aiPrompt);
      
      // Insert AI response into the RichTextEditor
      handleInputChange("contents", response.recommendation || response);
      
      // Close AI dialog
      handleCloseAiDialog();
    } catch (error) {
      console.error("Failed to get AI recommendation:", error);
    } finally {
      setAiLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      setCreating(true);

      const taskData = {
        title: formData.title,
        contents: formData.contents,
        dueDate: formData.dueDate,
        maxScore: formData.maxScore ? parseInt(formData.maxScore) : null,
        orgId: parseInt(orgId),
        assignedUserIds: formData.assignedUsers.map((user) => user.id),
        assignedTeamIds: formData.assignedTeams.map((team) => team.id),
      };

      await createTask(taskData);
      handleCloseDialog();
      refresh(); // Refresh the task list
    } catch (error) {
      console.error("Failed to create task:", error);
    } finally {
      setCreating(false);
    }
  };

  // Handle form field changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle task row click to show details
  const handleTaskRowClick = async (task) => {
    try {
      setTaskDetailsLoading(true);
      setDetailsDialogOpen(true);
      const taskDetails = await getTaskGroupById(task.id);
      setSelectedTask(taskDetails);
    } catch (error) {
      console.error("Failed to fetch task details:", error);
    } finally {
      setTaskDetailsLoading(false);
    }
  };

  // Handle task details dialog close
  const handleDetailsDialogClose = () => {
    setDetailsDialogOpen(false);
    setSelectedTask(null);
  };

  // Handle subtask click to navigate to task detail page
  const handleSubtaskClick = (taskId) => {
    navigate(`/task/${taskId}`);
  };

  // 정렬
  const handleRequestSort = (property) => {
    const isAsc = sortBy === property && sortDirection === "asc";
    setSortDirection(isAsc ? "desc" : "asc");
    setSortBy(property);
  };

  // 페이지 번호 (MUI TablePagination)
  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  // 한 페이지에 보여줄 행(row) 개수
  const handleChangeRowsPerPage = (event) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(0);
  };

  // 날짜 포맷팅 함수
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <main className="mt-5">
      <title>{t("pages.orgAdmin.tasks.title")}</title>

      <Box className="flex justify-between items-center mb-4">
        <Typography variant="h4">
          {t("pages.orgAdmin.task.taskManagementTitle")}
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
          className="mb-2"
        >
          {t("orgAdminPage.addNewTask")}
        </Button>
      </Box>

      <Box className="flex gap-5 items-center">
        <FormControl size="small" className="min-w-[120px]">
          <InputLabel>{t("common.searchKeyword")}</InputLabel>
          <Select
            value={searchBy}
            onChange={(e) => setSearchBy(e.target.value)}
            label={t("common.searchKeyword")}
          >
            <MenuItem value="all">{t("common.all")}</MenuItem>
            <MenuItem value="id">{t("common.id")}</MenuItem>
            <MenuItem value="title">{t("common.title")}</MenuItem>
          </Select>
        </FormControl>

        <TextField
          placeholder={`${t("common.search")} ${
            searchBy === "all"
              ? t("common.tasks")
              : `${t("common.by")} ${searchBy}`
          }`}
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="min-w-[250px]"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell colSpan={5}>
                <Box display="flex" alignItems="center" gap={1}>
                  <InfoIcon fontSize="small" color="action" />
                  <Typography variant="caption" color="text.secondary">
                    {t("orgAdminPage.searchInfo", {
                      total: tasks.totalElements || 0,
                    })}
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={sortBy === "id"}
                  direction={sortBy === "id" ? sortDirection : "asc"}
                  onClick={() => handleRequestSort("id")}
                >
                  {t("common.id")}
                </TableSortLabel>
              </TableCell>

              <TableCell>
                <TableSortLabel
                  active={sortBy === "title"}
                  direction={sortBy === "title" ? sortDirection : "asc"}
                  onClick={() => handleRequestSort("title")}
                >
                  {t("common.title")}
                </TableSortLabel>
              </TableCell>

              <TableCell>
                <TableSortLabel
                  active={sortBy === "createdAt"}
                  direction={sortBy === "createdAt" ? sortDirection : "asc"}
                  onClick={() => handleRequestSort("createdAt")}
                >
                  {t("common.createdAt")}
                </TableSortLabel>
              </TableCell>

              <TableCell>
                <TableSortLabel
                  active={sortBy === "dueDate"}
                  direction={sortBy === "dueDate" ? sortDirection : "asc"}
                  onClick={() => handleRequestSort("dueDate")}
                >
                  {t("common.dueDate")}
                </TableSortLabel>
              </TableCell>

              <TableCell>
                <TableSortLabel
                  active={sortBy === "maxScore"}
                  direction={sortBy === "maxScore" ? sortDirection : "asc"}
                  onClick={() => handleRequestSort("maxScore")}
                >
                  {t("common.maxScore")}
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : (
              tasks.data?.map((task) => (
                <TableRow
                  key={task.id}
                  hover
                  onClick={() => handleTaskRowClick(task)}
                  sx={{ cursor: "pointer" }}
                >
                  <TableCell>{task.id}</TableCell>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{formatDate(task.createdAt)}</TableCell>
                  <TableCell>{formatDate(task.dueDate)}</TableCell>
                  <TableCell>{task.maxScore || "-"}</TableCell>
                </TableRow>
              )) || []
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={tasks.totalElements || 0}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={pageSize}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Add New Task Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{t("orgAdminPage.addNewTask")}</DialogTitle>
        <DialogContent>
          <Box className="flex flex-col gap-4 mt-2">
            {/* Title */}
            <TextField
              label={t("common.title")}
              fullWidth
              required
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
            />

            {/* Contents */}
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle2" gutterBottom>
                  {t("common.content")}
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<AutoAwesomeIcon />}
                  onClick={handleOpenAiDialog}
                  sx={{ mb: 1 }}
                >
                  {t("orgAdminPage.aiRecommendation")}
                </Button>
              </Box>
              
              <RichTextEditor
                value={formData.contents}
                onChange={(content) => handleInputChange("contents", content)}
                placeholder={t("common.enterTaskContent")}
                readOnly={creating}
                minHeight="200px"
                showImageUpload={true}
              />
            </Box>            {/* Due Date */}
            <TextField
              label={t("common.dueDate")}
              type="datetime-local"
              fullWidth
              value={formData.dueDate}
              onChange={(e) => handleInputChange("dueDate", e.target.value)}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />

            {/* Max Score */}
            <TextField
              label={t("common.maxScore")}
              type="number"
              fullWidth
              value={formData.maxScore}
              onChange={(e) => handleInputChange("maxScore", e.target.value)}
            />

            {/* Assigned Users */}
            <Autocomplete
              multiple
              options={orgMembers.data || []}
              getOptionLabel={(option) => `${option.name} (${option.email})`}
              value={formData.assignedUsers}
              onChange={(event, newValue) => {
                handleInputChange("assignedUsers", newValue);
              }}
              loading={membersLoading}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    key={option.id}
                    label={option.name}
                    {...getTagProps({ index })}
                    size="small"
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t("orgAdminPage.assignedUsers")}
                  placeholder={t("orgAdminPage.selectUsers")}
                  slotProps={{
                    input: {
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {membersLoading ? (
                            <CircularProgress size={20} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    },
                  }}
                />
              )}
            />

            {/* Assigned Teams */}
            <Autocomplete
              multiple
              options={teams}
              getOptionLabel={(option) => option.name}
              value={formData.assignedTeams}
              onChange={(event, newValue) => {
                handleInputChange("assignedTeams", newValue);
              }}
              loading={teamsLoading}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    key={option.id}
                    label={option.name}
                    {...getTagProps({ index })}
                    size="small"
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t("orgAdminPage.assignedTeams")}
                  placeholder={t("orgAdminPage.selectTeams")}
                  slotProps={{
                    input: {
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {teamsLoading ? <CircularProgress size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    },
                  }}
                />
              )}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>{t("common.cancel")}</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!formData.title || creating}
          >
            {creating ? (
              <CircularProgress size={20} />
            ) : (
              t("orgAdminPage.createTask")
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Task Details Dialog */}
      <Dialog
        open={detailsDialogOpen}
        onClose={handleDetailsDialogClose}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>{t("orgAdminPage.taskGroupDetails")}</DialogTitle>
        <DialogContent>
          {taskDetailsLoading ? (
            <Box display="flex" justifyContent="center" p={4}>
              <CircularProgress />
            </Box>
          ) : selectedTask ? (
            <Box className="flex flex-col gap-4 mt-2">
              {/* Basic Information */}
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    {t("orgAdminPage.taskGroupId")}
                  </Typography>
                  <Typography variant="body1">{selectedTask.id}</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    {t("orgAdminPage.organization")}
                  </Typography>
                  <Typography variant="body1">
                    {selectedTask.organizationName}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    {t("common.maxScore")}
                  </Typography>
                  <Typography variant="body1">
                    {selectedTask.maxScore || "-"}
                  </Typography>
                </Grid>
              </Grid>

              <Divider />

              {/* Title */}
              <Box>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  {t("common.title")}
                </Typography>
                <Typography variant="h6">{selectedTask.title}</Typography>
              </Box>

              {/* Contents */}
              <Box>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  {t("common.content")}
                </Typography>
                <Box
                  sx={{
                    border: "1px solid #e0e0e0",
                    borderRadius: 1,
                    p: 2,
                    minHeight: "150px",
                    backgroundColor: "#fafafa",
                    "& .ql-editor": {
                      border: "none",
                      padding: 0,
                    },
                  }}
                >
                  {selectedTask.contents ? (
                    <div
                      className="ql-editor"
                      dangerouslySetInnerHTML={{
                        __html: selectedTask.contents,
                      }}
                    />
                  ) : (
                    <Typography color="text.secondary" fontStyle="italic">
                      {t("common.noContentProvided")}
                    </Typography>
                  )}
                </Box>
              </Box>

              {/* Dates */}
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    {t("common.createdAt")}
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(selectedTask.createdAt)}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    {t("common.dueDate")}
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(selectedTask.dueDate)}
                  </Typography>
                </Grid>
              </Grid>

              <Divider />

              {/* Subtasks */}
              {selectedTask.tasks && selectedTask.tasks.length > 0 && (
                <Box>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    {t("orgAdminPage.subtasks", {
                      count: selectedTask.tasks.length,
                    })}
                  </Typography>
                  <List sx={{ bgcolor: "background.paper", borderRadius: 1 }}>
                    {selectedTask.tasks.map((task) => (
                      <ListItem
                        key={task.id}
                        button
                        onClick={() => handleSubtaskClick(task.id)}
                        sx={{
                          border: "1px solid #e0e0e0",
                          borderRadius: 1,
                          mb: 1,
                          "&:hover": {
                            backgroundColor: "#f5f5f5",
                          },
                        }}
                      >
                        <ListItemIcon>
                          <AssignmentIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box display="flex" alignItems="center" gap={2}>
                              <Typography variant="body1" fontWeight="medium">
                                ID: {task.id}
                              </Typography>
                              <Chip
                                label={
                                  task.assignedUserName
                                    ? `${t("orgAdminPage.user")}: ${
                                        task.assignedUserName
                                      }`
                                    : task.teamName
                                    ? `${t("orgAdminPage.team")}: ${
                                        task.teamName
                                      }`
                                    : t("orgAdminPage.unassigned")
                                }
                                size="small"
                                color={
                                  task.assignedUserName
                                    ? "primary"
                                    : task.teamName
                                    ? "secondary"
                                    : "default"
                                }
                                variant="outlined"
                              />
                              <Chip
                                label={`${t("orgAdminPage.createdBy")}: ${
                                  task.createdByName
                                }`}
                                size="small"
                                color="info"
                                variant="outlined"
                              />
                            </Box>
                          }
                          secondary={
                            <Box
                              display="flex"
                              alignItems="center"
                              gap={2}
                              mt={1}
                            >
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {t("orgAdminPage.due")}:{" "}
                                {formatDate(task.dueDate)}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {t("orgAdminPage.score")}:{" "}
                                {task.score || t("orgAdminPage.notGraded")} /{" "}
                                {task.maxScore}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </Box>
          ) : (
            <Typography>{t("orgAdminPage.noTaskDetailsAvailable")}</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDetailsDialogClose}>
            {t("common.close")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* AI Prompt Dialog */}
      <Dialog
        open={aiDialogOpen}
        onClose={handleCloseAiDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <AutoAwesomeIcon />
            {t("orgAdminPage.aiTaskRecommendation")}
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {t("orgAdminPage.aiPromptDescription")}
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            label={t("orgAdminPage.aiPromptLabel")}
            placeholder={t("orgAdminPage.aiPromptPlaceholder")}
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            disabled={aiLoading}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAiDialog} disabled={aiLoading}>
            {t("common.cancel")}
          </Button>
          <Button
            onClick={handleAiRecommendation}
            variant="contained"
            disabled={!aiPrompt.trim() || aiLoading}
            startIcon={aiLoading ? <CircularProgress size={16} /> : <AutoAwesomeIcon />}
          >
            {aiLoading ? t("orgAdminPage.generating") : t("orgAdminPage.generateRecommendation")}
          </Button>
        </DialogActions>
      </Dialog>
    </main>
  );
}
