import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  AvatarGroup,
  Box,
  TextField,
  InputAdornment,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableSortLabel,
  TableBody,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import useOrganizationList from "../../hooks/useOrganizationList";
import {
  createOrganization,
  updateOrganization,
} from "../../utils/organization";

export default function SysAdminOrgPage() {
  const { t } = useTranslation();
  const {
    organizations,
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
  } = useOrganizationList();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    description: null,
    countryCode: "",
    type: "",
  });

  useEffect(() => {
    console.log(organizations);
  }, [organizations]);

  const handleRequestSort = (property) => {
    const isAsc = sortBy === property && sortDirection === "asc";
    setSortDirection(isAsc ? "desc" : "asc");
    setSortBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddOrganization = async () => {
    console.log("Adding organization:", formData);
    try {
      await createOrganization(
        formData.name,
        formData.countryCode,
        formData.type
      );
      await refresh();
    } catch (e) {
      console.error(e);
    }

    setFormData({ name: "", countryCode: "", type: "" });

    setOpenDialog(false);
  };

  const handleUpdateOrganization = async () => {
    console.log("Updating organization:", formData);
    try {
      await updateOrganization(
        formData.id,
        formData.name,
        formData.countryCode,
        formData.type
      );
      await refresh();
    } catch (e) {
      console.error(e);
    }

    setFormData({ name: "", countryCode: "", type: "" });
    setSelectedOrg(null);
    setOpenDialog(false);
  };

  const handleRowClick = (org) => {
    setSelectedOrg(org);
    // Add your row click logic here
    console.log("Clicked organization:", org);
    setFormData({
      id: org.id,
      name: org.name,
      countryCode: org.countryCode,
      type: org.type,
    });
    setOpenDialog(true);
  };

  return (
    <Box sx={{ padding: 2 }}>
      <title>{t("pages.sysAdmin.organizations.title")}</title>
      <Typography variant="h4" gutterBottom>
        조직 관리
      </Typography>
      <Card>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: 2,
              gap: 2,
            }}
          >
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Search by</InputLabel>
                <Select
                  value={searchBy}
                  onChange={(e) => setSearchBy(e.target.value)}
                  label="Search by"
                >
                  <MenuItem value="all">All Fields</MenuItem>
                  <MenuItem value="name">Name</MenuItem>
                  <MenuItem value="country">Country</MenuItem>
                  <MenuItem value="type">Type</MenuItem>
                  <MenuItem value="id">ID</MenuItem>
                </Select>
              </FormControl>
              <TextField
                placeholder={`Search ${
                  searchBy === "all" ? "organizations" : `by ${searchBy}`
                }...`}
                variant="outlined"
                size="small"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ minWidth: 250 }}
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
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenDialog(true)}
            >
              Add Organization
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === "id"}
                      direction={sortBy === "id" ? sortDirection : "asc"}
                      onClick={() => handleRequestSort("id")}
                    >
                      ID
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === "name"}
                      direction={sortBy === "name" ? sortDirection : "asc"}
                      onClick={() => handleRequestSort("name")}
                    >
                      Name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === "country"}
                      direction={sortBy === "country" ? sortDirection : "asc"}
                      onClick={() => handleRequestSort("country")}
                    >
                      Country
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === "type"}
                      direction={sortBy === "type" ? sortDirection : "asc"}
                      onClick={() => handleRequestSort("type")}
                    >
                      Type
                    </TableSortLabel>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : (
                  organizations.data.map((org) => (
                    <TableRow
                      key={org.id}
                      onClick={() => handleRowClick(org)}
                      hover
                      className="cursor-pointer"
                    >
                      <TableCell>{org.id}</TableCell>
                      <TableCell>{org.name}</TableCell>
                      <TableCell>{org.countryCode}</TableCell>
                      <TableCell>{org.type}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={organizations.totalElements}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={pageSize}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </CardContent>
      </Card>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add New Organization</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Country Code"
            value={formData.countryCode}
            onChange={(e) => {
              setFormData({ ...formData, countryCode: e.target.value });
            }}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Type"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenDialog(false);
              setSelectedOrg(null);
            }}
          >
            Cancel
          </Button>
          {setSelectedOrg ? (
            <Button onClick={handleUpdateOrganization} variant="contained">
              Edit
            </Button>
          ) : (
            <Button onClick={handleAddOrganization} variant="contained">
              Add
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}
