import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import MatchingProfile from "./MatchingProfile";
import MatchingRequest from "../Matching-request/MatchingRequest";
import fallbackImage from "../../../assets/images/Matching/matching_profile.svg";

const mockNavigate = jest.fn();
let mockLocation;
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => mockLocation,
}));
jest.mock("../../../components/BottomNav/BottomNav", () => () => null);

const originalFetch = global.fetch;
let detail;
const ok = (data) => ({ ok: true, json: async () => ({ success: true, code: "OK", data }) });

beforeEach(() => {
  mockNavigate.mockReset();
  mockLocation = {
    pathname: "/matching/request/profile",
    key: "profile",
    state: { requestId: 1, type: "received", name: "목록의이전이름", studentId: "99" },
  };
  detail = {
    requestId: 1,
    direction: "RECEIVED",
    status: "PENDING",
    matchingType: "SAJU",
    compatibilityScore: 85,
    user: { userId: 203, nickname: "고양이 집사", admissionYear: 22, profileImageUrl: null },
    expiresAt: "2099-01-01T18:00:00",
  };
  sessionStorage.setItem("accessToken", "test-token");
  global.fetch = jest.fn(async () => ok(detail));
});

afterEach(() => {
  global.fetch = originalFetch;
  sessionStorage.clear();
  jest.useRealTimers();
});

test("requestId 1로 인증된 GET을 보내고 목록의 임시 값 대신 상세 프로필과 사주 점수를 표시한다", async () => {
  render(<MatchingProfile />);
  await screen.findByText("고양이 집사");
  expect(global.fetch).toHaveBeenCalledWith(expect.stringMatching(/\/match-requests\/1$/), {
    method: "GET",
    cache: "no-store",
    headers: { "Content-Type": "application/json", Authorization: "Bearer test-token" },
  });
  expect(screen.getByText("22학번")).toBeTruthy();
  expect(screen.getByText("사주 궁합 85점")).toBeTruthy();
  expect(screen.queryByText("목록의이전이름")).toBeNull();
  expect(screen.getByRole("img", { name: "프로필 이미지" }).getAttribute("src")).toBe(fallbackImage);
  expect(screen.getByRole("button", { name: "수락" })).toBeTruthy();
});

test("일반 매칭은 점수를 숨기고 서버의 SENT 방향과 프로필 이미지를 사용한다", async () => {
  detail.direction = "SENT";
  detail.matchingType = "NORMAL";
  detail.matchingScore = 92;
  detail.user.profileImageUrl = "https://example.test/profile.png";
  render(<MatchingProfile />);
  await screen.findByText("고양이 집사");
  expect(screen.queryByText(/궁합|85점|92점/)).toBeNull();
  expect(screen.getByText("수락 대기 중")).toBeTruthy();
  expect(screen.queryByRole("button", { name: "수락" })).toBeNull();
  expect(screen.getByRole("img", { name: "프로필 이미지" }).getAttribute("src")).toBe(detail.user.profileImageUrl);
  fireEvent.click(screen.getByRole("button", { name: "뒤로가기" }));
  expect(mockNavigate).toHaveBeenCalledWith("/matching/request", { state: { tab: "sent" } });
});

test("조회가 끝나기 전에는 이전 프로필이나 수락 버튼을 표시하지 않는다", async () => {
  let resolveDetail;
  global.fetch.mockImplementationOnce(() => new Promise((resolve) => { resolveDetail = resolve; }));
  render(<MatchingProfile />);
  expect(screen.getByRole("status").textContent).toBe("프로필을 불러오고 있어요.");
  expect(screen.queryByText("목록의이전이름")).toBeNull();
  expect(screen.queryByRole("button", { name: "수락" })).toBeNull();
  await act(async () => { resolveDetail(ok(detail)); });
  expect(screen.getByText("고양이 집사")).toBeTruthy();
});

