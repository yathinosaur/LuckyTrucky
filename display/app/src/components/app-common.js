import axios from 'axios';

export const HTTP = axios.create({
  baseURL: `http://172.17.78.5:8081/`,
  headers: {
    Authorization: 'Bearer {token}'
  }
})