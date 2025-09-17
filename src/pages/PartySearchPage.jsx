import React, { useState } from "react";
import {
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
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PeopleIcon from "@mui/icons-material/People";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import usePartyList from "../hooks/usePartyList";
import taxios from "../utils/taxios";
import { useTranslation } from "react-i18next";

export default function PartySearchPage() {
  const { t } = useTranslation();
  const { parties, loading, search, setSearch } = usePartyList("name");

  // Dialog state for entry message form
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPartyId, setSelectedPartyId] = useState(null);
  const [entryMessage, setEntryMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearch(value);
  };

  const handleJoinClick = (partyId) => {
    setSelectedPartyId(partyId);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedPartyId(null);
    setEntryMessage("");
  };

  const handleSubmitJoin = async () => {
    if (!selectedPartyId || !entryMessage.trim()) {
      alert(t("common.pleaseEnterMessage"));
      return;
    }

    setSubmitting(true);
    try {
      await taxios.post(`/party/${selectedPartyId}/join`, {
        entryMessage: entryMessage.trim(),
      });

      alert(t("common.partyJoinApplicationCompleted"));
      handleCloseDialog();
    } catch (error) {
      console.error("Error joining party:", error);
      alert(t("common.partyJoinApplicationError"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Search Bar */}
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          value={search}
          onChange={handleInputChange}
          placeholder={t("common.partySearchPlaceholder")}
          slotProps={{
            htmlInput: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>

      {/* Loading State */}
      {loading && (
        <Box display="flex" justifyContent="center" sx={{ my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Party List */}
      <Stack spacing={2}>
        {!loading &&
          parties.data.length > 0 &&
          parties.data.map((party) => (
            <Card key={party.id} variant="outlined">
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="flex-start"
                p={2}
              >
                <Box sx={{ flex: 1 }}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="h6" component="div">
                      {party.name}
                    </Typography>
                    {/* Recruitment Status Chip */}
                    <Chip
                      icon={
                        party.isFinished ? (
                          <CheckCircleIcon />
                        ) : (
                          <HourglassEmptyIcon />
                        )
                      }
                      label={
                        party.isFinished
                          ? t("common.recruitmentCompleted")
                          : t("common.recruiting")
                      }
                      size="small"
                      color={party.isFinished ? "success" : "primary"}
                      variant="outlined"
                    />
                    {/* Member Count */}
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <PeopleIcon color="action" sx={{ fontSize: 16 }} />
                      <Typography variant="body2" color="text.secondary">
                        {party.userCount || 0}
                      </Typography>
                    </Box>
                  </Box>

                  {party.description && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      {party.description}
                    </Typography>
                  )}
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleJoinClick(party.id)}
                  disabled={party.isFinished}
                >
                  {party.isFinished
                    ? t("common.recruitmentClosed")
                    : t("common.join")}
                </Button>
              </Box>
            </Card>
          ))}
      </Stack>

      {/* Empty State */}
      {!loading && parties.data.length === 0 && (
        <Box textAlign="center" sx={{ mt: 5 }}>
          <Typography variant="body1" color="text.secondary">
            {t("common.noPartiesFound")}
          </Typography>
        </Box>
      )}

      {/* Entry Message Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: "center" }}>
          {t("common.partyJoinApplication")}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="entryMessage"
            label={t("common.partyEntryMessage")}
            type="text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            placeholder={t("common.partyEntryMessagePlaceholder")}
            value={entryMessage}
            onChange={(e) => setEntryMessage(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={submitting}>
            {t("common.cancel")}
          </Button>
          <Button
            onClick={handleSubmitJoin}
            color="primary"
            variant="contained"
            disabled={submitting || !entryMessage.trim()}
          >
            {submitting ? t("common.applying") : t("common.joinApplication")}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
