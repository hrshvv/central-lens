import ArticleEditor from '@/components/admin/ArticleEditor';

export default function NewArticlePage() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Create New Article</h1>
      <ArticleEditor />
    </div>
  );
}
