import {useEffect, useState} from "react";
import {useNavigate} from "react-router";
import {useTranslation} from "react-i18next";
import i18n from "../../i18n";
import {
    Alert,
    Box,
    Chip,
    CircularProgress,
    Pagination,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Tooltip,
    Typography,
} from "@mui/material";
import taxios from "../../utils/taxios";

export default function MyPageCounselPage() {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [menuAnchor, setMenuAnchor] = useState(null);
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const currentLocale =
        i18n.language === "ko"
            ? "ko-KR"
            : i18n.language === "ja"
                ? "ja-JP"
                : "en-US";

    useEffect(() => {
        fetchArticles();
    }, []);

    const fetchArticles = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await taxios.get("/user/mycounsels");
            setArticles(response.data);
        } catch (err) {
            setError(
                err.response?.data?.message || t("common.failedToFetchArticles")
            );
            console.error("Error fetching articles:", err);
        } finally {
            setLoading(false);
        }
    };

    const itemsPerPage = 10;

    // 페이지네이션 계산
    const totalPages = Math.ceil(articles.length / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;
    const paginatedArticles = articles.slice(
        startIndex,
        startIndex + itemsPerPage
    );

    // 날짜 포맷팅 함수
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        const isToday = date.toDateString() === today.toDateString();

        if (isToday) {
            // 오늘이면 시간 표시 (HH:MM)
            return date.toLocaleTimeString(currentLocale, {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
            });
        } else {
            // 오늘이 아니면 연/월/일
            return date.toLocaleDateString(currentLocale, {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
            });
        }
    };

    // 게시글 클릭 핸들러
    const handleArticleClick = (article) => {
        navigate(`/board/view/${article.id}`);
    };

    // 페이지 변경 핸들러
    const handlePageChange = (event, value) => {
        setPage(value);
    };

    // 메뉴 핸들러
    const handleMenuClick = (event, article) => {
        event.stopPropagation();
        setMenuAnchor(event.currentTarget);
        setSelectedArticle(article);
    };

    const handleMenuClose = () => {
        setMenuAnchor(null);
        setSelectedArticle(null);
    };

    return (
        <Box className="max-w-[1400px] mx-auto mt-10 px-4 mb-8">
            <Typography variant="h4" className="font-bold mb-6">
                {t("common.myCounselPosts")}
            </Typography>

            {/* 로딩 상태 */}
            {loading && (
                <Box className="flex justify-center items-center py-12">
                    <CircularProgress/>
                </Box>
            )}

            {/* 에러 상태 */}
            {error && (
                <Alert severity="error" className="mb-4">
                    {error}
                </Alert>
            )}

            {/* 데이터가 있을 때만 테이블 표시 */}
            {!loading && !error && (
                <>
                    <Paper className="overflow-hidden">
                        <Table size="small">
                            <TableHead>
                                <TableRow className="bg-gray-50">
                                    <TableCell
                                        align="center"
                                        className="font-semibold min-w-[60px]"
                                    >
                                        {t("common.tableNumber")}
                                    </TableCell>
                                    <TableCell
                                        align="center"
                                        className="font-semibold min-w-[300px]"
                                    >
                                        {t("common.tableTitle")}
                                    </TableCell>
                                    <TableCell
                                        align="center"
                                        className="font-semibold min-w-[120px]"
                                    >
                                        {t("common.tableAuthor")}
                                    </TableCell>
                                    <TableCell
                                        align="center"
                                        className="font-semibold min-w-[120px]"
                                    >
                                        {t("common.tableCreatedDate")}
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paginatedArticles.map((article) => (
                                    <TableRow
                                        key={article.id}
                                        hover
                                        className="cursor-pointer"
                                        onClick={() => handleArticleClick(article)}
                                    >
                                        <TableCell align="center" className="text-gray-600">
                                            {article.id}
                                        </TableCell>
                                        <TableCell
                                            className="text-blue-600 hover:text-blue-800 font-medium"
                                            style={{
                                                maxWidth: "300px",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap",
                                            }}
                                            title={article.title}
                                        >
                                            {article.title}
                                            {article.tags && article.tags.length > 0 && (
                                                <Box className="flex gap-1 mt-1">
                                                    {article.tags.slice(0, 3).map((tag, index) => (
                                                        <Chip
                                                            key={index}
                                                            label={tag}
                                                            size="small"
                                                            variant="outlined"
                                                            className="text-xs h-5"
                                                        />
                                                    ))}
                                                    {article.tags.length > 3 && (
                                                        <Chip
                                                            label={`+${article.tags.length - 3}`}
                                                            size="small"
                                                            variant="outlined"
                                                            className="text-xs h-5"
                                                        />
                                                    )}
                                                </Box>
                                            )}
                                        </TableCell>
                                        <TableCell align="center" className="text-gray-700">
                                            {article.createdByName}
                                        </TableCell>
                                        <TableCell align="center" className="text-gray-600 text-sm">
                                            <Tooltip
                                                title={new Date(article.createdAt).toLocaleString(
                                                    currentLocale
                                                )}
                                            >
                                                <span>{formatDate(article.createdAt)}</span>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Paper>

                    {/* 페이지네이션 */}
                    {totalPages > 1 && (
                        <Box className="flex justify-center mt-6">
                            <Pagination
                                count={totalPages}
                                page={page}
                                onChange={handlePageChange}
                                color="primary"
                                shape="rounded"
                                showFirstButton
                                showLastButton
                                siblingCount={2}
                                boundaryCount={1}
                            />
                        </Box>
                    )}

                    {/* 빈 상태 */}
                    {articles.length === 0 && !loading && !error && (
                        <Paper className="p-8 text-center">
                            <Typography variant="h6" color="text.secondary" className="mb-2">
                                {t("common.noCounselPostsWritten")}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {t("common.writeFirstCounselPost")}
                            </Typography>
                        </Paper>
                    )}
                </>
            )}
        </Box>
    );
}
