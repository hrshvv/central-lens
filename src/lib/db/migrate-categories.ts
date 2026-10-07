import dbConnect from './connect';
import { Category } from './models/Category';
import { Article } from './models/Article';
import { Video } from './models/Video';

export const STATE_CATEGORIES = [
  { name: 'मध्य प्रदेश', slug: 'mp', color: '#EA580C', order: 1, description: 'मध्य प्रदेश की ताजा और बड़ी खबरें' },
  { name: 'छत्तीसगढ़', slug: 'chhattisgarh', color: '#059669', order: 2, description: 'छत्तीसगढ़ राज्य की हर प्रमुख खबर' },
  { name: 'दिल्ली', slug: 'delhi', color: '#DC2626', order: 3, description: 'राजधानी दिल्ली और एनसीआर के ताजा समाचार' },
  { name: 'उत्तर प्रदेश', slug: 'uttar-pradesh', color: '#2563EB', order: 4, description: 'उत्तर प्रदेश से जुड़े सियासी और जनसरोकार के मुद्दे' },
  { name: 'बिहार', slug: 'bihar', color: '#D97706', order: 5, description: 'बिहार की राजनीति, विकास और सामाजिक हलचल' },
  { name: 'झारखंड', slug: 'jharkhand', color: '#0D9488', order: 6, description: 'झारखंड से जुड़ी जमीनी खबरें और विश्लेषण' },
  { name: 'पंजाब', slug: 'punjab', color: '#CA8A04', order: 7, description: 'पंजाब की हर बड़ी खबर और विशेष रिपोर्ट्स' },
  { name: 'हरियाणा', slug: 'haryana', color: '#4F46E5', order: 8, description: 'हरियाणा राज्य की ताजा खबरें और अपडेट्स' },
  { name: 'ओडिशा', slug: 'odisha', color: '#0891B2', order: 9, description: 'ओडिशा के विकास और संस्कृति से जुड़ी खबरें' },
  { name: 'राजस्थान', slug: 'rajasthan', color: '#E11D48', order: 10, description: 'राजस्थान की राजनीति, कला और जनमुद्दे' },
  { name: 'गुजरात', slug: 'gujarat', color: '#7C3AED', order: 11, description: 'गुजरात के उद्योग, व्यापार और सामाजिक घटनाक्रम' },
];

async function migrate() {
  await dbConnect();
  console.log('Connected to MongoDB.');

  // Find existing categories
  const oldCategories = await Category.find().lean();
  console.log(`Found ${oldCategories.length} existing categories.`);

  // Upsert all new state categories
  const newCatMap: Record<string, any> = {};
  for (const catData of STATE_CATEGORIES) {
    const doc = await Category.findOneAndUpdate(
      { slug: catData.slug },
      { ...catData, isActive: true },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    newCatMap[catData.slug] = doc;
  }
  console.log(`✓ Upserted 11 state categories.`);

  // Map old category slugs to new state categories
  const oldToNewMapping: Record<string, string> = {
    politics: 'mp',
    national: 'delhi',
    sports: 'haryana',
    technology: 'delhi',
    business: 'gujarat',
    entertainment: 'uttar-pradesh',
    world: 'delhi',
    auto: 'punjab',
    lifestyle: 'rajasthan',
  };

  const stateSlugs = STATE_CATEGORIES.map(c => c.slug);

  // Remap existing articles
  const allArticles = await Article.find();
  console.log(`Checking ${allArticles.length} existing articles...`);
  let remappedArticles = 0;
  for (let i = 0; i < allArticles.length; i++) {
    const art = allArticles[i];
    const currentCat = oldCategories.find(c => c._id.toString() === art.category?.toString());
    const targetSlug = currentCat ? (oldToNewMapping[currentCat.slug] || stateSlugs[i % stateSlugs.length]) : stateSlugs[i % stateSlugs.length];
    const targetCatDoc = newCatMap[targetSlug] || newCatMap['mp'];
    
    art.category = targetCatDoc._id;
    await art.save();
    remappedArticles++;
  }
  console.log(`✓ Remapped ${remappedArticles} articles to new state categories.`);

  // Remap existing videos
  const allVideos = await Video.find();
  console.log(`Checking ${allVideos.length} existing videos...`);
  let remappedVideos = 0;
  for (let i = 0; i < allVideos.length; i++) {
    const vid = allVideos[i];
    const currentCat = oldCategories.find(c => c._id.toString() === vid.category?.toString());
    const targetSlug = currentCat ? (oldToNewMapping[currentCat.slug] || stateSlugs[i % stateSlugs.length]) : stateSlugs[i % stateSlugs.length];
    const targetCatDoc = newCatMap[targetSlug] || newCatMap['mp'];
    
    vid.category = targetCatDoc._id;
    await vid.save();
    remappedVideos++;
  }
  console.log(`✓ Remapped ${remappedVideos} videos to new state categories.`);

  // Remove old categories that are not part of the 11 states
  const oldSlugsToRemove = oldCategories
    .map(c => c.slug)
    .filter(slug => !stateSlugs.includes(slug));

  if (oldSlugsToRemove.length > 0) {
    const delResult = await Category.deleteMany({ slug: { $in: oldSlugsToRemove } });
    console.log(`✓ Deleted ${delResult.deletedCount} old non-state categories: ${oldSlugsToRemove.join(', ')}`);
  }

  const finalCategories = await Category.find().sort({ order: 1 }).lean();
  console.log('\nFinal active categories in DB:');
  finalCategories.forEach(c => console.log(` - [${c.order}] ${c.name} (${c.slug})`));

  process.exit(0);
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
