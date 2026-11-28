export const getVisibleMatchRequests = (data, now) => {
  const receivedRequests = (data?.receivedRequests ?? []).filter(
    (item) => item.status === "PENDING" && Date.parse(item.expiresAt) > now,
  );
  // ACCEPTED의 수락 후 1일/발신자 확인 여부는 서버에서 필터링한다.
  // 보낸 PENDING은 명세상 expiresAt이 생략되므로 응답 목록을 기준으로 표시한다.
  const sentRequests = (data?.sentRequests ?? []).filter(
    (item) => item.status === "ACCEPTED" || (
      item.status === "PENDING" &&
      (!item.expiresAt || Date.parse(item.expiresAt) > now)
    ),
  );
  return { receivedRequests, sentRequests };
};
