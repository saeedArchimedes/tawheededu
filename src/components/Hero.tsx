import React from 'react';
import { ArrowRight, Users, BookOpen, Award, GraduationCap } from 'lucide-react';

interface HeroProps {
  onNavigate: (section: string) => void;
}

const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  const stats = [
    { number: "200+", label: "Students" },
    { number: "25+", label: "Teachers" },
    { number: "10+", label: "Years" },
    { number: "98%", label: "Success Rate" },
  ];

  const features = [
    {
      icon: <GraduationCap className="h-10 w-10 text-pink-600 mx-auto mb-3" />,
      title: "Quality Education",
      description: "Comprehensive Secular and Islamic education with modern teaching methods",
    },
    {
      icon: <Users className="h-10 w-10 text-pink-600 mx-auto mb-3" />,
      title: "Experienced Teachers",
      description: "Qualified educators dedicated to student success",
    },
    {
      icon: <BookOpen className="h-10 w-10 text-pink-600 mx-auto mb-3" />,
      title: "Modern Curriculum",
      description: "Balanced approach combining Islamic values with academic excellence",
    },
    {
      icon: <Award className="h-10 w-10 text-pink-600 mx-auto mb-3" />,
      title: "Excellence Awards",
      description: "Recognized for outstanding educational achievements",
    },
  ];

  return (
    <div className="relative min-h-screen flex items-center bg-white">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        
        {/* Flex layout: Welcome card (centered) and Mosque image */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-12">
          
          {/* Welcome Message Card (centered text) */}
          <div className="bg-white border border-pink-200 rounded-2xl shadow-lg p-10 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-pink-600">
              Welcome to
            </h1>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900">
              Tawheed Educational Center
            </h2>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              Nurturing minds, building character, and fostering excellence
              through Islamic and Secular education
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
              <button
                onClick={() => onNavigate('admission')}
                className="bg-pink-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-pink-700 transition-all duration-300 transform hover:scale-105 flex items-center gap-2 shadow-lg"
              >
                Apply for Admission
                <ArrowRight className="h-5 w-5" />
              </button>

              <button
                onClick={() => onNavigate('about')}
                className="border-2 border-pink-600 text-pink-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-pink-600 hover:text-white transition-all duration-300 shadow-md"
              >
                Learn More
              </button>
            </div>
          </div>

          {/* Mosque Image Section with smooth zoom-in */}
          <div className="flex justify-center">
            {/* 👉 Replace "mosque.jpg" with your local image path */}
            <img 
              src="/assets/masjid.jpg"  
              alt="Tawheed School Mosque" 
              className="rounded-2xl shadow-xl object-cover w-full max-h-[500px] transform transition duration-500 hover:scale-105"
            />
          </div>
        </div>

        {/* Mission / About Text */}
        <div className="max-w-4xl mx-auto mb-12 text-center">
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
          <span className="font-semibold text-pink-600">Tawheed Educational Center</span> is an Islamic Basic School in Bono Region,Ghana. The school is located in Boadan,Wenchi. Our mission is to develop well-rounded individuals who are knowledgeable, morally upright, and ready to contribute positively to society.
          </p>
{/* 👉 Inserted new local image (con1.png) here */}
        <div className="flex justify-center mb-12">
          <img 
            src="/assets/con1.png" 
            alt="School Students" 
            className="rounded-2xl shadow-xl object-cover w-full max-h-[500px] transform transition duration-500 hover:scale-105"
          />
        </div>
          <p className="text-lg text-gray-700 leading-relaxed">
            We believe in creating an environment where students can grow intellectually, spiritually, and socially. Our dedicated team of educators works tirelessly to ensure each student reaches their full potential while maintaining strong connections to their faith and cultural heritage.
          </p>
        </div>

        {/* 👉 Inserted new local image (s4.jpg) here */}
        <div className="flex justify-center mb-12">
          <img 
            src="/assets/s4.jpg" 
            alt="School Students" 
            className="rounded-2xl shadow-xl object-cover w-full max-h-[500px] transform transition duration-500 hover:scale-105"
          />
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto mb-16">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white border border-pink-200 text-pink-600 rounded-xl p-6 shadow-md transform transition duration-300 hover:scale-105 hover:shadow-xl text-center"
            >
              <div className="text-3xl md:text-4xl font-bold mb-2">{stat.number}</div>
              <div className="text-lg">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* 👉 Inserted new local image (s1.jpg) here */}
        <div className="flex justify-center mb-16">
          <img 
            src="/assets/s1.jpg" 
            alt="School Event" 
            className="rounded-2xl shadow-xl object-cover w-full max-h-[500px] transform transition duration-500 hover:scale-105"
          />
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white border border-pink-200 text-pink-600 rounded-xl p-6 shadow-md transform transition duration-300 hover:scale-105 hover:shadow-xl text-center"
            >
              {feature.icon}
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;
