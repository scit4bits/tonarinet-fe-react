import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  AvatarGroup,
  Avatar,
  Box,
  Typography,
  Button,
  Dialog,
  DialogActions,
  TextField,
  DialogContentText,
  DialogTitle,
  DialogContent,
  Stack,
  Chip,
  Autocomplete,
} from "@mui/material";
import { searchOrgMembers } from "../../utils/user";
import { useParams } from "react-router";
import { createTeam, getTeamByOrgId } from "../../utils/team";

export default function OrgAdminTeamPage() {
  const { t } = useTranslation();
  const [teams, setTeams] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newTeam, setNewTeam] = useState({ name: "", members: [] });
  const [memberSearch, setMemberSearch] = useState("");
  const [members, setMembers] = useState([]);
  const { orgId } = useParams();

  useEffect(() => {
    searchOrgMembers(orgId, memberSearch, "name", 0, 9999).then((data) => {
      setMembers(data);
    });
  }, [memberSearch]);

  useEffect(() => {
    // Mock data - replace with actual API call
    getTeamByOrgId(orgId).then((data) => {
      setTeams(data);
    });
  }, []);

  const handleAddNewTeam = async () => {
    const payload = {
      orgId,
      ...newTeam,
    };

    await createTeam(payload);
    setTeams(await getTeamByOrgId(orgId));
  };

  return (
    <Box>
      <Typography variant="h3">팀 관리</Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          setNewTeam({ name: "", members: [] });
          setDialogOpen(true);
        }}
      >
        Add Team
      </Button>
      <TableContainer component={Paper}>
        <title>{t("pages.orgAdmin.teams.title")}</title>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Team Name</TableCell>
              <TableCell>Members</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {teams.map((team) => (
              <TableRow key={team.id}>
                <TableCell>{team.id}</TableCell>
                <TableCell>{team.name}</TableCell>
                <TableCell>
                  <AvatarGroup max={10}>
                    {team.users.map((member) => (
                      <Avatar
                        key={member.id}
                        alt={member.name}
                        src={member.avatar}
                      >
                        {member.name.charAt(0)}
                      </Avatar>
                    ))}
                  </AvatarGroup>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Add Team</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To create a new team, please enter the team name and members.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="teamName"
            label="Team Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newTeam.name}
            onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
          />
          <Autocomplete
            multiple
            options={members.data}
            getOptionLabel={(option) => option.name}
            value={newTeam.members}
            onChange={(event, newValue) => {
              // duplication check
              const uniqueMembers = newValue.filter(
                (member) => !newTeam.members.some((m) => m.id === member.id)
              );
              setNewTeam({
                ...newTeam,
                members: [...newTeam.members, ...uniqueMembers],
              });
            }}
            inputValue={memberSearch}
            onInputChange={(event, newInputValue) => {
              setMemberSearch(newInputValue);
            }}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  variant="outlined"
                  label={option.name}
                  {...getTagProps({ index })}
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                margin="dense"
                label="Team Members"
                variant="outlined"
                fullWidth
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleAddNewTeam();
              setDialogOpen(false);
            }}
            color="primary"
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
