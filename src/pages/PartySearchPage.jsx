import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import usePartyList from "../hooks/usePartyList";
import taxios from "../utils/taxios";

export default function PartySearchPage() {
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
      alert("메시지를 입력해주세요.");
      return;
    }

    setSubmitting(true);
    try {
      await taxios.post(`/party/${selectedPartyId}/join`, {
        message: entryMessage.trim(),
      });

      alert("파티 가입 신청이 완료되었습니다.");
      handleCloseDialog();
    } catch (error) {
      console.error("Error joining party:", error);
      alert("가입 신청 도중 오류가 발생했습니다.");
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
          placeholder="Search parties..."
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
              <CardContent>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box>
                    <Typography variant="h6" component="div">
                      {party.name}
                    </Typography>
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
                  >
                    Join
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))}
      </Stack>

      {/* Empty State */}
      {!loading && parties.data.length === 0 && (
        <Box textAlign="center" sx={{ mt: 5 }}>
          <Typography variant="body1" color="text.secondary">
            No parties found
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
        <DialogTitle sx={{ textAlign: "center" }}>파티 가입 신청</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="entryMessage"
            label="가입 메시지"
            type="text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            placeholder="파티에 가입하고 싶은 이유나 자기소개를 입력해주세요."
            value={entryMessage}
            onChange={(e) => setEntryMessage(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={submitting}>
            취소
          </Button>
          <Button
            onClick={handleSubmitJoin}
            color="primary"
            variant="contained"
            disabled={submitting || !entryMessage.trim()}
          >
            {submitting ? "신청 중..." : "가입 신청"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
