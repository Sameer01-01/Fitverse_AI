import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Play, Search, Activity, Dumbbell, Zap } from 'lucide-react';

const ExerciseCard = () => {
  const [selectedExercise, setSelectedExercise] = useState(null);

  const tensorflowExercises = [
    {
      name: "Push-ups",
      description: "AI-powered push-up counter with pose detection",
      icon: <Dumbbell size={24} />,
      color: "from-red-500 to-orange-500",
      bgColor: "bg-gradient-to-r from-red-500/20 to-orange-500/20",
      borderColor: "border-red-500/30",
      component: "pushup"
    },
    {
      name: "Pull-ups",
      description: "Advanced pull-up detection and counting",
      icon: <Zap size={24} />,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-gradient-to-r from-purple-500/20 to-pink-500/20",
      borderColor: "border-purple-500/30",
      component: "pullup"
    },
    {
      name: "Bicep Curls",
      description: "Precise bicep curl counting with form feedback",
      icon: <Dumbbell size={24} />,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-gradient-to-r from-blue-500/20 to-cyan-500/20",
      borderColor: "border-blue-500/30",
      component: "bicepcurl"
    },
    {
      name: "Squats",
      description: "Real-time squat tracking with depth analysis",
      icon: <Activity size={24} />,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-gradient-to-r from-green-500/20 to-emerald-500/20",
      borderColor: "border-green-500/30",
      component: "squat"
    },
    {
      name: "Shoulder Press",
      description: "Shoulder press tracking with pose detection",
      icon: <Dumbbell size={24} />,
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
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl overflow-hidden border border-white/10 backdrop-blur-sm">
      <div className="p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl mb-4">
            <Camera size={28} className="text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">
            AI Exercise Tracker
          </h3>
          <p className="text-gray-400 max-w-md mx-auto">
            Choose from our TensorFlow-powered exercise tracking modules with real-time pose detection
          </p>
        </div>

        {/* Exercise Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <AnimatePresence>
            {tensorflowExercises.map((exercise, index) => (
              <motion.div
                key={exercise.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`${exercise.bgColor} ${exercise.borderColor} rounded-xl p-4 border hover:border-opacity-60 transition-all duration-300 cursor-pointer group`}
                onClick={() => handleExerciseSelect(exercise)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${exercise.color} flex items-center justify-center text-white`}>
                    {exercise.icon}
                  </div>
                  <span className="text-xs px-2 py-1 bg-gray-700/50 rounded-full text-gray-300">
                    TensorFlow
                  </span>
                </div>
                
                <h4 className="font-semibold text-white text-sm mb-2">{exercise.name}</h4>
                <p className="text-gray-400 text-xs mb-3">{exercise.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-blue-400 text-xs">
                    <Camera size={14} className="mr-1" />
                    <span>AI Tracking</span>
                  </div>
                  <Play size={16} className="text-blue-400 group-hover:scale-110 transition-transform duration-300" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Selected Exercise Details */}
        {selectedExercise && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/50 rounded-2xl p-6 border border-blue-500/30 mb-6"
          >
            <div className="text-center mb-6">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${selectedExercise.color} mb-4`}>
                {selectedExercise.icon}
              </div>
              <h4 className="text-xl font-bold text-white mb-2">
                {selectedExercise.name}
              </h4>
              <p className="text-gray-400 text-sm mb-4">{selectedExercise.description}</p>
              
              <div className="flex flex-wrap gap-2 justify-center mb-4">
                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">
                  TensorFlow.js
                </span>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
                  Pose Detection
                </span>
                <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs">
                  Real-time AI
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="text-lg font-bold mb-3 text-white">Features</h5>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                    Real-time pose detection
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                    Automatic rep counting
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                    Form analysis and feedback
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
                    Progress tracking
                  </li>
                </ul>
              </div>
              
              <div>
                <h5 className="text-lg font-bold mb-3 text-white">Requirements</h5>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                    Camera access
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                    Good lighting
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                    Full body visibility
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
                    Stable internet connection
                  </li>
                </ul>
              </div>
            </div>

            <div className="text-center mt-6">
              <Link
                to={`/exercise/${selectedExercise.component}`}
                className="inline-flex items-center justify-center w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
              >
                <Camera size={20} className="mr-2" />
                Start {selectedExercise.name} Training
                <span className="ml-2">→</span>
              </Link>
            </div>
          </motion.div>
        )}

        {/* CTA to Full Exercise Page */}
        {!selectedExercise && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mt-6"
          >
            <Link
              to="/exercise"
              className="inline-flex items-center justify-center w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
            >
              <Activity size={20} className="mr-2" />
              View All Exercise Options
              <span className="ml-2">→</span>
            </Link>
          </motion.div>
        )}

        {/* TensorFlow Info */}
        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
          <div className="flex items-center mb-2">
            <Zap size={16} className="text-blue-400 mr-2" />
            <span className="text-blue-400 font-semibold text-sm">Powered by TensorFlow.js</span>
          </div>
          <p className="text-gray-400 text-xs">
            Our AI exercise tracking uses advanced pose detection models to provide real-time feedback and accurate rep counting.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExerciseCard;