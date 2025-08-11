import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Dumbbell, Salad, BarChart2, Brain, Heart, Camera, Users, Play, Star, Shield, Clock, Award, Sun, Moon } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const cards = [
    {
      title: "Exercises",
      description: "Discover scientifically-backed routines tailored to your fitness level and goals",
      icon: <Dumbbell size={24} />,
      link: "/exercise",
      accent: "blue"
    },
    {
      title: "Diet Plans",
      description: "Personalized nutrition strategies designed by certified nutritionists",
      icon: <Salad size={24} />,
      link: "/diet",
      accent: "blue"
    },
    {
      title: "BMI Calculator",
      description: "Advanced body composition analysis with detailed health insights",
      icon: <BarChart2 size={24} />,
      link: "/bmi",
      accent: "blue"
    },
    {
      title: "AI Nutritionist",
      description: "Real-time nutrition guidance powered by advanced AI technology",
      icon: <Brain size={24} />,
      link: "/nutrition",
      accent: "blue"
    },
    {
      title: "Injury Prevention",
      description: "Comprehensive injury prevention protocols and recovery strategies",
      icon: <Heart size={24} />,
      link: "/injury",
      accent: "blue"
    },
    {
      title: "Live Exercise",
      description: "Interactive workout sessions with real-time form correction",
      icon: <Camera size={24} />,
      link: "/exercisecard",
      accent: "blue"
    },
    {
      title: "Expert Consultation",
      description: "One-on-one sessions with certified fitness professionals and specialists",
      icon: <Users size={24} />,
      link: "/meet",
      accent: "blue"
    },
    {
      title: "Women's Health",
      description: "Comprehensive menstrual cycle tracking, fertility monitoring, and women's health insights",
      icon: <Heart size={24} />,
      link: "/women",
      accent: "pink"
    }
  ];

  const features = [
    { icon: <Shield size={20} />, text: "SSL Encrypted" },
    { icon: <Clock size={20} />, text: "24/7 Support" },
    { icon: <Award size={20} />, text: "Certified Trainers" },
    { icon: <Star size={20} />, text: "5-Star Rated" }
  ];

  const themeClasses = {
    background: isDarkMode ? 'bg-black' : 'bg-gray-50',
    text: {
      primary: isDarkMode ? 'text-white' : 'text-gray-900',
      secondary: isDarkMode ? 'text-gray-400' : 'text-gray-600',
      tertiary: isDarkMode ? 'text-gray-300' : 'text-gray-700',
      accent: isDarkMode ? 'text-blue-400' : 'text-blue-600'
    },
    card: {
      primary: isDarkMode ? 'bg-gray-900/30 backdrop-blur-sm border-gray-800/50' : 'bg-white/70 backdrop-blur-sm border-gray-200/50',
      hover: isDarkMode ? 'hover:bg-gray-900/50 hover:border-blue-500/30 hover:shadow-blue-500/10' : 'hover:bg-white/90 hover:border-blue-400/30 hover:shadow-blue-600/10'
    },
    nav: isDarkMode ? 'backdrop-blur-xl bg-black/80 border-gray-800/50' : 'backdrop-blur-xl bg-white/80 border-gray-200/50',
    button: {
      primary: isDarkMode ? 'bg-blue-500 hover:bg-blue-600 shadow-blue-500/20' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20',
      secondary: isDarkMode ? 'bg-gray-900/50 backdrop-blur-sm border-gray-800 hover:bg-gray-800/50' : 'bg-gray-200/50 backdrop-blur-sm border-gray-300 hover:bg-gray-300/50',
      nav: isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
    },
    badge: isDarkMode ? 'bg-gray-900/50 backdrop-blur-sm border-gray-800' : 'bg-white/50 backdrop-blur-sm border-gray-200',
    stats: isDarkMode ? 'bg-gray-900/20 backdrop-blur-xl border-gray-800/30' : 'bg-white/40 backdrop-blur-xl border-gray-200/30',
    footer: isDarkMode ? 'border-gray-800/50 bg-gray-900/20' : 'border-gray-200/50 bg-white/20'
  };

  const handleCardClick = (link) => {
    // Navigate to the specified route
    console.log(`Navigating to: ${link}`);
    navigate(link);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { y: 30, opacity: 0 },
    show: { 
      y: 0, 
      opacity: 1, 
      transition: { 
        type: "spring", 
        stiffness: 400,
        damping: 25
      } 
    }
  };

  return (
    <div className={`${themeClasses.background} min-h-screen relative overflow-hidden transition-colors duration-500`}>
      {/* Sophisticated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Animated Grid */}
        <div 
          className={`absolute inset-0 ${isDarkMode ? 'opacity-[0.03]' : 'opacity-[0.04]'}`}
          style={{
            backgroundImage: `
              linear-gradient(${isDarkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.15)'} 1px, transparent 1px),
              linear-gradient(90deg, ${isDarkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.15)'} 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`
          }}
        />
        
        {/* Floating Orbs */}
        <div 
          className={`absolute top-20 right-20 w-72 h-72 rounded-full bg-blue-500 ${isDarkMode ? 'opacity-[0.08]' : 'opacity-[0.12]'} blur-3xl`}
          style={{ transform: `translateY(${scrollY * 0.2}px) scale(${1 + Math.sin(scrollY * 0.01) * 0.1})` }}
        />
        <div 
          className={`absolute bottom-40 left-20 w-96 h-96 rounded-full bg-blue-400 ${isDarkMode ? 'opacity-[0.06]' : 'opacity-[0.10]'} blur-3xl`}
          style={{ transform: `translateY(${scrollY * -0.15}px) scale(${1 + Math.cos(scrollY * 0.008) * 0.1})` }}
        />
        
        {/* Subtle Noise Texture */}
        <div 
          className={`absolute inset-0 ${isDarkMode ? 'opacity-[0.015]' : 'opacity-[0.025]'}`}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
          }}
        />
      </div>
      
      {/* Navigation */}
      <nav className={`${themeClasses.nav} border-b p-6 px-8 md:px-12 flex justify-between items-center sticky top-0 z-50 transition-colors duration-500`}>
        <div className="flex items-center gap-6">
          <div className={`w-10 h-10 ${isDarkMode ? 'bg-blue-500' : 'bg-blue-600'} rounded-lg flex items-center justify-center`}>
            <Dumbbell size={20} className="text-white" />
          </div>
          <div className={`hidden md:block h-6 w-px ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`} />
          <h1 className={`hidden md:block text-2xl font-bold ${themeClasses.text.primary} tracking-tight`}>
            FitVerse
          </h1>
        </div>
        
        <div className="flex items-center gap-6">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`${themeClasses.text.secondary} hover:${themeClasses.text.primary} transition-colors group p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-800/50' : 'hover:bg-gray-200/50'}`}
          >
            <div className="relative w-6 h-6">
              <motion.div
                initial={false}
                animate={{ rotate: isDarkMode ? 0 : 180, opacity: isDarkMode ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0"
              >
                <Moon size={24} />
              </motion.div>
              <motion.div
                initial={false}
                animate={{ rotate: isDarkMode ? -180 : 0, opacity: isDarkMode ? 0 : 1 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0"
              >
                <Sun size={24} />
              </motion.div>
            </div>
          </button>

          <button className={`${themeClasses.button.nav} transition-colors duration-300 font-medium`}>
            Login
          </button>
          <button className={`${themeClasses.button.primary} text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg`}>
            Get Started
          </button>
        </div>
      </nav>
      
      {/* Hero Section */}
      <div className="relative z-10 px-6 pt-20 pb-16 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-4xl mx-auto"
        >
          <div className={`inline-flex items-center gap-3 mb-8 px-6 py-3 ${themeClasses.badge} rounded-full border`}>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <span className={`${themeClasses.text.accent} font-medium text-sm`}>Transform Your Fitness Journey</span>
          </div>
          
          <h1 className={`font-black ${themeClasses.text.primary} text-6xl md:text-7xl lg:text-8xl tracking-tighter leading-none mb-8`}>
            Welcome to{" "}
            <span className="relative">
              <span className={`${isDarkMode ? 'text-blue-500' : 'text-blue-600'}`}>FitVerse</span>
              <div className={`absolute -bottom-2 left-0 w-full h-1 ${isDarkMode ? 'bg-blue-500' : 'bg-blue-600'} rounded-full`} />
            </span>
          </h1>
          
          <p className={`text-xl md:text-2xl ${themeClasses.text.secondary} max-w-3xl mx-auto leading-relaxed mb-12 font-light`}>
            Your premium fitness ecosystem. Where science meets performance, 
            and every workout becomes a step towards excellence.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6 mb-16">
            <button className={`px-10 py-4 rounded-xl ${themeClasses.button.primary} text-white font-semibold transform transition-all duration-300 hover:scale-105 shadow-xl text-lg`}>
              <span className="flex items-center gap-3">
                Start Your Journey
                <ArrowRight size={20} />
              </span>
            </button>
            <button className={`px-10 py-4 rounded-xl ${themeClasses.button.secondary} ${themeClasses.text.primary} font-semibold border transition-all duration-300 text-lg`}>
              <span className="flex items-center gap-3">
                <Play size={18} />
                Watch Demo
              </span>
            </button>
          </div>
          
          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-8 opacity-60">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.1 }}
                className={`flex items-center gap-2 ${themeClasses.text.secondary} text-sm`}
              >
                {feature.icon}
                <span>{feature.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
      
      {/* Services Grid */}
      <div className="relative z-10 px-6 py-20 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className={`font-bold text-4xl md:text-5xl ${themeClasses.text.primary} mb-6 tracking-tight`}>
            What drives you today?
          </h2>
          <p className={`text-xl ${themeClasses.text.secondary} max-w-2xl mx-auto`}>
            Choose your path to excellence with our comprehensive suite of professional tools
          </p>
        </motion.div>
        
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {cards.map((card, index) => (
            <motion.div key={index} variants={item}>
              <div 
                onClick={() => handleCardClick(card.link)}
                className="group relative block cursor-pointer"
              >
                <div className={`${themeClasses.card.primary} rounded-2xl p-8 h-full transition-all duration-500 ${themeClasses.card.hover} hover:scale-105 shadow-xl border`}>
                  {/* Card Icon */}
                  <div className={`w-14 h-14 mb-6 rounded-xl ${isDarkMode ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-blue-100 border-blue-200 text-blue-600'} border flex items-center justify-center ${isDarkMode ? 'group-hover:bg-blue-500/20 group-hover:text-blue-300' : 'group-hover:bg-blue-200 group-hover:text-blue-700'} transition-all duration-300`}>
                    {card.icon}
                  </div>
                  
                  {/* Card Content */}
                  <h3 className={`font-bold text-2xl ${themeClasses.text.primary} mb-4 ${isDarkMode ? 'group-hover:text-blue-50' : 'group-hover:text-blue-800'} transition-colors`}>
                    {card.title}
                  </h3>
                  <p className={`${themeClasses.text.secondary} mb-6 leading-relaxed ${isDarkMode ? 'group-hover:text-gray-300' : 'group-hover:text-gray-500'} transition-colors`}>
                    {card.description}
                  </p>
                  
                  {/* Card Action */}
                  <div className={`flex items-center font-semibold ${themeClasses.text.accent} ${isDarkMode ? 'group-hover:text-blue-300' : 'group-hover:text-blue-700'} transition-colors`}>
                    <span>Explore</span>
                    <ArrowRight size={18} className="ml-2 transition-transform duration-300 group-hover:translate-x-2" />
                  </div>
                  
                  {/* Hover Effect Line */}
                  <div className={`absolute bottom-0 left-0 w-0 h-0.5 ${isDarkMode ? 'bg-blue-500' : 'bg-blue-600'} group-hover:w-full transition-all duration-500 rounded-full`} />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Stats Section */}
      <div className="relative z-10 px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto"
        >
          <div className={`${themeClasses.stats} rounded-3xl p-12 md:p-16 border shadow-xl ${isDarkMode ? 'shadow-black/10' : 'shadow-gray-300/10'}`}>
            <div className="text-center mb-12">
              <h2 className={`font-bold text-3xl md:text-4xl ${themeClasses.text.primary} mb-4`}>
                Trusted by fitness enthusiasts worldwide
              </h2>
              <p className={`${themeClasses.text.secondary} text-lg`}>
                Join a community that's redefining what it means to be fit
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { number: "50K+", label: "Active Members" },
                { number: "1,200+", label: "Workout Programs" },
                { number: "800+", label: "Nutrition Plans" },
                { number: "98%", label: "Success Rate" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <p className={`text-4xl md:text-5xl font-black ${themeClasses.text.accent} mb-2`}>
                    {stat.number}
                  </p>
                  <p className={`${themeClasses.text.secondary} font-medium`}>
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
   
      {/* Footer */}
      <footer className={`relative z-10 px-6 py-12 border-t ${themeClasses.footer} transition-colors duration-500`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="flex items-center mb-6 md:mb-0">
              <div className={`w-10 h-10 ${isDarkMode ? 'bg-blue-500' : 'bg-blue-600'} rounded-lg flex items-center justify-center mr-4`}>
                <Dumbbell size={20} className="text-white" />
              </div>
              <div>
                <h3 className={`${themeClasses.text.primary} font-bold text-xl`}>FitVerse</h3>
                <p className={`${themeClasses.text.secondary} text-sm`}>Professional Fitness Platform</p>
              </div>
            </div>
            
            <div className="flex gap-8">
              {["About", "Privacy", "Terms", "Contact", "Support"].map((link) => (
                <a 
                  key={link}
                  href="#" 
                  className={`${themeClasses.text.secondary} ${isDarkMode ? 'hover:text-blue-400' : 'hover:text-blue-600'} transition-colors font-medium`}
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
          
          <div className={`border-t ${isDarkMode ? 'border-gray-800/50' : 'border-gray-200/50'} pt-8 text-center`}>
            <p className={`${isDarkMode ? 'text-gray-500' : 'text-gray-400'} text-sm`}>
              © 2025 FitVerse. All rights reserved. Crafted with precision for fitness excellence.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;