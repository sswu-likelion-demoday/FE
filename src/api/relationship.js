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

const createApiError = (
    result,
    fallbackMessage
) => {
    const error = new Error(
        result?.message ||
        fallbackMessage
    );

    error.code =
        result?.code;

    return error;
};

/*
 * 상대 프로필 조회
 *
 * GET
 * /relationships/{relationshipId}/partner-profile
 */
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

        const result = await response.json().catch((error) => {
            if (response.ok) {
                throw error;
            }
            return null;
        });

        if (
            !response.ok ||
            !result.success
        ) {
            const error = createApiError(
                result,
                '상대 프로필 조회에 실패했습니다.'
            );
            error.status = response.status;
            throw error;
        }

        return result.data;
    };

/*
 * 관계 종료
 *
 * POST
 * /relationships/{relationshipId}/end
 */
export const endRelationship =
    async (relationshipId) => {
        const response =
            await fetch(
                `${BASE_URL}/relationships/${relationshipId}/end`,
                {
                    method: 'POST',
                    headers:
                        getAuthHeaders(),
                }
            );

        const result =
            await response.json();

        /*
         * 이미 종료된 관계라면
         * 프론트에서는 종료된 상태로
         * 처리해도 된다.
         */
        if (
            result.code ===
            'RELATIONSHIP_ALREADY_ENDED'
        ) {
            return {
                relationshipId,
                relationshipStatus:
                    'ENDED',
            };
        }

        if (
            !response.ok ||
            !result.success
        ) {
            throw createApiError(
                result,
                '관계 종료에 실패했습니다.'
            );
        }

        return result.data;
    };

/*
 * 사용자 차단
 *
 * POST
 * /users/{userId}/block
 */
export const blockUser =
    async (userId) => {
        const response =
            await fetch(
                `${BASE_URL}/users/${userId}/block`,
                {
                    method: 'POST',
                    headers:
                        getAuthHeaders(),
                }
            );

        const result =
            await response.json();

        /*
         * 이미 차단한 사용자도
         * 프론트에서는 차단 완료 상태로 처리
         */
        if (
            result.code ===
            'USER_ALREADY_BLOCKED'
        ) {
            return true;
        }

        if (
            !response.ok ||
            !result.success
        ) {
            throw createApiError(
                result,
                '사용자 차단에 실패했습니다.'
            );
        }

        return true;
    };

/*
* 관계 단계 및 퀘스트 조회
*
* GET
* /relationships/{relationshipId}
*/
export const getRelationshipDetail =
    async (relationshipId) => {
        const response =
            await fetch(
                `${BASE_URL}/relationships/${relationshipId}`,
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
            throw createApiError(
                result,
                '관계 진행 정보 조회에 실패했습니다.'
            );
        }

        return result.data;
    };