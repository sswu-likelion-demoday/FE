import { BASE_URL } from './config';

const getAccessToken = () => {
    return sessionStorage.getItem('accessToken');
};

const getAuthHeaders = () => {
    const accessToken = getAccessToken();

    return {
        Authorization: `Bearer ${accessToken}`,
    };
};

export const getChatRooms = async () => {
    const response = await fetch(
        `${BASE_URL}/chat-rooms`,
        {
            method: 'GET',
            headers: getAuthHeaders(),
        }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
        throw new Error(
            result.message ||
            '채팅방 목록 조회에 실패했습니다.'
        );
    }

    return result.data;
};

export const getChatRoomDetail = async (
    chatRoomId
) => {
    const response = await fetch(
        `${BASE_URL}/chat-rooms/${chatRoomId}`,
        {
            method: 'GET',
            headers: getAuthHeaders(),
        }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
        if (
            result.code ===
            'CHAT_ROOM_NOT_FOUND'
        ) {
            throw new Error(
                '존재하지 않는 채팅방입니다.'
            );
        }

        if (
            result.code ===
            'CHAT_ROOM_ACCESS_DENIED'
        ) {
            throw new Error(
                '접근할 수 없는 채팅방입니다.'
            );
        }

        if (
            result.code ===
            'RELATIONSHIP_ENDED'
        ) {
            throw new Error(
                '이미 종료된 관계입니다.'
            );
        }

        throw new Error(
            result.message ||
            '채팅방 조회에 실패했습니다.'
        );
    }

    return result.data;
};

export const getChatMessages = async (
    chatRoomId,
    cursor = null,
    size = 30
) => {
    const params =
        new URLSearchParams();

    params.set('size', size);

    if (cursor !== null) {
        params.set('cursor', cursor);
    }

    const response = await fetch(
        `${BASE_URL}/chat-rooms/${chatRoomId}/messages?${params.toString()}`,
        {
            method: 'GET',
            headers: getAuthHeaders(),
        }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
        if (
            result.code ===
            'CHAT_ROOM_NOT_FOUND'
        ) {
            throw new Error(
                '존재하지 않는 채팅방입니다.'
            );
        }

        if (
            result.code ===
            'CHAT_ROOM_ACCESS_DENIED'
        ) {
            throw new Error(
                '접근할 수 없는 채팅방입니다.'
            );
        }

        if (
            result.code ===
            'RELATIONSHIP_ENDED'
        ) {
            throw new Error(
                '이미 종료된 관계입니다.'
            );
        }

        if (
            result.code ===
            'INVALID_CURSOR'
        ) {
            throw new Error(
                '메시지 조회 위치가 올바르지 않습니다.'
            );
        }

        if (
            result.code ===
            'INVALID_PAGE_SIZE'
        ) {
            throw new Error(
                '메시지 조회 개수가 올바르지 않습니다.'
            );
        }

        throw new Error(
            result.message ||
            '메시지 내역 조회에 실패했습니다.'
        );
    }

    return result.data;
};

export const markChatRoomAsRead = async (
    chatRoomId,
    lastReadMessageId
) => {
    const response = await fetch(
        `${BASE_URL}/chat-rooms/${chatRoomId}/read`,
        {
            method: 'PATCH',
            headers: {
                ...getAuthHeaders(),
                'Content-Type':
                    'application/json',
            },
            body: JSON.stringify({
                lastReadMessageId,
            }),
        }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
        if (
            result.code ===
            'INVALID_READ_POSITION'
        ) {
            return;
        }

        if (
            result.code ===
            'CHAT_ROOM_NOT_FOUND'
        ) {
            throw new Error(
                '존재하지 않는 채팅방입니다.'
            );
        }

        if (
            result.code ===
            'CHAT_ROOM_ACCESS_DENIED'
        ) {
            throw new Error(
                '접근할 수 없는 채팅방입니다.'
            );
        }

        if (
            result.code ===
            'MESSAGE_NOT_FOUND' ||
            result.code ===
            'MESSAGE_NOT_IN_CHAT_ROOM'
        ) {
            throw new Error(
                '메시지 정보를 다시 불러와야 합니다.'
            );
        }

        throw new Error(
            result.message ||
            '메시지 읽음 처리에 실패했습니다.'
        );
    }

    return result.data;
};