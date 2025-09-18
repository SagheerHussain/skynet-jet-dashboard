import axios from "axios";

export const createAccount = async (data) => {
    const res = await axios.post(
        `${import.meta.env.VITE_APP_API_BASE_URL}/api/auth/register`,
        data,
    );
    return res.data;
}

export const loginAccount = async (data) => {
    const res = await axios.post(
        `${import.meta.env.VITE_APP_API_BASE_URL}/api/auth/login`,
        data,
    );
    return res.data;
}