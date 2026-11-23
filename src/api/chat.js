import { BASE_URL } from './config';

const getAccessToken = () => {
    return sessionStorage.getItem('accessToken');
};

export const getChatRooms = async () => {
    const accessToken = getAccessToken();

    const response = await fetch(
        `${BASE_URL}/chat-rooms`,
        {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
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