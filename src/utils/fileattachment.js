import taxios from "./taxios";

async function uploadOneFile(file) {
  try {
    const formData = new FormData();
    formData.append("files", file);

    const metadata = {
      isPrivate: false,
      type: "FILE",
      articleId: null,
    };

    const metadataBlob = new Blob([JSON.stringify(metadata)], {
      type: "application/json",
    });

    formData.append("metadata", metadataBlob);

    const response = await taxios.post("/api/files/upload", formData);

    console.log("File uploaded successfully:", response.data);
    return null;
  } catch (error) {
    console.error("Error uploading file:", error);
    return null;
  }
}

async function uploadOneImage(file) {
  try {
    const formData = new FormData();
    formData.append("files", file);

    const metadata = {
      isPrivate: false,
      type: "IMAGE",
      articleId: null,
    };

    const metadataBlob = new Blob([JSON.stringify(metadata)], {
      type: "application/json",
    });

    formData.append("metadata", metadataBlob);

    const response = await taxios.post("/files/upload", formData);

    const data = response.data;
    console.log("Image uploaded successfully:", data);
    return data[0];
  } catch (error) {
    console.error("Error uploading image:", error);
    return null;
  }
}

async function downloadFile(fileId) {
  try {
    const response = await taxios.get(`/files/${fileId}/download`, {
      responseType: "blob",
    });

    // Get filename from Content-Disposition header
    const contentDisposition = response.headers["content-disposition"];
    let filename = "download";

    if (contentDisposition) {
      // Try filename* first (RFC 5987 - supports UTF-8 encoding)
      const filenameStarMatch = contentDisposition.match(/filename\*=UTF-8''([^;]+)/);
      if (filenameStarMatch) {
        // Decode the URL-encoded filename
        filename = decodeURIComponent(filenameStarMatch[1]);
      } else {
        // Fallback to regular filename
        const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }
    }

    // Create blob URL and trigger download
    const blob = new Blob([response.data]);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    console.error("Error downloading file:", error);
    return false;
  }
}

export { uploadOneFile, uploadOneImage, downloadFile };
