import mongoose, { Document, Model, Schema } from 'mongoose';

export interface INewsletter extends Document {
  email: string;
  subscribedAt: Date;
  isActive: boolean;
  createdBy?: mongoose.Types.ObjectId;
}

const NewsletterSchema = new Schema<INewsletter>(
  {
    email: { type: String, required: true, unique: true },
    subscribedAt: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export const Newsletter: Model<INewsletter> =
  mongoose.models.Newsletter || mongoose.model<INewsletter>('Newsletter', NewsletterSchema);
