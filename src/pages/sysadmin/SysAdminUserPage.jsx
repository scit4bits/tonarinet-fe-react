import { useTranslation } from "react-i18next";
import {
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableSortLabel,
  CircularProgress,
  Switch,
  TablePagination,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import useUserList from "../../hooks/useUserList";
import { setUserAdmin } from "../../utils/user";

// 시스템 관리자: 유저 관리 페이지
export default function SysAdminUserPage() {
  const { t } = useTranslation();
  const {
    users,
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
  } = useUserList();

  // 정렬
  const handleRequestSort = (property) => {
    const isAsc = sortBy === property && sortDirection === "asc";
    setSortDirection(isAsc ? "desc" : "asc");
    setSortBy(property);
  };

  // 페이지 번호 (MUI TablePagination)
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // 한 페이지에 보여줄 행(row) 개수
  const handleChangeRowsPerPage = (event) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(0);
  };

  // 관리자 권한 ON/OFF
  const handleAdminToggle = async (userId) => {
    try {
      const response = await setUserAdmin(userId);
      await refresh();
    } catch (error) {
      console.error("Error toggling admin status:", error);
    }
  };

  return (
    <main className="mt-5">
      <title>{t("pages.sysAdmin.users.title")}</title>

      <Typography variant="h4" gutterBottom className="mt-10 mb-7">
        {t("pages.sysAdminPage.userManagement")}
      </Typography>

      <Box className="flex items-center mb-4 gap-4">
        <FormControl size="small" className="min-w-[120px]">
          <InputLabel>{t("common.searchKeyword")}</InputLabel>
          <Select
            value={searchBy}
            label={t("common.searchKeyword")}
            onChange={(e) => setSearchBy(e.target.value)}
          >
            <MenuItem value="all">{t("common.all")}</MenuItem>
            <MenuItem value="id">{t("common.id")}</MenuItem>
            <MenuItem value="email">{t("common.email")}</MenuItem>
            <MenuItem value="name">{t("common.name")}</MenuItem>
            <MenuItem value="nickname">{t("common.nickname")}</MenuItem>
            <MenuItem value="phone">{t("common.phone")}</MenuItem>
            <MenuItem value="birth">{t("common.birth")}</MenuItem>
            <MenuItem value="nationality">{t("common.nationality")}</MenuItem>
          </Select>
        </FormControl>

        <TextField
          value={search}
          variant="outlined"
          size="small"
          className="min-w-[250px]"
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("pages.sysAdminPage.searchByField", {
            field:
              searchBy === "all"
                ? t("pages.sysAdminPage.searchUsers")
                : searchBy,
          })}
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
                  active={sortBy === "email"}
                  direction={sortBy === "email" ? sortDirection : "asc"}
                  onClick={() => handleRequestSort("email")}
                >
                  {t("common.email")}
                </TableSortLabel>
              </TableCell>

              <TableCell>
                <TableSortLabel
                  active={sortBy === "name"}
                  direction={sortBy === "name" ? sortDirection : "asc"}
                  onClick={() => handleRequestSort("name")}
                >
                  {t("common.name")}
                </TableSortLabel>
              </TableCell>

              <TableCell>
                <TableSortLabel
                  active={sortBy === "nickname"}
                  direction={sortBy === "nickname" ? sortDirection : "asc"}
                  onClick={() => handleRequestSort("nickname")}
                >
                  {t("common.nickname")}
                </TableSortLabel>
              </TableCell>

              <TableCell>
                <TableSortLabel
                  active={sortBy === "phone"}
                  direction={sortBy === "phone" ? sortDirection : "asc"}
                  onClick={() => handleRequestSort("phone")}
                >
                  {t("common.phone")}
                </TableSortLabel>
              </TableCell>

              <TableCell>
                <TableSortLabel
                  active={sortBy === "birth"}
                  direction={sortBy === "birth" ? sortDirection : "asc"}
                  onClick={() => handleRequestSort("birth")}
                >
                  {t("common.birth")}
                </TableSortLabel>
              </TableCell>

              <TableCell>
                <TableSortLabel
                  active={sortBy === "nationality"}
                  direction={sortBy === "nationality" ? sortDirection : "asc"}
                  onClick={() => handleRequestSort("nationality")}
                >
                  {t("common.nationality")}
                </TableSortLabel>
              </TableCell>

              <TableCell>{t("common.admin")}</TableCell>
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
              users.data.map((user) => (
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
                      onClick={() => handleAdminToggle(user.id)}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={users.totalElements}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={pageSize}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </main>
  );
}
