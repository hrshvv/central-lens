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

const realisticArticles = [
  {
    title: 'इसरो का अगला बड़ा कदम: चंद्रयान-4 और गगनयान मिशन की तैयारियों पर बड़ी रिपोर्ट',
    slug: 'isro-next-big-step-chandrayaan-4-gaganyaan',
    subtitle: 'भारतीय अंतरिक्ष अनुसंधान संगठन ने मानव अंतरिक्ष मिशन के नए चरणों की घोषणा की।',
    content: `<p>भारतीय अंतरिक्ष अनुसंधान संगठन (ISRO) ने अपने आगामी बहुप्रतीक्षित मिशन <b>चंद्रयान-4</b> और <b>गगनयान</b> को लेकर अहम जानकारियां साझा की हैं। वैज्ञानिकों की टीम नई तकनीकों और अत्याधुनिक सुरक्षा प्रणालियों पर दिन-रात काम कर रही है।</p><p>इसरो प्रमुख ने बताया कि भारत का पहला मानवयुक्त अंतरिक्ष उड़ान मिशन देश के अंतरिक्ष विज्ञान इतिहास में एक ऐतिहासिक मील का पत्थर साबित होगा।</p>`,
    excerpt: 'इसरो ने गगनयान और चंद्रयान-4 मिशनों के लिए नई समय-सीमा और वैज्ञानिक लक्ष्यों की घोषणा की है...',
    coverImage: 'https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=1200&auto=format&fit=crop&q=80',
    categorySlug: 'technology',
    tags: ['इसरो', 'स्पेस', 'भारत', 'साइंस'],
    isFeatured: true,
    isTrending: true,
    isBreaking: false,
    views: 1420,
    readingTime: 4,
  },
  {
    title: 'ब्रेकिंग: संसद के आगामी सत्र में पेश हो सकते हैं डिजिटल सुरक्षा और नवाचार से जुड़े नए विधेयक',
    slug: 'parliament-upcoming-session-digital-security-bill',
    subtitle: 'नागरिकों के डेटा संरक्षण और ऑनलाइन फ्रॉड से निपटने के लिए कड़े प्रावधान लाने की तैयारी।',
    content: `<p>संसद के आगामी सत्र में सरकार देश की डिजिटल सुरक्षा को और मजबूत करने के उद्देश्य से एक समग्र विधेयक पेश कर सकती है। इस बिल में साइबर अपराधों पर त्वरित कार्रवाई और डिजिटल अधिकारों की सुरक्षा का विशेष ध्यान रखा गया है।</p>`,
    excerpt: 'आगामी संसदीय सत्र में डिजिटल सुरक्षा और साइबर अपराध नियंत्रण को लेकर नए प्रावधान लाए जाएंगे...',
    coverImage: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1000&auto=format&fit=crop&q=80',
    categorySlug: 'national',
    tags: ['संसद', 'सरकार', 'डिजिटल', 'सुरक्षा'],
    isFeatured: false,
    isTrending: true,
    isBreaking: true,
    views: 2150,
    readingTime: 3,
  },
  {
    title: 'टी20 विश्व कप की रणनीति: युवा खिलाड़ियों के दम पर टीम इंडिया की नई तैयारी',
    slug: 't20-world-cup-team-india-strategy-youth',
    subtitle: 'आगामी अंतरराष्ट्रीय टूर्नामेंट के लिए चयनकर्ताओं ने युवा प्रतिभाओं पर जताया भरोसा।',
    content: `<p>भारतीय क्रिकेट कंट्रोल बोर्ड (BCCI) और टीम प्रबंधन ने आगामी टी20 श्रृंखलाओं के लिए आक्रामक और युवा खिलाड़ियों को मौका देने का निर्णय लिया है। घरेलू सत्र में बेहतरीन प्रदर्शन करने वाले कई नए चेहरे टीम का हिस्सा बनेंगे।</p>`,
    excerpt: 'युवा ऊर्जा और आधुनिक खेल शैली के साथ टीम इंडिया नए सत्र की शुरुआत करने जा रही है...',
    coverImage: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1000&auto=format&fit=crop&q=80',
    categorySlug: 'sports',
    tags: ['क्रिकेट', 'टीम इंडिया', 'खेल', 'T20'],
    isFeatured: false,
    isTrending: true,
    isBreaking: false,
    views: 3200,
    readingTime: 5,
  },
  {
    title: 'शेयर बाजार में रिकॉर्ड उछाल: सेंसेक्स और निफ्टी नए सर्वकालिक शिखर पर पहुंचे',
    slug: 'stock-market-record-high-sensex-nifty',
    subtitle: 'विदेशी निवेशकों की लगातार खरीदारी और मजबूत आर्थिक आंकड़ों से बाजार में शानदार तेजी।',
    content: `<p>भारतीय शेयर बाजारों में आज के कारोबारी सत्र में भारी लिवाली देखने को मिली। आईटी, बैंकिंग और ऑटो सेक्टर के शेयरों में जोरदार खरीदारी के चलते प्रमुख सूचकांक नए उच्चतम स्तर पर बंद हुए।</p>`,
    excerpt: 'मजबूत आर्थिक वृद्धि और विदेशी संस्थागत निवेशकों के प्रवाह से घरेलू शेयर बाजार में जबरदस्त तेजी...',
    coverImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1000&auto=format&fit=crop&q=80',
    categorySlug: 'business',
    tags: ['शेयर बाजार', 'सेंसेक्स', 'निफ्टी', 'अर्थव्यवस्था'],
    isFeatured: false,
    isTrending: false,
    isBreaking: false,
    views: 980,
    readingTime: 3,
  },
  {
    title: 'आर्टिफिशियल इंटेलिजेंस और शिक्षा: भारतीय कक्षाओं में स्मार्ट लर्निंग का नया युग',
    slug: 'ai-and-education-smart-learning-india',
    subtitle: 'स्कूलों और कॉलेजों में एआई टूल्स के जरिए छात्रों को मिल रही व्यक्तिगत शिक्षा।',
    content: `<p>कृत्रिम बुद्धिमत्ता (AI) अब केवल तकनीकी उद्योग तक सीमित नहीं रही है, बल्कि भारत के शिक्षा क्षेत्र में भी व्यापक बदलाव ला रही है। छात्रों की कमजोरियों को पहचान कर उन्हें कस्टमाइज्ड अभ्यास सामग्री उपलब्ध कराई जा रही है।</p>`,
    excerpt: 'एआई संचालित शिक्षण तकनीकों ने छात्रों के सीखने के अनुभव को और अधिक प्रभावी बनाया है...',
    coverImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1000&auto=format&fit=crop&q=80',
    categorySlug: 'technology',
    tags: ['एआई', 'शिक्षा', 'टेक्नोलॉजी', 'भविष्य'],
    isFeatured: false,
    isTrending: true,
    isBreaking: false,
    views: 1840,
    readingTime: 4,
  },
  {
    title: 'भारतीय सिनेमा का वैश्विक डंका: ऑस्कर और अंतरराष्ट्रीय फिल्मोत्सवों में नई पहचान',
    slug: 'indian-cinema-global-recognition-film-festivals',
    subtitle: 'स्थानीय कहानियों और दमदार अभिनय के दम पर भारतीय फिल्मों ने दुनियाभर में बनाया मुकाम।',
    content: `<p>भारतीय सिनेमा अब सीमाओं को पार कर वैश्विक मंचों पर अपनी मजबूत उपस्थिति दर्ज करा रहा है। विभिन्न क्षेत्रीय भाषाओं की फिल्मों ने अंतरराष्ट्रीय फिल्मोत्सवों में दर्शकों और आलोचकों का दिल जीता है।</p>`,
    excerpt: 'वैश्विक स्तर पर भारतीय फिल्मों की अनूठी कहानियों और निर्देशन को मिल रही है व्यापक सराहना...',
    coverImage: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1000&auto=format&fit=crop&q=80',
    categorySlug: 'entertainment',
    tags: ['सिनेमा', 'मनोरंजन', 'बॉलीवुड', 'फिल्में'],
    isFeatured: false,
    isTrending: false,
    isBreaking: false,
    views: 1120,
    readingTime: 4,
  },
  {
    title: 'इलेक्ट्रिक वाहनों की ओर बढ़ता भारत: नई ईवी नीतियों से चार्जिंग इंफ्रास्ट्रक्चर में क्रांति',
    slug: 'electric-vehicles-india-ev-charging-infrastructure',
    subtitle: 'शहरों से लेकर राष्ट्रीय राजमार्गों तक तीव्र गति से स्थापित हो रहे हैं फास्ट चार्जिंग स्टेशन।',
    content: `<p>ग्रीन मोबिलिटी को बढ़ावा देने के लिए केंद्र और राज्य सरकारों के साझा प्रयासों से देश में इलेक्ट्रिक वाहनों की स्वीकार्यता तेजी से बढ़ रही है। नए फास्ट-चार्जिंग नेटवर्क से लंबी दूरी की यात्राएं भी सुगम हो रही हैं।</p>`,
    excerpt: 'देशभर में ईवी चार्जिंग स्टेशनों का तेजी से विस्तार पर्यावरण अनुकूल परिवहन को नई गति दे रहा है...',
    coverImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1000&auto=format&fit=crop&q=80',
    categorySlug: 'auto',
    tags: ['ईवी', 'ऑटोमोबाइल', 'ग्रीन एनर्जी', 'कार'],
    isFeatured: false,
    isTrending: false,
    isBreaking: false,
    views: 750,
    readingTime: 3,
  },
  {
    title: 'जी20 और अंतरराष्ट्रीय कूटनीति: वैश्विक शांति और आर्थिक सहयोग में भारत की निर्णायक भूमिका',
    slug: 'g20-international-diplomacy-india-role',
    subtitle: 'ग्लोबल साउथ की आवाज बनकर भारत ने बहुपक्षीय मंचों पर महत्वपूर्ण वैश्विक समझौते कराए।',
    content: `<p>वैश्विक कूटनीति के बदलते परिदृश्य में भारत की भूमिका अत्यंत महत्वपूर्ण हो चुकी है। ऊर्जा सुरक्षा, खाद्य आपूर्ति और जलवायु परिवर्तन जैसे संवेदनशील मुद्दों पर भारत विश्व पटल पर नेतृत्व प्रदान कर रहा है।</p>`,
    excerpt: 'अंतरराष्ट्रीय कूटनीति में भारत की सक्रिय भूमिका से वैश्विक सहयोग को नई दिशा मिल रही है...',
    coverImage: 'https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?w=1000&auto=format&fit=crop&q=80',
    categorySlug: 'world',
    tags: ['विदेश नीति', 'कूटनीति', 'वैश्विक', 'भारत'],
    isFeatured: false,
    isTrending: false,
    isBreaking: false,
    views: 890,
    readingTime: 5,
  }
];

