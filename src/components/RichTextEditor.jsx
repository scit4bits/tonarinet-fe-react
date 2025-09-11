import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Box } from "@mui/material";
import ReactQuill, { Quill } from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { uploadOneImage } from "../utils/fileattachment";

const RichTextEditor = ({
  value,
  onChange,
  placeholder,
  readOnly = false,
  minHeight = "200px",
  showImageUpload = true,
  onError,
}) => {
  const { t } = useTranslation();
  const quillRef = useRef(null);

  // Use provided placeholder or default translated one
  const actualPlaceholder = placeholder || t("common.enterContent");

  // Image upload handler for ReactQuill
  const imageHandler = () => {
    if (!showImageUpload) return;

    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (file) {
        // Validate file size (limit to 5MB)
        if (file.size > 5 * 1024 * 1024) {
          const errorMessage = t("common.imageSizeError");
          console.log(errorMessage);
          if (onError) onError(errorMessage);
          return;
        }

        // Validate file type
        if (!file.type.startsWith("image/")) {
          const errorMessage = t("common.imageTypeError");
          console.log(errorMessage);
          if (onError) onError(errorMessage);
          return;
        }

        try {
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
                  "http://localhost:8999/api") +
                  `/files/${response.id}/download`
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
                  "http://localhost:8999/api") +
                  `/files/${response.id}/download`
              );
              quill.setSelection(length + 1);
            }
          }
        } catch (error) {
          const errorMessage = t("common.imageUploadError");
          console.error("Image upload error:", error);
          if (onError) onError(errorMessage);
        }
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
        showImageUpload ? ["link", "image", "video"] : ["link", "video"],
        ["clean"],
      ],
      handlers: showImageUpload
        ? {
            image: imageHandler,
          }
        : {},
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

  return (
    <Box
      sx={{
        border: "1px solid #e0e0e0",
        borderRadius: 1,
        "& .ql-editor": {
          minHeight: minHeight,
        },
        "& .ql-toolbar": {
          borderBottom: "1px solid #e0e0e0",
        },
      }}
    >
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={quillModules}
        formats={quillFormats}
        placeholder={actualPlaceholder}
        readOnly={readOnly}
      />
    </Box>
  );
};

export default RichTextEditor;
