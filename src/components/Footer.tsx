import React from 'react';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white"> {/* Blue-black background */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* School Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-pink-500">TEC</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Providing quality Islamic and Secular education with modern teaching methods. 
              Building tomorrow's leaders with strong moral values and academic excellence.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-pink-500">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#about" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
              <li><a href="#admission" className="text-gray-400 hover:text-white transition-colors">Admissions</a></li>
              <li><a href="#gallery" className="text-gray-400 hover:text-white transition-colors">Gallery</a></li>
              <li><a href="#contact" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Academic Programs */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-pink-500">Programs</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Basic Education</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Islamic Education</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Arabic Language</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Quran Studies</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">After School Programs</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-pink-500">Contact Info</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-pink-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-400">Digital Address: BW-0082-2413</p>
                  <p className="text-gray-400">Wenchi, Ghana</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-pink-500 flex-shrink-0" />
                <a 
                  href="https://wa.me/233558652422" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  +233 55 865 2422
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-pink-500 flex-shrink-0" />
                <a 
                  href="saeedarchimedes115@gmail.com" 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  info@tawheededucenter.com
                </a>
              </div>
            </div>
            
            {/* School Hours */}
            <div className="mt-6">
              <h5 className="text-sm font-semibold text-pink-500 mb-2">School Hours</h5>
              <div className="text-xs text-gray-400 space-y-1">
                <p>Monday - Friday: 7:30 AM - 3:00 PM</p>
                <p>Saturday & Sunday: Closed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-500">
              <p>&copy; {new Date().getFullYear()} Tawheed Educational Center. All rights reserved.</p>
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
