import express from 'express';
import {
    createLeaveRequest,
    getStudentLeaveRequests,
    getAllLeaveRequests,
    updateLeaveRequestStatus,
    getActiveLeaveRequests,
   // getMyActiveLeaveRequests,
    getPendingRequests,
    getApprovedRequests,
    updateLeaveRequestRecord
} from '../controllers/leaveController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/requests',authenticateToken,createLeaveRequest);
router.get('/requests',authenticateToken,getStudentLeaveRequests);
router.get('/requests/all',authenticateToken,getAllLeaveRequests);
router.patch('/requests/update',authenticateToken,updateLeaveRequestStatus);
router.get('/requests/active',authenticateToken,getActiveLeaveRequests);
//router.get('/requests/my-active',authenticateToken,getMyActiveLeaveRequests);

router.get('/requests/pending',authenticateToken,getPendingRequests);
router.get('/requests/approved',authenticateToken,getApprovedRequests);
router.patch('/requests/exit',authenticateToken,updateLeaveRequestRecord);
export default router;