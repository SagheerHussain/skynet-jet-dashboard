// AddVideo.jsx
import React, { useEffect, useState } from "react";
import { Box, Button, Typography, Snackbar, Alert } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SendIcon from "@mui/icons-material/Send";
import { createVideo } from "../../api/video.api";
import { useNavigate } from "react-router-dom";

const AddVideo = () => {
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [snack, setSnack] = useState({ open: false, severity: "success", msg: "" });
  const [uploading, setUploading] = useState(false);

  const handleVideoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // OPTIONAL: simple client-side type/size guard
    if (!file.type.startsWith("video/")) {
      setSnack({ open: true, severity: "error", msg: "Please select a video file" });
      return;
    }
    setVideo(file);
  };

  // Create & cleanup preview URL
  useEffect(() => {
    if (!video) { setPreviewUrl(null); return; }
    const url = URL.createObjectURL(video);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [video]);

  const handleAdd = async () => {
    if (!video) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("src", video, video.name);
      const response = await createVideo(formData);
      if (response?.success) {
        setSnack({ open: true, severity: "success", msg: "Video added successfully" });
        // Navigate to your videos page (fix the path if different)
        navigate("/videos");
      } else {
        throw new Error(response?.message || "Upload failed");
      }
    } catch (error) {
      console.error(error);
      setSnack({ open: true, severity: "error", msg: "Error adding video" });
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <div style={{ padding: "1rem", minWidth: 400, margin: "auto", background: "#fff" }}>
        <Typography variant="h6" gutterBottom>
          Add Video
        </Typography>

        {/* Video Preview */}
        {previewUrl && (
          <Box sx={{ textAlign: "center", mb: 2 }}>
            <video
              autoPlay
              loop
              muted
              src={previewUrl}
              style={{ width: "100%", height: 300, objectFit: "cover" }}
              controls
            />
          </Box>
        )}

        {/* Upload Button */}
        <Button component="label" variant="outlined" startIcon={<CloudUploadIcon />} fullWidth sx={{ mb: 2 }}>
          <input
            type="file"
            accept="video/*"        // <-- allow videos
            name="src"
            hidden
            onChange={handleVideoChange}  // <-- use the correct handler
          />
          {video ? "Change Video" : "Upload Video"}
        </Button>

        {/* Add Button */}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          disabled={!video || uploading}
          onClick={handleAdd}
          endIcon={<SendIcon />}
        >
          {uploading ? "Uploading..." : "Add Video"}
        </Button>
      </div>

      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={() => setSnack({ open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setSnack({ open: false })} severity={snack.severity} sx={{ width: "100%" }}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AddVideo;
