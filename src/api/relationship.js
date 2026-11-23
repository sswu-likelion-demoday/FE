import { BASE_URL } from './config';

const getAccessToken = () => {
    return sessionStorage.getItem(
        'accessToken'
    );
};

const getAuthHeaders = () => {
    const accessToken =
        getAccessToken();

    return {
        Authorization:
            `Bearer ${accessToken}`,
    };
};

export const getPartnerProfile =
    async (relationshipId) => {
        const response =
            await fetch(
                `${BASE_URL}/relationships/${relationshipId}/partner-profile`,
                {
                    method: 'GET',
                    headers:
                        getAuthHeaders(),
                }
            );

        const result =
            await response.json();

        if (
            !response.ok ||
            !result.success
        ) {
            if (
                result.code ===
                'RELATIONSHIP_NOT_FOUND'
            ) {
                throw new Error(
                    '존재하지 않는 관계입니다.'
                );
            }

            if (
                result.code ===
                'RELATIONSHIP_ACCESS_DENIED'
            ) {
                throw new Error(
                    '상대 프로필에 접근할 수 없습니다.'
                );
            }

            if (
                result.code ===
                'RELATIONSHIP_ENDED'
            ) {
                throw new Error(
                    '종료된 관계입니다.'
                );
            }

            throw new Error(
                result.message ||
                '상대 프로필 조회에 실패했습니다.'
            );
        }

        return result.data;
    };