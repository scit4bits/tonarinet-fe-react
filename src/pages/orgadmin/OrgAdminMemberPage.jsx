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
  Switch,
  TablePagination,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import useUserList from "../../hooks/useUserList";
import {
  changeUserRole,
  setUserAdmin,
  toggleUserGrant,
} from "../../utils/user";
import useOrgMemberList from "../../hooks/useOrgMemberList";
import { useParams } from "react-router";

// 시스템 관리자: 유저 관리 페이지
export default function OrgAdminMemberPage() {
  const { t } = useTranslation();
  const { orgId } = useParams();
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
  } = useOrgMemberList(orgId);

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

  // 승인 여부 TOGGLE
  const handleGrantToggle = async (userId) => {
    try {
      const response = await toggleUserGrant(userId, orgId);
      await refresh();
    } catch (error) {
      console.error("Error toggling admin status:", error);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const response = await changeUserRole(userId, orgId, newRole);
      await refresh();
    } catch (error) {
      console.error("Error changing user role:", error);
    }
  };

  return (
    <main className="mt-5">
      <title>{t("pages.sysAdmin.users.title")}</title>

      <Typography variant="h4" gutterBottom>
        유저 관리
      </Typography>

      <Box className="flex gap-5 items-center">
        <FormControl size="small" className="min-w-[120px]">
          <InputLabel>검색 키워드</InputLabel>
          <Select
            value={searchBy}
            onChange={(e) => setSearchBy(e.target.value)}
            label="검색 키워드"
          >
            <MenuItem value="all">전체</MenuItem>
            <MenuItem value="id">ID</MenuItem>
            <MenuItem value="email">이메일</MenuItem>
            <MenuItem value="name">이름</MenuItem>
            <MenuItem value="nickname">닉네임</MenuItem>
            <MenuItem value="phone">핸드폰</MenuItem>
            <MenuItem value="nationality">국가</MenuItem>
          </Select>
        </FormControl>

        <TextField
          placeholder={`Search ${
            searchBy === "all" ? "users" : `by ${searchBy}`
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
                  이메일
                </TableSortLabel>
              </TableCell>

              <TableCell>
                <TableSortLabel
                  active={sortBy === "name"}
                  direction={sortBy === "name" ? sortDirection : "asc"}
                  onClick={() => handleRequestSort("name")}
                >
                  이름
                </TableSortLabel>
              </TableCell>

              <TableCell>
                <TableSortLabel
                  active={sortBy === "nickname"}
                  direction={sortBy === "nickname" ? sortDirection : "asc"}
                  onClick={() => handleRequestSort("nickname")}
                >
                  닉네임
                </TableSortLabel>
              </TableCell>

              <TableCell>
                <TableSortLabel
                  active={sortBy === "phone"}
                  direction={sortBy === "phone" ? sortDirection : "asc"}
                  onClick={() => handleRequestSort("phone")}
                >
                  핸드폰
                </TableSortLabel>
              </TableCell>

              <TableCell>
                <TableSortLabel
                  active={sortBy === "birth"}
                  direction={sortBy === "birth" ? sortDirection : "asc"}
                  onClick={() => handleRequestSort("birth")}
                >
                  생일
                </TableSortLabel>
              </TableCell>

              <TableCell>
                <TableSortLabel
                  active={sortBy === "nationality"}
                  direction={sortBy === "nationality" ? sortDirection : "asc"}
                  onClick={() => handleRequestSort("nationality")}
                >
                  국가
                </TableSortLabel>
              </TableCell>

              <TableCell>역할</TableCell>
              <TableCell>승인여부</TableCell>
              <TableCell>탈퇴</TableCell>
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
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <Select
                        value={user.role || "user"}
                        onChange={(e) => {
                          handleRoleChange(user.id, e.target.value);
                        }}
                      >
                        <MenuItem value="user">User</MenuItem>
                        <MenuItem value="admin">Admin</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={user.isGranted}
                      onClick={() => handleGrantToggle(user.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => {
                        if (
                          window.confirm(
                            `Are you sure you want to delete user ${user.name}?`
                          )
                        ) {
                          // Handle delete logic here
                          console.log(`Deleting user ${user.id}`);
                        }
                      }}
                    >
                      탈퇴
                    </Button>
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
