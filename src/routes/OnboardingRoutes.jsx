import { Route } from "react-router-dom";

import Onboarding from "../pages/Onboarding/Onboarding";
import StudentVerification from "../pages/Onboarding/Signup/SignupStep01";
import BasicInfo from "../pages/Onboarding/Signup/SignupStep02";
import Profile from "../pages/Onboarding/Signup/SignupStep03";
import SignupComplete from "../pages/Onboarding/Signup/SignupStep04";
import Login from "../pages/Onboarding/Login/Login";
import FindPassword from "../pages/Onboarding/Login/FindPassword";
import ResetPassword from "../pages/Onboarding/Login/ResetPassword";
import SajuSetting from "../pages/Onboarding/SajuSetting/SajuSetting";
import PreferenceIntro from "../pages/Onboarding/Preference/PreferenceIntro";
import Preference01 from "../pages/Onboarding/Preference/pages/Preference01";
import Preference02 from "../pages/Onboarding/Preference/pages/Preference02";
import Preference03 from "../pages/Onboarding/Preference/pages/Preference03";
import Preference04 from "../pages/Onboarding/Preference/pages/Preference04";
import Preference05 from "../pages/Onboarding/Preference/pages/Preference05";
import PreferenceComplete from "../pages/Onboarding/Preference/PreferenceComplete";
import OnboardingComplete from "../pages/Onboarding/SajuSetting/OnboardingComplete";

const OnboardingRoutes = (
  <>
    <Route path="/" element={<Onboarding />} />
    <Route
      path="/signup/student-verification"
      element={<StudentVerification />}
    />
    <Route path="/signup/basic-info" element={<BasicInfo />} />
    <Route path="/signup/profile" element={<Profile />} />
    <Route path="/signup/complete" element={<SignupComplete />} />
    <Route path="/login" element={<Login />} />
    <Route path="/login/find-password" element={<FindPassword />} />
    <Route path="/login/reset-password" element={<ResetPassword />} />
    <Route path="/signup/saju-setting" element={<SajuSetting />} />
    <Route path="/signup/preference-intro" element={<PreferenceIntro />} />
    <Route path="/signup/preference01" element={<Preference01 />} />
    <Route path="/signup/preference02" element={<Preference02 />} />
    <Route path="/signup/preference03" element={<Preference03 />} />
    <Route path="/signup/preference04" element={<Preference04 />} />
    <Route path="/signup/preference05" element={<Preference05 />} />
    <Route
      path="/signup/preference-complete"
      element={<PreferenceComplete />}
    />
    <Route
      path="/signup/onboarding-complete"
      element={<OnboardingComplete />}
    />
  </>
);
export default OnboardingRoutes;
