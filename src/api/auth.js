import { BASE_URL } from "./config";

export const checkStudentNumber = async (studentNumber) => {
  const response = await fetch(
    `${BASE_URL}/auth/student-numbers/check?studentNumber=${encodeURIComponent(studentNumber)}`,
  );

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "학번 중복 확인에 실패했습니다.");
  }

  return result.data.available;
};

export const sendVerificationEmail = async (email) => {
  const response = await fetch(`${BASE_URL}/auth/email/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "인증번호 발송에 실패했습니다.");
  }

  return result.data;
};

export const verifyEmail = async (email, verificationCode) => {
  const response = await fetch(`${BASE_URL}/auth/email/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, verificationCode }),
  });

  const result = await response.json();

  if (!response.ok || !result.success || !result.data?.verified) {
    throw new Error(result.message || "이메일 인증에 실패했습니다.");
  }

  return result.data.verified;
};

export const signup = async (signupData, profileImage) => {
  const formData = new FormData();

  formData.append("request", JSON.stringify(signupData));

  if (profileImage) {
    formData.append("profileImage", profileImage);
  }

  const response = await fetch(`${BASE_URL}/auth/signup`, {
    method: "POST",
    body: formData,
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "회원가입에 실패했습니다.");
  }

  return result.data;
};

export const login = async (studentNumber, password) => {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      studentNumber,
      password,
    }),
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "로그인에 실패했습니다.");
  }

  return result.data;
};

export const resetPassword = async (email, studentNumber, newPassword) => {
  const response = await fetch(`${BASE_URL}/auth/password/reset`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      studentNumber,
      newPassword,
    }),
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "비밀번호 재설정에 실패했습니다.");
  }

  return result.data;
};

export const reissueToken = async (refreshToken) => {
  const response = await fetch(`${BASE_URL}/auth/reissue`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken }),
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "토큰 재발급에 실패했습니다.");
  }

  return result.data;
};
