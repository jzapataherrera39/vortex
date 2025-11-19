import axios from 'axios';

const API_URL = 'http://localhost:5000/api/pools';

const getToken = () => localStorage.getItem('token');

const getPools = async () => {
    const config = {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    };
    const response = await axios.get(API_URL, config);
    return response.data;
};

const getPoolById = async (id) => {
    const config = {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    };
    const response = await axios.get(`${API_URL}/${id}`, config);
    return response.data;
};

const createPool = async (poolData) => {
    const config = {
        headers: {
            Authorization: `Bearer ${getToken()}`,
            'Content-Type': 'multipart/form-data',
        },
    };
    const response = await axios.post(API_URL, poolData, config);
    return response.data;
};

const updatePool = async (id, poolData) => {
    const config = {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    };
    const response = await axios.put(`${API_URL}/${id}`, poolData, config);
    return response.data;
};

const deletePool = async (id) => {
    const config = {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    };
    const response = await axios.delete(`${API_URL}/${id}`, config);
    return response.data;
};

export { getPools, getPoolById, createPool, updatePool, deletePool };
