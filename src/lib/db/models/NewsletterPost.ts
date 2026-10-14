import mongoose, { Document, Model, Schema } from 'mongoose';

export interface INewsletterPost extends Document {
  subject: string;
  previewText?: string;
  content: string;
  status: 'draft' | 'sent';
  sentAt?: Date;
  recipientsCount?: number;
  createdBy: mongoose.Types.ObjectId;
  authorName: string;
  createdAt: Date;
  updatedAt: Date;
}

const NewsletterPostSchema = new Schema<INewsletterPost>(
  {
    subject: { type: String, required: true },
    previewText: { type: String },
    content: { type: String, required: true },
    status: {
      type: String,
      enum: ['draft', 'sent'],
      default: 'draft',
    },
    sentAt: { type: Date },
    recipientsCount: { type: Number, default: 0 },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    authorName: { type: String, default: 'Central Lens Editorial' },
  },
  { timestamps: true }
);

NewsletterPostSchema.index({ createdBy: 1 });
NewsletterPostSchema.index({ status: 1, createdAt: -1 });

export const NewsletterPost: Model<INewsletterPost> =
  mongoose.models.NewsletterPost || mongoose.model<INewsletterPost>('NewsletterPost', NewsletterPostSchema);
