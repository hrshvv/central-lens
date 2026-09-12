import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: 'reader' | 'editor' | 'admin';
  avatar?: string;
  savedArticles: mongoose.Types.ObjectId[];
  newsletterSubscribed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ['reader', 'editor', 'admin'],
      default: 'reader',
    },
    avatar: { type: String },
    savedArticles: [{ type: Schema.Types.ObjectId, ref: 'Article' }],
    newsletterSubscribed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
