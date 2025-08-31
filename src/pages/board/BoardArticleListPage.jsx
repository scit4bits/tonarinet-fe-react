import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
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
import taxios from "../../utils/taxios";

export default function BoardArticleListPage() {
  const { boardId } = useParams();
  const navigate = useNavigate();

  // 게시판 목록 더미데이터
  const [boards] = useState([
    { id: "1", name: "니지동 갤러리" },
    { id: "2", name: "오너모 갤러리" },
    { id: "3", name: "러브라이브 갤러리" },
    { id: "4", name: "스쿠스타 갤러리" },
    { id: "free", name: "자유게시판" },
    { id: "notice", name: "공지게시판" },
    { id: "qna", name: "질문게시판" },
    { id: "review", name: "리뷰게시판" },
    { id: "event", name: "이벤트게시판" },
    { id: "humor", name: "유머게시판" },
  ]);

  // 선택된 게시판 상태
  const [selectedBoard, setSelectedBoard] = useState(boardId || "3");

  // 게시판 변경 핸들러
  const handleBoardChange = (event) => {
    const newBoardId = event.target.value;
    setSelectedBoard(newBoardId);
    navigate(`/board/${newBoardId}`);
  };

  // 선택된 게시판 이름 가져오기
  const getSelectedBoardName = () => {
    const board = boards.find((b) => b.id === selectedBoard);
    return board ? board.name : "게시판";
  };

  const [articles, setArticles] = useState([
    //게시물 더미데이터
    {
      id: 1,
      title: "니지동 5th 라이브 후기.txt",
      author: "μ's최고",
      date: "2025-08-26",
      views: 1423,
      category: "후기",
      recommend: 45,
    },
    {
      id: 2,
      title: "오늘자 요시코 생일 축하짤 모음",
      author: "요하네짱",
      date: "2025-08-26",
      views: 987,
      category: "짤방",
      recommend: 32,
    },
    {
      id: 3,
      title: "[잡담] 러브라이브 신작 루머 떴다",
      author: "익명",
      date: "2025-08-26",
      views: 2034,
      category: "잡담",
      recommend: 67,
    },
    {
      id: 4,
      title: "스쿠스타 이벤트 보상 왜 이래...?",
      author: "가챠망함",
      date: "2025-08-25",
      views: 764,
      category: "불만",
      recommend: 12,
    },
    {
      id: 5,
      title: "러브라이브 성우들 근황 정리",
      author: "성우덕후",
      date: "2025-08-25",
      views: 1120,
      category: "정보",
      recommend: 28,
    },
    {
      id: 6,
      title: "[정보] 니지동 굿즈 발매 일정",
      author: "굿즈수집가",
      date: "2025-08-24",
      views: 856,
      category: "정보",
      recommend: 19,
    },
    {
      id: 7,
      title: "러브라이브 극장판 리마스터 소식",
      author: "극장판러버",
      date: "2025-08-24",
      views: 1345,
      category: "소식",
      recommend: 41,
    },
    {
      id: 8,
      title: "[짤] 치카 웃는 짤 공유함",
      author: "치카짱짱",
      date: "2025-08-23",
      views: 623,
      category: "짤방",
      recommend: 25,
    },
    {
      id: 9,
      title: "μ's 콘서트 다시 보고 싶다...",
      author: "추억팔이",
      date: "2025-08-23",
      views: 1789,
      category: "잡담",
      recommend: 58,
    },
    {
      id: 10,
      title: "[설문] 너네 최애 유닛 뭐냐",
      author: "설문러",
      date: "2025-08-22",
      views: 945,
      category: "설문",
      recommend: 15,
    },
    {
      id: 11,
      title: "[설문] 너네 최애 유닛 뭐냐",
      author: "설문러",
      date: "2025-08-22",
      views: 945,
      category: "설문",
      recommend: 15,
    },
  ]);
  //핫게시물 더미데이터
  const [hotList, setHotList] = useState([
    {
      id: 1,
      title: "니지동 5th 라이브 후기.txt",
      author: "μ's최고",
      date: "2025-08-26",
      views: 1423,
    },
    {
      id: 2,
      title: "오늘자 요시코 생일 축하짤 모음",
      author: "요하네짱",
      date: "2025-08-26",
      views: 987,
    },
    {
      id: 3,
      title: "[잡담] 러브라이브 신작 루머 떴다",
      author: "익명",
      date: "2025-08-26",
      views: 2034,
    },
  ]);
  //공지사항 더미데이터
  const [noticeList, setNoticeList] = useState([
    { id: 101, title: "사이트 점검 안내", views: 1423, date: "2025-08-26" },
    { id: 102, title: "신규 기능 업데이트", views: 1345, date: "2025-08-25" },
    { id: 103, title: "이벤트 참여 방법", views: 1234, date: "2025-08-24" },
    { id: 104, title: "자주 묻는 질문", views: 1123, date: "2025-08-23" },
    { id: 105, title: "관리자 연락처", views: 1023, date: "2025-08-22" },
  ]);

  // 페이지네이션 상태
  const [page, setPage] = useState(1);
  const articlesPerPage = 10;
  const totalPages = Math.ceil(articles.length / articlesPerPage);

  const handlePageChange = (event, value) => {
    setPage(value);
  };
  

  const paginatedArticles = articles.slice(
    (page - 1) * articlesPerPage,
    page * articlesPerPage
  );

  // 공지사항 페이지네이션
  const [noticePage, setNoticePage] = useState(1);
  const NOTICE_PER_PAGE = 3;
  const noticeTotalPages = Math.ceil(noticeList.length / NOTICE_PER_PAGE);

  const handleNoticePrev = () => setNoticePage((p) => Math.max(1, p - 1));
  const handleNoticeNext = () => setNoticePage((p) => Math.min(noticeTotalPages, p + 1));

  // HOT 게시물 페이지네이션
  const [hotPage, setHotPage] = useState(1);
  const HOT_PER_PAGE = 3;
  const hotTotalPages = Math.ceil(hotList.length / HOT_PER_PAGE);

  const handleHotPrev = () => setHotPage((p) => Math.max(1, p - 1));
  const handleHotNext = () => setHotPage((p) => Math.min(hotTotalPages, p + 1));

  useEffect(() => {
    // 실제 API 호출은 주석 처리됨
    // async function getArticles() {
    //   try {
    //     const response = await taxios.get(`/board/${boardId}`);
    //     setArticles(response.data);
    //   } catch (error) {
    //     console.error("Error fetching boards:", error);
    //   }
    // }
    // if (localStorage.getItem("accessToken")) {
    //   getArticles();
    // } else {
    //   window.location.href = "/signin";
    // }
  }, []);
  

  return (
    <Box className="max-w-[1400px] mx-auto mt-10 px-4 mb-8 overflow-hidden border rounded p-4 shadow flex-1">
      {/* 게시판 선택 드롭다운과 제목 */}
      <div className="flex items-center gap-3 mb-6">
        <FormControl size="small" className="min-w-[200px]">
          <InputLabel id="board-select-label">게시판 선택</InputLabel>
          <Select
            labelId="board-select-label"
            value={selectedBoard}
            label="게시판 선택"
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
                {board.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Typography variant="h5" className="font-bold">
          🎯 {getSelectedBoardName()}
        </Typography>
      </div>

      <div className="flex lg:flex-row gap-6 items-stretch">
        {/* 게시글 영역 */}
        <div className="flex-1 min-w-0">
          <Table
            size="small"
            className=" w-full border rounded p-4 shadow flex-1"
          >
            <TableHead>
              <TableRow>
                <TableCell align="center" className="min-w-[40px]">
                  번호
                </TableCell>
                <TableCell align="center" className="min-w-[80px]">
                  카테고리
                </TableCell>
                <TableCell align="center" className="min-w-[300px]">
                  제목
                </TableCell>
                <TableCell align="center" className="min-w-[100px]">
                  작성자
                </TableCell>
                <TableCell align="center" className="min-w-[120px]">
                  작성일
                </TableCell>
                <TableCell align="center" className="min-w-[80px]">
                  조회
                </TableCell>
                <TableCell align="center" className="min-w-[80px]">
                  추천
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedArticles.map((article, index) => (
                <TableRow key={article.id} hover>
                  <TableCell align="center">
                    {(page - 1) * articlesPerPage + index + 1}
                  </TableCell>
                  <TableCell align="center">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {article.category}
                    </span>
                  </TableCell>
                  <TableCell
                    className="text-blue-600 hover:underline cursor-pointer"
                    onClick={() => navigate(`/board/view/${article.id}`)}
                  >
                    {article.title}
                  </TableCell>
                  <TableCell align="center">{article.author}</TableCell>
                  <TableCell align="center">{article.date}</TableCell>
                  <TableCell align="center">{article.views}</TableCell>
                  <TableCell align="center" className="text-red-600 font-medium">
                    {article.recommend}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* 페이지네이션 + 글쓰기 */}
          <div className="flex justify-between items-center mt-6">
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              shape="rounded"
              showFirstButton
              showLastButton
              siblingCount={1}
              boundaryCount={1}
            />
            <Button
              variant="contained"
              color="primary"
              startIcon={<EditIcon />}
              onClick={() => navigate(`/board/write`)}
            >
              글쓰기
            </Button>
          </div>
        </div>

        {/* 사이드바 */}
        <div className="w-68 flex flex-col flex-shrink-0">
          {/* 공지사항 */}
          <Box className="border rounded p-4 shadow mb-6 flex-1">
            <div className="flex justify-between items-center mb-2">
              <Typography variant="h6" className="flex items-center gap-1">
                <AnnouncementIcon fontSize="small" /> 공지사항
              </Typography>
              <div className="flex items-center space-x-1 text-sm text-gray-600">
                <span>{noticePage} / {noticeTotalPages}</span>
                <IconButton size="small" onClick={handleNoticePrev} disabled={noticePage === 1}>
                  <ArrowBackIcon />
                </IconButton>
                <IconButton size="small" onClick={handleNoticeNext} disabled={noticePage === noticeTotalPages}>
                  <ArrowForwardIcon />
                </IconButton>
              </div>
            </div>
            <ul className="list-disc list-inside text-sm text-gray-700 text-left">
              {noticeList
                .slice((noticePage - 1) * NOTICE_PER_PAGE, noticePage * NOTICE_PER_PAGE)
                .map((notice) => (
                  <li
                    key={notice.id}
                    className="text-blue-600 hover:underline cursor-pointer flex justify-between items-center"
                    onClick={() => navigate(`/board/view/${notice.id}`)}
                  >
                    <span>{notice.title}</span>
                    <span className="text-gray-500 text-xs ml-2">{notice.date}</span>
                  </li>
                ))}
            </ul>
          </Box>

          {/* HOT 게시물 */}
          <Box className="border rounded p-4 shadow flex-1">
            <div className="flex justify-between items-center mb-2">
              <Typography variant="h6" className="flex items-center gap-1">
                <WhatshotIcon fontSize="small" /> HOT 게시물
              </Typography>
              <div className="flex items-center space-x-1 text-sm text-gray-600">
                <span>{hotPage} / {hotTotalPages}</span>
                <IconButton size="small" onClick={handleHotPrev} disabled={hotPage === 1}>
                  <ArrowBackIcon />
                </IconButton>
                <IconButton size="small" onClick={handleHotNext} disabled={hotPage === hotTotalPages}>
                  <ArrowForwardIcon />
                </IconButton>
              </div>
            </div>
            <ul className="space-y-1 text-sm text-gray-700 text-left">
              {hotList
                .slice((hotPage - 1) * HOT_PER_PAGE, hotPage * HOT_PER_PAGE)
                .map((item) => (
                  <li
                    key={item.id}
                    className="text-blue-600 hover:underline cursor-pointer"
                    onClick={() => navigate(`/board/view/${item.id}`)}
                  >
                    📌 {item.title}
                  </li>
                ))}
            </ul>
          </Box>
        </div>
      </div>
    </Box>
  );
}
