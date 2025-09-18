import axios from 'axios';

/* ------------------- GET ---------------------- */
export const getBlogs = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_APP_API_BASE_URL}/api/blogs/lists`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export const getBlogById = async (id) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_APP_API_BASE_URL}/api/blogs/lists/${id}`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

/* ------------------- POST ----------------------  */
export const createBlog = async (formData) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_APP_API_BASE_URL}/api/blogs`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating blog:', error);
    throw error;
  }
};

/* ------------------- PUT ---------------------- */
export const updateBlog = async (id, formData) => {
    try {
        const response = await axios.put(`${import.meta.env.VITE_APP_API_BASE_URL}/api/blogs/update/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error updating blog:', error);
        throw error;
    }
};

/* ------------------- DELETE ---------------------- */
export const deleteBlog = async (id) => {
    try {
        const response = await axios.delete(`${import.meta.env.VITE_APP_API_BASE_URL}/api/blogs/delete/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting blog:', error);
        throw error;
    }
};

export const bulkDeleteBlogs = async (ids) => {
    try {
        const response = await axios.delete(`${import.meta.env.VITE_APP_API_BASE_URL}/api/blogs/bulkDelete`, { ids });
        return response.data;
    } catch (error) {
        console.error('Error deleting blogs:', error);
        throw error;
    }
};
