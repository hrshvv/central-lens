export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 min-h-screen">
      <div className="mb-12 border-b border-gray-100 pb-8">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Privacy Policy</h1>
        <p className="text-gray-500">Last updated: September 2026</p>
      </div>

      <div className="prose prose-lg max-w-none text-gray-600">
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Introduction</h2>
        <p className="mb-6">
          At Central Lens, we respect your privacy and are committed to protecting your personal data. 
          This privacy policy will inform you as to how we look after your personal data when you visit our website 
          and tell you about your privacy rights.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. The Data We Collect</h2>
        <p className="mb-4">We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
          <li><strong>Contact Data:</strong> includes email address and telephone numbers.</li>
          <li><strong>Technical Data:</strong> includes internet protocol (IP) address, your login data, browser type and version.</li>
          <li><strong>Usage Data:</strong> includes information about how you use our website.</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. How We Use Your Data</h2>
        <p className="mb-6">
          We will only use your personal data when the law allows us to. Most commonly, we will use your personal data 
          to provide you with the news and services you have requested, to manage our relationship with you, and to 
          improve our website and services.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Data Security</h2>
        <p className="mb-6">
          We have put in place appropriate security measures to prevent your personal data from being accidentally lost, 
          used, or accessed in an unauthorized way, altered, or disclosed.
        </p>
      </div>
    </div>
  );
}
