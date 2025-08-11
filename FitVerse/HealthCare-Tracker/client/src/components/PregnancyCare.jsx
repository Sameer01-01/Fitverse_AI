import React, { useState } from 'react';
import { Calendar, Heart, Baby, Clock, Activity, Bell, Book, Users, Phone } from 'lucide-react';

const Womenhealth = () => {
  const [currentWeek, setCurrentWeek] = useState(24);
  const [dueDate, setDueDate] = useState('2024-03-15');
  const [appointments, setAppointments] = useState([
    { id: 1, type: 'Regular Checkup', date: '2024-01-20', time: '10:00 AM' },
    { id: 2, type: 'Ultrasound', date: '2024-02-05', time: '2:30 PM' },
  ]);

  const milestones = [
    { week: 12, title: 'First Trimester Complete', completed: true },
    { week: 20, title: 'Anatomy Scan', completed: true },
    { week: 28, title: 'Third Trimester Begins', completed: false },
    { week: 36, title: 'Full Term Approaching', completed: false },
  ];

  const tips = [
    { category: 'Nutrition', tip: 'Take prenatal vitamins daily', color: 'from-pink-500 to-rose-500' },
    { category: 'Exercise', tip: 'Light walking for 30 minutes', color: 'from-purple-500 to-indigo-500' },
    { category: 'Sleep', tip: 'Sleep on your left side', color: 'from-blue-500 to-cyan-500' },
    { category: 'Health', tip: 'Stay hydrated - 8-10 glasses daily', color: 'from-green-500 to-emerald-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
            <h1 className="text-4xl font-bold mb-5">Pregnancy Care Hub</h1>
          </div>
          <p className="text-gray-300 text-lg">Your complete companion for a healthy pregnancy journey</p>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          
          {/* Pregnancy Progress Card */}
          <div className="lg:col-span-2 bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <Baby className="text-pink-400" />
                Pregnancy Progress
              </h2>
              <div className="bg-gradient-to-r from-pink-500 to-purple-500 px-4 py-2 rounded-full text-sm font-medium">
                Week {currentWeek}
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-300 mb-2">
                <span>Progress</span>
                <span>{Math.round((currentWeek / 40) * 100)}% Complete</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-pink-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(currentWeek / 40) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-900 rounded-xl p-4">
                <div className="text-gray-400 text-sm mb-1">Due Date</div>
                <div className="text-xl font-semibold text-purple-400">{dueDate}</div>
              </div>
              <div className="bg-gray-900 rounded-xl p-4">
                <div className="text-gray-400 text-sm mb-1">Trimester</div>
                <div className="text-xl font-semibold text-pink-400">
                  {currentWeek <= 12 ? 'First' : currentWeek <= 28 ? 'Second' : 'Third'}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Activity className="text-green-400" />
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 py-3 rounded-xl font-medium transition-all duration-200">
                Log Symptoms
              </button>
              <button className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 py-3 rounded-xl font-medium transition-all duration-200">
                Track Baby Kicks
              </button>
              <button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 py-3 rounded-xl font-medium transition-all duration-200">
                Weight Tracker
              </button>
              <button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 py-3 rounded-xl font-medium transition-all duration-200">
                Mood Journal
              </button>
            </div>
          </div>
        </div>

        {/* Appointments & Milestones */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          
          {/* Upcoming Appointments */}
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Calendar className="text-blue-400" />
              Upcoming Appointments
            </h3>
            <div className="space-y-3">
              {appointments.map((appointment) => (
                <div key={appointment.id} className="bg-gray-900 rounded-xl p-4 flex justify-between items-center">
                  <div>
                    <div className="font-medium text-white">{appointment.type}</div>
                    <div className="text-gray-400 text-sm flex items-center gap-2">
                      <Calendar size={16} />
                      {appointment.date} at {appointment.time}
                    </div>
                  </div>
                  <Bell className="text-yellow-400" size={20} />
                </div>
              ))}
              <button className="w-full border border-gray-600 hover:border-purple-500 py-3 rounded-xl font-medium transition-all duration-200 text-gray-300 hover:text-white">
                + Schedule New Appointment
              </button>
            </div>
          </div>

          {/* Milestones */}
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Heart className="text-red-400" />
              Pregnancy Milestones
            </h3>
            <div className="space-y-3">
              {milestones.map((milestone, index) => (
                <div key={index} className="bg-gray-900 rounded-xl p-4 flex justify-between items-center">
                  <div>
                    <div className="font-medium text-white">Week {milestone.week}</div>
                    <div className="text-gray-400 text-sm">{milestone.title}</div>
                  </div>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    milestone.completed ? 'bg-green-500' : 'bg-gray-600'
                  }`}>
                    {milestone.completed && <span className="text-white text-xs">✓</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Daily Tips & Resources */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Daily Tips */}
          <div className="lg:col-span-2 bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Book className="text-yellow-400" />
              Daily Tips for Week {currentWeek}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tips.map((tip, index) => (
                <div key={index} className="bg-gray-900 rounded-xl p-4 border-l-4 border-transparent">
                  <div className={`w-full h-1 bg-gradient-to-r ${tip.color} rounded-full mb-3`}></div>
                  <div className="font-medium text-white mb-2">{tip.category}</div>
                  <div className="text-gray-300 text-sm">{tip.tip}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Emergency & Resources */}
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Phone className="text-red-400" />
              Resources & Support
            </h3>
            <div className="space-y-3">
              <button className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2">
                <Phone size={18} />
                Emergency Hotline
              </button>
              <button className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2">
                <Users size={18} />
                Support Groups
              </button>
              <button className="w-full bg-gradient-to-r from-teal-500 to-green-500 hover:from-teal-600 hover:to-green-600 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2">
                <Book size={18} />
                Educational Articles
              </button>
              <div className="bg-gray-900 rounded-xl p-4 text-center">
                <div className="text-gray-400 text-sm mb-1">24/7 Nurse Line</div>
                <div className="text-xl font-semibold text-green-400">1-800-BABY-CARE</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Womenhealth;