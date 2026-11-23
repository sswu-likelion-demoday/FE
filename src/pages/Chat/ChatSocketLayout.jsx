import {
    createContext,
    useCallback,
    useContext,
    useEffect,
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
    const navigate =
        useNavigate();

    const { chatId } =
        useParams();

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

    const [
        latestMessage,
        setLatestMessage,
    ] = useState(null);

    const [
        latestEvent,
        setLatestEvent,
    ] = useState(null);

    const [
        pendingUnlockEvent,
        setPendingUnlockEvent,
    ] = useState(null);

    /*
     * WebSocket 연결
     *
     * /chat/:chatId 아래의
     * 모든 자식 화면에서
     * 동일한 연결을 유지한다.
     */
    useEffect(() => {
        if (!chatId) {
            return undefined;
        }

        const client =
            createChatSocket({
                chatRoomId: chatId,

                /*
                 * TEXT / SYSTEM 메시지 수신
                 */
                onMessage: (
                    message
                ) => {
                    setLatestMessage(
                        message
                    );
                },

                /*
                 * 관계 / 퀘스트 이벤트 수신
                 */
                onEvent: (
                    event
                ) => {
                    console.log(
                        '채팅 이벤트:',
                        event
                    );

                    setLatestEvent(
                        event
                    );

                    /*
                     * 실제 해금 정보 자체는
                     * WebSocket payload가 아니라
                     * 이후 프로필 API 응답이 기준.
                     *
                     * 여기서는 사용자에게
                     * 해금됐다는 사실만 알려준다.
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

                        setPendingUnlockEvent(
                            event
                        );
                    }
                },

                /*
                 * 개인 에러 채널
                 */
                onError: (
                    socketError
                ) => {
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
                        navigate('/chat');

                        return;
                    }

                    if (
                        socketError.code ===
                        'AUTH_UNAUTHORIZED'
                    ) {
                        setIsSocketConnected(
                            false
                        );
                    }
                },

                onConnected: () => {
                    setIsSocketConnected(
                        true
                    );
                },

                onDisconnected: () => {
                    setIsSocketConnected(
                        false
                    );
                },
            });

        clientRef.current =
            client;

        return () => {
            setIsSocketConnected(
                false
            );

            disconnectChatSocket(
                client
            );

            clientRef.current =
                null;
        };
    }, [
        chatId,
        navigate,
    ]);

    /*
     * 실제 메시지 전송
     *
     * useMemo에서 사용하므로
     * useCallback으로 고정
     */
    const sendMessage =
        useCallback(
            (content) => {
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
            [chatId]
        );

    /*
     * Context 값
     */
    const contextValue =
        useMemo(
            () => ({
                isSocketConnected,
                latestMessage,
                latestEvent,
                sendMessage,
            }),
            [
                isSocketConnected,
                latestMessage,
                latestEvent,
                sendMessage,
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