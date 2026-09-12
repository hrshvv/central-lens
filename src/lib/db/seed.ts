import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dbConnect from './connect';
import { Category } from './models/Category';
import { User } from './models/User';
import { Article } from './models/Article';

const categories = [
  { name: 'राजनीति', slug: 'politics', color: '#1D4ED8', order: 1 },
  { name: 'खेल', slug: 'sports', color: '#10B981', order: 2 },
  { name: 'टेक्नोलॉजी', slug: 'technology', color: '#6366F1', order: 3 },
  { name: 'मनोरंजन', slug: 'entertainment', color: '#EC4899', order: 4 },
  { name: 'बिज़नेस', slug: 'business', color: '#F59E0B', order: 5 },
  { name: 'देश', slug: 'national', color: '#EF4444', order: 6 },
  { name: 'विदेश', slug: 'world', color: '#8B5CF6', order: 7 },
  { name: 'ऑटो', slug: 'auto', color: '#6B7280', order: 8 },
  { name: 'लाइफस्टाइल', slug: 'lifestyle', color: '#14B8A6', order: 9 },
];

async function seed() {
  await dbConnect();
  console.log('Connected to database. Starting seed...');

  // 1. Seed Categories
  await Category.deleteMany({});
  const createdCategories = await Category.insertMany(categories);
  console.log(`Seeded ${createdCategories.length} categories.`);

  // 2. Seed Admin User
  await User.deleteMany({});
  const passwordHash = await bcrypt.hash('admin123', 10);
  const adminUser = await User.create({
    name: 'Admin User',
    email: 'admin@centrallens.co.in',
    passwordHash,
    role: 'admin',
    newsletterSubscribed: true,
  });
  console.log('Seeded admin user.');

  // 3. Seed Sample Articles
  await Article.deleteMany({});
  const sampleArticles = [];
  
  for (let i = 1; i <= 15; i++) {
    const randomCategory = createdCategories[Math.floor(Math.random() * createdCategories.length)];
    const isPublished = i <= 12;
    
    sampleArticles.push({
      title: `Sample Article Title ${i} in Hindi (नमूना लेख ${i})`,
      slug: `sample-article-${i}`,
      subtitle: `This is a sample subtitle for article ${i} to test the layout.`,
      content: `<p>This is the HTML content for <b>Sample Article ${i}</b>. It includes some dummy text to simulate a real article. यह एक नमूना लेख है।</p><p>More paragraphs here...</p>`,
      excerpt: `This is a short excerpt for sample article ${i}...`,
      coverImage: 'https://res.cloudinary.com/demo/image/upload/sample.jpg', // Dummy image
      category: randomCategory._id,
      tags: ['sample', 'test', 'news'],
      author: {
        name: adminUser.name,
      },
      status: isPublished ? 'published' : 'draft',
      isFeatured: i === 1,
      isTrending: i >= 2 && i <= 5,
      isBreaking: i === 6,
      views: Math.floor(Math.random() * 1000),
      readingTime: Math.floor(Math.random() * 10) + 1,
      publishedAt: isPublished ? new Date(Date.now() - Math.random() * 10000000000) : undefined,
    });
  }

  await Article.insertMany(sampleArticles);
  console.log(`Seeded ${sampleArticles.length} sample articles.`);

  console.log('Seeding complete!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Error seeding database:', err);
  process.exit(1);
});
