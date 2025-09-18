import axios from 'axios';

/* ------------------- GET ---------------------- */
export const getBlogCategories = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_APP_API_BASE_URL}/api/blogCategories/lists`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export const getBlogCategoryById = async (id) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_APP_API_BASE_URL}/api/blogCategories/lists/${id}`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

/* ------------------- POST ---------------------- */
export const createBlogCategory = async (data) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_APP_API_BASE_URL}/api/blogCategories`, data);
        return response.data;
    } catch (error) {
        console.error('Error creating blog category:', error);
        throw error;
    }
};

/* ------------------- PUT ---------------------- */
export const updateBlogCategory = async (id, data) => {
    try {
        const response = await axios.put(`${import.meta.env.VITE_APP_API_BASE_URL}/api/blogCategories/update/${id}`, data);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

/* ------------------- DELETE ---------------------- */
export const deleteBlogCategory = async (id) => {
    try {
        const response = await axios.delete(`${import.meta.env.VITE_APP_API_BASE_URL}/api/blogCategories/delete/${id}`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export const deleteBlogCategoriesByBulk = async (ids) => {
    try {
        const response = await axios.delete(`${import.meta.env.VITE_APP_API_BASE_URL}/api/blogCategories/bulkDelete`, { ids });
        return response.data;
    } catch (error) {
        console.log(error);
    }
}


