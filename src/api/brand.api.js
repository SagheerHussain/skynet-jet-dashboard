import axios from "axios";

/* ------------------- GET ---------------------- */
export const getBrands = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_APP_API_BASE_URL}/api/brands/lists`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export const getBrandById = async (id) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_APP_API_BASE_URL}/api/brands/lists/${id}`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

/* ------------------- POST ---------------------- */
export const createBrand = async (formData) => {
    // Let Axios set the boundary. You can omit headers entirely.
    const res = await axios.post(
        `${import.meta.env.VITE_APP_API_BASE_URL}/api/brands`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } } // optional; Axios will add this automatically
    );
    return res.data;
};

/* ------------------- PUT ---------------------- */
export const updateBrand = async (id, formData) => {
    try {
        const response = await axios.put(
            `${import.meta.env.VITE_APP_API_BASE_URL}/api/brands/update/${id}`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
        );
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

/* ------------------- DELETE ---------------------- */
export const deleteBrand = async (id) => {
    try {
        const response = await axios.delete(`${import.meta.env.VITE_APP_API_BASE_URL}/api/brands/delete/${id}`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export const deleteBrandsByBulk = async (ids) => {
    try {
        const response = await axios.delete(`${process.env.VITE_APP_API_BASE_URL}/api/brands/bulkDelete`, { ids });
        return response.data;
    } catch (error) {
        console.log(error);
    }
}   
