import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  Chip,
  Avatar,
  AvatarGroup,
  Paper,
  CircularProgress,
  Alert,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Tabs,
  Tab,
} from "@mui/material";
import {
  Celebration,
  Person,
  Star,
  Group,
  Add,
  Settings,
  Check,
  Close,
  PersonAdd,
  Search,
} from "@mui/icons-material";
import taxios from "../../utils/taxios";
import useAuth from "../../hooks/useAuth";

export default function MyPagePartyPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [parties, setParties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [partyName, setPartyName] = useState("");
  const [creating, setCreating] = useState(false);
  const [openManageDialog, setOpenManageDialog] = useState(false);
  const [selectedParty, setSelectedParty] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    const fetchParties = async () => {
      try {
        setLoading(true);
        const response = await taxios.get("/party/my");
        setParties(response.data);
      } catch (err) {
        setError(t("common.failedToLoadParties"));
        console.error("Error fetching parties:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchParties();
  }, []);

  const getStringAvatar = (name) => {
    return {
      sx: {
        bgcolor: "#9c27b0",
        color: "white",
      },
      children: name ? name.charAt(0).toUpperCase() : "?",
    };
  };

  const handleCreateParty = async () => {
    if (!partyName.trim()) return;

    try {
      setCreating(true);
      await taxios.post("/party", {
        name: partyName.trim(),
      });

      const newPartyList = await taxios.get("/party/my");
      setParties(newPartyList.data);

      // Close dialog and reset form
      setOpenDialog(false);
      setPartyName("");
    } catch (err) {
      setError(t("common.failedToCreateParty"));
      console.error("Error creating party:", err);
    } finally {
      setCreating(false);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setPartyName("");
  };

  const handleManageParty = (party) => {
    setSelectedParty(party);
    setOpenManageDialog(true);
  };

  const handleCloseManageDialog = () => {
    setOpenManageDialog(false);
    setSelectedParty(null);
    setTabValue(0);
  };

  const handleGrantUser = async (userId) => {
    try {
      await taxios.post(`/party/${selectedParty.id}/grant/${userId}`);

      // Refresh the main parties list to update the users data
      const partiesResponse = await taxios.get("/party/my");
      setParties(partiesResponse.data);

      // Update the selected party with the new data
      const updatedParty = partiesResponse.data.find(
        (p) => p.id === selectedParty.id
      );
      if (updatedParty) {
        setSelectedParty(updatedParty);
      }
    } catch (err) {
      console.error("Error granting user:", err);
      setError(t("common.failedToGrantUser"));
    }
  };

  const handleRejectUser = async (userId) => {
    try {
      await taxios.post(`/party/${selectedParty.id}/reject/${userId}`);

      // Refresh the main parties list to update the users data
      const partiesResponse = await taxios.get("/party/my");
      setParties(partiesResponse.data);

      // Update the selected party with the new data
      const updatedParty = partiesResponse.data.find(
        (p) => p.id === selectedParty.id
      );
      if (updatedParty) {
        setSelectedParty(updatedParty);
      }
    } catch (err) {
      console.error("Error rejecting user:", err);
      setError(t("common.failedToRejectUser"));
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: "center" }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          {t("common.loadingParties")}
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={1} sx={{ p: 3 }}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={4}
        >
          <Box display="flex" alignItems="center">
            <Celebration
              sx={{ mr: 2, color: "secondary.main", fontSize: 32 }}
            />
            <Typography variant="h4" component="h1" fontWeight="bold">
              {t("common.myParties")}
            </Typography>
          </Box>
          <Box display="flex" gap={2}>
            <Button
              variant="outlined"
              startIcon={<Search />}
              onClick={() => navigate("/party/list")}
            >
              {t("common.searchParties")}
            </Button>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpenDialog(true)}
            >
              {t("common.createNewParty")}
            </Button>
          </Box>
        </Box>

        {parties.length === 0 ? (
          <Box textAlign="center" py={4}>
            <Celebration sx={{ fontSize: 64, color: "text.disabled", mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {t("common.notMemberOfAnyParties")}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {t("common.searchAndJoinParties")}
            </Typography>
            <Button
              variant="contained"
              startIcon={<Search />}
              onClick={() => navigate("/party/list")}
              sx={{ px: 3, py: 1 }}
            >
              {t("common.searchParties")}
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {parties.map((party) => (
              <Grid item xs={12} md={6} key={party.id}>
                <Card elevation={2} sx={{ height: "100%" }}>
                  <CardContent>
                    {/* Party Header */}
                    <Box display="flex" alignItems="center" mb={2}>
                      <Avatar sx={{ bgcolor: "secondary.main", mr: 2 }}>
                        <Celebration />
                      </Avatar>
                      <Box flex={1}>
                        <Typography variant="h6" fontWeight="bold">
                          {party.name}
                        </Typography>
                      </Box>
                      {user && user.id === party.leaderUserId && (
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<Settings />}
                          onClick={() => handleManageParty(party)}
                          sx={{ ml: 1 }}
                        >
                          {t("common.manage")}
                        </Button>
                      )}
                    </Box>

                    {/* Party Info */}
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          {t("common.partyLeaderLabel")}
                        </Typography>
                        <Box display="flex" alignItems="center">
                          <Star
                            sx={{
                              fontSize: 16,
                              mr: 0.5,
                              color: "warning.main",
                            }}
                          />
                          <Typography variant="body1" fontWeight="medium">
                            {party.leaderUserName}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          {t("common.membersLabel")}
                        </Typography>
                        <Box display="flex" alignItems="center">
                          <Group
                            sx={{
                              fontSize: 16,
                              mr: 0.5,
                              color: "text.secondary",
                            }}
                          />
                          <Typography variant="body1" fontWeight="medium">
                            {party.userCount}{" "}
                            {party.userCount !== 1
                              ? t("common.memberPlural")
                              : t("common.memberSingular")}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>

                    <Divider sx={{ my: 2 }} />

                    {/* Party Members */}
                    <Typography variant="subtitle2" fontWeight="bold" mb={1}>
                      {t("common.partyMembersTitle")}
                    </Typography>
                    <AvatarGroup max={4} sx={{ justifyContent: "flex-start" }}>
                      {party.users.map((user) => (
                        <Avatar
                          key={user.id}
                          {...getStringAvatar(user.name)}
                          title={`${user.name}${
                            user.nickname ? ` (${user.nickname})` : ""
                          }${
                            user.id === party.leaderUserId
                              ? ` - ${t("common.leaderSuffix")}`
                              : ""
                          }`}
                        />
                      ))}
                    </AvatarGroup>

                    {/* Member Roles */}
                    {party.users.some((user) => user.role) && (
                      <Box mt={2}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          mb={1}
                        >
                          {t("common.memberRoles")}
                        </Typography>
                        <Box display="flex" flexWrap="wrap" gap={1}>
                          {party.users
                            .filter((user) => user.role)
                            .slice(0, 3)
                            .map((user) => (
                              <Chip
                                key={user.id}
                                label={`${user.name}: ${user.role}`}
                                size="small"
                                variant="outlined"
                                color={
                                  user.id === party.leaderUserId
                                    ? "primary"
                                    : "default"
                                }
                              />
                            ))}
                          {party.users.filter((user) => user.role).length >
                            3 && (
                            <Chip
                              label={`+${
                                party.users.filter((user) => user.role).length -
                                3
                              } ${t("common.moreRoles")}`}
                              size="small"
                              variant="outlined"
                              color="default"
                            />
                          )}
                        </Box>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Create Party Dialog */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>{t("common.createNewParty")}</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label={t("common.partyNameLabel")}
              fullWidth
              variant="outlined"
              value={partyName}
              onChange={(e) => setPartyName(e.target.value)}
              placeholder={t("common.enterPartyNamePlaceholder")}
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>{t("common.cancel")}</Button>
            <Button
              onClick={handleCreateParty}
              variant="contained"
              disabled={!partyName.trim() || creating}
            >
              {creating ? t("common.creating") : t("common.create")}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Manage Party Dialog */}
        <Dialog
          open={openManageDialog}
          onClose={handleCloseManageDialog}
          maxWidth="md"
          fullWidth
          PaperProps={{ sx: { minHeight: "500px" } }}
        >
          <DialogTitle>
            <Box display="flex" alignItems="center">
              <Settings sx={{ mr: 1 }} />
              {t("common.managePartyTitle")} {selectedParty?.name}
            </Box>
          </DialogTitle>
          <DialogContent>
            <Tabs
              value={tabValue}
              onChange={(e, newValue) => setTabValue(newValue)}
              sx={{ mb: 2 }}
            >
              <Tab label={t("common.grantedMembers")} />
              <Tab label={t("common.pendingRequests")} />
            </Tabs>

            {/* Granted Members Tab */}
            {tabValue === 0 && (
              <List>
                {selectedParty?.users
                  ?.filter((user) => user.isGranted)
                  .map((partyUser) => (
                    <ListItem key={partyUser.id} divider>
                      <ListItemAvatar>
                        <Avatar {...getStringAvatar(partyUser.name)}>
                          {partyUser.id === selectedParty?.leaderUserId && (
                            <Star sx={{ fontSize: 12 }} />
                          )}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center">
                            <Typography variant="body1" fontWeight="medium">
                              {partyUser.name}
                            </Typography>
                            {partyUser.id === selectedParty?.leaderUserId && (
                              <Chip
                                label={t("common.leaderSuffix")}
                                size="small"
                                color="warning"
                                sx={{ ml: 1 }}
                              />
                            )}
                          </Box>
                        }
                        secondary={
                          <Box>
                            {partyUser.nickname && (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {t("common.nicknameLabel")}:{" "}
                                {partyUser.nickname}
                              </Typography>
                            )}
                            {partyUser.role && (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {t("common.roleLabel")}: {partyUser.role}
                              </Typography>
                            )}
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                {(!selectedParty?.users ||
                  selectedParty.users.filter((user) => user.isGranted)
                    .length === 0) && (
                  <Box textAlign="center" py={4}>
                    <Typography variant="body2" color="text.secondary">
                      {t("common.noGrantedMembersFound")}
                    </Typography>
                  </Box>
                )}
              </List>
            )}

            {/* Pending Requests Tab */}
            {tabValue === 1 && (
              <List>
                {selectedParty?.users
                  ?.filter((user) => !user.isGranted)
                  .map((partyUser) => (
                    <ListItem key={partyUser.id} divider>
                      <ListItemAvatar>
                        <Avatar {...getStringAvatar(partyUser.name)} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={partyUser.name}
                        secondary={
                          <Box>
                            {partyUser.nickname && (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {t("common.nicknameLabel")}:{" "}
                                {partyUser.nickname}
                              </Typography>
                            )}
                            {partyUser.entryMessage && (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mt: 1 }}
                              >
                                {t("common.entryMessage")}: "
                                {partyUser.entryMessage}"
                              </Typography>
                            )}
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        <Box display="flex" gap={1}>
                          <IconButton
                            color="success"
                            size="small"
                            onClick={() => handleGrantUser(partyUser.id)}
                            title={t("common.grantAccess")}
                          >
                            <Check />
                          </IconButton>
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => handleRejectUser(partyUser.id)}
                            title={t("common.rejectRequest")}
                          >
                            <Close />
                          </IconButton>
                        </Box>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                {(!selectedParty?.users ||
                  selectedParty.users.filter((user) => !user.isGranted)
                    .length === 0) && (
                  <Box textAlign="center" py={4}>
                    <PersonAdd
                      sx={{ fontSize: 48, color: "text.disabled", mb: 1 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {t("common.noPendingRequests")}
                    </Typography>
                  </Box>
                )}
              </List>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseManageDialog}>
              {t("common.closeDialog")}
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
}
