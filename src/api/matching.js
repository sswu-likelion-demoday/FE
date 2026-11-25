import { BASE_URL } from "./config";

// 공통 GET 요청: 성공하면 응답의 data만 돌려줌
const get = async (path) => {
  const token = localStorage.getItem("accessToken");

  const res = await fetch(`${BASE_URL}${path}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  const body = await res.json();
  if (!res.ok || !body.success) {
    throw new Error(body.message || "요청에 실패했습니다.");
  }
  return body.data;
};

// 매칭 홈 조회: { relationshipSlots: { used, available, total } }
export const getMatchingHome = () => get("/matching/home");

// 매칭 이용 횟수 조회:
// { weeklyMatching: { remaining, total }, currency: { balance, matchingCost },
//   actionType: "FREE" | "CURRENCY" | "INSUFFICIENT_CURRENCY" }
export const getMatchingStatus = () => get("/matching/status");
