import axios from "axios";

export const getLatestAircraft = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_APP_API_BASE_URL}/api/aircrafts/lists/latest`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}
