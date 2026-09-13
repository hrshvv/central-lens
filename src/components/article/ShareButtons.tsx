'use client';

import { useState, useEffect } from 'react';
import { Link as LinkIcon, Check, MessageCircle } from 'lucide-react';
import { FaXTwitter } from 'react-icons/fa6';

interface ShareButtonsProps {
  title: string;
}

export default function ShareButtons({ title }: ShareButtonsProps) {
  const [url, setUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' - ' + url)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;

  if (!url) return null;

  return (
    <div className="flex items-center space-x-3 py-6 border-t border-b border-gray-100 my-8">
      <span className="text-sm font-semibold text-gray-500 mr-2">Share:</span>
      
      <a 
        href={whatsappUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:bg-[#1EBE5D] transition-colors shadow-sm"
        aria-label="Share on WhatsApp"
      >
        <MessageCircle size={18} />
      </a>
      
      <a 
        href={twitterUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        className="w-10 h-10 rounded-full bg-[#1DA1F2] text-white flex items-center justify-center hover:bg-[#1A91DA] transition-colors shadow-sm"
        aria-label="Share on X (Twitter)"
      >
        <FaXTwitter size={18} />
      </a>
      
      <button 
        onClick={handleCopyLink}
        className="w-10 h-10 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center hover:bg-gray-200 transition-colors shadow-sm"
        aria-label="Copy Link"
      >
        {copied ? <Check size={18} className="text-green-600" /> : <LinkIcon size={18} />}
      </button>

      {copied && <span className="text-sm text-green-600 font-medium ml-2 animate-pulse">Link copied!</span>}
    </div>
  );
}
