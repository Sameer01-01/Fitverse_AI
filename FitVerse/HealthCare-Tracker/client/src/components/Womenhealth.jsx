import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, Baby, Heart, ArrowRight } from 'lucide-react'

const Womenhealth = () => {
  const navigate = useNavigate()

  const handlePeriodTracker = () => {
    navigate('/period-tracker')
  }

  const handlePregnancyCare = () => {
    navigate('/pregnancy-care')
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Women's Health Hub
          </h1>
          <p className="text-gray-300 text-lg">
            Choose your health tracking journey
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          
          {/* Period Tracker Card */}
          <div 
            onClick={handlePeriodTracker}
            className="bg-gray-800 rounded-2xl p-8 border-2 border-gray-700 hover:border-blue-500 transition-all duration-300 cursor-pointer group hover:shadow-2xl hover:shadow-blue-500/20"
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Calendar className="w-10 h-10 text-white" />
              </div>
              
              <h2 className="text-2xl font-bold mb-4 text-white group-hover:text-blue-400 transition-colors">
                Period Tracker
              </h2>
              
              <p className="text-gray-300 mb-6 leading-relaxed">
                Track your menstrual cycle, predict periods, monitor symptoms, and gain insights into your reproductive health patterns.
              </p>
              
              <div className="flex items-center justify-center gap-2 text-blue-400 group-hover:text-blue-300 transition-colors">
                <span className="font-medium">Get Started</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* Pregnancy Care Card */}
          <div 
            onClick={handlePregnancyCare}
            className="bg-gray-800 rounded-2xl p-8 border-2 border-gray-700 hover:border-blue-500 transition-all duration-300 cursor-pointer group hover:shadow-2xl hover:shadow-blue-500/20"
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Baby className="w-10 h-10 text-white" />
              </div>
              
              <h2 className="text-2xl font-bold mb-4 text-white group-hover:text-blue-400 transition-colors">
                Pregnancy Care
              </h2>
              
              <p className="text-gray-300 mb-6 leading-relaxed">
                Monitor your pregnancy journey, track milestones, manage appointments, and get personalized care recommendations.
              </p>
              
              <div className="flex items-center justify-center gap-2 text-blue-400 group-hover:text-blue-300 transition-colors">
                <span className="font-medium">Get Started</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
            <h3 className="text-2xl font-bold mb-6 text-center flex items-center justify-center gap-3">
              <Heart className="w-8 h-8 text-red-400" />
              Why Track Your Health?
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">1</span>
                </div>
                <h4 className="font-semibold mb-2 text-blue-400">Better Understanding</h4>
                <p className="text-gray-300 text-sm">
                  Gain insights into your body's patterns and cycles
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">2</span>
                </div>
                <h4 className="font-semibold mb-2 text-blue-400">Health Monitoring</h4>
                <p className="text-gray-300 text-sm">
                  Track symptoms and identify potential health concerns early
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">3</span>
                </div>
                <h4 className="font-semibold mb-2 text-blue-400">Informed Decisions</h4>
                <p className="text-gray-300 text-sm">
                  Make better healthcare decisions with comprehensive data
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Womenhealth