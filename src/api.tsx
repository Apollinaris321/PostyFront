import axios from 'axios'
import { url } from './Url';

export const client = axios.create({
  baseURL: url,
  withCredentials: true,
});