async function seed() {
  await dbConnect();
  console.log('Connected to MongoDB. Starting seed...');

  // 1. Seed Categories
  await Category.deleteMany({});
  const createdCategories = await Category.insertMany(categories);
  console.log(`✓ Seeded ${createdCategories.length} categories.`);

  // Map slugs to ObjectIds
  const categoryMap: Record<string, any> = {};
  createdCategories.forEach((cat) => {
    categoryMap[cat.slug] = cat._id;
  });

  // 2. Promote harshverma1022006@gmail.com to Admin (if exists)
  const userToPromote = await User.findOneAndUpdate(
    { email: 'harshverma1022006@gmail.com' },
    { role: 'admin' },
    { new: true }
  );

  if (userToPromote) {
    console.log(`✓ Promoted existing user ${userToPromote.email} to ADMIN role.`);
  }

  // Ensure an Admin user exists
  let adminUser = userToPromote;
  if (!adminUser) {
    const existingAdmin = await User.findOne({ email: 'admin@centrallens.co.in' });
    if (!existingAdmin) {
      const passwordHash = await bcrypt.hash('admin123', 10);
      adminUser = await User.create({
        name: 'Harsh Verma',
        email: 'admin@centrallens.co.in',
        passwordHash,
        role: 'admin',
        newsletterSubscribed: true,
      });
      console.log('✓ Created default admin user (admin@centrallens.co.in / admin123).');
    } else {
      adminUser = existingAdmin;
    }
  }

  const authorName = adminUser?.name || 'Harsh Verma';

  // 3. Seed Articles
  await Article.deleteMany({});

  const articlesToInsert = realisticArticles.map((art, idx) => ({
    title: art.title,
    slug: art.slug,
    subtitle: art.subtitle,
    content: art.content,
    excerpt: art.excerpt,
    coverImage: art.coverImage,
    category: categoryMap[art.categorySlug] || createdCategories[0]._id,
    tags: art.tags,
    author: {
      name: authorName,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    },
    status: 'published',
    isFeatured: art.isFeatured,
    isTrending: art.isTrending,
    isBreaking: art.isBreaking,
    views: art.views,
    readingTime: art.readingTime,
    publishedAt: new Date(Date.now() - idx * 3600000 * 4), // Stagger published timestamps
  }));

  await Article.insertMany(articlesToInsert);
  console.log(`✓ Seeded ${articlesToInsert.length} realistic Hindi news articles.`);

  console.log('\n======================================');
  console.log('🎉 SEEDING COMPLETED SUCCESSFULLY!');
  console.log('Your website now has:');
  console.log(` - ${createdCategories.length} Categories`);
  console.log(` - ${articlesToInsert.length} Published Articles`);
  console.log(` - Admin access enabled for harshverma1022006@gmail.com`);
  console.log('======================================\n');

  process.exit(0);
}

seed().catch((err) => {
  console.error('Error seeding database:', err);
  process.exit(1);
});
