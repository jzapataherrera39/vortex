import api from './api';

const getUsers = async () => {
    const response = await api.get('/users');
    return response.data;
};

const getUserById = async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
};

const updateUser = async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
};

const deleteUser = async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
};

const setUserState = async (id, state) => {
    const response = await api.put(`/users/${id}/state`, { state });
    return response.data;
};

export { getUsers, getUserById, updateUser, deleteUser, setUserState };
