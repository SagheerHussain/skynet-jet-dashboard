// EditVideo.jsx
import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Typography, Snackbar, Alert, Stack } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SendIcon from "@mui/icons-material/Send";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { getVideoById, updateVideo } from "../../api/video.api";
import { useNavigate, useParams } from "react-router-dom";

const EditVideo = () => {
  const { id } = useParams();              // expects route like /videos/edit/:id
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // original from server
  const [originalSrc, setOriginalSrc] = useState(null);

  // chosen file + preview
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [snack, setSnack] = useState({ open: false, severity: "success", msg: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch existing video
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await getVideoById(id);
        if (mounted) {
          if (res?.success && res?.data?.src) {
            setOriginalSrc(res.data.src);
          } else {
            setSnack({ open: true, severity: "error", msg: res?.message || "Video not found" });
          }
        }
      } catch (e) {
        if (mounted) setSnack({ open: true, severity: "error", msg: "Failed to load video" });
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  // Create & cleanup preview URL for newly selected file
  useEffect(() => {
    if (!file) { setPreviewUrl(null); return; }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handlePick = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("video/")) {
      setSnack({ open: true, severity: "error", msg: "Please select a video file" });
      return;
    }
    setFile(f);
  };

  const handleResetSelection = () => {
    setFile(null);
    setPreviewUrl(null);
    // also clear the <input> so reselecting same file triggers onChange
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      if (file) {
        formData.append("src", file, file.name);
      }
      const res = await updateVideo(id, formData); // your controller keeps old src if no file
      if (res?.success) {
        setSnack({ open: true, severity: "success", msg: "Video updated successfully" });
        // optional: go back to list/detail
        navigate("/videos");
      } else {
        throw new Error(res?.message || "Update failed");
      }
    } catch (e) {
      setSnack({ open: true, severity: "error", msg: e.message || "Error updating video" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "1rem", minWidth: 400, margin: "auto", background: "#fff" }}>
        <Typography variant="h6">Loading video…</Typography>
      </div>
    );
  }

  const showingSrc = previewUrl || originalSrc; // preview if chosen, otherwise original

  return (
    <>
      <div style={{ padding: "1rem", minWidth: 400, margin: "auto", background: "#fff" }}>
        <Typography variant="h6" gutterBottom>
          Edit Video
        </Typography>

        {/* Current / Preview Video */}
        {showingSrc ? (
          <Box sx={{ textAlign: "center", mb: 2 }}>
            <video
              autoPlay
              loop
              muted
              src={showingSrc}
              style={{ width: "100%", height: 300, objectFit: "cover" }}
              controls
            />
            <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
              {previewUrl ? "Previewing newly selected file (not saved yet)" : "Currently saved video"}
            </Typography>
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            No video available.
          </Typography>
        )}

        <Stack spacing={1.5}>
          {/* Change Video */}
          <Button
            component="label"
            variant="outlined"
            startIcon={<CloudUploadIcon />}
            fullWidth
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              name="src"
              hidden
              onChange={handlePick}
            />
            {file ? "Change Selection" : "Change Video"}
          </Button>

          {/* Reset selection (only if a new file is chosen) */}
          {file && (
            <Button
              variant="text"
              color="secondary"
              startIcon={<RestartAltIcon />}
              onClick={handleResetSelection}
            >
              Reset selection
            </Button>
          )}

          {/* Save */}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            disabled={saving}
            onClick={handleSave}
            endIcon={<SendIcon />}
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </Stack>
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

export default EditVideo;
