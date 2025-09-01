import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  Alert,
  CircularProgress,
  Chip,
  Divider,
  IconButton,
} from "@mui/material";
import {
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  Create as CreateIcon,
  ChevronLeft as ChevronLeftIcon,
} from "@mui/icons-material";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

export default function BoardWritePage() {
  const { t } = useTranslation();
  const { boardId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    files: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // React Quill modules configuration
  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      ["blockquote", "code-block"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image", "video"],
      ["clean"],
    ],
  };

  const quillFormats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "align",
    "blockquote",
    "code-block",
    "list",
    "bullet",
    "link",
    "image",
    "video",
  ];

  const handleTitleChange = (event) => {
    setFormData((prev) => ({ ...prev, title: event.target.value }));
  };

  const handleContentChange = (content) => {
    setFormData((prev) => ({ ...prev, content }));
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setFormData((prev) => ({ ...prev, files: [...prev.files, ...files] }));
  };

  const removeFile = (index) => {
    setFormData((prev) => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.title.trim()) {
      setError("제목을 입력해주세요.");
      return;
    }

    if (!formData.content.trim()) {
      setError("내용을 입력해주세요.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // TODO: Implement API call to submit the form
      console.log("Submitting:", formData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Navigate back to board list after successful submission
      navigate(`/board/${boardId}`);
    } catch (err) {
      setError("게시글 작성 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton
            onClick={handleCancel}
            sx={{
              color: "primary.main",
            }}
          >
            <ChevronLeftIcon fontSize="large" />
          </IconButton>
          <Box sx={{ flexGrow: 1, textAlign: "center" }}>
            <Typography
              variant="h5"
              component="h1"
              sx={{
                fontWeight: "bold",
                color: "primary.main",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <CreateIcon fontSize="large" />
              {t("pages.board.write.title", "게시글 작성")}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Form */}
        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={3}>
            {/* Title Input */}
            <TextField
              label="제목"
              variant="outlined"
              fullWidth
              required
              value={formData.title}
              onChange={handleTitleChange}
              placeholder="제목을 입력하세요"
              disabled={loading}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&:hover fieldset": {
                    borderColor: "primary.main",
                  },
                },
              }}
            />

            {/* Content Editor */}
            <Box>
              <Box
                sx={{
                  border: "1px solid #e0e0e0",
                  borderRadius: 1,
                  "& .ql-editor": {
                    minHeight: "300px",
                  },
                  "& .ql-toolbar": {
                    borderBottom: "1px solid #e0e0e0",
                  },
                }}
              >
                <ReactQuill
                  theme="snow"
                  value={formData.content}
                  onChange={handleContentChange}
                  modules={quillModules}
                  formats={quillFormats}
                  placeholder="내용을 입력하세요..."
                  readOnly={loading}
                />
              </Box>
            </Box>

            {/* File Upload */}
            <Box>
              <Button
                component="label"
                variant="outlined"
                startIcon={<AttachFileIcon />}
                disabled={loading}
                sx={{ mb: 2 }}
              >
                파일 첨부
                <input
                  type="file"
                  hidden
                  multiple
                  onChange={handleFileChange}
                />
              </Button>

              {/* Display attached files */}
              {formData.files.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    첨부된 파일:
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {formData.files.map((file, index) => (
                      <Chip
                        key={index}
                        label={file.name}
                        onDelete={() => removeFile(index)}
                        variant="outlined"
                        size="small"
                      />
                    ))}
                  </Stack>
                </Box>
              )}
            </Box>

            {/* Action Buttons */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
                pt: 2,
              }}
            >
              <Button
                type="submit"
                variant="contained"
                startIcon={
                  loading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <SendIcon />
                  )
                }
                disabled={loading}
                size="large"
                sx={{
                  minWidth: 120,
                }}
              >
                {loading ? "등록 중..." : "등록"}
              </Button>
            </Box>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
}
