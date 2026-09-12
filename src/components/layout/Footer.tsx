import Link from 'next/link';
import { Globe, MessageCircle, Mail, Link as LinkIcon } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 mt-12">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tighter mb-4">CENTRAL LENS</h2>
          <p className="text-sm text-gray-400 mb-6">
            Your source for the latest news in politics, sports, technology, and more. 
            Hindi-first, video-first journalism.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-white"><Globe size={20} /></a>
            <a href="#" className="hover:text-white"><MessageCircle size={20} /></a>
            <a href="#" className="hover:text-white"><Mail size={20} /></a>
            <a href="#" className="hover:text-white"><LinkIcon size={20} /></a>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Categories</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/category/politics" className="hover:text-white transition-colors">राजनीति</Link></li>
            <li><Link href="/category/sports" className="hover:text-white transition-colors">खेल</Link></li>
            <li><Link href="/category/technology" className="hover:text-white transition-colors">टेक्नोलॉजी</Link></li>
            <li><Link href="/category/entertainment" className="hover:text-white transition-colors">मनोरंजन</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Company</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Subscribe to Newsletter</h3>
          <p className="text-sm text-gray-400 mb-4">Get the latest stories directly to your inbox.</p>
          <form className="flex">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="bg-gray-800 border-none rounded-l-lg py-2 px-4 focus:ring-2 focus:ring-red-600 outline-none w-full text-white"
            />
            <button type="submit" className="bg-red-600 hover:bg-red-700 text-white rounded-r-lg px-4 font-semibold transition-colors">
              Subscribe
            </button>
          </form>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-gray-800 text-sm text-gray-500 flex flex-col md:flex-row justify-between items-center">
        <p>&copy; {new Date().getFullYear()} Central Lens. All rights reserved.</p>
      </div>
    </footer>
  );
}
