import { BrowserRouter, Routes, Route } from "react-router-dom";

import Onboarding from "./pages/Onboarding/Onboarding";
import StudentVerification from "./pages/Onboarding/Signup/SignupStep01";
import BasicInfo from "./pages/Onboarding/Signup/SignupStep02";
import Profile from "./pages/Onboarding/Signup/SignupStep03";
import SignupComplete from "./pages/Onboarding/Signup/SignupStep04";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Onboarding />} />
        <Route path="/signup/student-verification" element={<StudentVerification />} />
        <Route path="/signup/basic-info" element={<BasicInfo />} />
        <Route path="/signup/profile" element={<Profile />} />
        <Route path="/signup/complete" element={<SignupComplete />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
