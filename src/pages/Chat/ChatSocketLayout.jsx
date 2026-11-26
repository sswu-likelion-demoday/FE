import {
    createContext,
    useCallback,
    useContext,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from 'react';

import {
    Outlet,
    useNavigate,
    useParams,
} from 'react-router-dom';

import {
    createChatSocket,
    disconnectChatSocket,
    sendChatMessage,
} from '../../api/chatSocket';

import StageCompleteModal from './components/StageCompleteModal/StageCompleteModal';

const ChatSocketContext =
    createContext(null);

export const useChatSocket = () => {
    const context =
        useContext(
            ChatSocketContext
        );

    if (!context) {
        throw new Error(
            'useChatSocket은 ChatSocketLayout 내부에서 사용해야 합니다.'
        );
    }

    return context;
};

const ChatSocketLayout = () => {
    const { chatId } = useParams();

    return <ChatRoomSocket key={chatId} chatId={chatId} />;
};

const ChatRoomSocket = ({ chatId }) => {
    const navigate = useNavigate();
    const navigateRef = useRef(navigate);

    useLayoutEffect(() => {
        navigateRef.current = navigate;
    }, [navigate]);

    const clientRef =
        useRef(null);

    /*
     * 같은 정보 해금 이벤트가
     * 중복으로 들어오는 경우 방지
     */
    const handledUnlockKeysRef =
        useRef(new Set());

    const [
        isSocketConnected,
        setIsSocketConnected,
    ] = useState(false);

    const latestMessageRef = useRef(null);
    const messageListenerRef = useRef(null);

    const subscribeToMessages = useCallback((listener) => {
        messageListenerRef.current = listener;
        if (latestMessageRef.current) {
            listener(latestMessageRef.current);
        }

        return () => {
            if (messageListenerRef.current === listener) {
                messageListenerRef.current = null;
            }
        };
    }, []);

    const [
        latestEvent,
        setLatestEvent,
    ] = useState(null);

    const [latestUnlockEvent, setLatestUnlockEvent] = useState(null);
    const [reconnectCount, setReconnectCount] = useState(0);

    const [
        pendingUnlockEvent,
        setPendingUnlockEvent,
    ] = useState(null);

    /*
     * WebSocket 이벤트 기준
     * 관계 완료 여부.
     *
     * REST 상세 재조회가 끝나기 전에도
     * 메시지 전송을 즉시 차단하기 위해 사용.
     */
    const [
        relationshipCompleted,
        setRelationshipCompleted,
    ] = useState(false);

    /*
     * 소켓 연결 종료
     */
    const closeSocket =
        useCallback(() => {
            const client =
                clientRef.current;

            if (client) {
                clientRef.current = null;
                disconnectChatSocket(client);
            }

            setIsSocketConnected(
                false
            );
        }, []);

    /*
     * 관계 완료 처리
     *
     * WebSocket 이벤트뿐 아니라
     * REST 상세 조회 결과가 COMPLETED인 경우에도
     * 동일하게 호출한다.
     */
    const markRelationshipCompleted =
        useCallback(() => {
            setRelationshipCompleted(
                true
            );

            closeSocket();
        }, [closeSocket]);

    /*
     * ChatRoom의 REST 조회 결과와
     * WebSocket 상태를 동기화.
     */
    const syncRelationshipStatus =
        useCallback(
            (
                relationshipStatus
            ) => {
                if (
                    relationshipStatus ===
                    'COMPLETED'
                ) {
                    markRelationshipCompleted();
                }
            },
            [
                markRelationshipCompleted,
            ]
        );

    /*
     * WebSocket 연결
     *
     * /chat/:chatId 아래 모든 화면에서
     * 동일한 연결을 유지한다.
     */
    useLayoutEffect(() => {
        if (!chatId) {
            return undefined;
        }

        let hasConnected = false;

        const client =
            createChatSocket({
                chatRoomId: chatId,

                /*
                 * TEXT / SYSTEM 메시지
                 */
                onMessage: (
                    message
                ) => {
                    if (clientRef.current !== client) {
                        return;
                    }

                    latestMessageRef.current = message;
                    messageListenerRef.current?.(message);
                },

                /*
                 * 관계 / 퀘스트 이벤트
                 */
                onEvent: (
                    event
                ) => {
                    if (clientRef.current !== client) {
                        return;
                    }

                    console.log(
                        '채팅 이벤트:',
                        event
                    );

                    setLatestEvent(
                        event
                    );

                    /*
                     * 정보 해금 이벤트
                     */
                    if (
                        event.type ===
                        'INFORMATION_UNLOCKED'
                    ) {
                        const unlockKey = [
                            event.relationshipId,
                            event.completedStage,
                            event.unlockLabel,
                        ].join('-');

                        if (
                            handledUnlockKeysRef.current.has(
                                unlockKey
                            )
                        ) {
                            return;
                        }

                        handledUnlockKeysRef.current.add(
                            unlockKey
                        );

                        setLatestUnlockEvent(event);
                        setPendingUnlockEvent(
                            event
                        );

                        return;
                    }

                    /*
                     * 관계 완료 이벤트
                     *
                     * 상세 REST 재조회 이전에도
                     * 즉시 메시지 전송을 막고
                     * 더 이상 필요 없는 소켓 연결을 종료.
                     */
                    if (
                        event.type ===
                        'RELATIONSHIP_COMPLETED'
                    ) {
                        markRelationshipCompleted();
                    }
                },

                /*
                 * 개인 WebSocket 에러
                 */
                onError: (
                    socketError
                ) => {
                    if (clientRef.current !== client) {
                        return;
                    }

                    console.error(
                        '채팅 WebSocket 오류:',
                        socketError
                    );

                    if (
                        socketError.code ===
                        'CHAT_ROOM_NOT_FOUND' ||
                        socketError.code ===
                        'CHAT_ROOM_ACCESS_DENIED'
                    ) {
                        navigateRef.current('/chat');

                        return;
                    }

                    /*
                     * 이미 관계가 완료된 상태에서
                     * 전송을 시도했을 경우.
                     *
                     * 바로 전송 차단.
                     */
                    if (
                        socketError.code ===
                        'CHAT_ROOM_NOT_WRITABLE'
                    ) {
                        markRelationshipCompleted();

                        return;
                    }

                    if (
                        socketError.code ===
                        'AUTH_UNAUTHORIZED'
                    ) {
                        closeSocket();
                    }
                },

                onConnected: () => {
                    if (clientRef.current !== client) {
                        return;
                    }

                    if (hasConnected) {
                        setReconnectCount((count) => count + 1);
                    }
                    hasConnected = true;

                    setIsSocketConnected(
                        true
                    );
                },

                onDisconnected: () => {
                    if (clientRef.current !== client) {
                        return;
                    }

                    setIsSocketConnected(
                        false
                    );
                },
            });

        clientRef.current =
            client;

        return () => {
            if (
                clientRef.current ===
                client
            ) {
                clientRef.current = null;
                disconnectChatSocket(client);
                setIsSocketConnected(false);
            }
        };
    }, [
        chatId,
        closeSocket,
        markRelationshipCompleted,
    ]);

    /*
     * 메시지 전송
     */
    const sendMessage =
        useCallback(
            (content) => {
                /*
                 * RELATIONSHIP_COMPLETED 이벤트를
                 * 이미 받았다면 REST 갱신 전이라도
                 * 전송하지 않는다.
                 */
                if (
                    relationshipCompleted
                ) {
                    return false;
                }

                try {
                    sendChatMessage(
                        clientRef.current,
                        chatId,
                        content
                    );

                    return true;
                } catch (error) {
                    console.error(
                        '메시지 전송 실패:',
                        error
                    );

                    return false;
                }
            },
            [
                chatId,
                relationshipCompleted,
            ]
        );

    const contextValue =
        useMemo(
            () => ({
                isSocketConnected,
                subscribeToMessages,
                latestEvent,
                latestUnlockEvent,
                reconnectCount,
                relationshipCompleted,
                sendMessage,
                syncRelationshipStatus,
            }),
            [
                isSocketConnected,
                subscribeToMessages,
                latestEvent,
                latestUnlockEvent,
                reconnectCount,
                relationshipCompleted,
                sendMessage,
                syncRelationshipStatus,
            ]
        );

    const unlockStage =
        pendingUnlockEvent
            ?.completedStage ??
        pendingUnlockEvent
            ?.stage ??
        1;

    return (
        <ChatSocketContext.Provider
            value={contextValue}
        >
            <Outlet />

            {pendingUnlockEvent && (
                <StageCompleteModal
                    stage={
                        unlockStage
                    }
                    title={
                        pendingUnlockEvent
                            .unlockLabel ||
                        '새로운 정보가 해금됐어요!'
                    }
                    reward=""
                    infoLabel="해금 안내"
                    infoValue="프로필에서 새로 공개된 정보를 확인해보세요."
                    profileButtonText="프로필에서 보기"
                    continueButtonText="대화 계속하기"
                    onProfile={() => {
                        const event =
                            pendingUnlockEvent;

                        setPendingUnlockEvent(
                            null
                        );

                        navigate(
                            `/chat/${chatId}/profile`,
                            {
                                state: {
                                    relationshipId:
                                        event.relationshipId,

                                    completedStage:
                                        event.completedStage ??
                                        unlockStage,

                                    currentStage:
                                        event.stage ??
                                        unlockStage,
                                },
                            }
                        );
                    }}
                    onContinue={() =>
                        setPendingUnlockEvent(
                            null
                        )
                    }
                />
            )}
        </ChatSocketContext.Provider>
    );
};

export default ChatSocketLayout;