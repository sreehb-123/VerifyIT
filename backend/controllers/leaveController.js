import LeaveRequest from '../models/LeaveRequest.js';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

export const createLeaveRequest = async (req, res) => {
  try {
    
    const { studentId, noOfStudents, phoneNo, leaveDate, entryDate, reason, rollNo } = req.body;
    // const { rollNo } = req.user;
    const newRequest = new LeaveRequest({
      studentId,
      noOfStudents,
      phoneNo,
      rollNo,
      leaveDate,
      entryDate,
      reason,
      status: 'pending', 
      records: 'inactive',
    });

   // console.log(process.env.WARDEN_EMAIL,process.env.WARDEN_EMAIL_PWD);

    const savedRequest = await newRequest.save();
    
    /*
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SECURITY_EMAIL,
        pass: process.env.SECURITY_EMAIL_PWD
      },
    });

    const mailOptions = {
      from: process.env.SECURITY_EMAIL,
      to: 'harshab1926@gmail.com',
      subject: 'New Leave Request Submitted',
      text:  `A new leave request is submitted by student - ${studentId}. Details:
        - Roll No: ${rollNo ? rollNo.join(', ') : 'Not provided'}
        - Leave Date: ${leaveDate}
        - Entry Date: ${entryDate}
        - Contact No: ${phoneNo ? phoneNo.join(', ') : 'Not provided'}
        - Reason: ${reason}
        - No. of Students: ${noOfStudents}
      `,
    };

    await transporter.sendMail(mailOptions);

*/
    res.status(201).json(savedRequest);
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: error.message });
  }
};

export const getStudentLeaveRequests = async (req, res) => {
  try {
    const studentId = req.user.uid; // Getting studentId from authenticated user
    //console.log('Fetching requests for studentId:', studentId);
    
    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: 'Student ID is required'
      });
    }

    // Correct MongoDB query syntax
    const requests = await LeaveRequest.find({ studentId: studentId });
   // console.log('Found requests:', requests);

    return res.status(200).json({
      success: true,
      data: requests,
      message: requests.length > 0 ? 'Leave requests retrieved successfully' : 'No leave requests found'
    });

  } catch (error) {
    console.error('Error in getStudentLeaveRequests:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

export const getAllLeaveRequests = async (req, res) => {
  // console.log(req.user.role);
  if(req.user.role === 'student'){
    return res.status(403).json({message: 'Access denied. Not for students'})
  }
  try {
    const requests = await LeaveRequest.find();
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateLeaveRequestStatus = async (req, res) => {
  const requestId = req.body.id;
  const status = req.body.status;
  if(req.user.role !== 'warden'){
    return res.status(403).json({message: 'Access denied. Only for warden'});
  }
  try {
    const updatedRequest = await LeaveRequest.findByIdAndUpdate(
      requestId,
      { status },
      { new: true }
    );
    if(!updatedRequest){
      //console.log('kuch nahi hai');
      return res.status(404).json({messge: 'Leave request not found'});
    }
    res.status(200).json(updatedRequest);
  } catch (error) {
    console.error('Error updating leave request:', error); // Log the full error

    res.status(500).json({ message: error.message });
  }
};
export const getMyActiveLeaveRequests = async (req, res) => {
  const { studentId } = req.user.uid;
  
  try {
    // Validate studentId
    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: 'Student ID is required'
      });
    }

    const activeRequests = await LeaveRequest.find({ 
      studentId,
    });

    // Return empty array instead of 404 when no requests found
    return res.status(200).json({
      success: true,
      data: activeRequests,
      message: activeRequests.length === 0 ? 'No active leave requests found' : 'Active leave requests retrieved successfully'
    });

  } catch (error) {
    console.error('Error fetching active requests:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching active leave requests',
      error: error.message
    });
  }
};

export const getActiveLeaveRequests = async (req,res) => {
  if(req.user.role === 'student'){
    return res.status(403).json({message: 'Access denied. Not for students'})
  }
  try {
    const activeRequests = await LeaveRequest.find({ records: 'active' });
    if(activeRequests.length === 0){
      return res.status(404).json({message: 'No active leave requests'});
    }
    res.status(200).json(activeRequests);
  } catch (error) {
    
    res.status(500).json({message: error.message});
  }
};

export const getPendingRequests = async (req,res) => {
  if(req.user.role !== 'warden'){
    return res.status(403).json({message: 'Access denied. Only for warden.'});
  }

  try {
    const pendingRequests = await LeaveRequest.find({ status: 'pending' });
    if(pendingRequests.length === 0){
      return res.status(404).json({message: 'No pending requests found'});
    }
    return res.status(200).json(pendingRequests);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
}
/*
export const getApprovedRequests = async(req,res) => {
  console.log(req.body.studentId);
  const  studentId = req.body.studentId;
  console.log(studentId);
  try {
    const approvedRequests = await LeaveRequest.find({ studentId, status: 'approved' });
    if (approvedRequests.length === 0) {
      return res.status(404).json({ message: 'No approved requests found for this student.' });
    }
    res.status(200).json(approvedRequests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}*/
export const getApprovedRequests = async (req, res) => {
  try {
    const { studentId } = req.query;

    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: 'Student ID is required'
      });
    }

    const approvedRequests = await LeaveRequest.find({ 
      studentId, 
      status: 'approved',
      records: { $in: ['inactive','active'] }
    });
    if (approvedRequests.length === 0) {
      return res.status(404).json({ message: 'No approved requests found for this student.' });
    }
    res.status(200).json(approvedRequests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

