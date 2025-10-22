import React from 'react';
import { Heart, Target, Star, Shield } from 'lucide-react';

const About: React.FC = () => {
  const values = [
    {
      icon: Heart,
      title: 'Islamic Values',
      description: 'Education grounded in Islamic principles and moral teachings'
    },
    {
      icon: Target,
      title: 'Academic Excellence',
      description: 'High-quality curriculum meeting international standards'
    },
    {
      icon: Star,
      title: 'Character Building',
      description: 'Developing strong moral character and leadership skills'
    },
    {
      icon: Shield,
      title: 'Safe Environment',
      description: 'Nurturing and secure learning environment for all students'
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold font-serif text-pink-500 mb-4">
            About Tawheed Educational Center
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto text-justify">
            Established in 2015 with a vision to provide quality Islamic education, we are committed to 
            nurturing young minds and building future leaders of our community.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h3 className="text-3xl font-bold font-serif text-pink-500 mb-6 text-center">
              Our Mission
            </h3>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed text-justify">
              At Tawheed Educational Center, we strive to provide comprehensive education that 
              combines academic excellence with Islamic values. Our mission is to develop 
              well-rounded individuals who are knowledgeable, morally upright, and ready to 
              contribute positively to society.
            </p>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed text-justify">
              We believe in creating an environment where students can grow intellectually, 
              spiritually, and socially. Our dedicated team of educators works tirelessly to 
              ensure each student reaches their full potential while maintaining strong 
              connections to their faith and cultural heritage.
            </p>
            <div className="bg-pink-50 border-l-4 border-pink-500 p-4 rounded">
              <p className="text-pink-700 font-medium text-justify">
                "Education is the most powerful weapon which you can use to change the world." 
                - We believe in empowering our students with knowledge and wisdom.
              </p>
            </div>
          </div>
                 {values.map((value, index) => (
            <div 
              key={index} 
              className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                <value.icon className="h-8 w-8 text-pink-500" />
              </div>
              <h4 className="text-xl font-semibold font-serif text-pink-500 mb-3 text-center">
                {value.title}
              </h4>
              <p className="text-gray-600 text-center text-justify">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
