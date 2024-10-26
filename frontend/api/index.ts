import axios from 'axios';

const BACKEND_URL = 'http://localhost:5000/api';

export const studentSignup = async (email: string, password: string, rollNo: string) => {
    await axios.post(`${BACKEND_URL}/auth/create-student`, {email,password,rollNo});
};

export const adminSignup = async (email: string, password: string, role: string) => {
    await axios.post(`${BACKEND_URL}/auth/create-admin`, {email,password,role});
};

export const studentLogin = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/auth/student-login`, { email, password });
      return response.data.idToken; 
    } catch (error) {
        console.error(error);
        throw new Error('Login failed');
    }
  };  

export const wardenLogin = async (email: string, password: string) => {
    const response = await axios.post(`${BACKEND_URL}/auth/warden-login`, {email,password});
    return response.data.idToken;
};

export const securityLogin = async (email: string, password: string) => {
    const response = await axios.post(`${BACKEND_URL}/auth/security-login`, {email,password});
    return response.data.idToken;
};