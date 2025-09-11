import { useEffect, useState, useMemo } from "react";
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
import { getMe } from "../../utils/user";
import { writeArticle } from "../../utils/board";
import RichTextEditor from "../../components/RichTextEditor";

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
  const [isAdmin, setIsAdmin] = useState(false);

  const categories = useMemo(() => {
    const baseCategories = [
      { value: "general", label: t("common.general") },
      { value: "question", label: t("common.question") },
      { value: "tip", label: t("common.tip") },
      { value: "counsel", label: t("common.counsel") },
    ];

    if (isAdmin) {
      baseCategories.push({ value: "notice", label: t("common.notice") });
    }

    return baseCategories;
  }, [t, isAdmin]);

  useEffect(() => {
    getMe().then((data) => {
      setIsAdmin(data.isAdmin);
    });
  }, []);

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
      setError(t("pages.board.write.validation.titleRequired"));
      return;
    }

    if (!formData.content.trim()) {
      setError(t("pages.board.write.validation.contentRequired"));
      return;
    }

    if (!formData.category) {
      setError(t("pages.board.write.validation.categoryRequired"));
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
      setError(t("pages.board.write.validation.writeError"));
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
              {t("pages.board.write.writePost")}
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
                <InputLabel>{t("common.category")}</InputLabel>
                <Select
                  value={formData.category}
                  onChange={handleCategoryChange}
                  label={t("common.category")}
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
                label={t("common.title")}
                variant="outlined"
                fullWidth
                required
                value={formData.title}
                onChange={handleTitleChange}
                placeholder={t("pages.board.write.titlePlaceholder")}
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
              <RichTextEditor
                value={formData.content}
                onChange={handleContentChange}
                placeholder={t("pages.board.write.contentPlaceholder")}
                readOnly={loading}
                minHeight="300px"
                showImageUpload={true}
                onError={setError}
              />
            </Box>

            {/* Tags Input */}
            <Box>
              <TextField
                label={t("common.tags")}
                variant="outlined"
                fullWidth
                value={tagInput}
                onChange={handleTagInputChange}
                onKeyDown={handleTagInputKeyDown}
                placeholder={t("pages.board.write.tagPlaceholder")}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <TagIcon sx={{ mr: 1, color: "text.secondary" }} />
                  ),
                }}
                helperText={t("common.addTagHelper")}
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
                {t("common.fileAttachment")}
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
                    {t("common.attachedFiles")}
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
                {loading ? t("common.uploading") : t("common.register")}
              </Button>
            </Box>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
}
