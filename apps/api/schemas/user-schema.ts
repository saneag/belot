import type { UserRole } from "@belot/types";

import mongoose from "mongoose";

export interface UserFields {
  username: string;
  email: string;
  passwordHash: string;
  passwordSalt: string;
  role: UserRole;
}

const userSchema = new mongoose.Schema<UserFields>(
  {
    username: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true, select: false },
    passwordSalt: { type: String, required: true, select: false },
    role: { type: String, enum: ["user", "admin"], default: "user", required: true },
  },
  { timestamps: true },
);

const UserModel =
  (mongoose.models.User as mongoose.Model<UserFields> | undefined) ??
  mongoose.model<UserFields>("User", userSchema);
export default UserModel;
