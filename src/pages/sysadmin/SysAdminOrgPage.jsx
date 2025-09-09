import { useState } from "react";
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
	Button,
	TableContainer,
	Paper,
	Table,
	TableHead,
	TableBody,
	TableRow,
	TableCell,
	TableSortLabel,
	CircularProgress,
	TablePagination,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import useOrganizationList from "../../hooks/useOrganizationList";
import {
	createOrganization,
	updateOrganization,
} from "../../utils/organization";
import countryCode from "../../data/countryCode.json";

// 시스템 관리자: 조직 관리 페이지
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
	const orgList = ["SCHOOL", "COMPANY"];

	// 정렬
	const handleRequestSort = (property) => {
		const isAsc = sortBy === property && sortDirection === "asc";
		setSortDirection(isAsc ? "desc" : "asc");
		setSortBy(property);
	};

	// 조직 추가 버튼
	const handleAddBtnClick = () => {
		setSelectedOrg(null);
		setFormData({ name: "", countryCode: "", type: "" });
		setOpenDialog(true);
	};

	// 조직 추가
	const handleAddOrganization = async () => {
		if (!formData.name || !formData.countryCode || !formData.type) {
			alert("추가할 조직의 정보를 모두 입력해 주세요.");
			return;
		}

		try {
			await createOrganization(
				formData.name,
				formData.countryCode,
				formData.type
			);
			await refresh();
		} catch (error) {
			console.error("Failed to add organization", error);
		}

		setFormData({ name: "", countryCode: "", type: "" });
		setOpenDialog(false);
	};

	// 조직 선택 및 수정 모드
	const handleRowClick = (org) => {
		setSelectedOrg(org);

		setFormData({
			id: org.id,
			name: org.name,
			countryCode: org.countryCode,
			type: org.type,
		});

		setOpenDialog(true);
	};

	// 조직 수정
	const handleUpdateOrganization = async () => {
		if (!formData.name || !formData.countryCode || !formData.type) {
			alert("수정할 조직의 정보를 모두 입력해 주세요.");
			return;
		}

		try {
			await updateOrganization(
				formData.id,
				formData.name,
				formData.countryCode,
				formData.type
			);
			await refresh();
		} catch (error) {
			console.error("Failed to add organization", error);
		}

		setFormData({ name: "", countryCode: "", type: "" });
		setSelectedOrg(null);
		setOpenDialog(false);
	};

	// Dialog 닫기
	const handleCloseDialog = () => {
		setOpenDialog(false);
		setSelectedOrg(null);
		setFormData({
			name: "",
			countryCode: "",
			type: "",
		});
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

	return (
		<main className="mt-5">
			<title>{t("pages.sysAdmin.organizations.title")}</title>

			<Typography gutterBottom variant="h4" className="mt-10 mb-7">
				조직 관리
			</Typography>

			<Box className="flex justify-between mb-4 gap-4">
				<Box className="flex items-center gap-1">
					<FormControl size="small" className="min-w-[120px]">
						<InputLabel>검색 키워드</InputLabel>
						<Select
							value={searchBy}
							onChange={(e) => setSearchBy(e.target.value)}
							label="검색 키워드"
						>
							<MenuItem value="all">전체</MenuItem>
							<MenuItem value="id">ID</MenuItem>
							<MenuItem value="name">조직명</MenuItem>
							<MenuItem value="country">소속 국가</MenuItem>
							<MenuItem value="type">조직 타입</MenuItem>
						</Select>
					</FormControl>

					<TextField
						variant="outlined"
						size="small"
						className="min-w-[250px]"
						value={search}
						placeholder={`Search ${
							searchBy === "all" ? "organizations" : `by ${searchBy}`
						}`}
						onChange={(e) => setSearch(e.target.value)}
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
					onClick={handleAddBtnClick}
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
									조직명
								</TableSortLabel>
							</TableCell>

							<TableCell>
								<TableSortLabel
									active={sortBy === "country"}
									direction={sortBy === "country" ? sortDirection : "asc"}
									onClick={() => handleRequestSort("country")}
								>
									소속 국가
								</TableSortLabel>
							</TableCell>

							<TableCell>
								<TableSortLabel
									active={sortBy === "type"}
									direction={sortBy === "type" ? sortDirection : "asc"}
									onClick={() => handleRequestSort("type")}
								>
									조직 타입
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
									hover
									key={org.id}
									onClick={() => handleRowClick(org)}
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

			<Dialog
				fullWidth
				open={openDialog}
				onClose={handleCloseDialog}
				maxWidth="sm"
			>
				<DialogTitle>
					{selectedOrg ? "Edit Organization" : "Add New Organization"}
				</DialogTitle>
				<DialogContent>
					<TextField
						fullWidth
						label="Name"
						size="small"
						margin="normal"
						value={formData.name}
						onChange={(e) => setFormData({ ...formData, name: e.target.value })}
					/>

					{/* <TextField
						fullWidth
						label="Description"
						size="small"
						margin="normal"
						value={formData.description}
						onChange={(e) =>
							setFormData({ ...formData, description: e.target.value })
						}
					/> */}

					<FormControl fullWidth size="small" margin="normal">
						<InputLabel id="country-code-label">Country Code</InputLabel>
						<Select
							labelId="country-code-label"
							label="Country Code"
							size="small"
							margin="normal"
							value={formData.countryCode ?? ""}
							onChange={(e) =>
								setFormData({ ...formData, countryCode: e.target.value })
							}
							displayEmpty
						>
							{countryCode.data.map((country) => (
								<MenuItem key={country.countryCode} value={country.countryCode}>
									{country.kCountryName}
								</MenuItem>
							))}
						</Select>
					</FormControl>

					{/* <TextField
						fullWidth
						label="Country Code"
						value={formData.countryCode}
						onChange={(e) => {
							setFormData({ ...formData, countryCode: e.target.value });
						}}
						margin="normal"
					/> */}

					<FormControl fullWidth size="small" margin="normal">
						<InputLabel id="org-type-label">Type</InputLabel>
						<Select
							labelId="org-type-label"
							label="Type"
							value={formData.type ?? ""}
							onChange={(e) =>
								setFormData({ ...formData, type: e.target.value })
							}
							displayEmpty
						>
							{orgList.map((type) => (
								<MenuItem key={type} value={type}>
									{type}
								</MenuItem>
							))}
						</Select>
					</FormControl>

					{/* <TextField
						fullWidth
						label="Type"
						value={formData.type}
						onChange={(e) => setFormData({ ...formData, type: e.target.value })}
						margin="normal"
					/> */}
				</DialogContent>

				<DialogActions>
					<Button onClick={handleCloseDialog}>Cancel</Button>
					{selectedOrg ? (
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
		</main>
	);
}
