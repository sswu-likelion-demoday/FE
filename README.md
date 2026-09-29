# 수정구함 Frontend

멋쟁이사자처럼 데모데이 프론트엔드 프로젝트입니다.

성신여자대학교 구성원들을 위한 친구 매칭 서비스 **수정구函(수정구함)** 의 Frontend Repository입니다.



## 🛠 기술 스택

| 구분 | 기술 |
| --- | --- |
| Frontend | React |
| Language | JavaScript |
| Styling | Sass |
| Package Manager | npm |



## 🌿 브랜치 전략

`main - develop - feature` 구조를 사용합니다.

- `main`: 배포용 브랜치
- `develop`: 개발 통합 브랜치
- `feature/*`: 기능 개발 브랜치

기능 개발 시 `develop` 브랜치에서 새로운 `feature` 브랜치를 생성하여 작업합니다.

```bash
feature/onboarding
feature/matching
feature/map
feature/chat
feature/mypage
```

작업 완료 후 `develop` 브랜치로 Pull Request를 생성하고, 리뷰어 1인 이상의 승인 후 병합합니다.



## 📁 폴더 구조

```bash
src/
├─ api/            # API 요청 관련 코드
├─ assets/         # 이미지 및 정적 파일
├─ components/     # 공통 컴포넌트
├─ pages/          # 기능별 페이지 컴포넌트 및 SCSS 파일
├─ styles/         # 공통 SCSS 파일
├─ App.js
├─ index.js
└─ index.scss
```



## 🚀 실행 방법

Repository를 clone한 후 패키지를 설치합니다.

```bash
npm install
```

개발 서버를 실행합니다.

```bash
npm start
```

개발 서버는 기본적으로 아래 주소에서 실행됩니다.

```text
http://localhost:3000
```

프로덕션 빌드는 다음 명령어를 사용합니다.

```bash
npm run build
```



## 👩‍💻 팀원

| 이름 | 담당 |
| --- | --- |
| 김서윤 | 온보딩, 마이페이지 |
| 김주연 | 매칭, 수정맵 |
| 배재경 | 채팅 |



## 📌 협업 규칙

### Commit Convention

Conventional Commits 기반으로 작성합니다.

```text
feat: 새로운 기능 추가
fix: 버그 수정
refactor: 코드 리팩토링
chore: 설정 및 기타 작업
```

### Pull Request

- 기능 개발은 `feature/*` 브랜치에서 진행합니다.
- `develop` 브랜치로 Pull Request를 생성합니다.
- 리뷰어 1인 이상의 승인 후 병합합니다.
