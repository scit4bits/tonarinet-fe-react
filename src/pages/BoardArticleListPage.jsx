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
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import EditIcon from "@mui/icons-material/Edit";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import taxios from "../utils/taxios";

export default function BoardArticleListPage() {
  const { boardId } = useParams();
  const navigate = useNavigate();

  const [articles, setArticles] = useState([
    {
      id: 1,
      title: "니지동 5th 라이브 후기.txt",
      author: "μ’s최고",
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
    {
      id: 4,
      title: "스쿠스타 이벤트 보상 왜 이래...?",
      author: "가챠망함",
      date: "2025-08-25",
      views: 764,
    },
    {
      id: 5,
      title: "러브라이브 성우들 근황 정리",
      author: "성우덕후",
      date: "2025-08-25",
      views: 1120,
    },
    {
      id: 6,
      title: "[정보] 니지동 굿즈 발매 일정",
      author: "굿즈수집가",
      date: "2025-08-24",
      views: 856,
    },
    {
      id: 7,
      title: "러브라이브 극장판 리마스터 소식",
      author: "극장판러버",
      date: "2025-08-24",
      views: 1345,
    },
    {
      id: 8,
      title: "[짤] 치카 웃는 짤 공유함",
      author: "치카짱짱",
      date: "2025-08-23",
      views: 623,
    },
    {
      id: 9,
      title: "μ’s 콘서트 다시 보고 싶다...",
      author: "추억팔이",
      date: "2025-08-23",
      views: 1789,
    },
    {
      id: 10,
      title: "[설문] 너네 최애 유닛 뭐냐",
      author: "설문러",
      date: "2025-08-22",
      views: 945,
    },
    {
      id: 11,
      title: "[설문] 너네 최애 유닛 뭐냐",
      author: "설문러",
      date: "2025-08-22",
      views: 945,
    },
  ]);

  const [hotList, setHotList] = useState([
    {
      id: 1,
      title: "니지동 5th 라이브 후기.txt",
      author: "μ’s최고",
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

  const [noticeList, setNoticeList] = useState([
    { id: 101, title: "사이트 점검 안내", views: 1423 },
    { id: 102, title: "신규 기능 업데이트", views: 1345 },
    { id: 103, title: "이벤트 참여 방법", views: 1234 },
    { id: 104, title: "자주 묻는 질문", views: 1123 },
    { id: 105, title: "관리자 연락처", views: 1023 },
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
      <Typography variant="h5" className="font-bold mb-6">
        🎯 {boardId} 갤러리
      </Typography>

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
              </TableRow>
            </TableHead>
            <TableBody>
              {articles.map((article, index) => (
                <TableRow key={article.id} hover>
                  <TableCell align="center">{index + 1}</TableCell>
                  <TableCell className="text-blue-600 hover:underline cursor-pointer">
                    <a
                      href={`/board/${boardId}/article/${article.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {article.title}
                    </a>
                  </TableCell>
                  <TableCell align="center">{article.author}</TableCell>
                  <TableCell align="center">{article.date}</TableCell>
                  <TableCell align="center">{article.views}</TableCell>
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
              onClick={() => navigate(`/board/${boardId}/write`)}
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
                <span>1 / {Math.ceil(noticeList.length / 3)}</span>
                <IconButton size="small">
                  <ArrowBackIcon />
                </IconButton>
                <IconButton size="small">
                  <ArrowForwardIcon />
                </IconButton>
              </div>
            </div>
            <ul className="list-disc list-inside text-sm text-gray-700 text-left">
              {noticeList.slice(0, 3).map((notice) => (
                <li key={notice.id}>
                  <a
                    href={`/board/${boardId}/article/${notice.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    {notice.title}
                  </a>
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
                <span>1 / {Math.ceil(hotList.length / 3)}</span>
                <IconButton size="small">
                  <ArrowBackIcon />
                </IconButton>
                <IconButton size="small">
                  <ArrowForwardIcon />
                </IconButton>
              </div>
            </div>
            <ul className="space-y-1 text-sm text-gray-700 text-left">
              {hotList.slice(0, 3).map((item) => (
                <li key={item.id}>
                  <a
                    href={`/board/${boardId}/article/${item.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    📌 {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </Box>
        </div>
      </div>
    </Box>
  );
}
