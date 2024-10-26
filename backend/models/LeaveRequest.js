import mongoose from "mongoose";

const RequestSchema = new mongoose.Schema({
    studentId: {
        type: String,
        required: true
    },
    rollNo: {type: String, required: true},
    leaveDate: {type: Date, required: true},
    entryDate: {type: Date, required: true},
    reason: String,
    qrCode: String,
    checkInTime: Date,
    checkOutTime: Date,
    status: {
        type: String,
        enum: ['approved','pending','rejected'],
        default: 'pending',
    },
    records: {
        type: String,
        enum: ['active','inactive','done'],
        default: 'inactive',
    },
});

export default mongoose.model('LeaveRequest',RequestSchema);