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