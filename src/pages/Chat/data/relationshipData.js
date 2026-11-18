export const relationshipStages = {
    1: {
        stage: 1,
        stageName: '첫 인사',
        stageLabel: '1단계 · 첫 인사',

        unlockTitle: '관심사 전체',
        unlockText: '1단계를 마치면 상대의 관심사 전체가 열려요',

        quests: [
            {
                id: 1,
                title: '첫 인사 나누기',
                guide: '서로 첫 인사를 나눠보세요',
                type: 'MESSAGE_COUNT',
            },
            {
                id: 2,
                title: '공통 관심사 찾기',
                guide: '서로의 공통 관심사를 찾아보세요',
                type: 'AI_ANALYSIS',
            },
            {
                id: 3,
                title: '서로의 주말 루틴 물어보기',
                guide: '서로의 주말 루틴을 물어보세요',
                type: 'AI_ANALYSIS',
            },
            {
                id: 4,
                title: '공통 관심사로 대화 이어가기',
                guide: '공통 관심사로 대화를 이어가 보세요',
                type: 'AI_ANALYSIS',
            },
        ],
    },

    2: {
        stage: 2,
        stageName: '알아가는 중',
        stageLabel: '2단계 · 알아가는 중',

        unlockTitle: '취미 · MBTI',
        unlockText: '2단계를 마치면 상대의 취미 · MBTI가 열려요',

        quests: [
            {
                id: 1,
                title: '서로의 취미 이야기하기',
                guide: '서로의 취미를 이야기해보세요',
                type: 'AI_ANALYSIS',
            },
            {
                id: 2,
                title: '가고 싶은 장소 공유하기',
                guide: '가고 싶은 장소를 공유해보세요',
                type: 'AI_ANALYSIS',
            },
            {
                id: 3,
                title: '같이 해보고 싶은 활동 이야기하기',
                guide: '같이 해보고 싶은 활동을 이야기해보세요',
                type: 'AI_ANALYSIS',
            },
            {
                id: 4,
                title: '상대 퀴즈 맞히기 ✨',
                guide: null,
                type: 'AI_QUIZ',
                path: '/chat/1/quest/quiz',
            },
        ],
    },

    3: {
        stage: 3,
        stageName: '가까워지는 중',
        stageLabel: '3단계 · 가까워지는 중',

        unlockTitle: '이름 · 학번 · 학과 · 프로필 사진',
        unlockText:
            '3단계를 마치면 상대의 이름 · 학번 · 학과 · 프로필 사진이 열려요',

        quests: [
            {
                id: 1,
                title: '요즘 고민 하나 나누기',
                guide: '요즘 고민 하나를 나눠보세요',
                type: 'AI_ANALYSIS',
            },
            {
                id: 2,
                title: '추천 콘텐츠 공유하기',
                guide: '요즘 빠진 콘텐츠를 추천해보세요',
                type: 'AI_ANALYSIS',
            },
            {
                id: 3,
                title: '서로의 학교생활 이야기하기',
                guide: '서로의 학교생활을 이야기해보세요',
                type: 'AI_ANALYSIS',
            },
            {
                id: 4,
                title: '서로의 첫인상 이야기하기',
                guide: '서로의 첫인상을 이야기해보세요',
                type: 'AI_ANALYSIS',
            },
        ],
    },

    4: {
        stage: 4,
        stageName: '인연',
        stageLabel: '4단계 · 인연',

        unlockTitle: '외부 연락 수단',
        unlockText: '4단계를 마치면 상대의 외부 연락 수단이 열려요',

        quests: [
            {
                id: 1,
                title: '인생 여행지 하나 추천하기',
                guide: '인생 여행지 하나를 추천해보세요',
                type: 'AI_ANALYSIS',
            },
            {
                id: 2,
                title: '좋아하는 음식 이야기하기',
                guide: '좋아하는 음식을 이야기해보세요',
                type: 'AI_ANALYSIS',
            },
            {
                id: 3,
                title: '만날 날짜와 시간 정하기',
                guide: '만날 날짜와 시간을 정해보세요',
                type: 'AI_ANALYSIS',
            },
            {
                id: 4,
                title: '첫 만남 상호 인증하기',
                guide: null,
                type: 'VERIFICATION',
                path: '/chat/1/quest/verification',
            },
        ],
    },
};

export const getRelationshipStage = (stage) =>
    relationshipStages[stage];

export const getQuest = (stage, questNumber) =>
    relationshipStages[stage]?.quests.find(
        (quest) => quest.id === questNumber
    );