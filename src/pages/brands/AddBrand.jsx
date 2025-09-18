import React, { useState } from "react";
import {
    Box,
    Button,
    Typography,
    Snackbar,
    Alert,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { createBrand } from "../../api/brand.api";
import { useNavigate } from "react-router-dom";
import SendIcon from "@mui/icons-material/Send";

const AddBrand = () => {
    const navigate = useNavigate();
    const [image, setImage] = useState(null);
    const [snack, setSnack] = useState({ open: false, severity: "success", msg: "" });
    const [uploading, setUploading] = useState(false);
    
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
        }
    };
    
    const handleAdd = async () => {
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("logo", image, image.name);
            const response = await createBrand(formData);
            if (response.success) {
                setSnack({ open: true, severity: "success", msg: "Brand added successfully" });
                setUploading(false);
                setTimeout(() => {
                    navigate("/brands");
                }, 700);
            }
        } catch (error) {
            setUploading(false);
            console.error("Error adding brand:", error);
            setSnack({ open: true, severity: "error", msg: "Error adding brand" });
        }
    };

    const handleClose = () => {
        setSnack({ open: false });
    };

    return (
        <>
        <div style={{ padding: "1rem", minWidth: "400px", margin: "auto", background: "#fff" }}>
            <Typography variant="h6" gutterBottom>
                Add Brand
            </Typography>

            {/* Image Preview */}
            {image && (
                <Box sx={{ textAlign: "center", mb: 2 }}>
                    <img
                        src={URL.createObjectURL(image)}
                        alt="Brand Preview"
                        style={{ width: "100%", height: "300px", objectFit: "cover" }}
                    />
                </Box>
            )}

            {/* Upload Button */}
             <Button
                component="label"
                variant="outlined"
                startIcon={<CloudUploadIcon />}
                fullWidth
                sx={{ mb: 2 }}
            >
                <input
                    type="file"
                    // accept="image/*"
                    name="logo"
                    hidden
                    onChange={handleImageChange}
                />
                {image ? "Change Image" : "Upload Image"}
            </Button> 

            {/* Add Button */}
            <div>
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={!image || uploading}
                    onClick={handleAdd}
                    endIcon={<SendIcon />}
                >
                    Add Brand
                </Button>
            </div>
        </div>

        <Snackbar
            open={snack.open}
            autoHideDuration={6000}
            onClose={handleClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
            <Alert onClose={handleClose} severity={snack.severity} sx={{ width: "100%" }}>
                {snack.msg}
            </Alert>
        </Snackbar>
        </>
    );
};

export default AddBrand;
