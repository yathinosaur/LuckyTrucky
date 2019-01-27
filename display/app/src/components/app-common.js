import axios from 'axios';

export const HTTP = axios.create({
  baseURL: `http://192.168.43.147:8081/`,
  headers: {
    Authorization: 'Bearer {token}'
  }
})