import mongoose, { Document, Schema } from "mongoose";
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  username: string;
  email: string;
  password?: string;
  googleId?: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: false,
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true,
  },
});

userSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) {
    return;
  }
  // Hash the password before saving
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
}

const userModel = mongoose.model<IUser>("User", userSchema);
export default userModel;
