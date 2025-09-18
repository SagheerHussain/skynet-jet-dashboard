import axios from "axios";

/* ------------------- GET ---------------------- */
export const getContactsLists = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_APP_API_BASE_URL}/api/contacts/lists`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export const getContactById = async (id) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_APP_API_BASE_URL}/api/contacts/lists/${id}`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

/* ------------------- POST ---------------------- */
export const createContact = async (data) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_APP_API_BASE_URL}/api/contacts`, data);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

/* ------------------- PUT ---------------------- */
export const updateContact = async (id, data) => {
    try {
        const response = await axios.put(`${import.meta.env.VITE_APP_API_BASE_URL}/api/contacts/update/${id}`, data);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

/* ------------------- DELETE ---------------------- */
export const deleteContact = async (id) => {
    try {
        const response = await axios.delete(`${import.meta.env.VITE_APP_API_BASE_URL}/api/contacts/delete/${id}`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export const bulkDeleteContact = async (ids) => {
    try {
        const response = await axios.delete(`${import.meta.env.VITE_APP_API_BASE_URL}/api/contacts/bulkDelete`, { ids });
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

