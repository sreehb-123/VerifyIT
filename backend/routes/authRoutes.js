import express from 'express';
import { studentLogin,wardenOrSecurityLogin,createStudent,createAdmin } from '../controllers/authController.js';

const router = express.Router();

router.post('/create-student',createStudent);
router.post('/student-login',studentLogin);
router.post('/warden-login',wardenOrSecurityLogin);
router.post('/security-login',wardenOrSecurityLogin);
router.post('/create-admin',createAdmin);

export default router;