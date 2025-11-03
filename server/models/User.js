import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  provider: {
    type: String,
    required: true,
    enum: ['google', 'facebook', 'github']
  },
  providerId: {
    type: String,
    required: true
  },
  displayName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  photo: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index for provider and providerId
userSchema.index({ provider: 1, providerId: 1 }, { unique: true });

export default mongoose.model("User", userSchema);
