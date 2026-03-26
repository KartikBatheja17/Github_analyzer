import axios from 'axios';

const BASE_URL = "https://github-analyzer-720q.onrender.com/api";

export const analyzerUser = (username) => {
    return axios.get(`${BASE_URL}/analyze/${username}/`)
};