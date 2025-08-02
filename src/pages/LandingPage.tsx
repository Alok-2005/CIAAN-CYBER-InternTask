import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../App';
import { Users, MessageCircle, TrendingUp, Shield, Zap, Globe, Linkedin as LinkedIn, ArrowRight, Star, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const LandingPage: React.FC = () => {
  const { isDarkMode } = useTheme();

  const features = [
    {
      icon: Users,
      title: 'Connect & Network',
      description: 'Build meaningful professional relationships with like-minded individuals.',
    },
    {
      icon: MessageCircle,
      title: 'Engage & Share',
      description: 'Share your thoughts, insights, and engage in meaningful discussions.',
    },
    {
      icon: TrendingUp,
      title: 'Grow Your Presence',
      description: 'Increase your visibility and grow your professional network.',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data is protected with enterprise-grade security measures.',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Software Engineer',
      content: 'This platform has helped me connect with amazing professionals in my field.',
      avatar: 'SJ',
    },
    {
      name: 'Mike Chen',
      role: 'Product Manager',
      content: 'The community here is incredibly supportive and engaging.',
      avatar: 'MC',
    },
    {
      name: 'Emily Davis',
      role: 'Designer',
      content: 'I love how easy it is to share ideas and get feedback from peers.',
      avatar: 'ED',
    },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100' 
        : 'bg-gradient-to-br from-slate-50 to-blue-50 text-gray-900'
    }`}>
      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`bg-opacity-80 backdrop-blur-md border-b transition-colors ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className={`p-2 rounded-lg transition-transform hover:scale-105 ${
                isDarkMode ? 'bg-blue-500' : 'bg-blue-600'
              }`}>
                <LinkedIn className="h-6 w-6 text-white" />
              </div>
              <span className={`text-xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                CommunityHub
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className={`font-medium transition-colors hover:scale-105 ${
                  isDarkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'
                }`}
                aria-label="Sign in to CommunityHub"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 shadow-lg ${
                  isDarkMode 
                    ? 'bg-blue-500 text-white hover:bg-blue-600' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
                aria-label="Get started with CommunityHub"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center"
          >
            <h1 className={`text-5xl md:text-6xl font-bold mb-6 ${
              isDarkMode ? 'text-gray-100' : 'text-gray-900'
            }`}>
              Connect with
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {' '}Professionals
              </span>
            </h1>
            <p className={`text-xl mb-8 max-w-3xl mx-auto leading-relaxed ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Join our thriving community of professionals. Share ideas, build connections, 
              and grow your network in a modern, engaging platform designed for success.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                to="/register"
                className={`px-8 py-4 rounded-xl font-semibold text-lg shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl flex items-center space-x-2 ${
                  isDarkMode 
                    ? 'bg-blue-500 text-white hover:bg-blue-600' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
                aria-label="Join CommunityHub"
              >
                <span>Join Community</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/login"
                className={`px-8 py-4 rounded-xl font-semibold text-lg border-2 transition-all duration-300 hover:scale-105 ${
                  isDarkMode 
                    ? 'border-gray-600 text-gray-300 hover:border-blue-500 hover:text-blue-400' 
                    : 'border-gray-300 text-gray-700 hover:border-blue-600 hover:text-blue-600'
                }`}
                aria-label="Sign in to CommunityHub"
              >
                Sign In
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className={`py-20 transition-colors ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className={`text-4xl font-bold mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
              Why Choose CommunityHub?
            </h2>
            <p className={`text-xl max-w-2xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Everything you need to build meaningful professional relationships and grow your career.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border ${
                  isDarkMode ? 'bg-gray-900/90 border-gray-700' : 'bg-gradient-to-br from-white to-gray-50 border-gray-100'
                }`}
              >
                <div className={`p-3 rounded-xl w-fit mb-4 ${
                  isDarkMode ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-gradient-to-r from-blue-600 to-purple-600'
                }`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className={`text-xl font-bold mb-3 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                  {feature.title}
                </h3>
                <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              { value: '10K+', label: 'Active Members' },
              { value: '50K+', label: 'Posts Shared' },
              { value: '100K+', label: 'Connections Made' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="text-white"
              >
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-blue-100">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={`py-20 transition-colors ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className={`text-4xl font-bold mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
              What Our Community Says
            </h2>
            <p className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Join thousands of professionals who are already part of our community.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 ${
                  isDarkMode ? 'bg-gray-800/90 border-gray-700' : 'bg-white border-gray-100'
                }`}
              >
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" aria-hidden="true" />
                  ))}
                </div>
                <p className={`mb-6 italic ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  "{testimonial.content}"
                </p>
                <div className="flex items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                    isDarkMode ? 'bg-gradient-to-r from-blue-400 to-purple-400' : 'bg-gradient-to-r from-blue-500 to-purple-500'
                  }`}>
                    <span className="text-white font-semibold">{testimonial.avatar}</span>
                  </div>
                  <div>
                    <div className={`font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                      {testimonial.name}
                    </div>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-20 transition-colors ${
        isDarkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-slate-50 to-blue-50'
      }`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className={`text-4xl font-bold mb-6 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
              Ready to Join Our Community?
            </h2>
            <p className={`text-xl mb-8 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Start building meaningful connections today. It's free to join and takes less than a minute.
            </p>
            <div className="flex justify-center items-center space-x-4 mb-8">
              <CheckCircle className={`h-6 w-6 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
              <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Free to join</span>
              <CheckCircle className={`h-6 w-6 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
              <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>No spam</span>
              <CheckCircle className={`h-6 w-6 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
              <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Secure</span>
            </div>
            <Link
              to="/register"
              className={`px-8 py-4 rounded-xl font-semibold text-lg inline-flex items-center space-x-2 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl ${
                isDarkMode 
                  ? 'bg-blue-500 text-white hover:bg-blue-600' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
              aria-label="Get started with CommunityHub"
            >
              <span>Get Started Now</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-12 transition-colors ${isDarkMode ? 'bg-gray-900' : 'bg-gray-900 text-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-2 mb-8">
            <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-blue-500' : 'bg-blue-600'}`}>
              <LinkedIn className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold">CommunityHub</span>
          </div>
          <div className="text-center text-gray-400">
            <p>&copy; 2025 CommunityHub. All rights reserved.</p>
            <p className="mt-2">Built with ❤️ for the professional community</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;