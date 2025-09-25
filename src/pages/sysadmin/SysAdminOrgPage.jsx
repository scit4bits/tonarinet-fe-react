import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
	Box,
	Button,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
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
import AddIcon from "@mui/icons-material/Add";
import useOrganizationList from "../../hooks/useOrganizationList";
import useCountryList from "../../hooks/useCountryList";
import {
	createOrganization,
	updateOrganization,
} from "../../utils/organization";

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
	const { countries, loading: countriesLoading } = useCountryList();
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
			alert(t("pages.sysAdminPage.fillAllOrgInfo"));
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
			alert(t("pages.sysAdminPage.fillAllOrgInfoEdit"));
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
				{t("pages.sysAdminPage.organizationManagement")}
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
							<MenuItem value="all">{t("common.all")}</MenuItem>
							<MenuItem value="id">{t("common.id")}</MenuItem>
							<MenuItem value="name">
								{t("pages.sysAdminPage.organizationName")}
							</MenuItem>
							<MenuItem value="country">
								{t("pages.sysAdminPage.country")}
							</MenuItem>
							<MenuItem value="type">
								{t("pages.sysAdminPage.organizationType")}
							</MenuItem>
						</Select>
					</FormControl>

					<TextField
						variant="outlined"
						size="small"
						className="min-w-[250px]"
						value={search}
						placeholder={
							searchBy === "all"
								? t("orgAdminPage.searchPlaceholderAll")
								: t("orgAdminPage.searchPlaceholder", { field: searchBy })
						}
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
					{t("pages.sysAdminPage.addOrganization")}
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
									{t("common.id")}
								</TableSortLabel>
							</TableCell>

							<TableCell>
								<TableSortLabel
									active={sortBy === "name"}
									direction={sortBy === "name" ? sortDirection : "asc"}
									onClick={() => handleRequestSort("name")}
								>
									{t("pages.sysAdminPage.organizationName")}
								</TableSortLabel>
							</TableCell>

							<TableCell>
								<TableSortLabel
									active={sortBy === "country"}
									direction={sortBy === "country" ? sortDirection : "asc"}
									onClick={() => handleRequestSort("country")}
								>
									{t("pages.sysAdminPage.country")}
								</TableSortLabel>
							</TableCell>

							<TableCell>
								<TableSortLabel
									active={sortBy === "type"}
									direction={sortBy === "type" ? sortDirection : "asc"}
									onClick={() => handleRequestSort("type")}
								>
									{t("pages.sysAdminPage.organizationType")}
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
					{selectedOrg
						? t("pages.sysAdminPage.editOrganization")
						: t("pages.sysAdminPage.addNewOrganization")}
				</DialogTitle>
				<DialogContent>
					<TextField
						fullWidth
						label={t("common.name")}
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
						<InputLabel id="country-code-label">
							{t("pages.sysAdminPage.countryCode")}
						</InputLabel>
						<Select
							labelId="country-code-label"
							label={t("pages.sysAdminPage.countryCode")}
							size="small"
							margin="normal"
							value={formData.countryCode ?? ""}
							onChange={(e) =>
								setFormData({ ...formData, countryCode: e.target.value })
							}
							displayEmpty
						>
							{countries.map((country) => (
								<MenuItem key={country.countryCode} value={country.countryCode}>
									{country.name}
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
						<InputLabel id="org-type-label">
							{t("pages.sysAdminPage.type")}
						</InputLabel>
						<Select
							labelId="org-type-label"
							label={t("pages.sysAdminPage.type")}
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
					<Button onClick={handleCloseDialog}>{t("common.cancel")}</Button>
					{selectedOrg ? (
						<Button onClick={handleUpdateOrganization} variant="contained">
							{t("common.edit")}
						</Button>
					) : (
						<Button onClick={handleAddOrganization} variant="contained">
							{t("common.add")}
						</Button>
					)}
				</DialogActions>
			</Dialog>
		</main>
	);
}
