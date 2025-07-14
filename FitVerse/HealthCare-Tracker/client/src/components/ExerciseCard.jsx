import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Play, Activity, Dumbbell, Zap, ArrowLeft } from 'lucide-react';

const ExerciseCard = () => {
  const [selectedExercise, setSelectedExercise] = useState(null);

  const tensorflowExercises = [
    {
      name: "Push-ups",
      description: "AI-powered push-up counter with pose detection",
      icon: <Dumbbell size={32} />,
      color: "from-red-500 to-orange-500",
      bgColor: "bg-gradient-to-r from-red-500/20 to-orange-500/20",
      borderColor: "border-red-500/30",
      component: "pushup"
    },
    {
      name: "Pull-ups",
      description: "Advanced pull-up detection and counting",
      icon: <Zap size={32} />,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-gradient-to-r from-purple-500/20 to-pink-500/20",
      borderColor: "border-purple-500/30",
      component: "pullup"
    },
    {
      name: "Bicep Curls",
      description: "Precise bicep curl counting with form feedback",
      icon: <Dumbbell size={32} />,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-gradient-to-r from-blue-500/20 to-cyan-500/20",
      borderColor: "border-blue-500/30",
      component: "bicepcurl"
    },
    {
      name: "Squats",
      description: "Real-time squat tracking with depth analysis",
      icon: <Activity size={32} />,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-gradient-to-r from-green-500/20 to-emerald-500/20",
      borderColor: "border-green-500/30",
      component: "squat"
    },
    {
      name: "Shoulder Press",
      description: "Shoulder press tracking with pose detection",
      icon: <Dumbbell size={32} />,
      color: "from-yellow-500 to-orange-500",
      bgColor: "bg-gradient-to-r from-yellow-500/20 to-orange-500/20",
      borderColor: "border-yellow-500/30",
      component: "shoulderpress"
    }
  ];

  const handleExerciseSelect = (exercise) => {
    setSelectedExercise(exercise);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute top-0 left-0 w-full h-full opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.3) 0%, transparent 50%),
                             radial-gradient(circle at 80% 80%, rgba(16, 185, 129, 0.3) 0%, transparent 50%),
                             radial-gradient(circle at 40% 60%, rgba(139, 92, 246, 0.3) 0%, transparent 50%)`
          }}
        />
      </div>
      
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-gradient-to-bl from-blue-600 to-purple-500 opacity-20 blur-3xl" />
      <div className="absolute top-1/3 -left-20 w-80 h-80 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-500 opacity-20 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-gradient-to-tl from-green-400 to-emerald-500 opacity-20 blur-3xl" />

      {/* Navigation */}
      <nav className="relative z-10 backdrop-blur-md bg-black/30 border-b border-white/10 p-4 px-6 md:px-10 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3 text-white hover:text-blue-400 transition-colors">
          <ArrowLeft size={24} />
          <span className="font-semibold">Back to Home</span>
        </Link>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Camera size={20} className="text-blue-400" />
            <span className="text-white font-semibold">AI Exercise Tracker</span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 px-4 py-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl mb-6">
            <Camera size={36} className="text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            AI Exercise Tracker
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Choose from our TensorFlow-powered exercise tracking modules with real-time pose detection and form analysis
          </p>
        </motion.div>

        {/* Selected Exercise Details - Full Screen */}
        {selectedExercise && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-3xl overflow-hidden border border-white/10 backdrop-blur-sm">
              <div className="p-8 md:p-12">
                <div className="text-center mb-8">
                  <div className={`inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-r ${selectedExercise.color} mb-6`}>
                    {selectedExercise.icon}
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    {selectedExercise.name}
                  </h2>
                  <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-6">{selectedExercise.description}</p>
                  
                  <div className="flex flex-wrap gap-3 justify-center mb-8">
                    <span className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium border border-blue-500/30">
                      TensorFlow.js
                    </span>
                    <span className="px-4 py-2 bg-green-500/20 text-green-400 rounded-full text-sm font-medium border border-green-500/30">
                      Pose Detection
                    </span>
                    <span className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-full text-sm font-medium border border-purple-500/30">
                      Real-time AI
                    </span>
                    <span className="px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-full text-sm font-medium border border-yellow-500/30">
                      Form Analysis
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                  <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
                    <h3 className="text-xl font-bold mb-4 text-white">Features</h3>
                    <ul className="space-y-3 text-gray-300">
                      <li className="flex items-center">
                        <div className="w-3 h-3 bg-blue-400 rounded-full mr-3"></div>
                        Real-time pose detection
                      </li>
                      <li className="flex items-center">
                        <div className="w-3 h-3 bg-green-400 rounded-full mr-3"></div>
                        Automatic rep counting
                      </li>
                      <li className="flex items-center">
                        <div className="w-3 h-3 bg-purple-400 rounded-full mr-3"></div>
                        Form analysis and feedback
                      </li>
                      <li className="flex items-center">
                        <div className="w-3 h-3 bg-yellow-400 rounded-full mr-3"></div>
                        Progress tracking
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
                    <h3 className="text-xl font-bold mb-4 text-white">Requirements</h3>
                    <ul className="space-y-3 text-gray-300">
                      <li className="flex items-center">
                        <div className="w-3 h-3 bg-blue-400 rounded-full mr-3"></div>
                        Camera access
                      </li>
                      <li className="flex items-center">
                        <div className="w-3 h-3 bg-green-400 rounded-full mr-3"></div>
                        Good lighting
                      </li>
                      <li className="flex items-center">
                        <div className="w-3 h-3 bg-purple-400 rounded-full mr-3"></div>
                        Full body visibility
                      </li>
                      <li className="flex items-center">
                        <div className="w-3 h-3 bg-yellow-400 rounded-full mr-3"></div>
                        Stable internet connection
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
                    <h3 className="text-xl font-bold mb-4 text-white">Tips for {selectedExercise.name}</h3>
                    <ul className="space-y-3 text-gray-300">
                      <li className="flex items-center">
                        <div className="w-3 h-3 bg-blue-400 rounded-full mr-3"></div>
                        Face the camera from the front view
                      </li>
                      <li className="flex items-center">
                        <div className="w-3 h-3 bg-green-400 rounded-full mr-3"></div>
                        Keep proper form throughout
                      </li>
                      <li className="flex items-center">
                        <div className="w-3 h-3 bg-purple-400 rounded-full mr-3"></div>
                        Use controlled movements
                      </li>
                      <li className="flex items-center">
                        <div className="w-3 h-3 bg-yellow-400 rounded-full mr-3"></div>
                        Maintain a steady pace
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="text-center">
                  <Link
                    to={`/exercise/${selectedExercise.component}`}
                    className="inline-flex items-center justify-center bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-6 px-12 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
                  >
                    <Camera size={24} className="mr-3" />
                    Start {selectedExercise.name} Training
                    <span className="ml-3 text-xl">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Exercise Grid */}
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Choose Your Exercise
            </h2>
            <p className="text-gray-400 text-lg">
              Select an exercise to see detailed information and start training
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            <AnimatePresence>
              {tensorflowExercises.map((exercise, index) => (
                <motion.div
                  key={exercise.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className={`${exercise.bgColor} ${exercise.borderColor} rounded-2xl p-6 border hover:border-opacity-60 transition-all duration-300 cursor-pointer group transform hover:scale-105 hover:shadow-xl`}
                  onClick={() => handleExerciseSelect(exercise)}
                >
                  <div className="text-center">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${exercise.color} flex items-center justify-center text-white mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      {exercise.icon}
                    </div>
                    
                    <h3 className="font-bold text-white text-lg mb-2">{exercise.name}</h3>
                    <p className="text-gray-400 text-sm mb-4 leading-relaxed">{exercise.description}</p>
                    
                    <div className="flex items-center justify-center text-blue-400 text-sm font-medium">
                      <Camera size={16} className="mr-2" />
                      <span>AI Tracking</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-3xl p-8 backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to Transform Your Fitness?
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Experience the power of AI-driven exercise tracking with real-time feedback and personalized insights.
            </p>
            <Link
              to="/exercise"
              className="inline-flex items-center justify-center bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              <Activity size={20} className="mr-2" />
              Explore All Exercise Options
              <span className="ml-2">→</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ExerciseCard;