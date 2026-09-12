import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IVideo extends Document {
  title: string;
  slug: string;
  description?: string;
  thumbnailUrl: string;
  videoUrl: string;
  videoType: 'long' | 'short' | 'podcast';
  duration: number;
  category: mongoose.Types.ObjectId;
  tags: string[];
  author: {
    name: string;
    avatar?: string;
  };
  status: 'draft' | 'published';
  views: number;
  isFeatured: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const VideoSchema = new Schema<IVideo>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    thumbnailUrl: { type: String, required: true },
    videoUrl: { type: String, required: true },
    videoType: {
      type: String,
      enum: ['long', 'short', 'podcast'],
      default: 'long',
    },
    duration: { type: Number, default: 0 },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    tags: [{ type: String }],
    author: {
      name: { type: String, required: true },
      avatar: { type: String },
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
    views: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    publishedAt: { type: Date },
  },
  { timestamps: true }
);

VideoSchema.index({ slug: 1 }, { unique: true });
VideoSchema.index({ status: 1, publishedAt: -1 });

export const Video: Model<IVideo> =
  mongoose.models.Video || mongoose.model<IVideo>('Video', VideoSchema);
