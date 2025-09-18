import axios from "axios";

export const getAircraftCategories = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_APP_API_BASE_URL}/api/aircraftCategories/lists`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export const getAircraftCategoryById = async (id) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_APP_API_BASE_URL}/api/aircraftCategories/lists/${id}`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export const createAircraftCategory = async (data) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_APP_API_BASE_URL}/api/aircraftCategories`, data);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export const updateAircraftCategory = async (id, data) => {
    try {
        const response = await axios.put(`${import.meta.env.VITE_APP_API_BASE_URL}/api/aircraftCategories/update/${id}`, data);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export const deleteAircraftCategory = async (id) => {
    try {
        const response = await axios.delete(`${import.meta.env.VITE_APP_API_BASE_URL}/api/aircraftCategories/delete/${id}`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export const deleteAircraftCategoriesByBulk = async (ids) => {
    try {
        const response = await axios.delete(`${import.meta.env.VITE_APP_API_BASE_URL}/api/aircraftCategories/bulk-delete`, { ids });
        return response.data;
    } catch (error) {
        console.log(error);
    }
}
