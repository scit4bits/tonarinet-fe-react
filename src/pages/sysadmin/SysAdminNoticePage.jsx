import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
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
import CreateIcon from "@mui/icons-material/Create";
import useArticleListByBoardId from "../../hooks/useArticleListByBoardId";

// 시스템 관리자: 공지 목록 페이지
export default function SysAdminNoticePage() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const {
		articles,
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
	} = useArticleListByBoardId(0, "notice"); // Using boardId 1 for system admin notices

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

	// 행 클릭 시 상세 페이지로 이동
	const handleRowClick = (articleId) => {
		navigate(`/board/view/${articleId}`);
	};

	// 글쓰기 버튼 클릭 시 게시글 작성 페이지로 이동
	const handleWriteClick = () => {
		navigate(`/board/0/write`);
	};

	return (
		<main className="mt-5">
			<title>{t("pages.sysAdmin.notices.title")}</title>

			<Typography variant="h4" gutterBottom className="mt-10 mb-7">
				{t("pages.sysAdminPage.noticeManagement")}
			</Typography>

			<Box className="flex justify-between mb-4 gap-4">
				<Box className="flex items-center gap-1">
					<FormControl size="small" className="min-w-[120px]">
						<InputLabel>{t("pages.sysAdminPage.searchKeyword")}</InputLabel>
						<Select
							value={searchBy}
							onChange={(e) => setSearchBy(e.target.value)}
							label={t("pages.sysAdminPage.searchKeyword")}
						>
							<MenuItem value="all">{t("orgAdminPage.searchAll")}</MenuItem>
							<MenuItem value="id">{t("orgAdminPage.searchById")}</MenuItem>
							<MenuItem value="title">
								{t("orgAdminPage.searchByTitle")}
							</MenuItem>
							<MenuItem value="createdByName">
								{t("orgAdminPage.searchByAuthor")}
							</MenuItem>
							<MenuItem value="contents">
								{t("orgAdminPage.searchByContent")}
							</MenuItem>
						</Select>
					</FormControl>

					<TextField
						placeholder={
							searchBy === "all"
								? t("orgAdminPage.searchPlaceholderAll")
								: t("orgAdminPage.searchPlaceholder", { field: searchBy })
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
										<SearchIcon />
									</InputAdornment>
								),
							},
						}}
					/>
				</Box>

				<Button
					variant="contained"
					color="primary"
					startIcon={<CreateIcon />}
					onClick={handleWriteClick}
					sx={{ minWidth: "120px" }}
				>
					{t("orgAdminPage.writePost")}
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
									{t("orgAdminPage.tableHeaderId")}
								</TableSortLabel>
							</TableCell>

							<TableCell>
								<TableSortLabel
									active={sortBy === "title"}
									direction={sortBy === "title" ? sortDirection : "asc"}
									onClick={() => handleRequestSort("title")}
								>
									{t("orgAdminPage.tableHeaderTitle")}
								</TableSortLabel>
							</TableCell>

							<TableCell>
								<TableSortLabel
									active={sortBy === "createdByName"}
									direction={sortBy === "createdByName" ? sortDirection : "asc"}
									onClick={() => handleRequestSort("createdByName")}
								>
									{t("orgAdminPage.tableHeaderAuthor")}
								</TableSortLabel>
							</TableCell>

							<TableCell>
								<TableSortLabel
									active={sortBy === "createdAt"}
									direction={sortBy === "createdAt" ? sortDirection : "asc"}
									onClick={() => handleRequestSort("createdAt")}
								>
									{t("orgAdminPage.tableHeaderCreatedAt")}
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
						) : articles.data && articles.data.length > 0 ? (
							articles.data.map((article) => (
								<TableRow
									key={article.id}
									hover
									onClick={() => handleRowClick(article.id)}
									sx={{ cursor: "pointer" }}
								>
									<TableCell>{article.id}</TableCell>
									<TableCell>{article.title}</TableCell>
									<TableCell>{article.createdByName}</TableCell>
									<TableCell>
										{new Date(article.createdAt).toLocaleDateString()}
									</TableCell>
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={4} align="center">
									<Typography variant="body2" color="text.secondary">
										{t("common.noData")}
									</Typography>
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>

			<TablePagination
				component="div"
				count={articles.totalElements}
				page={page}
				onPageChange={handleChangePage}
				rowsPerPage={pageSize}
				onRowsPerPageChange={handleChangeRowsPerPage}
				rowsPerPageOptions={[5, 10, 25, 50]}
			/>
		</main>
	);
}
