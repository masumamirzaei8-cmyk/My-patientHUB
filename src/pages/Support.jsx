import React, { useState } from 'react';
import { HelpCircle, Mail, MessageSquare, Phone, Check } from 'lucide-react';

const Support = () => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('faq');

  const faqs = [
    { q: 'How do I book an appointment?', a: 'Navigate to the Appointments page and click "Book New". Select your preferred doctor, date, and time.' },
    { q: 'Can I cancel my appointment?', a: 'Yes, go to your Appointments page, find the appointment, and click the cancel button. You will be asked to confirm.' },
    { q: 'How do I find a doctor?', a: 'Use the "Find Doctor" page to search by name, specialty, or location. You can view doctor profiles and book directly.' },
    { q: 'Is my data secure?', a: 'This is a demonstration application. In production, all data would be encrypted and stored securely following healthcare regulations.' },
    { q: 'How do I add a dependent?', a: 'Go to "My Dependents" page and click "Add Dependent". Fill in the required information and save.' },
    { q: 'Can I order from the marketplace?', a: 'Yes, browse products in the Marketplace, add to cart, and proceed to checkout. This is a demo — no real transactions occur.' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!subject.trim()) newErrors.subject = 'Subject is required';
    if (!message.trim()) newErrors.message = 'Message is required';
    if (message.trim().length < 10) newErrors.message = 'Message must be at least 10 characters';
    
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setSuccess(true);
    setSubject('');
    setMessage('');
    setTimeout(() => setSuccess(false), 5000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800">Help & Support</h2>
        <p className="text-gray-500 text-sm mt-1">Get help with MyPatientHUB or contact our support team</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-100">
          <button
            onClick={() => setActiveTab('faq')}
            className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium transition-colors ${
              activeTab === 'faq' ? 'text-pink-600 border-b-2 border-pink-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <HelpCircle className="w-4 h-4" /> FAQ
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium transition-colors ${
              activeTab === 'contact' ? 'text-pink-600 border-b-2 border-pink-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <MessageSquare className="w-4 h-4" /> Contact Support
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'faq' && (
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <details key={i} className="group border border-gray-100 rounded-xl overflow-hidden">
                  <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 list-none">
                    <span className="text-sm font-medium text-gray-800">{faq.q}</span>
                    <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="px-4 pb-4 text-sm text-gray-600 bg-gray-50">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          )}

          {activeTab === 'contact' && (
            <div>
              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2 mb-4 animate-fadeIn">
                  <Check className="w-5 h-5" />
                  Your message has been received! (Demo — no real message was sent)
                </div>
              )}

              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
                <p className="text-sm text-blue-700">
                  <strong>Note:</strong> This is a demonstration support form. In a production environment, your message would be sent to our support team.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => { setSubject(e.target.value); if (errors.subject) setErrors({ ...errors, subject: '' }); }}
                    placeholder="What do you need help with?"
                    className={`w-full px-4 py-2.5 border rounded-xl text-sm ${errors.subject ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                  />
                  {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                  <textarea
                    value={message}
                    onChange={(e) => { setMessage(e.target.value); if (errors.message) setErrors({ ...errors, message: '' }); }}
                    placeholder="Describe your issue or question in detail..."
                    rows={5}
                    className={`w-full px-4 py-2.5 border rounded-xl text-sm resize-none ${errors.message ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                  />
                  {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                </div>

                <button type="submit" className="btn-primary w-full py-3">
                  Submit Request
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-gray-100">
                <h4 className="text-sm font-bold text-gray-800 mb-4">Other ways to reach us</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Mail className="w-5 h-5 text-pink-600" />
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="text-sm font-medium text-gray-800">support@mypatienthub.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Phone className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="text-sm font-medium text-gray-800">+1 (555) 123-4567</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <MessageSquare className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="text-xs text-gray-500">Live Chat</p>
                      <p className="text-sm font-medium text-gray-800">Available 9AM-5PM</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Support;
