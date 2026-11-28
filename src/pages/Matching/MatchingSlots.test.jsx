import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import Matchinghome from "./Matching-home/Matchinghome";
import MatchingRequest from "./Matching-request/MatchingRequest";
import MatchingProfile from "./Matching-profile/MatchingProfile";

const mockNavigate = jest.fn();
let mockLocation;
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => mockLocation,
}));
jest.mock("../../components/BottomNav/BottomNav", () => () => null);

const originalFetch = global.fetch;
let available;
let failAcceptance;
let requestList;
const slots = () => ({ total: 3, used: 3 - available, available });
const receivedRequest = {
  requestId: 42,
  user: { userId: 7, nickname: "테스트친구" },
  status: "PENDING",
  expiresAt: "2099-01-01T00:00:00",
};

beforeEach(() => {
  available = 3;
  failAcceptance = false;
  requestList = { receivedCount: 1, sentCount: 0, receivedRequests: [receivedRequest], sentRequests: [] };
  mockLocation = { pathname: "/matching", key: "home", state: null };
  mockNavigate.mockReset();
  sessionStorage.setItem("accessToken", "test-token");
  global.fetch = jest.fn(async (url, options) => {
    expect(options.headers.Authorization).toBe("Bearer test-token");
    let data;
    if (url.endsWith("/matching/home")) {
      data = { relationshipSlots: slots() };
    } else if (url.endsWith("/match-requests/42/accept")) {
      if (failAcceptance) {
        return { ok: false, json: async () => ({ success: false, message: "수락에 실패했어요." }) };
      }
      available -= 1;
      data = { requestId: 42, relationshipId: 9, chatRoomId: 10 };
    } else if (url.endsWith("/match-requests/42/reject")) {
      data = null;
    } else if (url.endsWith("/match-requests") && options.method === "POST") {
      data = { requestId: 42, status: "PENDING" };
    } else if (url.endsWith("/match-requests")) {
      data = { ...requestList, relationshipSlots: slots() };
    } else {
      throw new Error(`Unexpected request: ${url}`);
    }
    return { ok: true, json: async () => ({ success: true, data }) };
  });
});

afterEach(() => {
  global.fetch = originalFetch;
  sessionStorage.clear();
  jest.useRealTimers();
});

test("수락에 성공할 때마다 첫 화면의 빈 수정이 3 → 2 → 1 → 0으로 갱신된다", async () => {
  const view = render(<Matchinghome />);
  await screen.findByText("비어있는 수정 3개");
  for (const remaining of [2, 1, 0]) {
    mockNavigate.mockClear();
    view.rerender(<MatchingRequest />);
    fireEvent.click(await screen.findByRole("button", { name: "수락" }));
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/matching"));
    view.rerender(<Matchinghome />);
    await screen.findByText(`비어있는 수정 ${remaining}개`);
  }
  expect(screen.getByRole("button", { name: /나와 잘맞는 수정 구함/ }).disabled).toBe(true);
  fireEvent.click(screen.getByRole("button", { name: "비어있는 수정 0개" }));
  expect(mockNavigate).toHaveBeenLastCalledWith("/matching/request");
});

test("수락 실패 시 빈 수정을 차감하거나 첫 화면으로 이동하지 않는다", async () => {
  failAcceptance = true;
  const view = render(<MatchingRequest />);
  fireEvent.click(await screen.findByRole("button", { name: "수락" }));
  expect((await screen.findByRole("alert")).textContent).toBe("수락에 실패했어요.");
  expect(mockNavigate).not.toHaveBeenCalled();
  view.rerender(<Matchinghome />);
  await screen.findByText("비어있는 수정 3개");
});

test("채팅 요청을 보내고 수락 대기 중일 때는 빈 수정을 차감하지 않는다", async () => {
  mockLocation.state = { type: "found", name: "테스트친구", recommendationId: 15 };
  const view = render(<MatchingProfile />);
  fireEvent.click(screen.getByRole("button", { name: "채팅 요청하기" }));
  await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/matching/request/profile", expect.objectContaining({
    state: expect.objectContaining({ type: "sent", requestId: 42 }),
  })));
  expect(global.fetch).toHaveBeenCalledWith(expect.stringMatching(/\/match-requests$/), expect.objectContaining({
    method: "POST",
    body: JSON.stringify({ recommendationId: 15 }),
  }));
  view.rerender(<Matchinghome />);
  await screen.findByText("비어있는 수정 3개");
});

test("상대가 수락한 뒤 화면에 다시 포커스하면 서버의 최신 개수를 표시한다", async () => {
  render(<Matchinghome />);
  await screen.findByText("비어있는 수정 3개");
  available = 2;
  fireEvent(window, new Event("focus"));
  await screen.findByText("비어있는 수정 2개");
});

test("첫 화면에 머무는 동안에도 상대방의 수락을 주기적으로 반영한다", async () => {
  jest.useFakeTimers();
  render(<Matchinghome />);
  await screen.findByText("비어있는 수정 3개");
  available = 2;
  await act(async () => { jest.advanceTimersByTime(15000); });
  expect(screen.getByText("비어있는 수정 2개")).toBeTruthy();
});

