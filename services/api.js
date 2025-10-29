// services/api.js
import axios from 'axios'; // <--- Importe o Axios

const api = axios.create({
    baseURL: 'https://jsonplaceholder.typicode.com', // <--- URL base da API de exemplo
});

export default api; // <--- Exporte a instância configurada do Axios