test("조회 실패 시 서버 메시지와 재시도를 제공하고 임시 프로필을 표시하지 않는다", async () => {
  global.fetch.mockResolvedValueOnce({
    ok: false,
    json: async () => ({ success: false, message: "요청을 조회할 권한이 없습니다." }),
  });
  render(<MatchingProfile />);
  expect((await screen.findByRole("alert")).textContent).toBe("요청을 조회할 권한이 없습니다.");
  expect(screen.queryByText("목록의이전이름")).toBeNull();
  expect(screen.queryByRole("button", { name: "수락" })).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "다시 시도" }));
  await screen.findByText("고양이 집사");
});

test.each(["ACCEPTED", "REJECTED", "CANCELED", "EXPIRED"])("%s 요청의 프로필은 보여주되 다시 수락/거절할 수 없다", async (status) => {
  detail.status = status;
  render(<MatchingProfile />);
  await screen.findByText("고양이 집사");
  expect(screen.queryByRole("button", { name: "수락" })).toBeNull();
  expect(screen.queryByRole("button", { name: "거절" })).toBeNull();
  expect(screen.getByRole("button", { name: "요청 목록 보기" })).toBeTruthy();
});

test("열어 둔 프로필의 요청이 만료되면 수락/거절을 막는다", async () => {
  jest.useFakeTimers("modern");
  detail.expiresAt = new Date(Date.now() + 1000).toISOString();
  render(<MatchingProfile />);
  await screen.findByRole("button", { name: "수락" });
  await act(async () => { jest.advanceTimersByTime(1000); });
  expect(screen.getByText("만료된 요청이에요")).toBeTruthy();
  expect(screen.queryByRole("button", { name: "수락" })).toBeNull();
});

test("수락된 보낸 요청의 이름을 눌러도 요청 ID로 상세 프로필을 조회한다", async () => {
  global.fetch.mockResolvedValueOnce(ok({
    relationshipSlots: { total: 3, used: 1, available: 2 },
    receivedRequests: [],
    sentRequests: [{ requestId: 1, user: { userId: 203, nickname: "목록의이전이름" }, status: "ACCEPTED", chatRoomId: 301 }],
  }));
  mockLocation.state = { tab: "sent" };
  const view = render(<MatchingRequest />);
  fireEvent.click(await screen.findByText("목록의이전이름"));
  expect(mockNavigate).toHaveBeenCalledWith("/matching/request/profile", expect.objectContaining({
    state: expect.objectContaining({ requestId: 1, type: "sent" }),
  }));
  mockLocation.state = mockNavigate.mock.calls[0][1].state;
  detail.direction = "SENT";
  detail.status = "ACCEPTED";
  view.rerender(<MatchingProfile />);
  await screen.findByText("고양이 집사");
});

test("다른 요청으로 이동한 뒤 이전 상세 응답이 도착해도 새 프로필을 덮어쓰지 않는다", async () => {
  let resolvePrevious;
  const previousDetail = { ...detail };
  global.fetch.mockImplementationOnce(() => new Promise((resolve) => { resolvePrevious = resolve; }));
  const view = render(<MatchingProfile />);
  mockLocation = { ...mockLocation, state: { requestId: 2, type: "received" } };
  detail = { ...detail, requestId: 2, user: { ...detail.user, nickname: "두번째친구" } };
  view.rerender(<MatchingProfile />);
  await screen.findByText("두번째친구");
  await act(async () => { resolvePrevious(ok(previousDetail)); });
  expect(screen.queryByText("고양이 집사")).toBeNull();
  expect(screen.getByText("두번째친구")).toBeTruthy();
});

test("상세 응답의 요청 ID로 수락한다", async () => {
  render(<MatchingProfile />);
  await screen.findByText("고양이 집사");
  global.fetch.mockResolvedValueOnce(ok({ requestId: 1, relationshipId: 9, chatRoomId: 301 }));
  fireEvent.click(screen.getByRole("button", { name: "수락" }));
  await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/matching"));
  expect(global.fetch).toHaveBeenLastCalledWith(expect.stringMatching(/\/match-requests\/1\/accept$/), {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: "Bearer test-token" },
  });
});

