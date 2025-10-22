import React, { useState } from 'react';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import emailjs from "emailjs-com"; // ✅ EmailJS library

const AdmissionForm: React.FC = () => {
  const { addAdmission } = useData();
  const [formData, setFormData] = useState({
    studentName: '',
    parentName: '',
    email: '',
    phone: '',
    grade: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const grades = [
    'Pre-School',
    'BS1',
    'BS2', 
    'BS3',
    'BS4',
    'BS5',
    'BS6',
    'BS7',
    'BS8',
    'BS9'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // ✅ Send form data to EmailJS
    emailjs
      .send(
        "service_xgbrvh8", // ✅ Your Service ID
        "template_os7mk4j", // ✅ Your Template ID
        {
          studentName: formData.studentName,
          parentName: formData.parentName,
          email: formData.email,
          phone: formData.phone,
          grade: formData.grade,
          message: formData.message,
          submittedAt: new Date().toLocaleString(),
        },
        "cQ2T16dabKVeBCh4G" // ✅ Your Public Key
      )
      .then(
        () => {
          addAdmission({
            ...formData,
            submittedAt: new Date().toISOString(),
            status: "pending",
          });

          setIsSubmitting(false);
          setIsSubmitted(true);

          // Reset form
          setFormData({
            studentName: "",
            parentName: "",
            email: "",
            phone: "",
            grade: "",
            message: "",
          });
        },
        (error) => {
          console.error("EmailJS Error:", error);
          setIsSubmitting(false);
          alert("There was an error submitting the form. Please try again.");
        }
      );
  };

  if (isSubmitted) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center bg-pink-50 border border-pink-200 rounded-lg p-8">
            <CheckCircle className="h-16 w-16 text-pink-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-pink-800 mb-4">Application Submitted Successfully!</h3>
            <p className="text-pink-700 mb-6">
              Thank you for your interest in Tawheed Educational Center. We have received your admission 
              application and will review it carefully. Our admissions team will contact you within 
              3-5 business days.
            </p>
            <button
              onClick={() => setIsSubmitted(false)}
              className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition-colors duration-200"
            >
              Submit Another Application
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold font-serif text-pink-600 mb-4">Admission Form</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join our community of learners. Fill out the application form below to begin your 
            journey with Tawheed Educational Center.
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-8 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="studentName" className="block text-sm font-medium text-gray-700 mb-2">
                  Student Name *
                </label>
                <input
                  type="text"
                  id="studentName"
                  name="studentName"
                  required
                  value={formData.studentName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter student's full name"
                />
              </div>

              <div>
                <label htmlFor="parentName" className="block text-sm font-medium text-gray-700 mb-2">
                  Parent/Guardian Name *
                </label>
                <input
                  type="text"
                  id="parentName"
                  name="parentName"
                  required
                  value={formData.parentName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter parent/guardian name"
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
                  placeholder="Enter email address"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter phone number"
                />
              </div>
            </div>

            <div>
              <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-2">
                Class*
              </label>
              <select
                id="grade"
                name="grade"
                required
                value={formData.grade}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">Select class</option>
                {grades.map((grade) => (
                  <option key={grade} value={grade}>{grade}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Additional Message (Optional)
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                placeholder="Any additional information or special requirements..."
              />
            </div>

            {/* Requirements */}
            <div className="bg-pink-50 border border-pink-200 rounded-lg p-4 flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-pink-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-pink-800">
                <p className="font-medium mb-1">Application Requirements:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Birth certificate copy</li>
                  <li>Previous school records (if applicable)</li>
                  <li>Passport-size photograph (1 copy)</li>
                </ul>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-pink-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-pink-700 disabled:bg-pink-400 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  <span>Submit Application</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default AdmissionForm;
