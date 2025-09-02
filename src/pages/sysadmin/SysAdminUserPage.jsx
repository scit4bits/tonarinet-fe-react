import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import taxios from "../../utils/taxios";
import { fetchUsers, setUserAdmin } from "../../utils/user";

export default function SysAdminUserPage() {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers().then((data) => setUsers(data));
  }, []);

  const handleRowClick = (user) => {
    setSelectedUser(user);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedUser(null);
  };

  const handleAdminToggle = async (userId) => {
    try {
      const response = await setUserAdmin(userId);
      fetchUsers().then((data) => setUsers(data));
    } catch (error) {
      console.error("Error toggling admin status:", error);
    }
  };

  return (
    <div className="mt-5">
      <title>{t("pages.sysAdmin.users.title")}</title>
      <Typography variant="h4" gutterBottom>
        유저 관리
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Nickname</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Birth</TableCell>
              <TableCell>Nationality</TableCell>
              <TableCell>Admin</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} hover>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.nickname}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>{user.birth}</TableCell>
                <TableCell>{user.nationality}</TableCell>
                <TableCell>
                  <Switch
                    checked={user.isAdmin}
                    onMouseDown={() => handleAdminToggle(user.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