test("프로필에서 Body 없는 PATCH로 거절하고 data null 응답을 성공 처리한다", async () => {
  mockLocation.state.requestId = 7;
  detail.requestId = 7;
  render(<MatchingProfile />);
  await screen.findByText("고양이 집사");
  global.fetch.mockResolvedValueOnce(ok(null));
  fireEvent.click(screen.getByRole("button", { name: "거절" }));
  await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/matching/request", { replace: true }));
  expect(global.fetch).toHaveBeenLastCalledWith(expect.stringMatching(/\/match-requests\/7\/reject$/), {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: "Bearer test-token" },
  });
});

test.each([
  [403, "MATCH_REQUEST_403_3", "해당 채팅 요청을 조회할 권한이 없습니다."],
  [409, "SLOT_FULL", "상대방의 관계 슬롯이 가득 찼습니다."],
  [409, "MATCH_SLOT_FULL", "활성 관계 슬롯이 가득 찼습니다."],
  [409, "MATCH_REQUEST_409_4", "만료된 채팅 요청입니다."],
])("수락 실패(%s, %s)는 서버 메시지를 보여주고 성공 화면으로 이동하지 않는다", async (status, code, message) => {
  const alert = jest.spyOn(window, "alert").mockImplementation(() => {});
  try {
    render(<MatchingProfile />);
    await screen.findByText("고양이 집사");
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status,
      json: async () => ({ success: false, code, message }),
    });
    fireEvent.click(screen.getByRole("button", { name: "수락" }));
    await waitFor(() => expect(alert).toHaveBeenCalledWith(message));
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "수락" }).disabled).toBe(false);
  } finally {
    alert.mockRestore();
  }
});

test("수락 응답을 기다리는 동안 중복 수락을 차단한다", async () => {
  render(<MatchingProfile />);
  await screen.findByText("고양이 집사");
  let resolveAcceptance;
  global.fetch.mockImplementationOnce(() => new Promise((resolve) => { resolveAcceptance = resolve; }));
  const accept = screen.getByRole("button", { name: "수락" });
  fireEvent.click(accept);
  fireEvent.click(accept);
  expect(accept.disabled).toBe(true);
  expect(screen.getByRole("button", { name: "거절" }).disabled).toBe(true);
  expect(global.fetch.mock.calls.filter(([url]) => url.endsWith("/accept")).length).toBe(1);
  expect(mockNavigate).not.toHaveBeenCalled();
  await act(async () => {
    resolveAcceptance(ok({ requestId: 1, relationshipId: 201, chatRoomId: 301 }));
  });
  expect(mockNavigate).toHaveBeenCalledTimes(1);
  expect(mockNavigate).toHaveBeenCalledWith("/matching");
});

test("보낸 PENDING 요청을 확인 후 DELETE하고 null 응답이면 보낸 목록을 새로 조회한다", async () => {
  detail.direction = "SENT";
  const view = render(<MatchingProfile />);
  fireEvent.click(await screen.findByRole("button", { name: "매칭 취소" }));
  global.fetch.mockResolvedValueOnce(ok(null));
  fireEvent.click(screen.getByRole("button", { name: "예" }));
  await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/matching/request", {
    state: { tab: "sent" }, replace: true,
  }));
  expect(global.fetch).toHaveBeenLastCalledWith(expect.stringMatching(/\/match-requests\/1$/), {
    method: "DELETE",
    headers: { "Content-Type": "application/json", Authorization: "Bearer test-token" },
  });
  expect(screen.queryByRole("dialog")).toBeNull();

  mockLocation.state = { tab: "sent" };
  global.fetch.mockResolvedValueOnce(ok({
    relationshipSlots: { total: 3, used: 0, available: 3 },
    receivedCount: 0, sentCount: 0, receivedRequests: [], sentRequests: [],
  }));
  view.rerender(<MatchingRequest />);
  await screen.findByText("보낸 요청이 없어요.");
  expect(screen.getByRole("button", { name: "보낸 요청 0" })).toBeTruthy();
});

