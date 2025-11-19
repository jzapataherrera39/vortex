import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users';

const getToken = () => localStorage.getItem('token');

const getUsers = async () => {
    const config = {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    };
    const response = await axios.get(API_URL, config);
    return response.data;
};

const getUserById = async (id) => {
    const config = {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    };
    const response = await axios.get(`${API_URL}/${id}`, config);
    return response.data;
};

const updateUser = async (id, userData) => {
    const config = {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    };
    const response = await axios.put(`${API_URL}/${id}`, userData, config);
    return response.data;
};

const deleteUser = async (id) => {
    const config = {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    };
    const response = await axios.delete(`${API_URL}/${id}`, config);
    return response.data;
};

const setUserState = async (id, state) => {
    const config = {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    };
    const response = await axios.put(`${API_URL}/${id}/state`, { state }, config);
    return response.data;
};

export { getUsers, getUserById, updateUser, deleteUser, setUserState };
