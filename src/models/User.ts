// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    clerkId: { type: String, required: true },
    username: { type: String, required: false },
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    role: { type: String, required: true, default: 'user' },
    maxUsage: { type: Number, required: true, default: 10 },
    usage: { type: Number, required: true, default: 0 },
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
