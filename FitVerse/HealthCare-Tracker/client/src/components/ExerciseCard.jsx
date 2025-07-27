import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Play, Activity, Dumbbell, Zap, ArrowLeft, Target, TrendingUp, Award, CheckCircle, Clock, Users, Sun, Moon } from 'lucide-react';

const ExerciseCard = () => {
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const tensorflowExercises = [
    {
      name: "Push-ups",
      description: "AI-powered push-up counter with advanced pose detection and form analysis",
      icon: <Dumbbell size={28} />,
      component: "pushup",
      difficulty: "Beginner",
      duration: "10-15 min",
      muscles: ["Chest", "Triceps", "Shoulders"]
    }, 
    {
      name: "Pull-ups",
      description: "Advanced pull-up detection with grip analysis and progression tracking",
      icon: <Zap size={28} />,
      component: "pullup",
      difficulty: "Advanced",
      duration: "8-12 min",
      muscles: ["Back", "Biceps", "Core"]
    },
    {
      name: "Bicep Curls",
      description: "Precise bicep curl counting with range of motion feedback",
      icon: <Target size={28} />,
      component: "bicepcurl",
      difficulty: "Intermediate",
      duration: "12-18 min",
      muscles: ["Biceps", "Forearms"]
    },
    {
      name: "Squats",
      description: "Real-time squat tracking with depth analysis and knee alignment",
      icon: <Activity size={28} />,
      component: "squat",
      difficulty: "Beginner",
      duration: "15-20 min",
      muscles: ["Quadriceps", "Glutes", "Hamstrings"]
    },
    {
      name: "Shoulder Press",
      description: "Shoulder press tracking with stability analysis and form correction",
      icon: <TrendingUp size={28} />,
      component: "shoulderpress",
      difficulty: "Intermediate",
      duration: "10-15 min",
      muscles: ["Shoulders", "Triceps", "Core"]
    }
  ];

  const features = [
    { icon: <Camera size={20} />, title: "Real-time Tracking", desc: "Advanced pose detection" },
    { icon: <Target size={20} />, title: "Form Analysis", desc: "Instant feedback on technique" },
    { icon: <Award size={20} />, title: "Progress Tracking", desc: "Detailed performance metrics" },
    { icon: <Users size={20} />, title: "AI Coaching", desc: "Personalized recommendations" }
  ];

  const handleExerciseSelect = (exercise) => {
    setSelectedExercise(exercise);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const getDifficultyColor = (difficulty) => {
    if (isDarkMode) {
      switch (difficulty) {
        case 'Beginner': return 'text-green-400 bg-green-500/10 border-green-500/20';
        case 'Intermediate': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
        case 'Advanced': return 'text-red-400 bg-red-500/10 border-red-500/20';
        default: return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      }
    } else {
      switch (difficulty) {
        case 'Beginner': return 'text-green-600 bg-green-100 border-green-200';
        case 'Intermediate': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
        case 'Advanced': return 'text-red-600 bg-red-100 border-red-200';
        default: return 'text-blue-600 bg-blue-100 border-blue-200';
      }
    }
  };

  const themeClasses = {
    background: isDarkMode ? 'bg-black' : 'bg-gray-50',
    text: {
      primary: isDarkMode ? 'text-white' : 'text-gray-900',
      secondary: isDarkMode ? 'text-gray-400' : 'text-gray-600',
      tertiary: isDarkMode ? 'text-gray-300' : 'text-gray-700',
      accent: isDarkMode ? 'text-blue-400' : 'text-blue-600'
    },
    card: {
      primary: isDarkMode ? 'bg-gray-900/30 backdrop-blur-xl border-gray-800/50' : 'bg-white/70 backdrop-blur-xl border-gray-200/50',
      secondary: isDarkMode ? 'bg-gray-800/30 border-gray-700/50' : 'bg-gray-100/70 border-gray-200/50',
      hover: isDarkMode ? 'hover:border-blue-500/30 hover:bg-gray-900/50' : 'hover:border-blue-400/30 hover:bg-white/90'
    },
    nav: isDarkMode ? 'backdrop-blur-xl bg-black/80 border-gray-800/50' : 'backdrop-blur-xl bg-white/80 border-gray-200/50',
    button: {
      primary: isDarkMode ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700',
      secondary: isDarkMode ? 'bg-gray-900/50 backdrop-blur-sm border-gray-800 hover:bg-gray-800/50' : 'bg-gray-200/50 backdrop-blur-sm border-gray-300 hover:bg-gray-300/50'
    },
    feature: isDarkMode ? 'bg-gray-900/30 backdrop-blur-sm border-gray-800' : 'bg-white/50 backdrop-blur-sm border-gray-200'
  };

  return (
    <div className={`min-h-screen ${themeClasses.background} relative overflow-hidden transition-colors duration-500`}>
      {/* Sophisticated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Animated Grid */}
        <div 
          className={`absolute inset-0 ${isDarkMode ? 'opacity-[0.02]' : 'opacity-[0.03]'}`}
          style={{
            backgroundImage: `
              linear-gradient(${isDarkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.15)'} 1px, transparent 1px),
              linear-gradient(90deg, ${isDarkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.15)'} 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`
          }}
        />
        
        {/* Floating Elements */}
        <div className={`absolute top-1/4 right-1/4 w-80 h-80 rounded-full bg-blue-500 ${isDarkMode ? 'opacity-[0.04]' : 'opacity-[0.06]'} blur-3xl`} />
        <div className={`absolute bottom-1/3 left-1/4 w-96 h-96 rounded-full bg-blue-400 ${isDarkMode ? 'opacity-[0.03]' : 'opacity-[0.05]'} blur-3xl`} />
        
        {/* Subtle Texture */}
        <div 
          className={`absolute inset-0 ${isDarkMode ? 'opacity-[0.01]' : 'opacity-[0.02]'}`}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
          }}
        />
      </div>

      {/* Navigation */}
      <nav className={`relative z-10 ${themeClasses.nav} border-b p-6 px-8 md:px-12 flex justify-between items-center transition-colors duration-500`}>
        <div className="flex items-center gap-6">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`flex items-center gap-2 ${themeClasses.text.secondary} hover:${themeClasses.text.primary} transition-colors group p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-800/50' : 'hover:bg-gray-200/50'}`}
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

          <button onClick={() => window.history.back()} className={`flex items-center gap-3 ${themeClasses.text.secondary} hover:${themeClasses.text.primary} transition-colors group`}>
            <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-semibold">Back to Home</span>
          </button>
        </div>
        
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-3 ${isDarkMode ? 'bg-gray-900/50' : 'bg-white/50'} px-4 py-2 rounded-lg border ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <Camera size={20} className={themeClasses.text.accent} />
            <span className={`${themeClasses.text.primary} font-semibold`}>AI Exercise Tracker</span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 px-6 py-12 max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className={`w-20 h-20 ${isDarkMode ? 'bg-blue-500' : 'bg-blue-600'} rounded-2xl flex items-center justify-center mx-auto mb-8`}>
            <Camera size={36} className="text-white" />
          </div>
          <h1 className={`text-5xl md:text-6xl lg:text-7xl font-black ${themeClasses.text.primary} mb-6 tracking-tight`}>
            AI Exercise Tracker
          </h1>
          <p className={`text-xl md:text-2xl ${themeClasses.text.secondary} max-w-4xl mx-auto leading-relaxed font-light`}>
            Experience the future of fitness with TensorFlow-powered exercise tracking, 
            real-time pose detection, and intelligent form analysis
          </p>
          
          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className={`flex items-center gap-2 ${themeClasses.feature} px-4 py-2 rounded-lg`}
              >
                <div className={themeClasses.text.accent}>{feature.icon}</div>
                <span className={`${themeClasses.text.tertiary} text-sm font-medium`}>{feature.title}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Selected Exercise Details */}
        <AnimatePresence>
          {selectedExercise && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              className="mb-16"
            >
              <div className={`${themeClasses.card.primary} rounded-3xl p-8 md:p-12 shadow-xl ${isDarkMode ? 'shadow-black/20' : 'shadow-gray-300/20'}`}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Exercise Info */}
                  <div className="lg:col-span-2">
                    <div className="flex items-start gap-6 mb-8">
                      <div className={`w-16 h-16 ${isDarkMode ? 'bg-blue-500' : 'bg-blue-600'} rounded-2xl flex items-center justify-center text-white`}>
                        {selectedExercise.icon}
                      </div>
                      <div className="flex-1">
                        <h2 className={`text-3xl md:text-4xl font-black ${themeClasses.text.primary} mb-4`}>
                          {selectedExercise.name}
                        </h2>
                        <p className={`text-lg ${themeClasses.text.tertiary} leading-relaxed mb-6`}>
                          {selectedExercise.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-3">
                          <span className={`px-3 py-1 rounded-lg text-sm font-medium border ${getDifficultyColor(selectedExercise.difficulty)}`}>
                            {selectedExercise.difficulty}
                          </span>
                          <span className={`px-3 py-1 ${isDarkMode ? 'bg-gray-800/50 text-gray-300 border-gray-700' : 'bg-gray-200/50 text-gray-600 border-gray-300'} rounded-lg text-sm font-medium border`}>
                            <Clock size={14} className="inline mr-1" />
                            {selectedExercise.duration}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Muscle Groups */}
                    <div className="mb-8">
                      <h3 className={`text-xl font-bold ${themeClasses.text.primary} mb-4`}>Target Muscles</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedExercise.muscles.map((muscle, index) => (
                          <span key={index} className={`px-3 py-1 ${isDarkMode ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-blue-100 text-blue-600 border-blue-200'} rounded-lg text-sm font-medium border`}>
                            {muscle}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => window.open(`/exercise/${selectedExercise.component}`, '_blank')}
                      className={`inline-flex items-center gap-3 ${themeClasses.button.primary} text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg ${isDarkMode ? 'shadow-blue-500/20' : 'shadow-blue-600/20'}`}
                    >
                      <Camera size={24} />
                      Start {selectedExercise.name} Training
                      <ArrowLeft size={20} className="rotate-180" />
                    </button>
                  </div>

                  {/* Features & Requirements */}
                  <div className="space-y-6">
                    <div className={`${themeClasses.card.secondary} rounded-2xl p-6 border`}>
                      <h3 className={`text-xl font-bold mb-4 ${themeClasses.text.primary} flex items-center gap-2`}>
                        <CheckCircle size={20} className={themeClasses.text.accent} />
                        AI Features
                      </h3>
                      <ul className={`space-y-3 ${themeClasses.text.tertiary}`}>
                        <li className="flex items-center gap-3">
                          <div className={`w-2 h-2 ${isDarkMode ? 'bg-blue-400' : 'bg-blue-600'} rounded-full`} />
                          Real-time pose detection
                        </li>
                        <li className="flex items-center gap-3">
                          <div className={`w-2 h-2 ${isDarkMode ? 'bg-blue-400' : 'bg-blue-600'} rounded-full`} />
                          Automatic rep counting
                        </li>
                        <li className="flex items-center gap-3">
                          <div className={`w-2 h-2 ${isDarkMode ? 'bg-blue-400' : 'bg-blue-600'} rounded-full`} />
                          Form analysis & feedback
                        </li>
                        <li className="flex items-center gap-3">
                          <div className={`w-2 h-2 ${isDarkMode ? 'bg-blue-400' : 'bg-blue-600'} rounded-full`} />
                          Progress tracking
                        </li>
                      </ul>
                    </div>
                    
                    <div className={`${themeClasses.card.secondary} rounded-2xl p-6 border`}>
                      <h3 className={`text-xl font-bold mb-4 ${themeClasses.text.primary} flex items-center gap-2`}>
                        <Camera size={20} className={themeClasses.text.accent} />
                        Requirements
                      </h3>
                      <ul className={`space-y-3 ${themeClasses.text.tertiary}`}>
                        <li className="flex items-center gap-3">
                          <div className={`w-2 h-2 ${isDarkMode ? 'bg-blue-400' : 'bg-blue-600'} rounded-full`} />
                          Camera access
                        </li>
                        <li className="flex items-center gap-3">
                          <div className={`w-2 h-2 ${isDarkMode ? 'bg-blue-400' : 'bg-blue-600'} rounded-full`} />
                          Good lighting
                        </li>
                        <li className="flex items-center gap-3">
                          <div className={`w-2 h-2 ${isDarkMode ? 'bg-blue-400' : 'bg-blue-600'} rounded-full`} />
                          Full body visibility
                        </li>
                        <li className="flex items-center gap-3">
                          <div className={`w-2 h-2 ${isDarkMode ? 'bg-blue-400' : 'bg-blue-600'} rounded-full`} />
                          Stable connection
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Exercise Grid */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-center mb-12"
          >
            <h2 className={`text-3xl md:text-4xl font-bold ${themeClasses.text.primary} mb-4`}>
              Choose Your Exercise
            </h2>
            <p className={`${themeClasses.text.secondary} text-lg max-w-2xl mx-auto`}>
              Select an exercise to view detailed information and start your AI-powered training session
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {tensorflowExercises.map((exercise, index) => (
              <motion.div
                key={exercise.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`${themeClasses.card.primary} rounded-2xl p-6 ${themeClasses.card.hover} transition-all duration-300 cursor-pointer group transform hover:scale-105 hover:shadow-xl ${isDarkMode ? 'hover:shadow-blue-500/10' : 'hover:shadow-blue-600/10'} ${
                  selectedExercise?.name === exercise.name ? `${isDarkMode ? 'border-blue-500/50 bg-gray-900/50' : 'border-blue-400/50 bg-white/90'}` : ''
                }`}
                onClick={() => handleExerciseSelect(exercise)}
              >
                <div className="text-center">
                  <div className={`w-16 h-16 ${isDarkMode ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-blue-100 border-blue-200 text-blue-600'} rounded-2xl flex items-center justify-center mx-auto mb-4 ${isDarkMode ? 'group-hover:bg-blue-500/20' : 'group-hover:bg-blue-200'} group-hover:scale-110 transition-all duration-300 border`}>
                    {exercise.icon}
                  </div>
                  
                  <h3 className={`font-bold ${themeClasses.text.primary} text-lg mb-2 ${isDarkMode ? 'group-hover:text-blue-50' : 'group-hover:text-blue-800'} transition-colors`}>
                    {exercise.name}
                  </h3>
                  <p className={`${themeClasses.text.secondary} text-sm mb-4 leading-relaxed line-clamp-3`}>
                    {exercise.description}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    <div className={`inline-block px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(exercise.difficulty)}`}>
                      {exercise.difficulty}
                    </div>
                    <div className={`${isDarkMode ? 'text-gray-500' : 'text-gray-400'} text-xs`}>
                      {exercise.duration}
                    </div>
                  </div>
                  
                  <div className={`flex items-center justify-center ${themeClasses.text.accent} text-sm font-medium`}>
                    <Camera size={16} className="mr-2" />
                    <span>AI Tracking</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center"
        >
          <div className={`${isDarkMode ? 'bg-gray-900/20 border-gray-800/30' : 'bg-white/40 border-gray-200/30'} backdrop-blur-xl border rounded-3xl p-12 shadow-xl ${isDarkMode ? 'shadow-black/10' : 'shadow-gray-300/10'}`}>
            <div className="max-w-3xl mx-auto">
              <h3 className={`text-3xl md:text-4xl font-bold ${themeClasses.text.primary} mb-6`}>
                Ready to Transform Your Training?
              </h3>
              <p className={`${themeClasses.text.tertiary} text-lg mb-8 leading-relaxed`}>
                Experience the power of AI-driven exercise tracking with real-time feedback, 
                personalized insights, and professional-grade analysis.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => window.open('/exercise', '_blank')}
                  className={`inline-flex items-center justify-center ${themeClasses.button.primary} text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg ${isDarkMode ? 'shadow-blue-500/20' : 'shadow-blue-600/20'}`}
                >
                  <Activity size={20} className="mr-2" />
                  Explore All Exercises
                  <ArrowLeft size={18} className="ml-2 rotate-180" />
                </button>
                <button className={`inline-flex items-center justify-center ${themeClasses.button.secondary} ${themeClasses.text.primary} font-bold py-4 px-8 rounded-xl border transition-all duration-300`}>
                  <Play size={20} className="mr-2" />
                  Watch Demo
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ExerciseCard;