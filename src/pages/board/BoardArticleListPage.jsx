import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import {
  Button,
  IconButton,
  Typography,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import EditIcon from "@mui/icons-material/Edit";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import FlagIcon from "@mui/icons-material/Flag";
import PushPinIcon from "@mui/icons-material/PushPin";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import taxios from "../../utils/taxios";
import useMyBoardList from "../../hooks/useMyBoardList";
import {
  getBoardHotArticles,
  getLastVisitedBoard,
  searchArticles,
  setLastVisitedBoard,
} from "../../utils/board";

export default function BoardArticleListPage() {
  const { t } = useTranslation();
  const { boardId } = useParams();
  const navigate = useNavigate();
  const { boards } = useMyBoardList();

  // 선택된 게시판 상태
  const [selectedBoard, setSelectedBoard] = useState(null);

  // 카테고리 선택 상태
  const [selectedCategory, setSelectedCategory] = useState("all");

  // 페이지네이션 상태
  const [page, setPage] = useState(0);
  const [noticePage, setNoticePage] = useState(0);
  const [hotPage, setHotPage] = useState(0);

  // 게시글 데이터
  const [articles, setArticles] = useState(null);
  //핫게시물 더미데이터 - 추천수 15개 이상인 게시글 중 추천수 높은 순으로 정렬
  const [hotArticles, setHotArticles] = useState(null);
  //공지사항 더미데이터
  const [notice, setNotice] = useState(null);
  const [searchBy, setSearchBy] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    console.log(boards);
    if (boards && (boardId === "undefined" || boardId === undefined)) {
      const fallbackBoardId = boardId ?? getLastVisitedBoard() ?? boards[0]?.id;
      console.log(fallbackBoardId);
      if (fallbackBoardId !== "undefined" && fallbackBoardId !== undefined) {
        console.log(fallbackBoardId);
        window.location.href = `/board/${fallbackBoardId}`;
      }
    }
  }, [boards]);

  useEffect(() => {
    searchArticles(boardId, selectedCategory, searchBy, search).then((data) => {
      setArticles(data);
    });
  }, [selectedCategory, searchBy, search]);

  useEffect(() => {
    getBoardHotArticles(boardId).then((data) => {
      setHotArticles(data);
    });
  }, []);

  useEffect(() => {
    searchArticles(boardId, "notice").then((data) => {
      setNotice(data);
    });
  }, []);

  useEffect(() => {
    if (boardId !== "undefined" && boardId !== undefined) {
      setLastVisitedBoard(boardId);
    }
  }, []);

  // ===== 상수 및 함수들 =====
  // 카테고리 목록
  const categories = useMemo(
    () => [
      { value: "general", label: t("common.general") },
      { value: "question", label: t("common.question") },
      { value: "tip", label: t("common.tip") },
      { value: "notice", label: t("common.notice") },
    ],
    [t]
  );

  // 게시판 변경 핸들러
  const handleBoardChange = (event) => {
    const newBoardId = event.target.value;
    setSelectedBoard(newBoardId);
    window.location.href = `/board/${newBoardId}`;
  };

  // 카테고리 변경 핸들러
  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setPage(0); // 카테고리 변경 시 첫 페이지로 이동
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // 날짜 포맷팅 함수
  const formatDate = (dateString) => {
    const today = new Date();
    // 오늘 날짜인지 확인 (년, 월, 일이 같은지)
    const isToday =
      dateString.split("T")[0] === today.toISOString().split("T")[0];

    if (isToday) {
      // 오늘이면 시간 표시 (HH:MM)
      return dateString.split("T")[1].slice(0, 5);
    } else {
      // 오늘이 아니면 연/월/일만
      return dateString.split("T")[0];
    }
  };

  const convertCategoryName = (category) => {
    const found = categories.find((c) => c.value === category);
    return found ? found.label : category;
  };

  const handleNoticePrev = () => setNoticePage((p) => Math.max(0, p - 1));
  const handleNoticeNext = () =>
    setNoticePage((p) => Math.min(notice.totalPages, p + 1));

  const handleHotPrev = () => setHotPage((p) => Math.max(0, p - 1));
  const handleHotNext = () =>
    setHotPage((p) => Math.min(hotArticles.totalPages, p + 1));

  if (!boards || !articles || !hotArticles || !notice)
    return <div>{t("common.loading")}</div>;

  return (
    <Box className="max-w-[1400px] mx-auto mt-10 px-4 mb-8 overflow-hidden rounded p-4 shadow flex-1">
      <title>{t("pages.board.articles.title")}</title>
      {/* 게시판 선택 드롭다운과 제목 */}
      <div className="flex items-center gap-3 mb-6 justify-between">
        <FormControl size="small" className="min-w-[200px]">
          <InputLabel id="board-select-label">
            {t("pages.board.articles.boardSelection")}
          </InputLabel>
          <Select
            labelId="board-select-label"
            value={selectedBoard}
            label={t("pages.board.articles.boardSelection")}
            onChange={handleBoardChange}
            IconComponent={KeyboardArrowDownIcon}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 300, // 스크롤 가능한 최대 높이
                },
              },
            }}
          >
            {boards.map((board) => (
              <MenuItem key={board.id} value={board.id}>
                {board.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Typography variant="h4" className="font-bold">
          <FlagIcon sx={{ mr: 1, verticalAlign: "middle" }} />
          {boards.filter((board) => board.id == boardId)[0]?.title ||
            t("pages.board.articles.boardNotFound")}
        </Typography>
        <div />
        <div />
      </div>

      {/* 카테고리 선택과 글쓰기 버튼 */}
      <div className="flex justify-between items-center mb-4">
        <FormControl size="small" className="min-w-[150px]">
          <InputLabel id="category-select-label">
            {t("pages.board.articles.categoryFilter")}
          </InputLabel>
          <Select
            labelId="category-select-label"
            value={selectedCategory}
            label={t("pages.board.articles.categoryFilter")}
            onChange={handleCategoryChange}
            IconComponent={KeyboardArrowDownIcon}
          >
            <MenuItem value="all">
              <em>{t("pages.board.articles.allCategories")}</em>
            </MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.value} value={category.value}>
                {category.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <div className="flex items-center gap-2">
          <FormControl size="small" className="min-w-[120px]">
            <InputLabel id="searchby-select-label">
              {t("pages.board.articles.searchCriteria")}
            </InputLabel>
            <Select
              labelId="searchby-select-label"
              value={searchBy}
              label={t("pages.board.articles.searchCriteria")}
              onChange={(e) => setSearchBy(e.target.value)}
              IconComponent={KeyboardArrowDownIcon}
            >
              <MenuItem value="all">
                {t("pages.board.articles.integratedSearch")}
              </MenuItem>
              <MenuItem value="id">{t("pages.board.articles.postId")}</MenuItem>
              <MenuItem value="title">
                {t("pages.board.articles.postTitle")}
              </MenuItem>
              <MenuItem value="contents">
                {t("pages.board.articles.postContent")}
              </MenuItem>
              <MenuItem value="creator">
                {t("pages.board.articles.authorId")}
              </MenuItem>
            </Select>
          </FormControl>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("pages.board.articles.searchPlaceholder")}
            className="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            style={{ minWidth: "200px" }}
          />
        </div>

        <Button
          variant="contained"
          color="primary"
          startIcon={<EditIcon />}
          onClick={() => navigate(`/board/${boardId}/write`)}
        >
          {t("pages.board.articles.writePost")}
        </Button>
      </div>

      <div className="flex lg:flex-row gap-6 items-stretch">
        {/* 게시글 영역 */}
        <div className="flex-1 min-w-0">
          <Table size="small" className=" w-full rounded p-4 shadow flex-1">
            <TableHead>
              <TableRow>
                <TableCell align="center" className="min-w-[40px]">
                  {t("pages.board.articles.tableHeaders.number")}
                </TableCell>
                <TableCell align="center" className="min-w-[80px]">
                  {t("pages.board.articles.tableHeaders.category")}
                </TableCell>
                <TableCell align="center" className="min-w-[300px]">
                  {t("pages.board.articles.tableHeaders.title")}
                </TableCell>
                <TableCell align="center" className="min-w-[100px]">
                  {t("pages.board.articles.tableHeaders.author")}
                </TableCell>
                <TableCell align="center" className="min-w-[120px]">
                  {t("pages.board.articles.tableHeaders.createdDate")}
                </TableCell>
                <TableCell align="center" className="min-w-[80px]">
                  {t("pages.board.articles.tableHeaders.views")}
                </TableCell>
                <TableCell align="center" className="min-w-[80px]">
                  {t("pages.board.articles.tableHeaders.likes")}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {articles.data.map((article, index) => (
                <TableRow key={article.id} hover>
                  <TableCell align="center">{article.id}</TableCell>
                  <TableCell align="center">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {convertCategoryName(article.category)}
                    </span>
                  </TableCell>
                  <TableCell
                    className="text-blue-600 hover:underline cursor-pointer"
                    onClick={() => navigate(`/board/view/${article.id}`)}
                    style={{
                      maxWidth: "300px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                    title={article.title}
                  >
                    {article.title}
                  </TableCell>
                  <TableCell align="center">{article.createdByName}</TableCell>
                  <TableCell align="center">
                    {formatDate(article.createdAt)}
                  </TableCell>
                  <TableCell align="center">{article.views || 0}</TableCell>
                  <TableCell
                    align="center"
                    className="text-red-600 font-medium"
                  >
                    {article.likedByUsers || 0}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* 페이지네이션 */}
          <div className="flex justify-center items-center mt-6">
            <Pagination
              count={articles.totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              shape="rounded"
              showFirstButton
              showLastButton
              siblingCount={5}
              boundaryCount={1}
            />
          </div>
        </div>

        {/* 사이드바 */}
        <div className="w-68 flex flex-col flex-shrink-0">
          {/* 공지사항 */}
          <Box className="rounded p-4 shadow mb-6 flex-1">
            <div className="flex justify-between items-center mb-2">
              <Typography variant="h6" className="flex items-center gap-1">
                <AnnouncementIcon fontSize="small" />{" "}
                {t("pages.board.articles.notices")}
              </Typography>
              <div className="flex items-center space-x-1 text-sm text-gray-600">
                <span>
                  {noticePage + 1} / {notice.totalPages}
                </span>
                <IconButton
                  size="small"
                  onClick={handleNoticePrev}
                  disabled={noticePage === 0}
                >
                  <ArrowBackIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={handleNoticeNext}
                  disabled={noticePage + 1 === notice.totalPages}
                >
                  <ArrowForwardIcon />
                </IconButton>
              </div>
            </div>
            <ul className="list-disc list-inside text-sm text-gray-700 text-left">
              {notice.data.map((notice) => (
                <li
                  key={notice.id}
                  className="text-blue-600 hover:underline cursor-pointer flex justify-between items-center"
                  onClick={() => navigate(`/board/view/${notice.id}`)}
                >
                  <span
                    style={{
                      maxWidth: "200px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      display: "inline-block",
                    }}
                    title={notice.title}
                  >
                    {notice.title}
                  </span>
                  <span className="text-gray-500 text-xs ml-2">
                    {formatDate(notice.createdAt)}
                  </span>
                </li>
              ))}
            </ul>
          </Box>

          {/* HOT 게시물 */}
          <Box className="rounded p-4 shadow flex-1">
            <div className="flex justify-between items-center mb-2">
              <Typography variant="h6" className="flex items-center gap-1">
                <WhatshotIcon fontSize="small" />{" "}
                {t("pages.board.articles.hotPosts")}
              </Typography>
              <div className="flex items-center space-x-1 text-sm text-gray-600">
                <span>
                  {hotPage + 1} / {hotArticles.totalPages}
                </span>
                <IconButton
                  size="small"
                  onClick={handleHotPrev}
                  disabled={hotPage === 0}
                >
                  <ArrowBackIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={handleHotNext}
                  disabled={hotPage + 1 === hotArticles.totalPages}
                >
                  <ArrowForwardIcon />
                </IconButton>
              </div>
            </div>
            <ul className="space-y-1 text-sm text-gray-700 text-left">
              {hotArticles.data.map((item) => (
                <li
                  key={item.id}
                  className="text-blue-600 hover:underline cursor-pointer flex justify-between items-center"
                  onClick={() => navigate(`/board/view/${item.id}`)}
                >
                  <span
                    style={{
                      maxWidth: "200px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      display: "inline-block",
                    }}
                    title={item.title}
                  >
                    <PushPinIcon
                      sx={{ fontSize: 16, mr: 0.5, verticalAlign: "middle" }}
                    />{" "}
                    {item.title}
                  </span>
                  <span className="text-red-600 text-xs font-medium">
                    <ThumbUpIcon
                      sx={{ fontSize: 14, mr: 0.5, verticalAlign: "middle" }}
                    />
                    {item.likedByUsers || 0}
                  </span>
                </li>
              ))}
            </ul>
          </Box>
        </div>
      </div>
    </Box>
  );
}
