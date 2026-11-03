import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Play, Activity, Dumbbell, Zap, ArrowLeft, Target, TrendingUp, Award, CheckCircle, Clock, Users, Sun, Moon, Flame, Sparkles } from 'lucide-react';

const ExerciseCard = () => {
  const navigate = useNavigate();
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isDarkMode, setIsDarkMode] = useState(true);
  const detailsRef = useRef(null);

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
      category: "Strength",
      difficulty: "Beginner",
      duration: "10-15 min",
      muscles: ["Chest", "Triceps", "Shoulders"]
    }, 
    {
      name: "Squats",
      description: "Real-time squat tracking with knee flexion analysis and depth tracking",
      icon: <Activity size={28} />,
      component: "squat",
      category: "Lower Body",
      difficulty: "Beginner",
      duration: "15-20 min",
      muscles: ["Quadriceps", "Glutes", "Hamstrings"]
    },
    {
      name: "Bicep Curls",
      description: "Precise bicep curl counting with range of motion feedback for each arm",
      icon: <Target size={28} />,
      component: "bicepcurl",
      category: "Strength",
      difficulty: "Intermediate",
      duration: "12-18 min",
      muscles: ["Biceps", "Forearms"]
    },
    {
      name: "Pull-ups",
      description: "Advanced pull-up detection with grip analysis and progression tracking",
      icon: <Zap size={28} />,
      component: "pullup",
      category: "Strength",
      difficulty: "Advanced",
      duration: "8-12 min",
      muscles: ["Back", "Biceps", "Core"]
    },
    {
      name: "Shoulder Press",
      description: "Overhead shoulder press tracking with stability analysis and extension detection",
      icon: <TrendingUp size={28} />,
      component: "shoulderpress",
      category: "Strength",
      difficulty: "Intermediate",
      duration: "10-15 min",
      muscles: ["Shoulders", "Triceps", "Upper Back"]
    },
    {
      name: "Lunges",
      description: "Single-leg lunge tracking with knee angle validation and posture checking",
      icon: <Activity size={28} />,
      component: "lunges",
      category: "Lower Body",
      difficulty: "Intermediate",
      duration: "12-15 min",
      muscles: ["Quadriceps", "Glutes", "Calves"]
    },
    {
      name: "Front Raises",
      description: "Deltoid isolation tracking with arm elevation angle measurement",
      icon: <TrendingUp size={28} />,
      component: "frontraises",
      category: "Strength",
      difficulty: "Beginner",
      duration: "8-12 min",
      muscles: ["Anterior Deltoids", "Core"]
    },
    {
      name: "High Knees",
      description: "Dynamic cardio tracker detecting knee lift height relative to your hip level",
      icon: <Flame size={28} />,
      component: "highknees",
      category: "Lower Body",
      difficulty: "Intermediate",
      duration: "5-10 min",
      muscles: ["Hip Flexors", "Quads", "Core"]
    },
    {
      name: "Morning Stretch",
      description: "Full body morning stretch routine to awaken joints and increase mobility",
      icon: <Sparkles size={28} />,
      component: "morning",
      category: "Desk & Mobility",
      difficulty: "Beginner",
      duration: "5-10 min",
      muscles: ["Full Body", "Spine", "Shoulders"]
    },
    {
      name: "Desk Curls",
      description: "Seated bicep curls and arm activation tailored for quick office desk breaks",
      icon: <Target size={28} />,
      component: "deskcurls",
      category: "Desk & Mobility",
      difficulty: "Beginner",
      duration: "3-5 min",
      muscles: ["Biceps", "Forearms"]
    },
    {
      name: "Hand Stretches",
      description: "Desk-friendly wrist, finger, and forearm mobility tracking to avoid RSI",
      icon: <Zap size={28} />,
      component: "hand",
      category: "Desk & Mobility",
      difficulty: "Beginner",
      duration: "3-5 min",
      muscles: ["Wrists", "Hands", "Forearms"]
    },
    {
      name: "Seated Knee Raises",
      description: "Chair-based knee elevation exercise to engage lower abdominal muscles at your desk",
      icon: <Activity size={28} />,
      component: "kneeraises",
      category: "Desk & Mobility",
      difficulty: "Beginner",
      duration: "5-8 min",
      muscles: ["Lower Abs", "Hip Flexors"]
    }
  ];

  const categories = ["All", "Strength", "Lower Body", "Desk & Mobility"];

  const filteredExercises = activeCategory === "All"
    ? tensorflowExercises
    : tensorflowExercises.filter(ex => ex.category === activeCategory);

  const features = [
    { icon: <Camera size={20} />, title: "Real-time Tracking", desc: "Advanced pose detection" },
    { icon: <Target size={20} />, title: "Form Analysis", desc: "Instant feedback on technique" },
    { icon: <Award size={20} />, title: "Progress Tracking", desc: "Detailed performance metrics" },
    { icon: <Users size={20} />, title: "AI Coaching", desc: "Personalized recommendations" }
  ];

  const handleExerciseSelect = (exercise) => {
    setSelectedExercise(exercise);
    setTimeout(() => {
      if (detailsRef.current) {
        detailsRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 50);
  };

  const startExercise = (component) => {
    navigate(`/exercise/${component}`);
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
      primary: isDarkMode ? 'bg-gray-900/40 backdrop-blur-xl border-gray-800/60' : 'bg-white/80 backdrop-blur-xl border-gray-200/80',
      secondary: isDarkMode ? 'bg-gray-800/40 border-gray-700/60' : 'bg-gray-100/80 border-gray-200/80',
      hover: isDarkMode ? 'hover:border-blue-500/40 hover:bg-gray-900/70' : 'hover:border-blue-400/40 hover:bg-white'
    },
    nav: isDarkMode ? 'backdrop-blur-xl bg-black/80 border-gray-800/50' : 'backdrop-blur-xl bg-white/80 border-gray-200/50',
    button: {
      primary: isDarkMode ? 'bg-blue-600 hover:bg-blue-500' : 'bg-blue-600 hover:bg-blue-700',
      secondary: isDarkMode ? 'bg-gray-900/50 backdrop-blur-sm border-gray-800 hover:bg-gray-800/50' : 'bg-gray-200/50 backdrop-blur-sm border-gray-300 hover:bg-gray-300/50'
    },
    feature: isDarkMode ? 'bg-gray-900/30 backdrop-blur-sm border-gray-800' : 'bg-white/50 backdrop-blur-sm border-gray-200'
  };

  return (
    <div className={`min-h-screen ${themeClasses.background} relative overflow-hidden transition-colors duration-500`}>
      {/* Background Texture */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
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
        <div className={`absolute top-1/4 right-1/4 w-80 h-80 rounded-full bg-blue-500 ${isDarkMode ? 'opacity-[0.04]' : 'opacity-[0.06]'} blur-3xl`} />
        <div className={`absolute bottom-1/3 left-1/4 w-96 h-96 rounded-full bg-blue-400 ${isDarkMode ? 'opacity-[0.03]' : 'opacity-[0.05]'} blur-3xl`} />
      </div>

      {/* Navigation */}
      <nav className={`relative z-10 ${themeClasses.nav} border-b p-6 px-8 md:px-12 flex justify-between items-center transition-colors duration-500`}>
        <div className="flex items-center gap-6">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
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

          <button onClick={() => navigate('/home')} className={`flex items-center gap-3 ${themeClasses.text.secondary} hover:${themeClasses.text.primary} transition-colors group`}>
            <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-semibold">Back to Home</span>
          </button>
        </div>
        
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-3 ${isDarkMode ? 'bg-gray-900/50' : 'bg-white/50'} px-4 py-2 rounded-lg border ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <Camera size={20} className={themeClasses.text.accent} />
            <span className={`${themeClasses.text.primary} font-semibold`}>Live Exercise AI</span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 px-6 py-12 max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className={`w-16 h-16 ${isDarkMode ? 'bg-blue-600' : 'bg-blue-600'} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/20`}>
            <Camera size={32} className="text-white" />
          </div>
          <h1 className={`text-4xl md:text-5xl lg:text-6xl font-black ${themeClasses.text.primary} mb-4 tracking-tight`}>
            Live Exercise AI Tracker
          </h1>
          <p className={`text-lg md:text-xl ${themeClasses.text.secondary} max-w-3xl mx-auto leading-relaxed`}>
            Select any exercise to launch real-time computer vision pose detection. 
            Allow camera access and our AI will count your reps, monitor your form, and track your workout live!
          </p>
          
          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`flex items-center gap-2 ${themeClasses.feature} px-3.5 py-1.5 rounded-full border text-xs md:text-sm`}
              >
                <div className={themeClasses.text.accent}>{feature.icon}</div>
                <span className={`${themeClasses.text.tertiary} font-medium`}>{feature.title}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Selected Exercise Details Banner */}
        <AnimatePresence>
          {selectedExercise && (
            <motion.div
              ref={detailsRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-12 scroll-mt-6"
            >
              <div className={`${themeClasses.card.primary} rounded-3xl p-6 md:p-8 shadow-2xl border-2 border-blue-500/30`}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <div className="flex items-start gap-5 mb-6">
                      <div className={`w-14 h-14 ${isDarkMode ? 'bg-blue-600' : 'bg-blue-600'} rounded-2xl flex items-center justify-center text-white shrink-0`}>
                        {selectedExercise.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <h2 className={`text-2xl md:text-3xl font-black ${themeClasses.text.primary}`}>
                            {selectedExercise.name}
                          </h2>
                          <span className={`px-2.5 py-0.5 rounded-md text-xs font-semibold border ${getDifficultyColor(selectedExercise.difficulty)}`}>
                            {selectedExercise.difficulty}
                          </span>
                        </div>
                        <p className={`text-base ${themeClasses.text.tertiary} leading-relaxed mb-4`}>
                          {selectedExercise.description}
                        </p>
                        
                        <div className="flex items-center gap-3 text-sm">
                          <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} flex items-center gap-1`}>
                            <Clock size={15} /> {selectedExercise.duration}
                          </span>
                          <span className="text-gray-500">•</span>
                          <span className={themeClasses.text.accent}>
                            Category: {selectedExercise.category}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h3 className={`text-sm font-semibold uppercase tracking-wider ${themeClasses.text.secondary} mb-3`}>Target Muscle Groups</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedExercise.muscles.map((muscle, idx) => (
                          <span key={idx} className={`px-3 py-1 ${isDarkMode ? 'bg-blue-500/10 text-blue-300 border-blue-500/20' : 'bg-blue-50 text-blue-700 border-blue-200'} rounded-lg text-xs font-medium border`}>
                            {muscle}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => startExercise(selectedExercise.component)}
                        className={`inline-flex items-center gap-2 ${themeClasses.button.primary} text-white font-bold py-3 px-6 rounded-xl text-base transition-all duration-200 transform hover:scale-105 shadow-lg shadow-blue-500/25`}
                      >
                        <Play size={18} fill="white" />
                        Start {selectedExercise.name} Now
                      </button>
                      <button
                        onClick={() => setSelectedExercise(null)}
                        className={`px-4 py-3 rounded-xl border text-sm font-medium ${themeClasses.text.secondary} hover:${themeClasses.text.primary} transition-colors`}
                      >
                        Close Details
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className={`${themeClasses.card.secondary} rounded-xl p-4 border text-sm`}>
                      <h4 className={`font-bold mb-2 ${themeClasses.text.primary} flex items-center gap-2`}>
                        <CheckCircle size={16} className={themeClasses.text.accent} />
                        Live AI Features
                      </h4>
                      <ul className={`space-y-1.5 text-xs ${themeClasses.text.tertiary}`}>
                        <li>✓ Real-time webcam joint skeleton overlay</li>
                        <li>✓ Automatic repetition counting</li>
                        <li>✓ Form correctness alerts</li>
                        <li>✓ Live heart rate zone estimation</li>
                      </ul>
                    </div>
                    
                    <div className={`${themeClasses.card.secondary} rounded-xl p-4 border text-sm`}>
                      <h4 className={`font-bold mb-2 ${themeClasses.text.primary} flex items-center gap-2`}>
                        <Camera size={16} className={themeClasses.text.accent} />
                        Best Performance Tips
                      </h4>
                      <ul className={`space-y-1.5 text-xs ${themeClasses.text.tertiary}`}>
                        <li>• Position device so your active joints are visible</li>
                        <li>• Keep room well lit with minimal backlighting</li>
                        <li>• Click "Start Tracking" once camera loads</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeCategory === cat
                  ? `${themeClasses.button.primary} text-white shadow-md`
                  : `${isDarkMode ? 'bg-gray-900/60 text-gray-400 hover:text-white border-gray-800' : 'bg-gray-100 text-gray-600 hover:text-gray-900 border-gray-200'} border`
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Exercise Grid */}
        <div className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredExercises.map((exercise, index) => (
              <motion.div
                key={exercise.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className={`${themeClasses.card.primary} rounded-2xl p-5 ${themeClasses.card.hover} border transition-all duration-300 flex flex-col justify-between group transform hover:-translate-y-1 hover:shadow-xl ${
                  selectedExercise?.name === exercise.name ? 'ring-2 ring-blue-500 border-blue-500' : ''
                }`}
                onClick={() => handleExerciseSelect(exercise)}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 ${isDarkMode ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-blue-100 border-blue-200 text-blue-600'} rounded-xl flex items-center justify-center border group-hover:scale-110 transition-transform`}>
                      {exercise.icon}
                    </div>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getDifficultyColor(exercise.difficulty)}`}>
                      {exercise.difficulty}
                    </span>
                  </div>
                  
                  <h3 className={`font-bold ${themeClasses.text.primary} text-lg mb-1.5 group-hover:text-blue-400 transition-colors`}>
                    {exercise.name}
                  </h3>
                  <p className={`${themeClasses.text.secondary} text-xs mb-3 line-clamp-2 leading-relaxed`}>
                    {exercise.description}
                  </p>
                  
                  <div className="flex items-center gap-2 mb-4 text-xs">
                    <span className={`${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      {exercise.duration}
                    </span>
                    <span className="text-gray-600">•</span>
                    <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} truncate`}>
                      {exercise.muscles.slice(0, 2).join(', ')}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-800/40">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      startExercise(exercise.component);
                    }}
                    className={`w-full py-2.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 ${themeClasses.button.primary} text-white shadow-md transition-all duration-200 hover:brightness-110`}
                  >
                    <Play size={16} fill="white" />
                    <span>Start Exercise</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseCard;
