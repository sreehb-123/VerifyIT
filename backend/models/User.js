import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    firebaseUID: String,
    email: {
        type: String,
        required: true,
        unique: true,
    },
    role: {
        type: String,
        enum: ['student','warden','security'],
        required: true,
    },
    rollNo: {
        type: String,
        required: function() {
            return this.role === 'student';
        },
    },
});

export default mongoose.model('User',UserSchema);