test("취소 확인에서 아니요를 누르면 DELETE 없이 모달만 닫는다", async () => {
  detail.direction = "SENT";
  render(<MatchingProfile />);
  fireEvent.click(await screen.findByRole("button", { name: "매칭 취소" }));
  fireEvent.click(screen.getByRole("button", { name: "아니요" }));
  expect(screen.queryByRole("dialog")).toBeNull();
  expect(global.fetch.mock.calls.some(([, options]) => options.method === "DELETE")).toBe(false);
  expect(mockNavigate).not.toHaveBeenCalled();
});

test.each(["ACCEPTED", "REJECTED", "EXPIRED", "CANCELED"])("보낸 %s 요청에는 매칭 취소 버튼을 표시하지 않는다", async (status) => {
  detail.direction = "SENT";
  detail.status = status;
  render(<MatchingProfile />);
  await screen.findByText("고양이 집사");
  expect(screen.queryByRole("button", { name: "매칭 취소" })).toBeNull();
});

test.each([
  [403, "요청 발신자만 취소할 수 있습니다."],
  [409, "대기 중인 요청만 취소할 수 있습니다."],
])("취소 실패(%s)는 서버 메시지를 표시하고 목록으로 이동하지 않는다", async (status, message) => {
  const alert = jest.spyOn(window, "alert").mockImplementation(() => {});
  try {
    detail.direction = "SENT";
    render(<MatchingProfile />);
    fireEvent.click(await screen.findByRole("button", { name: "매칭 취소" }));
    global.fetch.mockResolvedValueOnce({ ok: false, status, json: async () => ({ success: false, message }) });
    fireEvent.click(screen.getByRole("button", { name: "예" }));
    await waitFor(() => expect(alert).toHaveBeenCalledWith(message));
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(screen.getByRole("dialog")).toBeTruthy();
    expect(screen.getByRole("button", { name: "예" }).disabled).toBe(false);
  } finally {
    alert.mockRestore();
  }
});

test("취소 응답을 기다리는 동안 확인 버튼을 잠그고 중복 DELETE를 막는다", async () => {
  detail.direction = "SENT";
  render(<MatchingProfile />);
  fireEvent.click(await screen.findByRole("button", { name: "매칭 취소" }));
  let resolveCancellation;
  global.fetch.mockImplementationOnce(() => new Promise((resolve) => { resolveCancellation = resolve; }));
  const confirm = screen.getByRole("button", { name: "예" });
  fireEvent.click(confirm);
  fireEvent.click(confirm);
  expect(confirm.disabled).toBe(true);
  expect(screen.getByRole("button", { name: "아니요" }).disabled).toBe(true);
  expect(global.fetch.mock.calls.filter(([, options]) => options.method === "DELETE").length).toBe(1);
  expect(mockNavigate).not.toHaveBeenCalled();
  await act(async () => { resolveCancellation(ok(null)); });
  expect(mockNavigate).toHaveBeenCalledTimes(1);
});

test("취소 확인 중에 요청이 만료되면 모달을 닫고 DELETE를 막는다", async () => {
  jest.useFakeTimers("modern");
  detail.direction = "SENT";
  detail.expiresAt = new Date(Date.now() + 1000).toISOString();
  render(<MatchingProfile />);
  fireEvent.click(await screen.findByRole("button", { name: "매칭 취소" }));
  expect(screen.getByRole("dialog")).toBeTruthy();
  await act(async () => { jest.advanceTimersByTime(1000); });
  expect(screen.queryByRole("dialog")).toBeNull();
  expect(screen.queryByRole("button", { name: "매칭 취소" })).toBeNull();
  expect(screen.getByText("만료된 요청이에요")).toBeTruthy();
  expect(global.fetch.mock.calls.some(([, options]) => options.method === "DELETE")).toBe(false);
});
