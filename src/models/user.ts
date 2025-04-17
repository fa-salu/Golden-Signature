import mongoose, { type Document, Schema } from "mongoose";

interface IUser extends Document {
  username: string;
  name?: string;
  email: string;
  phoneNumber: string;
  image?: string;
  password: string;
  role: string;
  status?: string;
  address?: string;
  group: string;
  isDelete: boolean;
}

const userSchema: Schema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      sparse: true,
    },
    name: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
    },
    phoneNumber: {
      type: String,
      unique: true,
      sparse: true,
    },
    image: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "manager", "salesman", "accountant"],
      required: true,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      required: false,
    },

    address: {
      type: String,
      required: false,
    },
    group: {
      type: String,
      ref: "Group",
      default: "User",
    },
    isDelete: {
      type: Boolean,
      default: true,
      required: true,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", userSchema);
