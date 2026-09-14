import { notFound } from 'next/navigation';
import Link from 'next/link';
import dbConnect from '@/lib/db/connect';
import { Article } from '@/lib/db/models/Article';
import '@/lib/db/models/Category';
import ShareButtons from '@/components/article/ShareButtons';
import ReadingProgressBar from '@/components/article/ReadingProgressBar';
import { Clock, Calendar, ArrowLeft, ShieldCheck } from 'lucide-react';

async function getArticle(slug: string) {
  try {
    await dbConnect();
    const article = await Article.findOne({ slug, status: 'published' })
      .populate('category', 'name slug color')
      .lean();
    return article;
  } catch (error) {
    return null;
  }
}

async function getRelatedArticles(categoryId: string, currentSlug: string) {
  try {
    await dbConnect();
    const related = await Article.find({
      category: categoryId,
      slug: { $ne: currentSlug },
      status: 'published',
    })
      .sort({ publishedAt: -1, createdAt: -1 })
      .limit(3)
      .populate('category', 'name slug color')
      .lean();
    return JSON.parse(JSON.stringify(related));
  } catch {
    return [];
  }
}

export default async function ArticlePage({ params }: { params: Promise<{ category: string; slug: string }> }) {
  const { slug } = await params;
  const article: any = await getArticle(slug);

  if (!article) {
    notFound();
  }

  const categoryId = article.category?._id || article.category;
  const relatedArticles = await getRelatedArticles(categoryId, slug);
  const catSlug = article.category?.slug || 'news';
  const catName = article.category?.name || 'समाचार';

  const publishedDateFormatted = new Date(article.publishedAt || article.createdAt).toLocaleDateString('hi-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <>
      {/* Sticky Top Reading Progress Bar */}
      <ReadingProgressBar />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 py-10 font-devanagari">
        {/* Back Link */}
        <div className="mb-6">
          <Link 
            href={`/${catSlug}`}
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-neutral-500 hover:text-red-600 transition-colors"
          >
            <ArrowLeft size={14} />
            <span>{catName} पर वापस जाएं</span>
          </Link>
        </div>

        {/* Article Header */}
        <header className="mb-8">
          <Link
            href={`/${catSlug}`}
            className="text-xs font-black uppercase tracking-wider mb-4 inline-block px-3.5 py-1 rounded-full text-white shadow-sm transition-transform hover:scale-105"
            style={{ backgroundColor: article.category?.color || '#DC2626' }}
          >
            {catName}
          </Link>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight sm:leading-tight text-neutral-900 mb-4 tracking-tight">
            {article.title}
          </h1>

          {article.subtitle && (
            <h2 className="text-lg sm:text-xl text-neutral-600 mb-6 font-medium leading-relaxed">
              {article.subtitle}
            </h2>
          )}

          {/* Metadata Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm text-neutral-500 border-t border-b border-neutral-100 py-4 font-sans">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-sm">
                {article.author?.name?.charAt(0) || 'C'}
              </div>
              <div>
                <span className="font-bold text-neutral-900 block font-devanagari text-sm">{article.author?.name || 'Central Lens Desk'}</span>
                <span className="text-[11px] text-neutral-400">वरिष्ठ संवाददाता</span>
              </div>
            </div>

            <div className="flex items-center space-x-4 text-xs text-neutral-500">
              <span className="flex items-center space-x-1">
                <Calendar size={13} className="text-red-500" />
                <span>{publishedDateFormatted}</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <Clock size={13} className="text-red-500" />
                <span>{article.readingTime || 4} मिनट पठन</span>
              </span>
            </div>
          </div>

          <ShareButtons title={article.title} />
        </header>

        {/* Cover Image */}
        {article.coverImage && (
          <figure className="mb-10 rounded-3xl overflow-hidden shadow-md bg-neutral-100">
            <img 
              src={article.coverImage} 
              alt={article.title} 
              className="w-full max-h-[550px] object-cover"
            />
            {article.excerpt && (
              <figcaption className="text-xs text-neutral-500 p-3 bg-neutral-50 text-center italic border-t border-neutral-100">
                {article.title} (सांकेतिक तस्वीर)
              </figcaption>
            )}
          </figure>
        )}

        {/* Article Body Content */}
        <div 
          className="prose prose-neutral prose-lg md:prose-xl max-w-none prose-p:leading-relaxed prose-headings:font-black prose-headings:tracking-tight prose-a:text-red-600 hover:prose-a:text-red-700 prose-img:rounded-2xl prose-strong:text-neutral-900 text-neutral-800"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="mt-12 pt-6 border-t border-neutral-100">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">संबंधित विषय (Tags)</h3>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag: string) => (
                <span key={tag} className="bg-neutral-100 text-neutral-700 font-medium px-3.5 py-1.5 rounded-full text-xs hover:bg-red-50 hover:text-red-600 cursor-pointer transition-colors">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Author Verification Card */}
        <div className="my-10 p-6 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-start space-x-4">
          <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center font-black text-lg flex-shrink-0">
            CL
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h4 className="font-bold text-neutral-900 text-base">Central Lens संपादकीय टीम</h4>
              <ShieldCheck size={16} className="text-blue-600" />
            </div>
            <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
              यह रिपोर्ट Central Lens के समाचार कक्ष द्वारा तथ्यों की पुष्टि और निष्पक्ष पत्रकारिता के मानकों के तहत तैयार की गई है।
            </p>
          </div>
        </div>

        {/* Related Articles Section */}
        {relatedArticles.length > 0 && (
          <section className="mt-14 pt-10 border-t-2 border-neutral-900">
            <div className="flex items-center space-x-2.5 mb-6">
              <span className="w-2 h-6 bg-red-600 rounded-full inline-block"></span>
              <h3 className="text-2xl font-black text-neutral-900 tracking-tight">
                संबंधित खबरें (Related Stories)
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((rel: any) => (
                <Link 
                  key={rel._id} 
                  href={`/${rel.category?.slug || catSlug}/${rel.slug}`} 
                  className="group block rounded-2xl overflow-hidden bg-white border border-neutral-100 hover:shadow-lg transition-all"
                >
                  <div className="relative h-44 w-full bg-neutral-100 overflow-hidden">
                    <img 
                      src={rel.coverImage || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=500&auto=format&fit=crop&q=80'} 
                      alt={rel.title} 
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-sm sm:text-base text-neutral-900 group-hover:text-red-600 line-clamp-2 leading-snug transition-colors">
                      {rel.title}
                    </h4>
                    <span className="text-[11px] text-neutral-400 font-sans block mt-2">
                      {new Date(rel.publishedAt || rel.createdAt).toLocaleDateString('hi-IN', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  );
}
