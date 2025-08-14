# 🏋️‍♂️ Fitverse – AI-Powered Fitness & Health Platform

Fitverse is an AI-powered, web-based fitness and wellness platform designed to deliver **personalized workouts, diet plans, injury prevention tips, and women’s health guidance**. It integrates **real-time pose detection, AI-driven recommendations, and live consultations** for a complete fitness journey.

## 🚀 Features

- **BMI Calculator** – Quickly check your body mass index.
- **AI Exercise Planner** – Get tailored workouts for your goals.
- **AI Diet Plan Generator** – Personalized nutrition plans.
- **AI Nutritionist** – Smart food & supplement recommendations.
- **Injury Prevention** – Alerts & corrections based on your form.
- **Women’s Health** – Period tracker, pregnancy care, and wellness tips.
- **Live Exercises** – Real-time pose tracking with TensorFlow.js & MediaPipe.
- **Expert Consultation** – Connect with fitness experts through video calls.

## 🏗 Architecture

<img width="1499" height="760" alt="diagram-export-8-14-2025-3_25_10-PM" src="https://github.com/user-attachments/assets/a0698066-3f20-4642-8449-1880ff57d5c2" />

### **UI Layer**
- **React 19**
- **TailwindCSS 4**
- **Framer Motion** (animations)
- **Lucide React** & **React Icons**
- **React Router**
- **Recharts** (data visualization)

### **Feature Modules**
- BMI Calculator
- AI Exercise Planner
- AI Diet Plans Generator
- AI Nutritionist
- Injury Prevention
- Women’s Health
- Expert Consultation
- Live Exercises

### **AI/ML Libraries**
- **TensorFlow.js** (machine learning in browser)
- **@tensorflow-models/pose-detection**
- **MediaPipe Pose**
- **TFJS WebGPU** backend for acceleration

### **Communication**
- **Axios** for API calls
- **PeerJS** for WebRTC-based video calls

### **Backend API Server**
- AI Services
- Business Logic
- Database

---

## 📂 Folder Structure

```

src/
├── components/
│   ├── Exercise/
│   │   ├── DeskExercise/
│   │   │   ├── BicepCurl.jsx
│   │   │   ├── FrontRaises.jsx
│   │   │   ├── HighKnees.jsx
│   │   │   ├── Lunges.jsx
│   │   │   ├── Morning.jsx
│   │   │   ├── PullUp.jsx
│   │   │   ├── PushUp.jsx
│   │   │   ├── ShoulderPress.jsx
│   │   │   ├── Squat.jsx
│   │   ├── Bmi.jsx
│   │   ├── DietPlans.jsx
│   │   ├── Exercise.jsx
│   │   ├── ExerciseCard.jsx
│   │   ├── ExerciseWrapper.jsx
│   ├── Home.jsx
│   ├── Injury.jsx
│   ├── Meet.jsx
│   ├── Nutrition.jsx
│   ├── PeriodTracker.jsx
│   ├── PregnancyCare.jsx
│   ├── WomenHealth.jsx
├── Data/
│   ├── data.json
│   ├── diet.js

````

---

## 🛠 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Sameer01-01/inhouseproject_final.git
   cd inhouseproject_final
````

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run the development server**

   ```bash
   npm run dev
   ```

4. **Build for production**

   ```bash
   npm run build
   ```

---

## 📦 Tech Stack

* **Frontend:** React 19, TailwindCSS 4, Framer Motion, Recharts
* **AI/ML:** TensorFlow\.js, MediaPipe Pose, TFJS WebGPU
* **Communication:** Axios, PeerJS
* **Tooling:** Vite, ESLint

---

## 📜 License

This project is licensed under the MIT License – feel free to use, modify, and distribute.

---

## 💡 Future Improvements

* Mobile app version using React Native
* Gamification of workouts
* AI-based injury detection and corrective suggestions
* Multi-language support

```

---

If you want, I can also **add shields.io badges, screenshots, and a short demo video link** so your GitHub page looks more engaging.  
Do you want me to include those next?
```
