import axios from 'axios';
import User from '../../backend/models/User';

const API_URL = ' http://localhost:5000/api';

export const studentSignup = async (email: string, password: string, rollNo: string) => {
    await axios.post(`${API_URL}/auth/create-student`, {email,password,rollNo});
};

export const adminSignup = async (email: string, password: string, role: string) => {
    await axios.post(`${API_URL}/auth/create-admin`, {email,password,role});
};

export const studentLogin = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/auth/student-login`, { email, password });
      //const studentId = response.data.uid;
      return [response.data.idToken, response.data.uid]; 
    } catch (error) {
        console.error(error);
        throw new Error('Login failed');
    }
  };  

export const wardenLogin = async (email: string, password: string) => {
    const response = await axios.post(`${API_URL}/auth/warden-login`, {email,password});
    return response.data.idToken;
};

export const securityLogin = async (email: string, password: string) => {
    const response = await axios.post(`${API_URL}/auth/security-login`, {email,password});
    return response.data.idToken;
};

export const submitRequest = async(rollNo: string[], phoneNo: string[], noOfStudents: number, reason: string, entryDate: Date, leaveDate: Date) => {
    const studentId = localStorage.getItem('studentId');
    const token = localStorage.getItem('userToken');

    console.log(studentId,token);

    try {
        const response = await axios.post(`${API_URL}/leaves/requests`, {studentId,noOfStudents,phoneNo,rollNo,leaveDate,entryDate,reason}, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        console.log('leave request submitted');
    } catch (error) {
        console.error('error submitting form', error);
    }
};