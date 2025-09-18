import axios from "axios";

/* ------------------- GET ---------------------- */
export const getVideos = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_APP_API_BASE_URL}/api/videos/lists`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export const getVideoById = async (id) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_APP_API_BASE_URL}/api/videos/lists/${id}`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

/* ------------------- POST ---------------------- */
export const createVideo = async (formData) => {
    // Let Axios set the boundary. You can omit headers entirely.
    const res = await axios.post(
        `${import.meta.env.VITE_APP_API_BASE_URL}/api/videos`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } } // optional; Axios will add this automatically
    );
    return res.data;
};

/* ------------------- PUT ---------------------- */
export const updateVideo = async (id, formData) => {
    try {
        const response = await axios.put(
            `${import.meta.env.VITE_APP_API_BASE_URL}/api/videos/update/${id}`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
        );
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

/* ------------------- DELETE ---------------------- */
export const deleteVideo = async (id) => {
    try {
        const response = await axios.delete(`${import.meta.env.VITE_APP_API_BASE_URL}/api/videos/delete/${id}`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export const deleteVideosByBulk = async (ids) => {
    try {
        const response = await axios.delete(`${process.env.VITE_APP_API_BASE_URL}/api/videos/bulkDelete`, { ids });
        return response.data;
    } catch (error) {
        console.log(error);
    }
}   
