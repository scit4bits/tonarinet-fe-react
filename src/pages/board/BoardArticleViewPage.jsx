import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Paper,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  ArrowBackIosNew,
  AttachFile,
  ChatBubbleOutline,
  DeleteOutline,
  Link as LinkIcon,
  ReportProblemOutlined,
  Send,
  ThumbUpOutlined,
} from "@mui/icons-material";
import {
  getArticleInformation,
  increaseViewCount,
  toggleArticleLike,
} from "../../utils/article";
import { addReplyToArticle, getRepliesOfArticle } from "../../utils/reply";
import useAuth from "../../hooks/useAuth";
import { downloadFile } from "../../utils/fileattachment";
import taxios from "../../utils/taxios";
import { TranslatableText } from "../../components/TranslatableText";

export default function BoardArticleViewPage() {
  const { t } = useTranslation();
  const { articleId } = useParams();
  const { user } = useAuth();
  const [article, setArticle] = useState(null);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyLoading, setReplyLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");

  useEffect(() => {
    increaseViewCount(articleId);

    getArticleInformation(articleId).then((data) => {
      setArticle(data);
      setLoading(false);
    });

    getRepliesOfArticle(articleId).then((data) => {
      setReplies(data);
      setReplyLoading(false);
    });
  }, []);

  const handleCopyClipBoard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert(t("common.linkCopied"));
    } catch (err) {
      // Fix: Added missing opening brace
      console.error("클립보드 복사 실패:", err);
      alert(t("common.linkCopyFailed"));
    }
  };

  const handleArticleLike = async () => {
    try {
      const currentLike = await toggleArticleLike(articleId);
      setArticle((prevArticle) => ({
        ...prevArticle,
        likedByUsers: currentLike,
      }));
    } catch (error) {
      console.error("추천 오류:", error);
      alert(t("common.recommendationError"));
    }
  };

  const handleReportSubmit = () => {
    // TODO: 실제 신고 로직을 여기에 구현합니다 (예: 백엔드 API 호출).
    console.log("신고 사유:", reportReason);
    alert(t("common.reportSubmitted"));
    setIsReportModalOpen(false);
    setReportReason(""); // 신고 사유 초기화
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) {
      alert(t("common.enterComment"));
      return;
    }
    setIsSubmitting(true);

    try {
      await addReplyToArticle(articleId, newComment);
      setNewComment(""); // 입력창 초기화
      setReplies(await getRepliesOfArticle(articleId));
    } catch (error) {
      console.error("댓글 등록 오류:", error);
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileDownload = async (file) => {
    try {
      const success = await downloadFile(file.id);
      if (!success) {
        alert(t("common.fileDownloadFailed"));
      }
    } catch (error) {
      console.error("파일 다운로드 오류:", error);
      alert(t("common.fileDownloadFailed"));
    }
  };

  const handleCommentDelete = (replyId) => async () => {
    if (window.confirm(t("common.confirmDeleteComment"))) {
      try {
        await taxios.delete(`/reply/${replyId}`);
        setReplies(await getRepliesOfArticle(articleId));
      } catch (error) {
        console.error("댓글 삭제 오류:", error);
        alert(t("common.commentDeleteError"));
      }
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
            {t("common.error")}: {error}
          </Typography>
          <Button
            variant="contained"
            onClick={() => window.location.reload()}
            sx={{ mt: 2 }}
          >
            {t("common.refresh")}
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
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
            <Box className="flex mb-4">
              {/* <IconButton onClick={() => window.history.back()} sx={{ mr: 1 }}>
                <ArrowBackIosNew />
              </IconButton> */}
              <TranslatableText className="flex flex-col">
                <Typography
                  variant="p"
                  color="text.primary"
                  component="a"
                  href={`/board/${article.boardId}`}
                  sx={{
                    mb: 1,
                    textAlign: "left",
                    textDecoration: "none",
                  }}
                >
                  {article.boardTitle}
                </Typography>
                <Typography variant="h4" component="h2">
                  {article.title}
                </Typography>
              </TranslatableText>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                color: "text.secondary",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Avatar
                  src={
                    article.createdByProfileFileId
                      ? `${import.meta.env.VITE_API_BASE_URL}/files/${
                          article.createdByProfileFileId
                        }/download`
                      : null
                  }
                  sx={{ width: 35, height: 35 }}
                />
                <Typography variant="body2">
                  {article.createdByName} |{" "}
                  {article.createdAt.replace("T", " ")}
                </Typography>
              </Box>
              <Typography variant="body2">
                {t("common.views")} {article.views || 0} |{" "}
                {t("pages.board.articles.tableHeaders.likes")}{" "}
                {article.likedByUsers || 0} |{t("common.comment")}{" "}
                {replies.length || 0}
              </Typography>
            </Box>
          </Box>
          <Divider />
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
            <TranslatableText>
              <Typography
                variant="body1"
                component="div"
                className="ql-editor ql-editor-readonly"
                dangerouslySetInnerHTML={{ __html: article.contents }}
              />
            </TranslatableText>
          </Box>
          {/* Tag list (use chips) */}
          <Box sx={{ my: 2 }}>
            {article.tags &&
              article.tags.length > 0 &&
              article.tags.map((tag) => (
                <Chip key={tag} label={"#" + tag} sx={{ mr: 1, mb: 1 }} />
              ))}
          </Box>
          {/* 버튼 영역 */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Button
                startIcon={<ThumbUpOutlined />}
                onClick={handleArticleLike}
                color="secondary"
              >
                {article.likedByUsers}
              </Button>
              <Button
                startIcon={<ChatBubbleOutline />}
                disabled
                color="secondary"
              >
                {replies.length}
              </Button>
            </Stack>
            <Stack direction="row" spacing={1}>
              <Button startIcon={<LinkIcon />} onClick={handleCopyClipBoard}>
                {t("common.copyLink")}
              </Button>
              <Button
                startIcon={<ReportProblemOutlined />}
                onClick={() => setIsReportModalOpen(true)}
                color="error"
              >
                {t("common.report")}
              </Button>
            </Stack>
          </Box>
          <Divider />
          {/* 첨부파일 목록 */}
          <Box sx={{ display: "flex", flexDirection: "row" }}>
            {article.files &&
              article.files.length > 0 &&
              article.files.map((file) => (
                <Button
                  key={file.id}
                  startIcon={<AttachFile />}
                  onClick={() => handleFileDownload(file)}
                >
                  {file.originalFilename}
                </Button>
              ))}
          </Box>
          <Divider />
          {/* 댓글 입력 */}
          <Box
            sx={{ display: "flex", alignItems: "center", gap: 1, mt: 3, mb: 3 }}
          >
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder={t("common.enterCommentPlaceholder")}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && !isSubmitting && handleCommentSubmit()
              }
              disabled={isSubmitting}
            />
            <IconButton
              color="primary"
              onClick={handleCommentSubmit}
              disabled={isSubmitting}
            >
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
                  <Typography
                    variant="subtitle2"
                    component="span"
                    sx={{ mr: 1, fontWeight: "bold" }}
                  >
                    {reply.createdByName}
                  </Typography>
                  <TranslatableText className="inline">
                    <Typography variant="body2" component="span">
                      {reply.contents}
                    </Typography>
                  </TranslatableText>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    color: "text.secondary",
                  }}
                >
                  <Typography variant="caption" sx={{ mr: 1 }}>
                    {reply.createdAt.replace("T", " ")}
                  </Typography>
                  {user && user.id === reply.createdById && (
                    <IconButton
                      size="small"
                      aria-label={`delete comment by ${reply.createdByName}`}
                      onClick={handleCommentDelete(reply.id)}
                    >
                      <DeleteOutline />
                    </IconButton>
                  )}
                </Box>
              </Paper>
            ))}
          </Stack>
        </Paper>
      </Box>

      {/* 신고 모달 */}
      <Dialog
        open={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: "center" }}>
          {t("common.reportPost")}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="report"
            label={t("common.reportReason")}
            type="text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            placeholder={t("common.reportReasonPlaceholder")}
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsReportModalOpen(false)}>
            {t("common.cancel")}
          </Button>
          <Button onClick={handleReportSubmit} color="error">
            {t("common.report")}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
