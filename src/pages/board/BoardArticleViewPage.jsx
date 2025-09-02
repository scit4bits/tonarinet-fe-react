import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Container,
  Box,
  Typography,
  Paper,
  Divider,
  Button,
  IconButton,
  TextField,
  Stack,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
  Skeleton,
} from "@mui/material";
import {
  ThumbUpOutlined,
  ChatBubbleOutline,
  AttachFile,
  Link as LinkIcon,
  ReportProblemOutlined,
  Send,
  DeleteOutline,
} from "@mui/icons-material";

export default function BoardArticleViewPage() {
  const { t } = useTranslation();
  const { articleId } = useParams();
  const [article, setArticle] = useState(null);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");

  // 데이터 로딩 로직
  useEffect(() => {
    const fetchArticleData = async () => {
      setLoading(true);
      setError(null);
      try {
        // 1. 게시글 정보 가져오기
        // TODO: 실제 API 엔드포인트로 교체해야 합니다.
        // const articleResponse = await fetch(`/api/articles/${articleId}`);
        // if (!articleResponse.ok) throw new Error("게시글을 불러오는데 실패했습니다.");
        // const articleData = await articleResponse.json();

        // 2. 댓글 정보 가져오기
        // const repliesResponse = await fetch(`/api/articles/${articleId}/replies`);
        // if (!repliesResponse.ok) throw new Error("댓글을 불러오는데 실패했습니다.");
        // const repliesData = await repliesResponse.json();

        // --- Mock 데이터 ---
        await new Promise((resolve) => setTimeout(resolve, 1000)); // 로딩 시뮬레이션
        const articleData = {
          schoolName: "토나리넷 대학교",
          title: "MUI로 리팩토링된 게시글 제목",
          writer: "개발자A",
          createdAt: "2025.08.27 10:00",
          viewCount: 102,
          likes: 25,
          contents:
            "이 게시글은 이제 백엔드 API와 연동을 가정하여 useEffect 훅을 통해 비동기적으로 데이터를 로드합니다. 로딩 중에는 스켈레톤 UI가 표시되어 사용자 경험을 향상시킵니다. 실제 API가 구현되면 fetch 주석을 해제하고 실제 데이터를 사용하도록 코드를 수정할 수 있습니다.",
        };
        const repliesData = [
          { id: 1, author: "김코딩", content: "오, 이제 데이터 로딩도 되네요!", createdAt: "2025.08.27 10:05" },
          { id: 2, author: "이해커", content: "스켈레톤 UI 멋지네요.", createdAt: "2025.08.27 10:10" },
          { id: 3, author: "박리액", content: "코드 구조가 더 깔끔해졌어요.", createdAt: "2025.08.27 10:15" },
        ];
        // --- Mock 데이터 끝 ---

        setArticle(articleData);
        setReplies(repliesData);
      } catch (e) {
        setError(e.message);
        console.error("데이터 로딩 오류:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchArticleData();
  }, [articleId]); // articleId가 변경될 때마다 데이터를 다시 가져옵니다.

  const handleCopyClipBoard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert("클립보드에 링크가 복사되었습니다.");
    } catch (err) {
      // Fix: Added missing opening brace
      console.error("클립보드 복사 실패:", err);
      alert("링크 복사에 실패했습니다.");
    }
  };

  const handleReportSubmit = () => {
    // TODO: 실제 신고 로직을 여기에 구현합니다 (예: 백엔드 API 호출).
    console.log("신고 사유:", reportReason);
    alert("신고가 접수되었습니다.");
    setIsReportModalOpen(false);
    setReportReason(""); // 신고 사유 초기화
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) {
      alert("댓글을 입력해주세요.");
      return;
    }
    setIsSubmitting(true);

    try {
      // 백엔드 API 엔드포인트입니다. 실제 주소로 변경해야 합니다.
      const response = await fetch(`/api/articles/${articleId}/replies`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // TODO: 인증 토큰이 필요하다면 헤더에 추가해야 합니다.
          // Authorization: `Bearer ${accessToken}`,
        },
        // Reply 엔티티에 맞는 데이터 구조로 전송합니다.
        body: JSON.stringify({ contents: newComment }),
      });

      if (!response.ok) {
        throw new Error("댓글 등록에 실패했습니다.");
      }

      const savedReply = await response.json(); // 백엔드가 저장된 댓글 객체를 반환한다고 가정
      setReplies((prevReplies) => [...prevReplies, savedReply]);
      setNewComment(""); // 입력창 초기화
    } catch (error) {
      console.error("댓글 등록 오류:", error);
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 로딩 중 UI
  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            <Skeleton width={300} />
          </Typography>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              width: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box sx={{ pb: 2, mb: 2 }}>
              <Typography variant="h4" component="h2" gutterBottom>
                <Skeleton />
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Skeleton width="40%" />
                <Skeleton width="30%" />
              </Box>
            </Box>
            <Divider />
            <Box sx={{ my: 3, flexGrow: 1 }}>
              <Skeleton variant="rectangular" width="100%" height={240} />
            </Box>
          </Paper>
        </Box>
      </Container>
    );
  }

  // 에러 발생 UI
  if (error) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ my: 4, textAlign: "center" }}>
          <Typography variant="h5" color="error">
            오류: {error}
          </Typography>
          <Button variant="contained" onClick={() => window.location.reload()} sx={{ mt: 2 }}>
            새로고침
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          {article.schoolName}
        </Typography>
        <Paper
          elevation={3}
          sx={{
            p: 3,
            width: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* 상단 제목 */}
          <Box sx={{ pb: 2, mb: 2 }}>
            <Typography variant="h4" component="h2" gutterBottom>
              {article.title}
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "space-between", color: "text.secondary" }}>
              <Typography variant="body2">
                {article.writer} | {article.createdAt}
              </Typography>
              <Typography variant="body2">
                조회 {article.viewCount} | 추천 {article.likes} | 댓글 {replies.length}
              </Typography>
            </Box>
          </Box>
          <Divider />

          {/* 본문 */}
          <Box
            sx={{
              minHeight: "240px",
              my: 3,
              p: 2,
              backgroundColor: "grey.100",
              borderRadius: 1,
              flexGrow: 1,
            }}
          >
            <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
              {article.contents}
            </Typography>
          </Box>

          {/* 버튼 영역 */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Button
                startIcon={<ThumbUpOutlined />}
                onClick={() => setArticle({ ...article, likes: article.likes + 1 })}
                color="secondary"
              >
                {article.likes}
              </Button>
              <Button startIcon={<ChatBubbleOutline />} disabled color="secondary">
                {replies.length}
              </Button>
            </Stack>
            <Stack direction="row" spacing={1}>
              <Button startIcon={<AttachFile />}>첨부파일</Button>
              <Button startIcon={<LinkIcon />} onClick={handleCopyClipBoard}>
                링크복사
              </Button>
              <Button startIcon={<ReportProblemOutlined />} onClick={() => setIsReportModalOpen(true)} color="error">
                신고
              </Button>
            </Stack>
          </Box>
          <Divider />

          {/* 댓글 입력 */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 3, mb: 3 }}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="댓글을 입력하세요..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !isSubmitting && handleCommentSubmit()}
              disabled={isSubmitting}
            />
            <IconButton color="primary" onClick={handleCommentSubmit} disabled={isSubmitting}>
              {isSubmitting ? <CircularProgress size={24} /> : <Send />}
            </IconButton>
          </Box>

          {/* 댓글 목록 */}
          <Stack spacing={1}>
            {replies.map((reply) => (
              <Paper
                key={reply.id}
                variant="outlined"
                sx={{
                  py: 1,
                  px: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  bgcolor: "grey.100",
                }}
              >
                <Box>
                  <Typography variant="subtitle2" component="span" sx={{ mr: 1, fontWeight: "bold" }}>
                    {reply.author}
                  </Typography>
                  <Typography variant="body2" component="span">
                    {reply.content}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", color: "text.secondary" }}>
                  <Typography variant="caption" sx={{ mr: 1 }}>
                    {reply.createdAt}
                  </Typography>
                  <IconButton size="small" aria-label={`delete comment by ${reply.author}`}>
                    <DeleteOutline />
                  </IconButton>
                </Box>
              </Paper>
            ))}
          </Stack>
        </Paper>
      </Box>

      {/* 신고 모달 */}
      <Dialog open={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ textAlign: "center" }}>게시물 신고</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="report"
            label="신고 사유"
            type="text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            placeholder="신고 사유를 자세히 입력해주세요."
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsReportModalOpen(false)}>취소</Button>
          <Button onClick={handleReportSubmit} color="error">
            신고
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
