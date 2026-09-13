import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16 min-h-screen">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-black text-gray-900 mb-6">Contact Us</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Have a story to share or want to get in touch? We'd love to hear from you.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-16">
        {/* Contact Information */}
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-red-100 p-3 rounded-full text-red-600">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Email</h3>
                  <p className="text-gray-600">editorial@centrallens.in</p>
                  <p className="text-gray-600">support@centrallens.in</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-red-100 p-3 rounded-full text-red-600">
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Phone</h3>
                  <p className="text-gray-600">+91 (800) 123-4567</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-red-100 p-3 rounded-full text-red-600">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Office</h3>
                  <p className="text-gray-600">123 Media House, Sector 4<br/>Noida, UP 201301<br/>India</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Send a Message</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 focus:outline-none" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input type="email" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 focus:outline-none" placeholder="john@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 focus:outline-none bg-white">
                <option>General Inquiry</option>
                <option>Editorial Pitch</option>
                <option>Feedback</option>
                <option>Advertising</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 focus:outline-none" placeholder="Your message..."></textarea>
            </div>
            <button type="button" className="w-full bg-red-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center">
              <span>Send Message</span>
              <Send size={18} className="ml-2" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
