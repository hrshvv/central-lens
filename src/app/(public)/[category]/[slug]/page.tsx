import { notFound } from 'next/navigation';
import dbConnect from '@/lib/db/connect';
import { Article } from '@/lib/db/models/Article';

async function getArticle(slug: string) {
  try {
    await dbConnect();
    const article = await Article.findOne({ slug, status: 'published' }).populate('category', 'name slug color').lean();
    return article;
  } catch (error) {
    return null;
  }
}

export default async function ArticlePage({ params }: { params: Promise<{ category: string; slug: string }> }) {
  const { slug } = await params;
  const article: any = await getArticle(slug);

  if (!article) {
    notFound();
  }

  return (
    <article className="max-w-4xl mx-auto px-4 py-12">
      {/* Article Header */}
      <div className="mb-8">
        <span 
          className="text-xs font-bold uppercase tracking-wider mb-4 inline-block px-3 py-1 rounded-full text-white"
          style={{ backgroundColor: article.category?.color || '#1D4ED8' }}
        >
          {article.category?.name || 'News'}
        </span>
        <h1 className="text-4xl md:text-5xl font-black leading-tight text-gray-900 mb-4">
          {article.title}
        </h1>
        {article.subtitle && (
          <h2 className="text-xl md:text-2xl text-gray-600 mb-6 font-medium">
            {article.subtitle}
          </h2>
        )}
        <div className="flex items-center space-x-4 text-sm text-gray-500 border-t border-b border-gray-100 py-4">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600">
              {article.author?.name?.charAt(0) || 'A'}
            </div>
            <span className="font-semibold text-gray-900">{article.author?.name}</span>
          </div>
          <span>•</span>
          <span>{new Date(article.publishedAt || article.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          <span>•</span>
          <span>{article.readingTime || 5} min read</span>
        </div>
      </div>

      {/* Cover Image */}
      {article.coverImage && (
        <div className="mb-12 rounded-2xl overflow-hidden shadow-sm">
          <img 
            src={article.coverImage} 
            alt={article.title} 
            className="w-full max-h-[600px] object-cover"
          />
        </div>
      )}

      {/* Article Content */}
      <div 
        className="prose prose-lg md:prose-xl max-w-none prose-a:text-blue-600 hover:prose-a:text-blue-800 prose-img:rounded-xl"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      {/* Tags */}
      {article.tags && article.tags.length > 0 && (
        <div className="mt-12 pt-8 border-t border-gray-100">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag: string) => (
              <span key={tag} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 cursor-pointer transition-colors">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
