import { useEffect, useState, useRef } from "react";
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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  Create as CreateIcon,
  ChevronLeft as ChevronLeftIcon,
  LocalOffer as TagIcon,
  Category as CategoryIcon,
} from "@mui/icons-material";
import ReactQuill, { Quill } from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { getMe } from "../../utils/user";
import { uploadOneImage } from "../../utils/fileattachment";
import { writeArticle } from "../../utils/board";

export default function BoardWritePage() {
  const { t } = useTranslation();
  const { boardId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    files: [],
    tags: [],
    category: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tagInput, setTagInput] = useState("");
  const quillRef = useRef(null);
  const [categories, setCategories] = useState([
    { value: "general", label: "일반" },
    { value: "question", label: "질문" },
    { value: "tip", label: "팁" },
    { value: "counsel", label: "상담" },
  ]);

  useEffect(() => {
    getMe().then((data) => {
      if (data.isAdmin) {
        setCategories((prev) => [
          ...prev,
          { value: "notice", label: "공지사항" },
        ]);
      }
    });
  }, []);

  // Image upload handler for ReactQuill
  const imageHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (file) {
        // Validate file size (limit to 5MB)
        if (file.size > 5 * 1024 * 1024) {
          console.log("이미지 파일 크기는 5MB 이하로 제한됩니다.");
          return;
        }

        // Validate file type
        if (!file.type.startsWith("image/")) {
          console.log("이미지 파일만 업로드 가능합니다.");
          return;
        }

        const response = await uploadOneImage(file);
        console.log("Image uploaded successfully:", response);
        const quill = quillRef.current?.getEditor();
        if (quill) {
          const range = quill.getSelection();
          if (range) {
            // Insert the image
            quill.insertEmbed(
              range.index,
              "image",
              (import.meta.env.VITE_API_BASE_URL ||
                "http://localhost:8999/api") + `/files/${response.id}/download`
            );
            // Move cursor after the image
            quill.setSelection(range.index + 1);
          } else {
            // If no selection, insert at the end
            const length = quill.getLength();
            quill.insertEmbed(
              length,
              "image",
              (import.meta.env.VITE_API_BASE_URL ||
                "http://localhost:8999/api") + `/files/${response.id}/download`
            );
            quill.setSelection(length + 1);
          }
        }

        // TODO: Here you can also upload to your server and replace base64 with URL
        // const formData = new FormData();
        // formData.append('image', file);
        // try {
        //   const response = await uploadImage(formData);
        //   const quill = quillRef.current?.getEditor();
        //   if (quill) {
        //     const range = quill.getSelection();
        //     quill.insertEmbed(range.index, 'image', response.url);
        //     quill.setSelection(range.index + 1);
        //   }
        // } catch (error) {
        //   setError('이미지 업로드 중 오류가 발생했습니다.');
        // }
      }
    };
  };

  // React Quill modules configuration
  const quillModules = {
    toolbar: {
      container: [
        [
          {
            size: ["small", false, "large", "huge"],
          },
        ],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ align: [] }],
        ["blockquote", "code-block"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image", "video"],
        ["clean"],
      ],
      handlers: {
        image: imageHandler,
      },
    },
  };

  const quillFormats = [
    "size",
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
    "link",
    "image",
    "video",
  ];

  const handleTitleChange = (event) => {
    setFormData((prev) => ({ ...prev, title: event.target.value }));
  };

  const handleCategoryChange = (event) => {
    setFormData((prev) => ({ ...prev, category: event.target.value }));
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

  const handleTagInputChange = (event) => {
    setTagInput(event.target.value);
  };

  const handleTagInputKeyDown = (event) => {
    if (event.key === "Enter" && tagInput.trim()) {
      event.preventDefault();
      const newTag = tagInput.trim();

      // Check if tag already exists
      if (!formData.tags.includes(newTag) && newTag.length > 0) {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, newTag],
        }));
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
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

    if (!formData.category) {
      setError("카테고리를 선택해주세요.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // TODO: Implement API call to submit the form
      console.log("Submitting:", formData);

      const response = await writeArticle(boardId, formData);
      console.log("Submit Response:", response);

      navigate(`/board/view/${response.id}`);
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
            {/* Category and Title Row */}
            <Box sx={{ display: "flex", gap: 2 }}>
              <FormControl
                variant="outlined"
                sx={{
                  minWidth: 200,
                  "& .MuiOutlinedInput-root": {
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "primary.main",
                    },
                  },
                }}
                disabled={loading}
                required
              >
                <InputLabel>카테고리</InputLabel>
                <Select
                  value={formData.category}
                  onChange={handleCategoryChange}
                  label="카테고리"
                  startAdornment={
                    <CategoryIcon sx={{ mr: 1, color: "text.secondary" }} />
                  }
                >
                  {categories.map((category) => (
                    <MenuItem key={category.value} value={category.value}>
                      {category.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

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
            </Box>

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
                  ref={quillRef}
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

            {/* Tags Input */}
            <Box>
              <TextField
                label="태그"
                variant="outlined"
                fullWidth
                value={tagInput}
                onChange={handleTagInputChange}
                onKeyDown={handleTagInputKeyDown}
                placeholder="태그를 입력하고 Enter를 누르세요"
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <TagIcon sx={{ mr: 1, color: "text.secondary" }} />
                  ),
                }}
                helperText="Enter 키를 누르면 태그가 추가됩니다"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": {
                      borderColor: "primary.main",
                    },
                  },
                }}
              />

              {/* Display Tags */}
              {formData.tags.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {formData.tags.map((tag, index) => (
                      <Chip
                        key={index}
                        label={`#${tag}`}
                        onDelete={() => removeTag(tag)}
                        color="primary"
                        variant="outlined"
                        size="small"
                        sx={{
                          mb: 1,
                          "& .MuiChip-deleteIcon": {
                            color: "primary.main",
                            "&:hover": {
                              color: "primary.dark",
                            },
                          },
                        }}
                      />
                    ))}
                  </Stack>
                </Box>
              )}
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
