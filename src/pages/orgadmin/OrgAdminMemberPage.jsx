import {useTranslation} from "react-i18next";
import {
    Box,
    Button,
    CircularProgress,
    FormControl,
    InputAdornment,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
    TextField,
    Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import {changeUserRole, toggleUserGrant,} from "../../utils/user";
import useOrgMemberList from "../../hooks/useOrgMemberList";
import {useParams} from "react-router";

// 시스템 관리자: 유저 관리 페이지
export default function OrgAdminMemberPage() {
    const {t} = useTranslation();
    const {orgId} = useParams();
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
            <title>{t("pages.orgAdmin.members.title")}</title>

            <Typography variant="h4" gutterBottom>
                {t("orgAdminPage.memberManagement")}
            </Typography>

            <Box className="flex gap-5 items-center">
                <FormControl size="small" className="min-w-[120px]">
                    <InputLabel>{t("orgAdminPage.searchKeyword")}</InputLabel>
                    <Select
                        value={searchBy}
                        onChange={(e) => setSearchBy(e.target.value)}
                        label={t("orgAdminPage.searchKeyword")}
                    >
                        <MenuItem value="all">{t("orgAdminPage.searchAll")}</MenuItem>
                        <MenuItem value="id">{t("orgAdminPage.searchById")}</MenuItem>
                        <MenuItem value="email">{t("common.email")}</MenuItem>
                        <MenuItem value="name">{t("common.name")}</MenuItem>
                        <MenuItem value="nickname">{t("common.nickname")}</MenuItem>
                        <MenuItem value="phone">{t("common.phone")}</MenuItem>
                        <MenuItem value="nationality">{t("common.nationality")}</MenuItem>
                    </Select>
                </FormControl>

                <TextField
                    placeholder={
                        searchBy === "all"
                            ? t("orgAdminPage.searchPlaceholderAll")
                            : t("orgAdminPage.searchPlaceholder", {field: searchBy})
                    }
                    variant="outlined"
                    size="small"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="min-w-[250px]"
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon/>
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
                                    {t("orgAdminPage.tableHeaderId")}
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

                            <TableCell>{t("orgAdminPage.role")}</TableCell>
                            <TableCell>{t("orgAdminPage.approved")}</TableCell>
                            <TableCell>{t("orgAdminPage.withdrawal")}</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    <CircularProgress/>
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
                                        <FormControl size="small" sx={{minWidth: 120}}>
                                            <Select
                                                value={user.role || "user"}
                                                onChange={(e) => {
                                                    handleRoleChange(user.id, e.target.value);
                                                }}
                                            >
                                                <MenuItem value="user">{t("common.user")}</MenuItem>
                                                <MenuItem value="admin">{t("common.admin")}</MenuItem>
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
                                                        t("orgAdminPage.confirmDeleteUser", {
                                                            userName: user.name,
                                                        })
                                                    )
                                                ) {
                                                    // Handle delete logic here
                                                    console.log(`Deleting user ${user.id}`);
                                                }
                                            }}
                                        >
                                            {t("orgAdminPage.withdrawal")}
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
