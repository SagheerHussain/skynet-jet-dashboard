import axios from 'axios';

/* ------------------- GET ---------------------- */
export const getAuthorsLists = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_APP_API_BASE_URL}/api/authors/lists`);
        console.log('authors= ==== ', response?.data);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export const getAuthorById = async (id) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_APP_API_BASE_URL}/api/authors/lists/${id}`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

/* ------------------- POST ---------------------- */
export const createAuthor = async (data) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_APP_API_BASE_URL}/api/authors`, data);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

/* ------------------- PUT ---------------------- */
export const updateAuthor = async (id, data) => {
    try {
        const response = await axios.put(`${import.meta.env.VITE_APP_API_BASE_URL}/api/authors/update/${id}`, data);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

/* ------------------- DELETE ---------------------- */
export const deleteAuthor = async (id) => {
    try {
        const response = await axios.delete(`${import.meta.env.VITE_APP_API_BASE_URL}/api/authors/delete/${id}`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export const deleteAuthorsByBulk = async (ids) => {
    try {
        const response = await axios.delete(`${import.meta.env.VITE_APP_API_BASE_URL}/api/authors/bulkDelete`, { ids });
        return response.data;
    } catch (error) {
        console.log(error);
    }
}