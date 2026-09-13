import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IArticle extends Document {
  title: string;
  slug: string;
  subtitle?: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  category: mongoose.Types.ObjectId;
  tags: string[];
  author: {
    name: string;
    avatar?: string;
    bio?: string;
  };
  status: 'draft' | 'published' | 'archived';
  isFeatured: boolean;
  isTrending: boolean;
  isBreaking: boolean;
  views: number;
  readingTime: number;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ArticleSchema = new Schema<IArticle>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    subtitle: { type: String },
    content: { type: String, required: true },
    excerpt: { type: String, maxlength: 160 },
    coverImage: { type: String },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    tags: [{ type: String }],
    author: {
      name: { type: String, required: true },
      avatar: { type: String },
      bio: { type: String },
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
    },
    isFeatured: { type: Boolean, default: false },
    isTrending: { type: Boolean, default: false },
    isBreaking: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    readingTime: { type: Number, default: 0 },
    publishedAt: { type: Date },
  },
  { timestamps: true }
);

ArticleSchema.index({ category: 1 });
ArticleSchema.index({ status: 1, publishedAt: -1 });
ArticleSchema.index({ tags: 1 });

export const Article: Model<IArticle> =
  mongoose.models.Article || mongoose.model<IArticle>('Article', ArticleSchema);