test("거절한 요청은 목록에서 사라지고 빈 수정은 유지된다", async () => {
  const view = render(<MatchingRequest />);
  fireEvent.click(await screen.findByRole("button", { name: "거절" }));
  await screen.findByText("받은 요청이 없어요.");
  expect(global.fetch).toHaveBeenLastCalledWith(expect.stringMatching(/\/match-requests\/42\/reject$/), {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: "Bearer test-token" },
  });
  expect(screen.getByRole("button", { name: "받은 요청 0" })).toBeTruthy();
  expect(mockNavigate).not.toHaveBeenCalled();
  view.rerender(<Matchinghome />);
  await screen.findByText("비어있는 수정 3개");
});

test("명세의 받은/보낸 목록과 실제 표시 개수를 보여주고 수락된 채팅방으로 이동한다", async () => {
  available = 1;
  requestList = {
    receivedCount: 2,
    sentCount: 2,
    receivedRequests: [
      receivedRequest,
      { ...receivedRequest, requestId: 43, user: { userId: 8, nickname: "두번째친구" } },
    ],
    sentRequests: [
      { requestId: 503, user: { userId: 205, nickname: "밤양갱" }, status: "ACCEPTED", chatRoomId: 301 },
      { requestId: 504, user: { userId: 206, nickname: "새벽산책" }, status: "PENDING" },
    ],
  };
  const { container } = render(<MatchingRequest />);
  await screen.findByRole("button", { name: "받은 요청 2" });
  expect(screen.getByRole("button", { name: "보낸 요청 2" })).toBeTruthy();
  expect(container.querySelectorAll(".mr_t_slot:not(.empty)").length).toBe(2);
  expect(container.querySelectorAll(".mr_t_slot.empty").length).toBe(1);
  expect(global.fetch).toHaveBeenCalledWith(expect.stringMatching(/\/match-requests$/), {
    method: "GET",
    cache: "no-store",
    headers: { "Content-Type": "application/json", Authorization: "Bearer test-token" },
  });

  fireEvent.click(screen.getByRole("button", { name: "보낸 요청 2" }));
  expect(screen.getByText("밤양갱")).toBeTruthy();
  expect(screen.getByText("새벽산책")).toBeTruthy();
  expect(screen.getByText("수락 완료")).toBeTruthy();
  expect(screen.getByText("수락 대기 중")).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "채팅 시작" }));
  expect(mockNavigate).toHaveBeenCalledWith("/chat/301");
});

test("만료되거나 종료된 요청은 숨기고 보낸 PENDING은 expiresAt 없이도 표시한다", async () => {
  const expired = { ...receivedRequest, requestId: 10, expiresAt: new Date(Date.now() - 1000).toISOString() };
  requestList = {
    receivedRequests: [
      receivedRequest,
      expired,
      ...["REJECTED", "CANCELED", "EXPIRED"].map((status, index) => ({ ...receivedRequest, requestId: 20 + index, status })),
    ],
    sentRequests: [
      { ...receivedRequest, requestId: 30, expiresAt: undefined },
      expired,
      ...["REJECTED", "CANCELED", "EXPIRED"].map((status, index) => ({ ...receivedRequest, requestId: 40 + index, status })),
    ],
  };
  render(<MatchingRequest />);
  await screen.findByRole("button", { name: "받은 요청 1" });
  fireEvent.click(screen.getByRole("button", { name: "보낸 요청 1" }));
  expect(screen.getByText("수락 대기 중")).toBeTruthy();
});

test("화면을 열어 둔 중에 받은 요청이 만료되면 서버 재조회 전에도 목록과 개수에서 제외한다", async () => {
  jest.useFakeTimers("modern");
  requestList.receivedRequests = [{ ...receivedRequest, expiresAt: new Date(Date.now() + 1000).toISOString() }];
  render(<MatchingRequest />);
  await screen.findByRole("button", { name: "받은 요청 1" });
  await act(async () => { jest.advanceTimersByTime(1000); });
  expect(screen.getByRole("button", { name: "받은 요청 0" })).toBeTruthy();
  expect(screen.getByText("받은 요청이 없어요.")).toBeTruthy();
  expect(screen.queryByText("테스트친구")).toBeNull();
});

test("서버가 수락 후 하루 지난 요청을 제외하면 열린 보낸 요청 목록도 갱신된다", async () => {
  jest.useFakeTimers("modern");
  mockLocation.state = { tab: "sent" };
  requestList.sentRequests = [{ requestId: 503, user: { userId: 205, nickname: "밤양갱" }, status: "ACCEPTED", chatRoomId: 301 }];
  render(<MatchingRequest />);
  await screen.findByText("밤양갱");
  requestList.sentRequests = [];
  await act(async () => { jest.advanceTimersByTime(15000); });
  expect(screen.getByRole("button", { name: "보낸 요청 0" })).toBeTruthy();
  expect(screen.queryByText("밤양갱")).toBeNull();
  expect(screen.getByText("보낸 요청이 없어요.")).toBeTruthy();
});

test("거절 전에 시작한 목록 조회가 늦게 도착해도 거절한 요청을 복원하지 않는다", async () => {
  render(<MatchingRequest />);
  await screen.findByRole("button", { name: "거절" });
  let resolveStale;
  global.fetch.mockImplementationOnce(() => new Promise((resolve) => { resolveStale = resolve; }));
  fireEvent(window, new Event("focus"));
  fireEvent.click(screen.getByRole("button", { name: "거절" }));
  await screen.findByText("받은 요청이 없어요.");
  await act(async () => {
    resolveStale({ ok: true, json: async () => ({ success: true, data: { ...requestList, relationshipSlots: slots() } }) });
  });
  expect(screen.getByText("받은 요청이 없어요.")).toBeTruthy();
  expect(screen.queryByText("테스트친구")).toBeNull();
});
