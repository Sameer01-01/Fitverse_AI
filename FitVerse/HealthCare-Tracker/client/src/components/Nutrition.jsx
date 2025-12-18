import { useState, useRef, useEffect } from 'react';

function Nutrition() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [quickActions, setQuickActions] = useState(true);
  const [nutritionProfile, setNutritionProfile] = useState({
    name: '',
    age: '',
    weight: '',
    height: '',
    goal: 'maintain',
    dietType: 'balanced'
  });
  const [showProfile, setShowProfile] = useState(false);
  const [mealPlan, setMealPlan] = useState([]);
  const [waterIntake, setWaterIntake] = useState(0);
  const [dailyWaterGoal] = useState(8);
  const [foodLog, setFoodLog] = useState([]);
  const [showMealPlan, setShowMealPlan] = useState(false);
  const [showFoodLog, setShowFoodLog] = useState(false);
  const [currentDate] = useState(new Date().toLocaleDateString());
  const [favorites, setFavorites] = useState([]);
  const [typing, setTyping] = useState(false);
  
  const messagesEndRef = useRef(null);
 const API_KEY = "AIzaSyAFWuD7AvPWLPmk1lkc8o45OUJ9v59Fh6Q";
  const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const welcomeMessage = {
      role: "assistant",
      content: "🥗 Hello! I'm your Enhanced AI Nutritionist. I can help you with personalized nutrition advice, meal planning, food logging, and much more. How can I assist you today?",
      timestamp: new Date().toLocaleTimeString()
    };
    setMessages([welcomeMessage]);
  }, []);

  const quickActionButtons = [
    { text: "🍎 Healthy Recipes", action: "Give me 3 healthy breakfast recipes" },
    { text: "📊 Calorie Calculator", action: "Help me calculate my daily calorie needs" },
    { text: "🥘 Meal Planning", action: "Create a weekly meal plan for me" },
    { text: "🏃‍♂️ Nutrition for Exercise", action: "What should I eat before and after workout?" },
    { text: "🌿 Superfoods Guide", action: "Tell me about the top 10 superfoods" },
    { text: "⚖️ Weight Management", action: "Give me tips for healthy weight management" }
  ];

  const handleSubmit = async (e, customInput = null) => {
    e?.preventDefault();
    const messageText = customInput || input;
    if (!messageText.trim()) return;

    const userMessage = { 
      role: "user", 
      content: messageText,
      timestamp: new Date().toLocaleTimeString()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setTyping(true);

    // Simulate typing delay for better UX
    setTimeout(async () => {
      try {
        const profileContext = nutritionProfile.name ? 
          `User profile: ${nutritionProfile.name}, ${nutritionProfile.age} years old, ${nutritionProfile.weight}kg, ${nutritionProfile.height}cm, Goal: ${nutritionProfile.goal}, Diet: ${nutritionProfile.dietType}. ` : '';

        const response = await fetch(`${API_URL}?key=${API_KEY}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are an Enhanced AI Nutritionist with advanced capabilities. ${profileContext}
                    Provide helpful, accurate, and personalized nutrition advice. 
                    The user's message is: ${messageText}
                    
                    Guidelines:
                    - Use emojis appropriately to make responses engaging
                    - Provide actionable advice
                    - Include specific food recommendations when relevant
                    - Be encouraging and supportive
                    - Format responses clearly with line breaks
                    - IMPORTANT: Do not use asterisks or markdown formatting. Use emojis and clear formatting instead.
                    
                    Keep responses informative yet conversational.`
                  }
                ]
              }
            ]
          })
        });

        const data = await response.json();
        
        let assistantResponse;
        if (data.candidates && data.candidates[0].content.parts[0].text) {
          assistantResponse = data.candidates[0].content.parts[0].text.replace(/\*/g, '');
        } else {
          assistantResponse = "I'm sorry, I couldn't generate a response. Please try again.";
        }

        const assistantMessage = { 
          role: "assistant", 
          content: assistantResponse,
          timestamp: new Date().toLocaleTimeString()
        };
        setMessages(prev => [...prev, assistantMessage]);
      } catch (error) {
        console.error("Error:", error);
        const errorMessage = { 
          role: "assistant", 
          content: "Sorry, there was an error processing your request. Please check your connection and try again.",
          timestamp: new Date().toLocaleTimeString()
        };
        setMessages(prev => [...prev, errorMessage]);
      } finally {
        setLoading(false);
        setTyping(false);
      }
    }, 1000);
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      if (speaking) {
        window.speechSynthesis.cancel();
        setSpeaking(false);
        return;
      }
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.onend = () => setSpeaking(false);
      setSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const addToFavorites = (content) => {
    const favorite = {
      id: Date.now(),
      content: content.substring(0, 100) + '...',
      fullContent: content,
      timestamp: new Date().toLocaleTimeString()
    };
    setFavorites(prev => [...prev, favorite]);
  };

  const addWater = () => {
    if (waterIntake < dailyWaterGoal) {
      setWaterIntake(prev => prev + 1);
    }
  };

  const resetWater = () => {
    setWaterIntake(0);
  };

  const addToFoodLog = () => {
    const food = prompt("Enter food item and quantity (e.g., 'Apple - 1 medium'):");
    if (food) {
      const logEntry = {
        id: Date.now(),
        food: food,
        time: new Date().toLocaleTimeString(),
        date: currentDate
      };
      setFoodLog(prev => [...prev, logEntry]);
    }
  };

  const generateMealPlan = () => {
    const sampleMealPlan = [
      { meal: "Breakfast", food: "🥣 Oatmeal with berries and nuts", calories: "350 cal" },
      { meal: "Snack", food: "🍎 Apple with almond butter", calories: "200 cal" },
      { meal: "Lunch", food: "🥗 Quinoa salad with vegetables", calories: "450 cal" },
      { meal: "Snack", food: "🥤 Greek yogurt with honey", calories: "150 cal" },
      { meal: "Dinner", food: "🐟 Grilled salmon with vegetables", calories: "500 cal" }
    ];
    setMealPlan(sampleMealPlan);
    setShowMealPlan(true);
  };

  const clearChat = () => {
    const welcomeMessage = {
      role: "assistant",
      content: "🥗 Chat cleared! How else can I help with your nutrition journey today?",
      timestamp: new Date().toLocaleTimeString()
    };
    setMessages([welcomeMessage]);
  };

  const themeClasses = darkMode 
    ? "min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-green-900 text-gray-100"
    : "min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 text-gray-900";

  return (
    <div className={`${themeClasses} flex flex-col transition-all duration-500`}>
      {/* Header */}
      <header className={`${darkMode ? 'bg-gray-800/90' : 'bg-white/90'} backdrop-blur-sm p-4 shadow-xl border-b ${darkMode ? 'border-green-500/30' : 'border-green-200'} sticky top-0 z-50`}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center animate-pulse">
                <span className="text-white text-xl">🥗</span>
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                AI Nutritionist Pro
              </h1>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Your Personal Nutrition Assistant</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Water Tracker */}
            <div className="flex items-center space-x-1 bg-blue-500/20 px-3 py-1 rounded-full">
              <span className="text-blue-400">💧</span>
              <span className="text-sm font-medium">{waterIntake}/{dailyWaterGoal}</span>
              <button 
                onClick={addWater}
                className="text-blue-400 hover:text-blue-300 text-xs bg-blue-500/30 px-2 py-1 rounded-full transition-colors"
              >
                +
              </button>
            </div>
            
            {/* Theme Toggle */}
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg transition-colors ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
            
            {/* Profile Button */}
            <button 
              onClick={() => setShowProfile(!showProfile)}
              className={`p-2 rounded-lg transition-colors ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
            >
              👤
            </button>
            
            {/* Clear Chat */}
            <button 
              onClick={clearChat}
              className={`px-3 py-2 rounded-lg text-sm transition-colors ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
            >
              🗑️ Clear
            </button>
          </div>
        </div>
      </header>

      {/* Profile Modal */}
      {showProfile && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 max-w-md w-full shadow-2xl`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">👤 Nutrition Profile</h3>
              <button 
                onClick={() => setShowProfile(false)}
                className={`text-2xl ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'}`}
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <input
                placeholder="Name"
                value={nutritionProfile.name}
                onChange={(e) => setNutritionProfile(prev => ({...prev, name: e.target.value}))}
                className={`w-full p-3 rounded-lg ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'} focus:ring-2 focus:ring-green-500`}
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  placeholder="Age"
                  value={nutritionProfile.age}
                  onChange={(e) => setNutritionProfile(prev => ({...prev, age: e.target.value}))}
                  className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'} focus:ring-2 focus:ring-green-500`}
                />
                <input
                  placeholder="Weight (kg)"
                  value={nutritionProfile.weight}
                  onChange={(e) => setNutritionProfile(prev => ({...prev, weight: e.target.value}))}
                  className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'} focus:ring-2 focus:ring-green-500`}
                />
              </div>
              <input
                placeholder="Height (cm)"
                value={nutritionProfile.height}
                onChange={(e) => setNutritionProfile(prev => ({...prev, height: e.target.value}))}
                className={`w-full p-3 rounded-lg ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'} focus:ring-2 focus:ring-green-500`}
              />
              <select
                value={nutritionProfile.goal}
                onChange={(e) => setNutritionProfile(prev => ({...prev, goal: e.target.value}))}
                className={`w-full p-3 rounded-lg ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'} focus:ring-2 focus:ring-green-500`}
              >
                <option value="lose">🎯 Lose Weight</option>
                <option value="maintain">⚖️ Maintain Weight</option>
                <option value="gain">💪 Gain Weight</option>
              </select>
              <select
                value={nutritionProfile.dietType}
                onChange={(e) => setNutritionProfile(prev => ({...prev, dietType: e.target.value}))}
                className={`w-full p-3 rounded-lg ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'} focus:ring-2 focus:ring-green-500`}
              >
                <option value="balanced">🍽️ Balanced Diet</option>
                <option value="vegetarian">🥬 Vegetarian</option>
                <option value="vegan">🌱 Vegan</option>
                <option value="keto">🥑 Keto</option>
                <option value="mediterranean">🫒 Mediterranean</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar Features */}
      <div className="flex flex-1">
        <aside className={`w-80 ${darkMode ? 'bg-gray-800/50' : 'bg-white/50'} backdrop-blur-sm p-4 space-y-4 overflow-y-auto border-r ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          {/* Quick Actions */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-lg">🚀 Quick Actions</h3>
              <button 
                onClick={() => setQuickActions(!quickActions)}
                className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
              >
                {quickActions ? '−' : '+'}
              </button>
            </div>
            {quickActions && (
              <div className="grid grid-cols-1 gap-2">
                {quickActionButtons.map((action, index) => (
                  <button
                    key={index}
                    onClick={(e) => handleSubmit(e, action.action)}
                    className={`text-left p-3 rounded-lg text-sm transition-all hover:scale-105 ${darkMode ? 'bg-gray-700/50 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} border ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}
                  >
                    {action.text}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Daily Tools */}
          <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/30' : 'bg-green-50'} border ${darkMode ? 'border-gray-600' : 'border-green-200'}`}>
            <h3 className="font-semibold mb-3">📱 Daily Tools</h3>
            <div className="space-y-2">
              <button 
                onClick={generateMealPlan}
                className="w-full text-left p-2 rounded-lg text-sm bg-green-500/20 text-green-400 hover:bg-green-500/30"
              >
                🍽️ Generate Meal Plan
              </button>
              <button 
                onClick={addToFoodLog}
                className="w-full text-left p-2 rounded-lg text-sm bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
              >
                📝 Log Food
              </button>
              <button 
                onClick={() => setShowFoodLog(!showFoodLog)}
                className="w-full text-left p-2 rounded-lg text-sm bg-purple-500/20 text-purple-400 hover:bg-purple-500/30"
              >
                📊 View Food Log ({foodLog.length})
              </button>
            </div>
          </div>

          {/* Water Tracker */}
          <div className={`p-4 rounded-xl ${darkMode ? 'bg-blue-900/20' : 'bg-blue-50'} border ${darkMode ? 'border-blue-800' : 'border-blue-200'}`}>
            <h3 className="font-semibold mb-3">💧 Water Tracker</h3>
            <div className="flex items-center justify-between mb-2">
              <span>{waterIntake} / {dailyWaterGoal} glasses</span>
              <div className="flex space-x-1">
                <button 
                  onClick={addWater}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-full text-sm"
                >
                  +1
                </button>
                <button 
                  onClick={resetWater}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded-full text-xs"
                >
                  Reset
                </button>
              </div>
            </div>
            <div className={`w-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2`}>
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(waterIntake / dailyWaterGoal) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Favorites */}
          {favorites.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">⭐ Favorites</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {favorites.slice(-5).map((fav) => (
                  <div 
                    key={fav.id}
                    className={`p-2 rounded-lg text-xs ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'} cursor-pointer hover:opacity-80`}
                    onClick={() => speakText(fav.fullContent)}
                  >
                    {fav.content}
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col">
          <div className="flex-1 p-4 overflow-auto">
            <div className="max-w-4xl mx-auto space-y-4">
              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-fadeIn`}
                >
                  <div className={`max-w-3xl p-4 rounded-2xl shadow-lg transform hover:scale-[1.02] transition-all ${
                    message.role === "user" 
                      ? `bg-gradient-to-r from-green-500 to-green-600 text-white ml-auto` 
                      : `${darkMode ? 'bg-gray-800/80 text-gray-100 border border-gray-700' : 'bg-white text-gray-900 border border-gray-200'} mr-auto`
                  }`}>
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-sm">
                          {message.role === "user" ? "You" : "🤖 AI Nutritionist"}
                        </span>
                        <span className="text-xs opacity-60">{message.timestamp}</span>
                      </div>
                      {message.role === "assistant" && (
                        <div className="flex items-center space-x-1">
                          <button 
                            onClick={() => addToFavorites(message.content)}
                            className="text-yellow-400 hover:text-yellow-300 p-1 rounded-full transition-colors"
                            title="Add to favorites"
                          >
                            ⭐
                          </button>
                          <button 
                            onClick={() => navigator.clipboard.writeText(message.content)}
                            className={`${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'} p-1 rounded-full transition-colors`}
                            title="Copy to clipboard"
                          >
                            📋
                          </button>
                          <button 
                            onClick={() => speakText(message.content)}
                            className={`${speaking ? 'text-red-400' : darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'} p-1 rounded-full transition-colors`}
                            title={speaking ? "Stop speaking" : "Speak text"}
                          >
                            {speaking ? '🔇' : '🔊'}
                          </button>
                        </div>
                      )}
                    </div>
                    <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className={`max-w-3xl p-4 rounded-2xl ${darkMode ? 'bg-gray-800/80' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'} shadow-lg mr-auto`}>
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce delay-100"></div>
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce delay-200"></div>
                      </div>
                      {typing && <span className="text-sm text-green-400">AI is thinking...</span>}
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <footer className={`p-4 ${darkMode ? 'bg-gray-800/50' : 'bg-white/50'} backdrop-blur-sm border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything about nutrition..."
                className={`flex-1 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all ${darkMode ? 'bg-gray-700 text-white placeholder-gray-400' : 'bg-gray-100 text-gray-900 placeholder-gray-500'}`}
                disabled={loading}
              />
              <button
                type="submit"
                className={`p-3 rounded-lg transition-all duration-300 flex items-center justify-center w-24 ${
                  loading || !input.trim() 
                    ? 'bg-gray-400 text-gray-700 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white'
                }`}
                disabled={loading || !input.trim()}
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-gray-300 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <span className="flex items-center space-x-1">
                    <span>Send</span>
                    <span>🚀</span>
                  </span>
                )}
              </button>
            </form>
            <div className={`max-w-4xl mx-auto mt-2 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'} text-center`}>
              🌟 Enhanced AI Nutritionist provides personalized guidance. Always consult healthcare professionals for medical advice.
            </div>
          </footer>
        </main>
      </div>

      {/* Food Log Modal */}
      {showFoodLog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 max-w-md w-full shadow-2xl max-h-[80vh] overflow-auto`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">📊 Food Log</h3>
              <button 
                onClick={() => setShowFoodLog(false)}
                className={`text-2xl ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'}`}
              >
                ✕
              </button>
            </div>
            {foodLog.length === 0 ? (
              <p className="text-center py-4">No food logged yet. Start by adding some items!</p>
            ) : (
              <div className="space-y-3">
                {foodLog.map((item, index) => (
                  <div 
                    key={item.id}
                    className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'} flex justify-between items-center`}
                  >
                    <div>
                      <p className="font-medium">{item.food}</p>
                      <p className="text-xs opacity-75">{item.date} at {item.time}</p>
                    </div>
                    <button 
                      onClick={() => setFoodLog(prev => prev.filter((_, i) => i !== index))}
                      className={`p-1 rounded-full ${darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-500 hover:text-red-600'}`}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Meal Plan Modal */}
      {showMealPlan && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 max-w-md w-full shadow-2xl max-h-[80vh] overflow-auto`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">🍽️ Daily Meal Plan</h3>
              <button 
                onClick={() => setShowMealPlan(false)}
                className={`text-2xl ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'}`}
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              {mealPlan.map((meal, index) => (
                <div 
                  key={index}
                  className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}
                >
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold">{meal.meal}</h4>
                    <span className="text-sm opacity-75">{meal.calories}</span>
                  </div>
                  <p className="mt-1">{meal.food}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default Nutrition;