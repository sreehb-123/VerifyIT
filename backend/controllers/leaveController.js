import LeaveRequest from '../models/LeaveRequest.js';

// Create a new leave request
export const createLeaveRequest = async (req, res) => {
  try {
    const { studentId, leaveDate, entryDate, reason, rollNo } = req.body;
    // const { rollNo } = req.user;
    const newRequest = new LeaveRequest({
      studentId,
      rollNo,
      leaveDate,
      entryDate,
      reason,
      status: 'pending', 
      records: 'inactive',
    });

    const savedRequest = await newRequest.save();
    res.status(201).json(savedRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all leave requests for a specific student
export const getStudentLeaveRequests = async (req, res) => {
  try {
    const studentId = req.user.uid; // Assuming student ID is stored in JWT
    const requests = await LeaveRequest.find({ studentId });
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all leave requests (for warden)
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

// Update leave request status (for warden)
export const updateLeaveRequestStatus = async (req, res) => {
  const { requestId, status } = req.body;
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
      return res.status(404).json({messge: 'Leave request not found'});
    }
    res.status(200).json(updatedRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
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