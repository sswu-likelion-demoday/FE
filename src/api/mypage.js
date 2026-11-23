import { BASE_URL } from "./config";

// 차단 목록 조회
export const getBlockedUsers = async (accessToken) => {
  const response = await fetch(`${BASE_URL}/users/blocks`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "차단 목록 조회에 실패했습니다.");
  }

  return result.data;
};

// 차단 해제
export const unblockUser = async (targetUserId, accessToken) => {
  const response = await fetch(`${BASE_URL}/users/${targetUserId}/block`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "차단 해제에 실패했습니다.");
  }

  return result.data;
};

// 마이페이지 홈 조회
export const getMypage = async (accessToken) => {
  const response = await fetch(`${BASE_URL}/users/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "마이페이지 조회에 실패했습니다.");
  }

  return result.data;
};

// 내 정보 조회
export const getMyProfile = async (accessToken) => {
  const response = await fetch(`${BASE_URL}/users/me/profile`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "내 정보 조회에 실패했습니다.");
  }

  return result.data;
};

// 내 정보 수정
export const updateMyProfile = async (
  accessToken,
  updateData,
  profileImage,
) => {
  const formData = new FormData();

  formData.append(
    "request",
    new Blob([JSON.stringify(updateData)], {
      type: "application/json",
    }),
  );

  if (profileImage) {
    formData.append("profileImage", profileImage);
  }

  const response = await fetch(`${BASE_URL}/users/me/profile`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: formData,
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "내 정보 수정에 실패했습니다.");
  }

  return result.data;
};

// 매칭 정보 조회
export const getMatchingProfile = async (accessToken) => {
  const response = await fetch(`${BASE_URL}/users/me/matching-profile`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "매칭 정보 조회에 실패했습니다.");
  }

  return result.data;
};
