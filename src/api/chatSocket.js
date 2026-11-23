import { Client } from '@stomp/stompjs';

import { BASE_URL } from './config';

const getAccessToken = () => {
    return sessionStorage.getItem('accessToken');
};

const getWebSocketUrl = () => {
    if (!BASE_URL) {
        return '';
    }

    return BASE_URL
        .replace(/^https:/, 'wss:')
        .replace(/^http:/, 'ws:');
};

export const createChatSocket = ({
    chatRoomId,
    onMessage,
    onEvent,
    onError,
    onConnected,
    onDisconnected,
}) => {
    const accessToken = getAccessToken();

    const client = new Client({
        brokerURL: `${getWebSocketUrl()}/ws`,

        connectHeaders: {
            Authorization:
                `Bearer ${accessToken}`,
        },

        reconnectDelay: 5000,

        heartbeatIncoming: 10000,
        heartbeatOutgoing: 10000,

        onConnect: () => {
            /*
             * 일반 메시지 +
             * 퀘스트 완료 SYSTEM 메시지
             */
            client.subscribe(
                `/sub/chat/${chatRoomId}`,
                (frame) => {
                    try {
                        const message =
                            JSON.parse(
                                frame.body
                            );

                        onMessage?.(
                            message
                        );
                    } catch (error) {
                        console.error(
                            '채팅 메시지 파싱 실패:',
                            error
                        );
                    }
                }
            );

            /*
             * QUEST_OPENED
             * INFORMATION_UNLOCKED
             * RELATIONSHIP_COMPLETED
             */
            client.subscribe(
                `/sub/chat/${chatRoomId}/events`,
                (frame) => {
                    try {
                        const event =
                            JSON.parse(
                                frame.body
                            );

                        onEvent?.(
                            event
                        );
                    } catch (error) {
                        console.error(
                            '채팅 이벤트 파싱 실패:',
                            error
                        );
                    }
                }
            );

            /*
             * 사용자 개인 WebSocket 에러
             */
            client.subscribe(
                '/user/queue/errors',
                (frame) => {
                    try {
                        const error =
                            JSON.parse(
                                frame.body
                            );

                        onError?.(
                            error
                        );
                    } catch (error) {
                        console.error(
                            'WebSocket 에러 파싱 실패:',
                            error
                        );
                    }
                }
            );

            onConnected?.();
        },

        onDisconnect: () => {
            onDisconnected?.();
        },

        onStompError: (frame) => {
            console.error(
                'STOMP 오류:',
                frame.headers[
                'message'
                ],
                frame.body
            );
        },

        onWebSocketError: (error) => {
            console.error(
                'WebSocket 연결 오류:',
                error
            );
        },
    });

    client.activate();

    return client;
};

export const sendChatMessage = (
    client,
    chatRoomId,
    content
) => {
    if (
        !client ||
        !client.connected
    ) {
        throw new Error(
            '채팅 서버에 연결되어 있지 않습니다.'
        );
    }

    const trimmedContent =
        content.trim();

    if (!trimmedContent) {
        return;
    }

    client.publish({
        destination:
            `/pub/chat/${chatRoomId}/messages`,

        body: JSON.stringify({
            content:
                trimmedContent,
        }),
    });
};

export const disconnectChatSocket = (
    client
) => {
    if (!client) {
        return;
    }

    client.deactivate();
};