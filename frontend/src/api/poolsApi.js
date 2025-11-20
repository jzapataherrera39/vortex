import api from './api';

const getPools = async () => {
    const response = await api.get('/piscinas');
    return response.data;
};

const getPoolById = async (id) => {
    const response = await api.get(`/piscinas/${id}`);
    return response.data;
};

const createPool = async (poolData) => {
    const response = await api.post('/piscinas', poolData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

const updatePool = async (id, poolData) => {
    const response = await api.put(`/piscinas/${id}`, poolData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

const deletePool = async (id) => {
    const response = await api.delete(`/piscinas/${id}`);
    return response.data;
};

export const togglePoolStatus = async (id) => {
    const response = await api.put(`/piscinas/${id}/toggle`);
    return response.data;
};

export { getPools, getPoolById, createPool, updatePool, deletePool };
