import axios from 'axios'
import { url } from './components/Url';

export const client = axios.create({
  baseURL: url,
  withCredentials: true,
});
