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

// 매칭 정보 수정
export const updateMatchingProfile = async (accessToken, updateData) => {
  const response = await fetch(`${BASE_URL}/users/me/matching-profile`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(updateData),
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "매칭 정보 수정에 실패했습니다.");
  }

  return result.data;
};

// 사주 매칭 설정 조회
export const getSajuSettings = async (accessToken) => {
  const response = await fetch(`${BASE_URL}/users/me/saju-settings`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "사주 매칭 설정 조회에 실패했습니다.");
  }

  return result.data;
};

// 사주 매칭 설정 수정
export const updateSajuSettings = async (accessToken, sajuData) => {
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
    throw new Error(result.message || "사주 매칭 설정 수정에 실패했습니다.");
  }

  return result.data;
};

// 수정구 내역 조회
export const getWalletTransactions = async (
  accessToken,
  { type, cursor, size } = {},
) => {
  const params = new URLSearchParams();

  if (type) params.append("type", type);
  if (cursor != null) params.append("cursor", cursor);
  if (size != null) params.append("size", size);

  const query = params.toString();

  const response = await fetch(
    `${BASE_URL}/wallet/transactions${query ? `?${query}` : ""}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "수정구 내역 조회에 실패했습니다.");
  }

  return result.data;
};

// 공지사항 목록 조회
export const getNotices = async (accessToken) => {
  const response = await fetch(`${BASE_URL}/notices`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "공지사항 조회에 실패했습니다.");
  }

  return result.data;
};
