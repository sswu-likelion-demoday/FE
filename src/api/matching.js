import { BASE_URL } from "./config";

// 공통 요청: 성공하면 응답의 data만 돌려줌
const request = async (method, path, data) => {
  const token = sessionStorage.getItem("accessToken");

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    ...(method === "GET" && { cache: "no-store" }),
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...(data !== undefined && { body: JSON.stringify(data) }),
  });

  const body = await res.json();
  if (!res.ok || !body.success) {
    throw new Error(body.message || "요청에 실패했습니다.");
  }
  return body.data;
};

const get = (path) => request("GET", path);
const post = (path, data) => request("POST", path, data);

// 매칭 홈 조회: { relationshipSlots: { used, available, total } }
export const getMatchingHome = () => get("/matching/home");

// 매칭 이용 횟수 조회:
// { weeklyMatching: { remaining, total }, currency: { balance, matchingCost },
//   actionType: "FREE" | "CURRENCY" | "INSUFFICIENT_CURRENCY" }
export const getMatchingStatus = () => get("/matching/status");

// 일반 매칭 실행: 후보 1명 추천 (무료 횟수 또는 수정구 차감)
// { recommendationId, matchingType, matchingScore,
//   candidate: { userId, nickname, admissionYear, profileImageUrl, introduction } }
export const postNormalMatching = () => post("/matching/recommendations");

// 사주 매칭 실행: 저장된 사주 정보로 후보 1명 추천 (일반 매칭과 무료 횟수 공유)
// { recommendationId, matchingType: "SAJU", compatibilityScore,
//   candidate: { userId, nickname, admissionYear, profileImageUrl } }
export const postSajuMatching = () => post("/matching/saju/recommendations");

// 사주 매칭 설정 조회 / 저장
// { matchingEnabled, calendarType: "SOLAR" | "LUNAR", birthDate: "2004-08-05", birthTime: "12:00" }
// 꺼져 있으면 { matchingEnabled: false, 나머지 null }
export const getSajuSettings = () => get("/matching/saju");
export const saveSajuSettings = (data) => request("PUT", "/matching/saju", data);

// 카테고리 매칭 상태 조회 (카테고리 매칭 홈)
// { categories: [{ category: "MEAL" | "MENTORING" | "STUDY" | "EXERCISE",
//   state: "NONE" | "WAITING" | "RESULT_PENDING", requestId, hasNewResult }] }
export const getCategoryMatchStatus = () => get("/category-matches/status");

// 카테고리 매칭 신청 (명세: POST /category-matches, 백엔드 실제 경로 기준)
// body: { category, memberCount, conditions: { admissionYearMin, admissionYearMax, department, mbti }, allowPartialMatch }
// { requestId, category, status: "WAITING", createdAt }
export const createCategoryMatch = (data) => post("/category-matches/requests", data);

// 카테고리 매칭 결과 상세 조회 (명세: /category-matches/{id}/result, 백엔드 실제 경로 기준)
// { requestId, category, status, groupId,
//   members: [{ userId, name, departmentName, admissionYear, profileImageUrl, mbti, contact }] }
export const getCategoryMatchResult = (requestId) =>
  get(`/category-matches/requests/${encodeURIComponent(requestId)}/result`);

// 추천 자체는 슬롯을 차감하지 않으며, 채팅 요청 수락 후 관계가 생성되면 차감됨
export const createMatchRequest = (recommendationId) =>
  post("/match-requests", { recommendationId });
export const getMatchRequests = () => get("/match-requests");
export const getMatchRequestDetail = (requestId) =>
  get(`/match-requests/${encodeURIComponent(requestId)}`);
export const acceptMatchRequest = (requestId) =>
  post(`/match-requests/${requestId}/accept`);
export const rejectMatchRequest = (requestId) =>
  request("PATCH", `/match-requests/${requestId}/reject`);
export const cancelMatchRequest = (requestId) =>
  request("DELETE", `/match-requests/${encodeURIComponent(requestId)}`);
