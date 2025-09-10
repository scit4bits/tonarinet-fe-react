import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
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
	TablePagination,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import useArticleList from "../../hooks/useArticleList";
import { useParams } from "react-router";

// 조직 관리자: 상담 목록 페이지
export default function OrgAdminCounselPage() {
	const { t } = useTranslation();
  const {orgId} = useParams();
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
	} = useArticleList(orgId, "counsel");

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
		navigate(`/orgadmin/counsel/${articleId}`);
	};

	return (
		<main className="mt-5">
			<title>{t("pages.orgAdmin.counseling.title")}</title>

			<Typography variant="h4" gutterBottom>
				상담 목록 관리
			</Typography>

			<Box className="flex gap-5 items-center mb-4">
				<FormControl size="small" className="min-w-[120px]">
					<InputLabel>검색 키워드</InputLabel>
					<Select
						value={searchBy}
						onChange={(e) => setSearchBy(e.target.value)}
						label="검색 키워드"
					>
						<MenuItem value="all">전체</MenuItem>
						<MenuItem value="id">ID</MenuItem>
						<MenuItem value="title">제목</MenuItem>
						<MenuItem value="createdByName">작성자</MenuItem>
						<MenuItem value="contents">내용</MenuItem>
					</Select>
				</FormControl>

				<TextField
					placeholder={`Search ${
						searchBy === "all" ? "articles" : `by ${searchBy}`
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
									active={sortBy === "title"}
									direction={sortBy === "title" ? sortDirection : "asc"}
									onClick={() => handleRequestSort("title")}
								>
									제목
								</TableSortLabel>
							</TableCell>

							<TableCell>
								<TableSortLabel
									active={sortBy === "createdByName"}
									direction={sortBy === "createdByName" ? sortDirection : "asc"}
									onClick={() => handleRequestSort("createdByName")}
								>
									작성자
								</TableSortLabel>
							</TableCell>

							<TableCell>
								<TableSortLabel
									active={sortBy === "createdAt"}
									direction={sortBy === "createdAt" ? sortDirection : "asc"}
									onClick={() => handleRequestSort("createdAt")}
								>
									작성일
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
