import React from 'react';

const ExerciseWrapper = ({ children, exerciseName }) => {
  return (
    <div className="bg-gray-900 text-white p-4 rounded-xl">
      <div className="max-w-full mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400 mb-4 text-center">
          {exerciseName} Tracker
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left side - Controls and Progress */}
          <div className="bg-gray-800 rounded-xl p-4 shadow-lg">
            <div className="mb-4">
              <h2 className="text-lg font-bold mb-2">Your Progress</h2>
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-400 mb-1">Reps Completed</p>
                <p className="text-3xl font-bold text-blue-400">0</p>
              </div>
            </div>
            
            <div className="mb-4">
              <h2 className="text-lg font-bold mb-2">Controls</h2>
              <div className="flex flex-col gap-2">
                <button className="bg-green-600 hover:bg-green-700 px-3 py-2 rounded-lg font-bold transition-colors text-sm">
                  Start Tracking
                </button>
                <button className="bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg font-bold transition-colors text-sm">
                  Reset Counter
                </button>
              </div>
            </div>
            
            <div>
              <h2 className="text-lg font-bold mb-2">Tips</h2>
              <ul className="list-disc pl-4 space-y-1 text-gray-300 text-sm">
                <li>Face the camera from the front view</li>
                <li>Keep proper form throughout</li>
                <li>Use controlled movements</li>
                <li>Maintain a steady pace</li>
              </ul>
            </div>
          </div>
          
          {/* Right side - Camera/Canvas */}
          <div className="bg-gray-800 rounded-xl p-4 shadow-lg">
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-2 text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-sm">Camera will activate when you start tracking</p>
                </div>
              </div>
              
              {/* Overlay Elements */}
              <div className="absolute top-2 left-2 z-20">
                <div className="bg-black/60 text-white px-2 py-1 rounded-full text-xs">
                  Ready
                </div>
              </div>
              
              {/* Exercise Counter */}
              <div className="absolute top-2 right-2 z-20">
                <div className="bg-black/60 text-white px-3 py-1 rounded-lg">
                  <span className="text-xl font-bold">0</span>
                  <span className="ml-1 text-xs">Reps</span>
                </div>
              </div>
            </div>
            
            {/* Progress */}
            <div className="mt-4">
              <h3 className="text-lg font-bold mb-2">Today's Goal</h3>
              <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-teal-500 rounded-full transition-all duration-500 ease-out"
                  style={{ width: '0%' }}
                />
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span>0</span>
                <span>Goal: 20 reps</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseWrapper; 