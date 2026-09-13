import { Building, Users, Target, Globe } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 min-h-screen">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-black text-gray-900 mb-6">About Central Lens</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          We are dedicated to bringing you the most accurate, unbiased, and comprehensive news coverage in Hindi.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 mb-16">
        <div className="space-y-6">
          <div className="flex items-start space-x-4">
            <div className="bg-red-100 p-3 rounded-xl text-red-600">
              <Target size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Our Mission</h3>
              <p className="text-gray-600">To empower Hindi-speaking audiences with facts, thorough analysis, and high-quality journalism in a rapidly changing world.</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="bg-red-100 p-3 rounded-xl text-red-600">
              <Globe size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Global Reach, Local Voice</h3>
              <p className="text-gray-600">While our focus is national, we bring global stories to you in the language you understand best.</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Values</h2>
          <ul className="space-y-4 text-gray-600">
            <li className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-red-600 rounded-full" />
              <span>Unbiased Reporting</span>
            </li>
            <li className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-red-600 rounded-full" />
              <span>Speed with Accuracy</span>
            </li>
            <li className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-red-600 rounded-full" />
              <span>Digital-First Approach</span>
            </li>
            <li className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-red-600 rounded-full" />
              <span>Community Driven</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
