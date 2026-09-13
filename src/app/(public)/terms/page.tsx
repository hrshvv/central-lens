export default function TermsOfServicePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 min-h-screen">
      <div className="mb-12 border-b border-gray-100 pb-8">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Terms of Service</h1>
        <p className="text-gray-500">Last updated: September 2026</p>
      </div>

      <div className="prose prose-lg max-w-none text-gray-600">
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Acceptance of Terms</h2>
        <p className="mb-6">
          By accessing and using Central Lens, you accept and agree to be bound by the terms and provision of this agreement. 
          If you do not agree to abide by these terms, please do not use our service.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Intellectual Property</h2>
        <p className="mb-6">
          The site and its original content, features, and functionality are owned by Central Lens and are protected by 
          international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. User Conduct</h2>
        <p className="mb-4">You agree not to use the Service to:</p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>Upload, post, or otherwise transmit any content that is unlawful, harmful, or abusive.</li>
          <li>Impersonate any person or entity or falsely state your affiliation.</li>
          <li>Interfere with or disrupt the Service or servers.</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Disclaimer of Warranties</h2>
        <p className="mb-6">
          The service is provided on an "as is" and "as available" basis. Central Lens makes no warranties, expressed or 
          implied, and hereby disclaims all other warranties including, without limitation, implied warranties or conditions of 
          merchantability, fitness for a particular purpose, or non-infringement of intellectual property.
        </p>
      </div>
    </div>
  );
}
