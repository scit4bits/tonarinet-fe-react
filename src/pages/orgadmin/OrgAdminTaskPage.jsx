import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  TablePagination,
} from "@mui/material";
import { useNavigate } from "react-router";

export default function OrgAdminTaskPage() {
  const { t } = useTranslation();
  const [notices, setNotices] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockNotices = [
      {
        id: 1,
        title: "System Maintenance Notice",
        author: "Admin",
        createdAt: "2024-01-15",
        views: 120,
      },
      {
        id: 2,
        title: "New Feature Update",
        author: "Admin",
        createdAt: "2024-01-14",
        views: 85,
      },
      {
        id: 3,
        title: "Security Policy Changes",
        author: "Admin",
        createdAt: "2024-01-13",
        views: 203,
      },
    ];
    setNotices(mockNotices);
  }, []);

  const handleRowClick = (noticeId) => {
    navigate(`/admin/notices/${noticeId}`);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ p: 3 }}>
      <title>{t("pages.orgAdmin.tasks.title")}</title>
      <Typography variant="h4" component="h1" gutterBottom>
        Notice Management
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Author</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell align="right">Views</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {notices
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((notice) => (
                <TableRow
                  key={notice.id}
                  hover
                  onClick={() => handleRowClick(notice.id)}
                  sx={{ cursor: "pointer" }}
                >
                  <TableCell>{notice.id}</TableCell>
                  <TableCell>{notice.title}</TableCell>
                  <TableCell>{notice.author}</TableCell>
                  <TableCell>{notice.createdAt}</TableCell>
                  <TableCell align="right">{notice.views}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={notices.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Box>
  );
}
