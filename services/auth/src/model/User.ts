import mongoose, {
  Document,
  Schema,
} from "mongoose";

export interface IUser
  extends Document {
  name: string;

  email: string;

  password?: string;

  image?: string;

  provider: string;

  role: string;

  resetPasswordToken?: string;

  resetPasswordExpire?: Date;
}

const schema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      default: null,
    },

    resetPasswordToken: {
      type: String,
      default: null,
    },

    resetPasswordExpire: {
      type: Date,
      default: null,
    },

    image: {
      type: String,
      default: null,
    },

    provider: {
      type: String,
      enum: ["google", "email"],
      default: "email",
    },

    role: {
      type: String,
      enum: [
        "customer",
        "admin",
        "rider",
      ],
      default: "customer",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model<IUser>(
  "User",
  schema
);

export default User;