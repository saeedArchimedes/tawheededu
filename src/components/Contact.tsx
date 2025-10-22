import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, MessageCircle } from 'lucide-react';
import emailjs from '@emailjs/browser'; // ⬅️ Add EmailJS

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // ✅ Send via EmailJS
    emailjs
      .send(
        "service_xgbrvh8",         // ⬅️ Your Service ID
        "template_os7mk4j",        // ⬅️ Your Template ID
        formData,
        "cQ2T16dabKVeBCh4G"        // ⬅️ Your Public Key
      )
      .then(() => {
        setIsSubmitting(false);
        setIsSubmitted(true);
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setIsSubmitted(false), 3000);
      })
      .catch((error) => {
        console.error("EmailJS Error:", error);
        setIsSubmitting(false);
      });
  };

  const handleWhatsApp = () => {
    const phoneNumber = '0558652422';
    const message = 'Hello! I would like to know more about Tawheed Educational Center.';
    const whatsappUrl = `https://wa.me/233${phoneNumber.slice(1)}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          {/* ✅ Centered pink heading (same as Admission) */}
          <h2 className="text-4xl font-bold text-pink-600 mb-4">Contact Us</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get in touch with us for admissions, inquiries, or any questions about our programs.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h3 className="text-2xl font-bold text-pink-600 text-center mb-8">Get in Touch</h3>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-pink-100 p-3 rounded-full">
                  <Phone className="h-6 w-6 text-pink-600" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">Phone</h4>
                  <p className="text-gray-600">0558652422</p>
                  <button
                    onClick={handleWhatsApp}
                    className="inline-flex items-center space-x-2 text-green-600 hover:text-green-700 font-medium mt-2"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Message us on WhatsApp</span>
                  </button>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-pink-100 p-3 rounded-full">
                  <Mail className="h-6 w-6 text-pink-600" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">Email</h4>
                  <p className="text-gray-600">info@tawheed-edu.com</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-pink-100 p-3 rounded-full">
                  <MapPin className="h-6 w-6 text-pink-600" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">Address</h4>
                  <p className="text-gray-600">
                    Digital Address: BW-0082-2413<br />
                    Ghana
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-pink-50 rounded-lg border border-pink-200">
              <h4 className="text-lg font-semibold text-pink-800 mb-3 text-center">Office Hours</h4>
              <div className="space-y-2 text-pink-700 text-center">
                <p><span className="font-medium">Monday - Friday:</span> 7:00 AM - 4:00 PM</p>
                <p><span className="font-medium">Saturday & Sunday :</span> Closed</p>
              </div>
            </div>
          </div>

          {/* Suggestion Form */}
          <div>
            <h3 className="text-2xl font-bold text-pink-600 text-center mb-8">Send us a Message</h3>
            
            {isSubmitted ? (
              <div className="bg-pink-50 border border-pink-200 rounded-lg p-6 text-center">
                <div className="text-pink-600 mb-4">
                  <Send className="h-12 w-12 mx-auto" />
                </div>
                <h4 className="text-lg font-semibold text-pink-800 mb-2">Message Sent!</h4>
                <p className="text-pink-700">Thank you for your message. We'll get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your email address"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                    placeholder="Write your message, suggestion, or inquiry here..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-pink-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-pink-700 disabled:bg-pink-400 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
