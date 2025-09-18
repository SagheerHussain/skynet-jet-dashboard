import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    Typography,
    Snackbar,
    Alert,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { createBrand, updateBrand } from "../../api/brand.api";
import { useNavigate } from "react-router-dom";
import SendIcon from "@mui/icons-material/Send";
import { useParams } from "react-router-dom";
import { getBrandById } from "../../api/brand.api";

const EditBrand = () => {
    const navigate = useNavigate();
    const [image, setImage] = useState(null);
    const [snack, setSnack] = useState({ open: false, severity: "success", msg: "" });
    const [uploading, setUploading] = useState(false);
    const [brand, setBrand] = useState({});
    const [defaultImage, setDefaultImage] = useState("");

    // Get id from url
    const { id } = useParams();
    
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setDefaultImage("");
            setImage(file);
        }
    };

    useEffect(() => {
        const fetchBrand = async () => {
            try {
                const response = await getBrandById(id);
                if (response.success) {
                    setBrand(response.data);
                    setDefaultImage(response.data.logo);
                    console.log("Brand fetched successfully:", response.data.logo);
                }
            } catch (error) {
                console.error("Error fetching brand:", error);
            }
        };
        fetchBrand();
    }, [id]);

    
    const handleEdit = async () => {
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("logo", image, image.name);
            const response = await updateBrand(id, formData);
            if (response.success) {
                setSnack({ open: true, severity: "success", msg: "Brand updated successfully" });
                setUploading(false);
                setTimeout(() => {
                    navigate("/brands");
                }, 700);
            }
        } catch (error) {
            setUploading(false);
            console.error("Error updating brand:", error);
            setSnack({ open: true, severity: "error", msg: "Error updating brand" });
        }
    };

    const handleClose = () => {
        setSnack({ open: false });
    };

    return (
        <>
        <div style={{ padding: "1rem", minWidth: "400px", margin: "auto", background: "#fff" }}>
            <Typography variant="h6" gutterBottom>
                Edit Brand
            </Typography>

            {/* Default Image */}
            {defaultImage && (
                <Box sx={{ margin: "0 auto 1rem", display: "flex", justifyContent: "center", width: "100%" }}>
                    <img
                        src={defaultImage}
                        alt="Brand Preview"
                        // style={{ width: "100%", height: "300px", objectFit: "cover" }}
                    />
                </Box>
            )}

            {/* Image Preview */}
            {image && (
                <Box sx={{ margin: "0 auto 1rem", display: "flex", justifyContent: "center", width: "100%" }}>
                    <img
                        src={URL.createObjectURL(image)}
                        alt="Brand Preview"
                        // style={{ width: "300px", height: "100px", objectFit: "cover" }}
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
                    onClick={handleEdit}
                    endIcon={<SendIcon />}
                >
                    Update Brand
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

export default EditBrand;
