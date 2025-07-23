import React, { useState, useEffect, useCallback } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area, PieChart, Pie, Cell, RadialBarChart, RadialBar, BarChart, Bar } from "recharts";

const Bmi = () => {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("male");
  const [activityLevel, setActivityLevel] = useState("moderate");
  const [bmi, setBmi] = useState(null);
  const [message, setMessage] = useState("");
  const [idealWeight, setIdealWeight] = useState("");
  const [tip, setTip] = useState("");
  const [calorieNeeds, setCalorieNeeds] = useState(null);
  const [waterIntake, setWaterIntake] = useState(null);
  const [goalWeight, setGoalWeight] = useState("");
  const [timeToGoal, setTimeToGoal] = useState(null);
  const [activeTab, setActiveTab] = useState("calculator");
  const [bodyComposition, setBodyComposition] = useState(null);
  const [userProfile, setUserProfile] = useState({
    name: "",
    goal: "maintain",
    medicalConditions: [],
    fitnessLevel: "beginner"
  });
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [animation, setAnimation] = useState(false);
  const [weightHistory, setWeightHistory] = useState([]);
  const [units, setUnits] = useState("metric"); // metric or imperial
  const [waistCircumference, setWaistCircumference] = useState("");
  const [bodyFatPercentage, setBodyFatPercentage] = useState("");
  const [muscleMass, setMuscleMass] = useState("");
  const [bloodPressure, setBloodPressure] = useState({ systolic: "", diastolic: "" });
  const [restingHeartRate, setRestingHeartRate] = useState("");
  const [sleepHours, setSleepHours] = useState("");
  const [stressLevel, setStressLevel] = useState("moderate");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [nutritionPlan, setNutritionPlan] = useState(null);
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [healthScore, setHealthScore] = useState(null);
  const [compareWith, setCompareWith] = useState("global");

  const tips = {
    nutrition: [
      "Drink at least 8 glasses of water daily for optimal hydration.",
      "Eat protein with every meal to help maintain muscle mass.",
      "Include colorful vegetables in your meals for essential nutrients.",
      "Consider meal prep on Sundays to maintain healthy eating habits.",
      "Eat mindfully - chew slowly and pay attention to hunger cues.",
      "Include omega-3 rich foods like salmon, walnuts, and chia seeds.",
      "Limit processed foods and focus on whole, natural ingredients.",
      "Try to eat 5-7 servings of fruits and vegetables daily."
    ],
    exercise: [
      "Incorporate both cardio and strength training for balanced fitness.",
      "Try HIIT workouts for efficient calorie burning in less time.",
      "Take at least 8,000 steps daily for cardiovascular health.",
      "Schedule rest days to allow your muscles to recover properly.",
      "Start with bodyweight exercises if you're new to fitness.",
      "Consistency is key - aim for at least 30 minutes of activity daily.",
      "Mix up your routine to prevent boredom and plateaus.",
      "Focus on compound movements like squats, deadlifts, and push-ups."
    ],
    lifestyle: [
      "Get 7-9 hours of quality sleep to support metabolism.",
      "Practice stress management techniques like meditation.",
      "Stand up and move for at least 5 minutes every hour.",
      "Track your food intake for a week to identify eating patterns.",
      "Maintain social connections for mental health support.",
      "Limit screen time before bed for better sleep quality.",
      "Practice gratitude daily to improve mental wellbeing.",
      "Set realistic, achievable goals to maintain motivation."
    ],
    mental: [
      "Practice deep breathing exercises to reduce stress.",
      "Set aside time for hobbies and activities you enjoy.",
      "Consider mindfulness meditation for mental clarity.",
      "Don't compare your journey to others - focus on your progress.",
      "Celebrate small victories along your health journey.",
      "Seek professional help if you're struggling with mental health."
    ]
  };

  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    veryActive: 1.9
  };

  const bmiCategories = [
    { name: "Underweight", range: "< 18.5", color: "#64B5F6", healthRisk: "Low to moderate" },
    { name: "Normal", range: "18.5-24.9", color: "#66BB6A", healthRisk: "Minimal" },
    { name: "Overweight", range: "25-29.9", color: "#FFA726", healthRisk: "Moderate" },
    { name: "Obese Class I", range: "30-34.9", color: "#FF7043", healthRisk: "High" },
    { name: "Obese Class II", range: "35-39.9", color: "#EF5350", healthRisk: "Very high" },
    { name: "Obese Class III", range: "≥ 40", color: "#D32F2F", healthRisk: "Extremely high" }
  ];

  const medicalConditions = [
    "Diabetes", "Hypertension", "Heart Disease", "Thyroid Issues", 
    "PCOS", "Arthritis", "Sleep Apnea", "Depression", "Anxiety"
  ];

  useEffect(() => {
    const categories = Object.keys(tips);
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const randomTip = tips[randomCategory][Math.floor(Math.random() * tips[randomCategory].length)];
    setTip(`${randomCategory.charAt(0).toUpperCase() + randomCategory.slice(1)}: ${randomTip}`);
    document.body.className = theme;
  }, []);

  useEffect(() => {
    if (animation) {
      const timer = setTimeout(() => setAnimation(false), 500);
      return () => clearTimeout(timer);
    }
  }, [animation]);

  const convertWeight = (value, toMetric = true) => {
    if (!value) return "";
    return toMetric ? (value / 2.205).toFixed(1) : (value * 2.205).toFixed(1);
  };

  const convertHeight = (value, toMetric = true) => {
    if (!value) return "";
    return toMetric ? (value * 2.54).toFixed(0) : (value / 2.54).toFixed(1);
  };

  const calculateBMI = useCallback(() => {
    let weightKg = parseFloat(weight);
    let heightCm = parseFloat(height);

    if (units === "imperial") {
      weightKg = parseFloat(weight) / 2.205;
      heightCm = parseFloat(height) * 2.54;
    }

    if (weightKg > 0 && heightCm > 0) {
      setAnimation(true);
      const heightInMeters = heightCm / 100;
      const bmiValue = (weightKg / (heightInMeters * heightInMeters)).toFixed(1);
      setBmi(bmiValue);
      generateMessage(bmiValue);
      calculateIdealWeight(heightCm, gender);
      calculateCalories();
      calculateWaterIntake();
      estimateBodyComposition();
      generateNutritionPlan();
      generateWorkoutPlan();
      calculateHealthScore();
      
      // Add to weight history
      const today = new Date().toISOString().split('T')[0];
      setWeightHistory(prev => {
        const filtered = prev.filter(entry => entry.date !== today);
        return [...filtered, { date: today, weight: weightKg, bmi: parseFloat(bmiValue) }].slice(-30);
      });

      if (goalWeight) {
        calculateTimeToGoal(bmiValue);
      }
    } else {
      setMessage("Please enter valid height and weight.");
    }
  }, [weight, height, age, gender, activityLevel, goalWeight, units, waistCircumference, bodyFatPercentage]);

  const calculateIdealWeight = (height, gender) => {
    const heightInMeters = height / 100;
    let minWeight, maxWeight;
    
    // Using multiple formulas for better accuracy
    const bmiBased = {
      min: (18.5 * (heightInMeters ** 2)),
      max: (24.9 * (heightInMeters ** 2))
    };

    // Hamwi formula
    const hamwi = gender === "male" 
      ? 48 + 2.7 * ((height - 152.4) / 2.54)
      : 45.5 + 2.2 * ((height - 152.4) / 2.54);

    // Average the methods
    minWeight = Math.min(bmiBased.min, hamwi * 0.9).toFixed(1);
    maxWeight = Math.max(bmiBased.max, hamwi * 1.1).toFixed(1);

    const displayWeight = units === "imperial" 
      ? `${(minWeight * 2.205).toFixed(1)} - ${(maxWeight * 2.205).toFixed(1)} lbs`
      : `${minWeight} - ${maxWeight} kg`;
    
    setIdealWeight(displayWeight);
    return { min: minWeight, max: maxWeight };
  };

  const generateMessage = (bmi) => {
    const bmiNum = parseFloat(bmi);
    if (bmiNum < 18.5) {
      setMessage("Underweight - Focus on gaining healthy weight through balanced nutrition and strength training.");
    } else if (bmiNum < 25) {
      setMessage("Normal weight - Excellent! Maintain your healthy lifestyle with regular exercise and balanced nutrition.");
    } else if (bmiNum < 30) {
      setMessage("Overweight - Consider a moderate calorie deficit with increased physical activity.");
    } else if (bmiNum < 35) {
      setMessage("Obese Class I - Significant health improvements possible with lifestyle changes. Consider professional guidance.");
    } else if (bmiNum < 40) {
      setMessage("Obese Class II - High health risk. Professional medical supervision recommended for weight management.");
    } else {
      setMessage("Obese Class III - Very high health risk. Immediate medical consultation strongly recommended.");
    }
  };

  const calculateCalories = () => {
    if (age > 0 && weight > 0 && height > 0) {
      let weightKg = parseFloat(weight);
      let heightCm = parseFloat(height);

      if (units === "imperial") {
        weightKg = parseFloat(weight) / 2.205;
        heightCm = parseFloat(height) * 2.54;
      }

      // Multiple BMR formulas for accuracy
      let bmrMifflin, bmrHarris;
      
      if (gender === "male") {
        bmrMifflin = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
        bmrHarris = 88.362 + (13.397 * weightKg) + (4.799 * heightCm) - (5.677 * age);
      } else {
        bmrMifflin = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
        bmrHarris = 447.593 + (9.247 * weightKg) + (3.098 * heightCm) - (4.330 * age);
      }

      const bmr = (bmrMifflin + bmrHarris) / 2; // Average of both formulas
      const dailyCalories = Math.round(bmr * activityMultipliers[activityLevel]);
      
      let adjustedCalories = dailyCalories;
      if (userProfile.goal === "lose") {
        adjustedCalories = Math.round(dailyCalories * 0.8);
      } else if (userProfile.goal === "gain") {
        adjustedCalories = Math.round(dailyCalories * 1.15);
      }

      // Calculate macronutrient breakdown
      const proteinCals = Math.round(adjustedCalories * 0.25);
      const carbCals = Math.round(adjustedCalories * 0.45);
      const fatCals = Math.round(adjustedCalories * 0.30);

      setCalorieNeeds({
        bmr: Math.round(bmr),
        maintenance: dailyCalories,
        adjusted: adjustedCalories,
        goal: userProfile.goal,
        macros: {
          protein: { calories: proteinCals, grams: Math.round(proteinCals / 4) },
          carbs: { calories: carbCals, grams: Math.round(carbCals / 4) },
          fat: { calories: fatCals, grams: Math.round(fatCals / 9) }
        }
      });
    }
  };

  const calculateWaterIntake = () => {
    let weightKg = parseFloat(weight);
    if (units === "imperial") {
      weightKg = parseFloat(weight) / 2.205;
    }

    const baseIntake = weightKg * 35; // Updated to 35ml per kg
    let activityAdjustment = 0;
    let climateAdjustment = 150; // Assuming moderate climate

    if (activityLevel === "active" || activityLevel === "veryActive") {
      activityAdjustment = 600;
    } else if (activityLevel === "moderate") {
      activityAdjustment = 300;
    }

    const totalIntake = baseIntake + activityAdjustment + climateAdjustment;
    setWaterIntake({
      ml: Math.round(totalIntake),
      liters: (totalIntake / 1000).toFixed(1),
      glasses: Math.round(totalIntake / 250),
      ounces: Math.round(totalIntake / 29.574)
    });
  };

  const estimateBodyComposition = () => {
    if (weight && height && age && gender) {
      let weightKg = parseFloat(weight);
      let heightCm = parseFloat(height);

      if (units === "imperial") {
        weightKg = parseFloat(weight) / 2.205;
        heightCm = parseFloat(height) * 2.54;
      }

      let fatPercentage;
      const heightInMeters = heightCm / 100;
      const bmiValue = weightKg / (heightInMeters * heightInMeters);

      // Enhanced Deurenberg formula with activity level adjustment
      if (gender === "male") {
        fatPercentage = (1.2 * bmiValue) + (0.23 * age) - 16.2;
      } else {
        fatPercentage = (1.2 * bmiValue) + (0.23 * age) - 5.4;
      }

      // Adjust for activity level
      const activityAdjustment = {
        sedentary: 0,
        light: -1,
        moderate: -2,
        active: -3,
        veryActive: -4
      };

      fatPercentage += activityAdjustment[activityLevel];
      fatPercentage = Math.max(5, Math.min(50, fatPercentage));

      const fatMass = (weightKg * (fatPercentage / 100));
      const leanMass = weightKg - fatMass;
      const muscleMass = leanMass * 0.4; // Approximate muscle mass

      // Metabolic age estimation
      const avgBMR = gender === "male" ? 1600 : 1400;
      const userBMR = calorieNeeds?.bmr || avgBMR;
      const metabolicAge = age + ((avgBMR - userBMR) / 22);

      setBodyComposition({
        fatPercentage: fatPercentage.toFixed(1),
        fatMass: fatMass.toFixed(1),
        leanMass: leanMass.toFixed(1),
        muscleMass: muscleMass.toFixed(1),
        metabolicAge: Math.max(20, Math.min(80, metabolicAge)).toFixed(0)
      });
    }
  };

  const generateNutritionPlan = () => {
    if (!calorieNeeds) return;

    const mealPlans = {
      lose: {
        breakfast: ["Greek yogurt with berries", "Oatmeal with nuts", "Vegetable omelet"],
        lunch: ["Grilled chicken salad", "Quinoa bowl with vegetables", "Lentil soup"],
        dinner: ["Baked fish with vegetables", "Lean protein with quinoa", "Vegetable stir-fry"],
        snacks: ["Apple with almond butter", "Mixed nuts", "Vegetable sticks with hummus"]
      },
      gain: {
        breakfast: ["Protein smoothie with banana", "Whole grain toast with avocado", "Granola with yogurt"],
        lunch: ["Chicken and rice bowl", "Pasta with lean meat", "Sandwich with protein"],
        dinner: ["Salmon with sweet potato", "Beef with quinoa", "Chicken with pasta"],
        snacks: ["Trail mix", "Protein bar", "Peanut butter sandwich"]
      },
      maintain: {
        breakfast: ["Balanced cereal with fruit", "Eggs with whole grain toast", "Smoothie bowl"],
        lunch: ["Balanced salad with protein", "Soup with bread", "Wrap with vegetables"],
        dinner: ["Grilled protein with vegetables", "Pasta with vegetables", "Stir-fry with rice"],
        snacks: ["Fruit", "Yogurt", "Small handful of nuts"]
      }
    };

    setNutritionPlan(mealPlans[userProfile.goal]);
  };

  const generateWorkoutPlan = () => {
    const plans = {
      beginner: {
        cardio: "20-30 min walking, 3x/week",
        strength: "2x/week full body workouts",
        flexibility: "Daily 10-minute stretching"
      },
      intermediate: {
        cardio: "30-45 min moderate intensity, 4x/week",
        strength: "3x/week split routines",
        flexibility: "15-minute yoga sessions"
      },
      advanced: {
        cardio: "45-60 min varied intensity, 5x/week",
        strength: "4-5x/week targeted workouts",
        flexibility: "20-minute mobility work"
      }
    };

    setWorkoutPlan(plans[userProfile.fitnessLevel]);
  };

  const calculateHealthScore = () => {
    let score = 100;
    const bmiNum = parseFloat(bmi || 0);

    // BMI score impact
    if (bmiNum < 18.5 || bmiNum > 30) score -= 20;
    else if (bmiNum < 20 || bmiNum > 25) score -= 10;

    // Activity level impact
    const activityScores = { sedentary: -15, light: -5, moderate: 0, active: 5, veryActive: 10 };
    score += activityScores[activityLevel];

    // Sleep impact
    if (sleepHours) {
      const sleep = parseInt(sleepHours);
      if (sleep < 6 || sleep > 9) score -= 10;
      else if (sleep >= 7 && sleep <= 8) score += 5;
    }

    // Stress impact
    const stressScores = { low: 5, moderate: 0, high: -10, veryHigh: -20 };
    score += stressScores[stressLevel];

    // Medical conditions impact
    score -= userProfile.medicalConditions.length * 5;

    // Waist circumference (if provided)
    if (waistCircumference) {
      const waist = parseFloat(waistCircumference);
      const waistThreshold = gender === "male" ? 102 : 88; // cm
      if (waist > waistThreshold) score -= 15;
    }

    score = Math.max(0, Math.min(100, score));
    
    let category, color;
    if (score >= 80) { category = "Excellent"; color = "#4CAF50"; }
    else if (score >= 60) { category = "Good"; color = "#8BC34A"; }
    else if (score >= 40) { category = "Fair"; color = "#FF9800"; }
    else { category = "Poor"; color = "#F44336"; }

    setHealthScore({ score: Math.round(score), category, color });
  };

  const calculateTimeToGoal = (currentBmi) => {
    if (goalWeight && weight) {
      let currentWeightKg = parseFloat(weight);
      let goalWeightKg = parseFloat(goalWeight);

      if (units === "imperial") {
        currentWeightKg = parseFloat(weight) / 2.205;
        goalWeightKg = parseFloat(goalWeight) / 2.205;
      }

      const weightDiff = Math.abs(currentWeightKg - goalWeightKg);
      const weeklyWeightLoss = currentWeightKg > goalWeightKg ? 0.5 : 0.3; // kg per week
      const weeksToGoal = (weightDiff / weeklyWeightLoss);
      const monthsToGoal = (weeksToGoal / 4.33);

      setTimeToGoal({
        weeks: weeksToGoal.toFixed(1),
        months: monthsToGoal.toFixed(1),
        isRealistic: monthsToGoal >= 1 && monthsToGoal <= 24
      });
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.body.className = newTheme;
  };

  const saveUserProfile = () => {
    setShowProfileModal(false);
    if (weight && height) {
      calculateCalories();
      generateNutritionPlan();
      generateWorkoutPlan();
    }
  };

  const getNewTip = () => {
    const categories = Object.keys(tips);
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const randomTip = tips[randomCategory][Math.floor(Math.random() * tips[randomCategory].length)];
    setTip(`${randomCategory.charAt(0).toUpperCase() + randomCategory.slice(1)}: ${randomTip}`);
  };

  const resetForm = () => {
    setWeight("");
    setHeight("");
    setAge("");
    setGender("male");
    setActivityLevel("moderate");
    setGoalWeight("");
    setWaistCircumference("");
    setBodyFatPercentage("");
    setMuscleMass("");
    setBloodPressure({ systolic: "", diastolic: "" });
    setRestingHeartRate("");
    setSleepHours("");
    setStressLevel("moderate");
    setBmi(null);
    setMessage("");
    setIdealWeight("");
    setCalorieNeeds(null);
    setWaterIntake(null);
    setTimeToGoal(null);
    setBodyComposition(null);
    setNutritionPlan(null);
    setWorkoutPlan(null);
    setHealthScore(null);
    getNewTip();
    setAnimation(true);
  };

  const exportData = () => {
    const data = {
      personalInfo: { weight, height, age, gender, units },
      results: { bmi, message, idealWeight },
      bodyComposition,
      calorieNeeds,
      waterIntake,
      healthScore,
      weightHistory,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `health-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const getBmiColor = (bmiValue) => {
    const bmiNum = parseFloat(bmiValue);
    if (bmiNum < 18.5) return "#64B5F6";
    if (bmiNum < 25) return "#66BB6A";
    if (bmiNum < 30) return "#FFA726";
    if (bmiNum < 35) return "#FF7043";
    if (bmiNum < 40) return "#EF5350";
    return "#D32F2F";
  };

  const backgroundGradient = theme === "dark" 
    ? "bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800"
    : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50";

  const textColor = theme === "dark" ? "text-white" : "text-gray-800";
  const mutedTextColor = theme === "dark" ? "text-gray-400" : "text-gray-500";

  // Chart data for trends
  const chartData = weightHistory.map((entry, index) => ({
    day: index + 1,
    weight: entry.weight,
    bmi: entry.bmi,
    date: entry.date
  }));

  // Health comparison data
  const comparisonData = compareWith === "global" ? {
    averageBMI: gender === "male" ? 26.9 : 26.4,
    region: "Global Average"
  } : {
    averageBMI: gender === "male" ? 28.8 : 28.2,
    region: "US Average"
  };

  // --- ADDED: Generate Progress Data for Analytics Tab ---
  const generateProgressData = () => {
    // Only project if we have the necessary data
    if (!weight || !height || !bmi) return [];
    let currentWeight = parseFloat(weight);
    let targetWeight = goalWeight ? parseFloat(goalWeight) : currentWeight;
    let heightCm = parseFloat(height);
    if (units === "imperial") {
      currentWeight = currentWeight / 2.205;
      targetWeight = targetWeight / 2.205;
      heightCm = heightCm * 2.54;
    }
    const heightM = heightCm / 100;
    const weeks = 12;
    const weightStep = (targetWeight - currentWeight) / weeks;
    let data = [];
    for (let i = 0; i <= weeks; i++) {
      const projectedWeight = currentWeight + weightStep * i;
      const projectedBMI = projectedWeight / (heightM * heightM);
      data.push({
        week: i + 1,
        bmi: parseFloat(projectedBMI.toFixed(1)),
        weight: parseFloat(projectedWeight.toFixed(1))
      });
    }
    return data;
  };

  return (
    <div className={`min-h-screen ${backgroundGradient} p-4 md:p-6 transition-all duration-500`}>
      <div className={`max-w-6xl mx-auto ${textColor}`}>
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-center mb-8 p-6 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-2xl">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
              Health Compass Pro
            </h1>
            <p className="text-blue-100 mt-1">Your comprehensive health analytics platform</p>
            {userProfile.name && (
              <p className="text-blue-200 text-sm mt-1">Welcome back, {userProfile.name}</p>
            )}
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setUnits(units === "metric" ? "imperial" : "metric")}
              className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-all font-medium"
            >
              {units === "metric" ? "Switch to Imperial" : "Switch to Metric"}
            </button>
            <button 
              onClick={() => setShowProfileModal(true)}
              className="p-3 rounded-full hover:bg-white/20 transition-all"
              aria-label="Profile settings"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
            <button 
              onClick={toggleTheme}
              className="p-3 rounded-full hover:bg-white/20 transition-all"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === "dark" ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>
        </header>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className={`inline-flex rounded-2xl p-1 ${theme === "dark" ? "bg-gray-800/80 backdrop-blur" : "bg-white/80 backdrop-blur shadow-lg"}`}>
            {["calculator", "insights", "tips"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                disabled={tab !== "calculator" && !bmi}
                className={`px-6 py-3 rounded-xl transition-all font-medium capitalize ${
                  activeTab === tab 
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg" 
                    : `hover:bg-opacity-25 hover:bg-gray-500 ${!bmi && tab !== "calculator" ? "opacity-50 cursor-not-allowed" : ""}`
                }`}
              >
                {tab}
              </button>
              ))}
              </div>
            </div>
    
            {/* Daily Tip */}
            <div 
              className={`mb-8 p-6 rounded-2xl ${
                theme === "dark" ? "bg-gray-800/80 backdrop-blur border border-gray-700" : "bg-white/80 backdrop-blur shadow-lg"
              } transition-all duration-300 hover:scale-105`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2 text-blue-600">💡 Daily Health Tip</h3>
                  <p className={`${mutedTextColor} leading-relaxed`}>{tip}</p>
                </div>
                <button 
                  onClick={getNewTip}
                  className="ml-4 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                  aria-label="Get new tip"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>
            </div>
    
            {/* Calculator Tab */}
            {activeTab === "calculator" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Input Form */}
                <div className={`p-8 rounded-2xl ${
                  theme === "dark" ? "bg-gray-800/80 backdrop-blur border border-gray-700" : "bg-white/80 backdrop-blur shadow-lg"
                } transition-all`}>
                  <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Health Calculator
                  </h2>
                  
                  <div className="space-y-6">
                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Weight ({units === "metric" ? "kg" : "lbs"})
                        </label>
                        <input
                          type="number"
                          value={weight}
                          onChange={(e) => setWeight(e.target.value)}
                          className={`w-full p-4 rounded-xl border-2 transition-all focus:ring-2 focus:ring-blue-500 ${
                            theme === "dark" 
                              ? "bg-gray-700 border-gray-600 text-white" 
                              : "bg-white border-gray-200"
                          }`}
                          placeholder={units === "metric" ? "70" : "154"}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Height ({units === "metric" ? "cm" : "inches"})
                        </label>
                        <input
                          type="number"
                          value={height}
                          onChange={(e) => setHeight(e.target.value)}
                          className={`w-full p-4 rounded-xl border-2 transition-all focus:ring-2 focus:ring-blue-500 ${
                            theme === "dark" 
                              ? "bg-gray-700 border-gray-600 text-white" 
                              : "bg-white border-gray-200"
                          }`}
                          placeholder={units === "metric" ? "175" : "69"}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Age</label>
                        <input
                          type="number"
                          value={age}
                          onChange={(e) => setAge(e.target.value)}
                          className={`w-full p-4 rounded-xl border-2 transition-all focus:ring-2 focus:ring-blue-500 ${
                            theme === "dark" 
                              ? "bg-gray-700 border-gray-600 text-white" 
                              : "bg-white border-gray-200"
                          }`}
                          placeholder="30"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Gender</label>
                        <select
                          value={gender}
                          onChange={(e) => setGender(e.target.value)}
                          className={`w-full p-4 rounded-xl border-2 transition-all focus:ring-2 focus:ring-blue-500 ${
                            theme === "dark" 
                              ? "bg-gray-700 border-gray-600 text-white" 
                              : "bg-white border-gray-200"
                          }`}
                        >
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </select>
                      </div>
                    </div>
    
                    {/* Activity Level */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Activity Level</label>
                      <select
                        value={activityLevel}
                        onChange={(e) => setActivityLevel(e.target.value)}
                        className={`w-full p-4 rounded-xl border-2 transition-all focus:ring-2 focus:ring-blue-500 ${
                          theme === "dark" 
                            ? "bg-gray-700 border-gray-600 text-white" 
                            : "bg-white border-gray-200"
                        }`}
                      >
                        <option value="sedentary">Sedentary (desk job, no exercise)</option>
                        <option value="light">Light (light exercise 1-3 days/week)</option>
                        <option value="moderate">Moderate (moderate exercise 3-5 days/week)</option>
                        <option value="active">Active (hard exercise 6-7 days/week)</option>
                        <option value="veryActive">Very Active (physical job + exercise)</option>
                      </select>
                    </div>
    
                    {/* Goal Weight */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Goal Weight ({units === "metric" ? "kg" : "lbs"}) - Optional
                      </label>
                      <input
                        type="number"
                        value={goalWeight}
                        onChange={(e) => setGoalWeight(e.target.value)}
                        className={`w-full p-4 rounded-xl border-2 transition-all focus:ring-2 focus:ring-blue-500 ${
                          theme === "dark" 
                            ? "bg-gray-700 border-gray-600 text-white" 
                            : "bg-white border-gray-200"
                        }`}
                        placeholder={units === "metric" ? "65" : "143"}
                      />
                    </div>
    
                    {/* Advanced Options Toggle */}
                    <button
                      onClick={() => setShowAdvanced(!showAdvanced)}
                      className="w-full p-3 text-left text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg transition-all flex items-center justify-between"
                    >
                      <span>Advanced Options</span>
                      <svg 
                        className={`w-5 h-5 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
    
                    {/* Advanced Options */}
                    {showAdvanced && (
                      <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Waist Circumference ({units === "metric" ? "cm" : "inches"})
                            </label>
                            <input
                              type="number"
                              value={waistCircumference}
                              onChange={(e) => setWaistCircumference(e.target.value)}
                              className={`w-full p-3 rounded-lg border transition-all ${
                                theme === "dark" 
                                  ? "bg-gray-600 border-gray-500 text-white" 
                                  : "bg-white border-gray-300"
                              }`}
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium mb-2">Sleep Hours</label>
                            <input
                              type="number"
                              value={sleepHours}
                              onChange={(e) => setSleepHours(e.target.value)}
                              className={`w-full p-3 rounded-lg border transition-all ${
                                theme === "dark" 
                                  ? "bg-gray-600 border-gray-500 text-white" 
                                  : "bg-white border-gray-300"
                              }`}
                              placeholder="8"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-2">Stress Level</label>
                          <select
                            value={stressLevel}
                            onChange={(e) => setStressLevel(e.target.value)}
                            className={`w-full p-3 rounded-lg border transition-all ${
                              theme === "dark" 
                                ? "bg-gray-600 border-gray-500 text-white" 
                                : "bg-white border-gray-300"
                            }`}
                          >
                            <option value="low">Low</option>
                            <option value="moderate">Moderate</option>
                            <option value="high">High</option>
                            <option value="veryHigh">Very High</option>
                          </select>
                        </div>
                      </div>
                    )}
    
                    {/* Action Buttons */}
                    <div className="flex gap-4">
                      <button
                        onClick={calculateBMI}
                        className={`flex-1 py-4 rounded-xl font-semibold text-white transition-all transform hover:scale-105 ${
                          animation ? 'animate-pulse' : ''
                        } bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg`}
                      >
                        Calculate Health Metrics
                      </button>
                      
                      <button
                        onClick={resetForm}
                        className={`px-6 py-4 rounded-xl font-semibold transition-all ${
                          theme === "dark" 
                            ? "bg-gray-700 hover:bg-gray-600 text-white" 
                            : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                        }`}
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                </div>
    
                {/* Results Panel */}
                <div className="space-y-6">
                  {bmi && (
                    <>
                      {/* BMI Result */}
                      <div className={`p-8 rounded-2xl text-center ${
                        theme === "dark" ? "bg-gray-800/80 backdrop-blur border border-gray-700" : "bg-white/80 backdrop-blur shadow-lg"
                      } transition-all transform hover:scale-105`}>
                        <h3 className="text-xl font-bold mb-4">Your BMI Result</h3>
                        <div 
                          className="text-6xl font-bold mb-4 transition-all duration-500"
                          style={{ color: getBmiColor(bmi) }}
                        >
                          {bmi}
                        </div>
                        <p className={`text-lg ${mutedTextColor} mb-4`}>{message}</p>
                        {idealWeight && (
                          <p className="text-sm">
                            <span className="font-medium">Ideal Weight Range: </span>
                            <span className="text-blue-600 font-semibold">{idealWeight}</span>
                          </p>
                        )}
                      </div>
    
                      {/* Health Score */}
                      {healthScore && (
                        <div className={`p-6 rounded-2xl ${
                          theme === "dark" ? "bg-gray-800/80 backdrop-blur border border-gray-700" : "bg-white/80 backdrop-blur shadow-lg"
                        }`}>
                          <h3 className="text-lg font-bold mb-4 text-center">Overall Health Score</h3>
                          <div className="flex items-center justify-center mb-4">
                            <div className="relative w-32 h-32">
                              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                                <path
                                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                  fill="none"
                                  stroke="#e5e7eb"
                                  strokeWidth="2"
                                />
                                <path
                                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                  fill="none"
                                  stroke={healthScore.color}
                                  strokeWidth="2"
                                  strokeDasharray={`${healthScore.score}, 100`}
                                  className="transition-all duration-1000"
                                />
                              </svg>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                  <div className="text-2xl font-bold" style={{color: healthScore.color}}>
                                    {healthScore.score}
                                  </div>
                                  <div className="text-sm text-gray-500">/ 100</div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <p className="text-center">
                            <span className="font-medium">Category: </span>
                            <span className="font-bold" style={{color: healthScore.color}}>
                              {healthScore.category}
                            </span>
                          </p>
                        </div>
                      )}
    
                      {/* Quick Stats */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {calorieNeeds && (
                          <div className={`p-6 rounded-xl ${
                            theme === "dark" ? "bg-gray-800/60 border border-gray-700" : "bg-white/60 shadow"
                          }`}>
                            <h4 className="font-semibold mb-3 text-orange-600">Daily Calories</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm">BMR:</span>
                                <span className="font-medium">{calorieNeeds.bmr}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm">Maintenance:</span>
                                <span className="font-medium">{calorieNeeds.maintenance}</span>
                              </div>
                              <div className="flex justify-between border-t pt-2">
                                <span className="text-sm">For {calorieNeeds.goal}:</span>
                                <span className="font-bold text-orange-600">{calorieNeeds.adjusted}</span>
                              </div>
                            </div>
                          </div>
                        )}
    
                        {waterIntake && (
                          <div className={`p-6 rounded-xl ${
                            theme === "dark" ? "bg-gray-800/60 border border-gray-700" : "bg-white/60 shadow"
                          }`}>
                            <h4 className="font-semibold mb-3 text-blue-600">Daily Water</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm">Liters:</span>
                                <span className="font-medium">{waterIntake.liters}L</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm">Glasses:</span>
                                <span className="font-medium">{waterIntake.glasses}</span>
                              </div>
                              <div className="flex justify-between border-t pt-2">
                                <span className="text-sm">Ounces:</span>
                                <span className="font-bold text-blue-600">{waterIntake.ounces} oz</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
    
                      {/* Time to Goal */}
                      {timeToGoal && (
                        <div className={`p-6 rounded-xl ${
                          theme === "dark" ? "bg-gray-800/60 border border-gray-700" : "bg-white/60 shadow"
                        }`}>
                          <h4 className="font-semibold mb-3 text-green-600">Time to Goal Weight</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-green-600">{timeToGoal.weeks}</div>
                              <div className="text-sm text-gray-500">weeks</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-green-600">{timeToGoal.months}</div>
                              <div className="text-sm text-gray-500">months</div>
                            </div>
                          </div>
                          {!timeToGoal.isRealistic && (
                            <p className="text-sm text-orange-600 mt-3 text-center">
                              ⚠️ Consider setting a more realistic timeline for sustainable results
                            </p>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
    
            {/* Insights Tab */}
            {activeTab === "insights" && bmi && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* BMI Categories Chart */}
                <div className={`p-8 rounded-2xl ${
                  theme === "dark" ? "bg-gray-800/80 backdrop-blur border border-gray-700" : "bg-white/80 backdrop-blur shadow-lg"
                }`}>
                  <h3 className="text-xl font-bold mb-6 text-center">BMI Categories</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={bmiCategories.map(cat => ({ ...cat, value: 1 }))}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {bmiCategories.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value, name, props) => [props.payload.range, props.payload.name]}
                        contentStyle={{
                          backgroundColor: theme === 'dark' ? '#374151' : '#fff',
                          border: 'none',
                          borderRadius: '8px',
                          color: theme === 'dark' ? '#fff' : '#000'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2">
                    {bmiCategories.map((cat, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <div 
                            className="w-4 h-4 rounded mr-2" 
                            style={{backgroundColor: cat.color}}
                          ></div>
                          <span>{cat.name}</span>
                        </div>
                        <span className={mutedTextColor}>{cat.range}</span>
                      </div>
                    ))}
                  </div>
                </div>
    
                {/* Body Composition */}
                {bodyComposition && (
                  <div className={`p-8 rounded-2xl ${
                    theme === "dark" ? "bg-gray-800/80 backdrop-blur border border-gray-700" : "bg-white/80 backdrop-blur shadow-lg"
                  }`}>
                    <h3 className="text-xl font-bold mb-6 text-center">Body Composition Analysis</h3>
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-red-500">{bodyComposition.fatPercentage}%</div>
                          <div className="text-sm text-gray-500">Body Fat</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-blue-500">{bodyComposition.leanMass}kg</div>
                          <div className="text-sm text-gray-500">Lean Mass</div>
                        </div>
                      </div>
                      
                      <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'Fat Mass', value: parseFloat(bodyComposition.fatMass), fill: '#EF4444' },
                              { name: 'Muscle Mass', value: parseFloat(bodyComposition.muscleMass), fill: '#3B82F6' },
                              { name: 'Other', value: parseFloat(bodyComposition.leanMass) - parseFloat(bodyComposition.muscleMass), fill: '#10B981' }
                            ]}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={80}
                            dataKey="value"
                          >
                          </Pie>
                          <Tooltip 
                            formatter={(value) => [`${value.toFixed(1)}kg`, 'Weight']}
                            contentStyle={{
                              backgroundColor: theme === 'dark' ? '#374151' : '#fff',
                              border: 'none',
                              borderRadius: '8px',
                              color: theme === 'dark' ? '#fff' : '#000'
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      
                      <div className="text-center">
                        <div className="text-lg">
                          <span className="text-gray-500">Metabolic Age: </span>
                          <span className="font-bold text-purple-600">{bodyComposition.metabolicAge} years</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
    
                {/* Macronutrient Breakdown */}
                {calorieNeeds && calorieNeeds.macros && (
                  <div className={`p-8 rounded-2xl ${
                    theme === "dark" ? "bg-gray-800/80 backdrop-blur border border-gray-700" : "bg-white/80 backdrop-blur shadow-lg"
                  }`}>
                    <h3 className="text-xl font-bold mb-6 text-center">Daily Macronutrients</h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={[
                        { name: 'Protein', grams: calorieNeeds.macros.protein.grams, calories: calorieNeeds.macros.protein.calories, fill: '#EF4444' },
                        { name: 'Carbs', grams: calorieNeeds.macros.carbs.grams, calories: calorieNeeds.macros.carbs.calories, fill: '#3B82F6' },
                        { name: 'Fat', grams: calorieNeeds.macros.fat.grams, calories: calorieNeeds.macros.fat.calories, fill: '#10B981' }
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} />
                        <XAxis dataKey="name" stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'} />
                        <YAxis stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'} />
                        <Tooltip 
                          formatter={(value, name) => [
                            name === 'grams' ? `${value}g` : `${value} cal`,
                            name === 'grams' ? 'Grams' : 'Calories'
                          ]}
                          contentStyle={{
                            backgroundColor: theme === 'dark' ? '#374151' : '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            color: theme === 'dark' ? '#fff' : '#000'
                          }}
                        />
                        <Bar dataKey="grams" />
                      </BarChart>
                    </ResponsiveContainer>
                    <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="font-bold text-red-500">{calorieNeeds.macros.protein.grams}g</div>
                        <div className="text-sm text-gray-500">Protein</div>
                      </div>
                      <div>
                        <div className="font-bold text-blue-500">{calorieNeeds.macros.carbs.grams}g</div>
                        <div className="text-sm text-gray-500">Carbs</div>
                      </div>
                      <div>
                        <div className="font-bold text-green-500">{calorieNeeds.macros.fat.grams}g</div>
                        <div className="text-sm text-gray-500">Fat</div>
                      </div>
                    </div>
                  </div>
                )}
    
                {/* Health Comparison */}
                <div className={`p-8 rounded-2xl ${
                  theme === "dark" ? "bg-gray-800/80 backdrop-blur border border-gray-700" : "bg-white/80 backdrop-blur shadow-lg"
                }`}>
                  <h3 className="text-xl font-bold mb-6 text-center">Health Comparison</h3>
                  <div className="mb-4 flex justify-center">
                    <div className={`inline-flex rounded-lg p-1 ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`}>
                      <button
                        onClick={() => setCompareWith("global")}
                        className={`px-4 py-2 rounded-md transition-all ${
                          compareWith === "global" 
                            ? "bg-blue-500 text-white" 
                            : theme === "dark" ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        Global
                      </button>
                      <button
                        onClick={() => setCompareWith("us")}
                        className={`px-4 py-2 rounded-md transition-all ${
                          compareWith === "us" 
                            ? "bg-blue-500 text-white" 
                            : theme === "dark" ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        US
                      </button>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={[
                      { name: 'You', bmi: parseFloat(bmi), fill: getBmiColor(bmi) },
                      { name: comparisonData.region, bmi: comparisonData.averageBMI, fill: '#94A3B8' }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} />
                      <XAxis dataKey="name" stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'} />
                      <YAxis stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'} />
                      <Tooltip 
                        formatter={(value) => [value.toFixed(1), 'BMI']}
                        contentStyle={{
                          backgroundColor: theme === 'dark' ? '#374151' : '#fff',
                          border: 'none',
                          borderRadius: '8px',
                          color: theme === 'dark' ? '#fff' : '#000'
                        }}
                      />
                      <Bar dataKey="bmi" />
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="mt-4 text-center">
                    <p className={`text-sm ${mutedTextColor}`}>
                      Your BMI is {parseFloat(bmi) < comparisonData.averageBMI ? 'below' : 'above'} the {comparisonData.region.toLowerCase()} 
                      by {Math.abs(parseFloat(bmi) - comparisonData.averageBMI).toFixed(1)} points
                    </p>
                  </div>
                </div>
              </div>
            )}
    
           {/* Analytics Tab */}
        {activeTab === "trends" && bmi && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* BMI Progress Simulation */}
            <div className={`p-8 rounded-2xl ${
              theme === "dark" ? "bg-gray-800/80 backdrop-blur border border-gray-700" : "bg-white/80 backdrop-blur shadow-lg"
            }`}>
              <h3 className="text-xl font-bold mb-6 text-center">BMI Progress Projection</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={generateProgressData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} />
                  <XAxis dataKey="week" stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'} />
                  <YAxis stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'} />
                  <Tooltip 
                    formatter={(value, name) => [value.toFixed(1), name === 'bmi' ? 'BMI' : 'Weight']}
                    contentStyle={{
                      backgroundColor: theme === 'dark' ? '#374151' : '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      color: theme === 'dark' ? '#fff' : '#000'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="bmi" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
              <div className="mt-4 text-center">
                <p className={`text-sm ${mutedTextColor}`}>
                  Projected BMI over the next 12 weeks based on your goal
                </p>
              </div>
            </div>

            {/* Health Risk Assessment */}
            <div className={`p-8 rounded-2xl ${
              theme === "dark" ? "bg-gray-800/80 backdrop-blur border border-gray-700" : "bg-white/80 backdrop-blur shadow-lg"
            }`}>
              <h3 className="text-xl font-bold mb-6 text-center">Health Risk Assessment</h3>
              {healthRisk && (
                <div className="space-y-6">
                  <div className="text-center">
                    <div 
                      className="text-4xl font-bold mb-2"
                      style={{ color: healthRisk.color }}
                    >
                      {healthRisk.level}
                    </div>
                    <p className={`text-sm ${mutedTextColor}`}>Overall Risk Level</p>
                  </div>
                  
                  <div className="space-y-4">
                    {healthRisk.factors.map((factor, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{factor.name}</span>
                          <span className={`text-sm px-2 py-1 rounded-full text-white`} 
                                style={{ backgroundColor: factor.color }}>
                            {factor.risk}
                          </span>
                        </div>
                        <div className={`w-full bg-gray-200 rounded-full h-2 ${theme === 'dark' ? 'bg-gray-600' : ''}`}>
                          <div 
                            className="h-2 rounded-full transition-all duration-1000"
                            style={{ 
                              width: `${factor.score}%`, 
                              backgroundColor: factor.color 
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-blue-50'}`}>
                    <h4 className="font-semibold text-blue-600 mb-2">Recommendations:</h4>
                    <ul className="space-y-1 text-sm">
                      {healthRisk.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-blue-600 mr-2">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Calorie Deficit/Surplus Chart */}
            {calorieNeeds && (
              <div className={`p-8 rounded-2xl ${
                theme === "dark" ? "bg-gray-800/80 backdrop-blur border border-gray-700" : "bg-white/80 backdrop-blur shadow-lg"
              }`}>
                <h3 className="text-xl font-bold mb-6 text-center">Calorie Balance Analysis</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={[
                    { name: 'BMR', calories: calorieNeeds.bmr, fill: '#94A3B8' },
                    { name: 'Maintenance', calories: calorieNeeds.maintenance, fill: '#3B82F6' },
                    { name: 'Target', calories: calorieNeeds.adjusted, fill: calorieNeeds.adjusted < calorieNeeds.maintenance ? '#EF4444' : '#10B981' }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} />
                    <XAxis dataKey="name" stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'} />
                    <YAxis stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'} />
                    <Tooltip 
                      formatter={(value) => [`${value} cal`, 'Calories']}
                      contentStyle={{
                        backgroundColor: theme === 'dark' ? '#374151' : '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        color: theme === 'dark' ? '#fff' : '#000'
                      }}
                    />
                    <Bar dataKey="calories" />
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-4 text-center">
                  <div className="text-lg">
                    <span className="text-gray-500">Daily </span>
                    <span className={`font-bold ${
                      calorieNeeds.adjusted < calorieNeeds.maintenance ? 'text-red-500' : 'text-green-500'
                    }`}>
                      {calorieNeeds.adjusted < calorieNeeds.maintenance ? 'Deficit' : 'Surplus'}: 
                      {Math.abs(calorieNeeds.maintenance - calorieNeeds.adjusted)} cal
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Body Measurements Tracker */}
            <div className={`p-8 rounded-2xl ${
              theme === "dark" ? "bg-gray-800/80 backdrop-blur border border-gray-700" : "bg-white/80 backdrop-blur shadow-lg"
            }`}>
              <h3 className="text-xl font-bold mb-6 text-center">Measurement Tracker</h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{weight}{units === 'metric' ? 'kg' : 'lbs'}</div>
                  <div className="text-sm text-gray-500">Current Weight</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{height}{units === 'metric' ? 'cm' : 'in'}</div>
                  <div className="text-sm text-gray-500">Height</div>
                </div>
              </div>
              
              {waistCircumference && (
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Waist Circumference</span>
                    <span className="text-sm">{waistCircumference}{units === 'metric' ? 'cm' : 'in'}</span>
                  </div>
                  <div className={`w-full bg-gray-200 rounded-full h-3 ${theme === 'dark' ? 'bg-gray-600' : ''}`}>
                    <div 
                      className="h-3 rounded-full bg-gradient-to-r from-green-400 to-yellow-400 transition-all duration-1000"
                      style={{ 
                        width: `${Math.min((parseFloat(waistCircumference) / (gender === 'male' ? 100 : 88)) * 100, 100)}%`
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Healthy</span>
                    <span>Risk Zone</span>
                  </div>
                </div>
              )}

              <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                <h4 className="font-semibold mb-2">Tracking Tips:</h4>
                <ul className="text-sm space-y-1">
                  <li>• Weigh yourself weekly at the same time</li>
                  <li>• Take measurements monthly</li>
                  <li>• Track body fat percentage if possible</li>
                  <li>• Monitor energy levels and sleep quality</li>
                </ul>
              </div>
            </div>
          </div>
        )}
        {/* Add closing tags for any other open elements here if needed */}
      </div>
    </div>
  );
};

export default Bmi;