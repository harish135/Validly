
import React, { useState } from 'react';
import Section from '../shared/Section';
import IconButton from '../IconButton';
import SendIcon from '../icons/SendIcon';
import InfoIcon from '../icons/InfoIcon';
import UserIcon from '../icons/UserIcon';
import EnvelopeIcon from '../icons/EnvelopeIcon';
import ChatBubbleBottomCenterTextIcon from '../icons/ChatBubbleBottomCenterTextIcon';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  const [submitMessage, setSubmitMessage] = useState('');

  // Image by Headway on Unsplash (communication/support): https://unsplash.com/photos/5QgIuuBxKwM
  const pageImageUrl = "https://images.unsplash.com/photo-1534536281715-e28d76689b4d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80";

  const subjectOptions = [
    "General Inquiry",
    "Feedback",
    "Support Request",
    "Partnership Inquiry",
    "Other"
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setSubmitStatus('error');
      setSubmitMessage('Please fill in all required fields.');
      return;
    }
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Simulated form submission:', formData);
      setIsSubmitting(false);
      setSubmitStatus('success');
      setSubmitMessage("Your message has been sent! We'll get back to you soon.");
      setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
      setTimeout(() => setSubmitStatus(null), 5000); // Clear message after 5s
    }, 1000);
  };

  return (
    <Section
      title="Contact Us"
      subtitle="We'd love to hear from you! Whether you have a question, feedback, or need support."
      animate={true}
      className="bg-brand-gray-900 rounded-xl border border-brand-gray-700 shadow-card"
    >
      <div className="max-w-3xl mx-auto space-y-10 p-2 md:p-4">
        <div className="mb-8 mt-[-1rem] md:mt-0 rounded-lg overflow-hidden border border-brand-gray-700 shadow-md">
          <img 
            src={pageImageUrl} 
            alt="Contact and communication concept with various contact icons" 
            className="object-cover w-full h-48 md:h-64 opacity-80"
          />
        </div>

        <div className="p-6 md:p-8 bg-brand-gray-850 rounded-lg shadow-xl border border-brand-gray-700">
          <h3 className="text-2xl font-semibold text-brand-gray-50 mb-6 text-center">Send Us a Message</h3>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-brand-gray-200 mb-1">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-brand-gray-400" />
                </div>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 pl-10 bg-brand-gray-700 border border-brand-gray-600 text-brand-gray-100 rounded-md focus:ring-2 focus:ring-brand-premium-blue outline-none placeholder-brand-gray-500"
                  placeholder="Your Name"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-brand-gray-200 mb-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <EnvelopeIcon className="h-5 w-5 text-brand-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 pl-10 bg-brand-gray-700 border border-brand-gray-600 text-brand-gray-100 rounded-md focus:ring-2 focus:ring-brand-premium-blue outline-none placeholder-brand-gray-500"
                  placeholder="you@example.com"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-brand-gray-200 mb-1">Subject</label>
              <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <ChatBubbleBottomCenterTextIcon className="h-5 w-5 text-brand-gray-400" />
                </div>
                <select
                  name="subject"
                  id="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full p-3 pl-10 bg-brand-gray-700 border border-brand-gray-600 text-brand-gray-100 rounded-md focus:ring-2 focus:ring-brand-premium-blue outline-none appearance-none"
                  disabled={isSubmitting}
                >
                  {subjectOptions.map(option => <option key={option} value={option}>{option}</option>)}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-brand-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-brand-gray-200 mb-1">Message</label>
              <textarea
                name="message"
                id="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                className="w-full p-3 bg-brand-gray-700 border border-brand-gray-600 text-brand-gray-100 rounded-md focus:ring-2 focus:ring-brand-premium-blue outline-none placeholder-brand-gray-500 resize-y"
                placeholder="Your message, feedback, or question..."
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="text-center pt-2">
              <IconButton
                type="submit"
                label={isSubmitting ? "Sending..." : "Send Message"}
                icon={<SendIcon />}
                variant="primary"
                size="lg"
                className="w-full sm:w-auto px-8"
                disabled={isSubmitting}
              />
            </div>
            {submitStatus && (
              <p className={`text-sm text-center mt-3 p-2 rounded-md ${submitStatus === 'success' ? 'bg-green-600 bg-opacity-30 text-green-300 border border-green-500' : 'bg-red-600 bg-opacity-30 text-red-300 border border-red-500'}`}>
                {submitMessage}
              </p>
            )}
          </form>
        </div>

        <div className="mt-10 text-center p-4 bg-brand-gray-800 rounded-lg border border-brand-gray-700">
          <h4 className="text-lg font-semibold text-brand-gray-200 mb-2">Prefer Direct Email?</h4>
          <p className="text-brand-gray-300">
            You can also reach us at: <a href="mailto:support@validly.example.com" className="text-brand-premium-blue hover:underline font-medium">support@validly.example.com</a> (Simulated)
          </p>
        </div>

        <div className="mt-6 text-sm text-brand-gray-500 text-center">
          <p>Your feedback is invaluable in helping us improve Validly!</p>
        </div>
      </div>
    </Section>
  );
};

export default ContactPage;
