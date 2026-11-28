import { BASE_URL } from "./config";

export const completeOnboarding = async (onboardingData) => {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("로그인이 필요합니다.");
  }

  const response = await fetch(`${BASE_URL}/onboarding/complete`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(onboardingData),
  });

  const result = await response.json();

  if (
    !response.ok ||
    !result.success ||
    result.data?.onboardingCompleted !== true
  ) {
    throw new Error(result.message || "온보딩 저장에 실패했습니다.");
  }

  return result.data;
};

export const saveSajuSettings = async (sajuData) => {
  const accessToken = sessionStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("로그인이 필요합니다.");
  }

  const response = await fetch(`${BASE_URL}/users/me/saju-settings`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(sajuData),
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "사주 설정 저장에 실패했습니다.");
  }

  return result.data;
};
