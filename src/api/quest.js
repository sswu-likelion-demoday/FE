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
        'Content-Type':
            'application/json',
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
 * AI 퀴즈 조회
 *
 * GET
 * /relationships/{relationshipId}
 * /quests/{relationshipQuestId}/quiz
 */
export const getAiQuiz =
    async (
        relationshipId,
        relationshipQuestId
    ) => {
        const response =
            await fetch(
                `${BASE_URL}/relationships/${relationshipId}/quests/${relationshipQuestId}/quiz`,
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
                'AI 퀴즈 조회에 실패했습니다.'
            );
        }

        return result.data;
    };

/*
 * AI 퀴즈 답변 제출
 *
 * POST
 * /relationships/{relationshipId}
 * /quests/{relationshipQuestId}
 * /quiz/answer
 */
export const submitAiQuizAnswer =
    async (
        relationshipId,
        relationshipQuestId,
        selectedOptionId
    ) => {
        const response =
            await fetch(
                `${BASE_URL}/relationships/${relationshipId}/quests/${relationshipQuestId}/quiz/answer`,
                {
                    method: 'POST',
                    headers:
                        getAuthHeaders(),

                    body: JSON.stringify({
                        selectedOptionId,
                    }),
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
                '퀴즈 답변 제출에 실패했습니다.'
            );
        }

        return result.data;
    };

/*
* 만남 인증 제출
*
* POST
* /relationships/{relationshipId}
* /quests/{relationshipQuestId}
* /meeting-verification
*
* multipart/form-data
*/
export const submitMeetingVerification =
    async (
        relationshipId,
        relationshipQuestId,
        imageFile
    ) => {
        const accessToken =
            getAccessToken();

        const formData =
            new FormData();

        formData.append(
            'image',
            imageFile
        );

        const response =
            await fetch(
                `${BASE_URL}/relationships/${relationshipId}/quests/${relationshipQuestId}/meeting-verification`,
                {
                    method: 'POST',

                    headers: {
                        Authorization:
                            `Bearer ${accessToken}`,
                    },

                    body: formData,
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
                '만남 인증에 실패했습니다.'
            );
        }

        return result.data;
    };