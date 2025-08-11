import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/Home";
import Bmi from "./components/Bmi";
import Dietplans from "./components/Dietplans";
import Injury from "./components/Injury";
import Exercise from "./components/Exercise";
import Nutrition from "./components/Nutrition";
import ExerciseCard from "./components/ExerciseCard";

// TensorFlow Exercise Components
import Pushup from "./components/Excercise/Pushup";
import Squat from "./components/Excercise/Sqaut";
import Bicepcurl from "./components/Excercise/Bicepcurl";
import Pullup from "./components/Excercise/Pullup";
import Lunges from "./components/Excercise/Lunges";
import Shoulderpress from "./components/Excercise/Shoulderpress";
import Frontraises from "./components/Excercise/Frontraises";
import Highknees from "./components/Excercise/Highknees";
import Morning from "./components/Excercise/Morning";
import Deskcurls from "./components/Excercise/DeskExcercise/Deskcurls";
import Hand from "./components/Excercise/DeskExcercise/Hand";
import Kneeraises from "./components/Excercise/DeskExcercise/Kneeraises";
import Meet from "./components/Meet";
import Womenhealth from "./components/Womenhealth";
import PeriodTracker from "./components/PeriodTracker";
import PregnancyCare from "./components/PregnancyCare";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/bmi" element={<Bmi />} />
        <Route path="/diet" element={<Dietplans />} />
        <Route path="/injury" element={<Injury />} />
        <Route path="/exercise" element={<Exercise />} />
        <Route path="/nutrition" element={<Nutrition />} />
        <Route path="/exercisecard" element={<ExerciseCard />} />
        <Route path="/meet" element={<Meet />} />
        <Route path="/women" element={<Womenhealth/>}/>
        <Route path="/period-tracker" element={<PeriodTracker />} />
        <Route path="/pregnancy-care" element={<PregnancyCare />} />

        
        {/* TensorFlow Exercise Routes */}
        <Route path="/exercise/pushup" element={<Pushup />} />
        <Route path="/exercise/squat" element={<Squat />} />
        <Route path="/exercise/bicepcurl" element={<Bicepcurl />} />
        <Route path="/exercise/pullup" element={<Pullup />} />
        <Route path="/exercise/lunges" element={<Lunges />} />
        <Route path="/exercise/shoulderpress" element={<Shoulderpress />} />
        <Route path="/exercise/frontraises" element={<Frontraises />} />
        <Route path="/exercise/highknees" element={<Highknees />} />
        <Route path="/exercise/morning" element={<Morning />} />
        <Route path="/exercise/deskcurls" element={<Deskcurls />} />
        <Route path="/exercise/hand" element={<Hand />} />
        <Route path="/exercise/kneeraises" element={<Kneeraises />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
