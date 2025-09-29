# 토나리넷 となりネット - 프론트엔드

[![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![License: LGPL v3](https://img.shields.io/badge/License-LGPL%20v3-blue.svg)](https://www.gnu.org/licenses/lgpl-3.0)

**데모 사이트: https://tn.thxx.xyz**

## 소개

**토나리넷**은 유학생 및 외국인 노동자를 위한 통합 관리 및 지원 플랫폼입니다. 이 프로젝트는 SMART Cloud IT Master 47기 교육과정에서 진행된 팀 프로젝트(4bits)의 프론트엔드 클라이언트입니다.

사용자 친화적인 인터페이스를 통해 유학생과 외국인 노동자가 현지 생활에 쉽게 적응하고, 필요한 정보를 얻으며, 커뮤니티를 형성할 수 있도록 돕습니다.

## 기술 스택

- **언어:** JavaScript
- **프레임워크:** React (Vite)
- **상태 관리:** React Hooks
- **UI 라이브러리:** TailwindCSS, Material-UI (MUI)
- **라우팅:** React Router DOM
- **API 통신:** Axios
- **국제화 (i18n):** `react-i18next`
- **WYSIWYG 에디터:** `react-quill-new`
- **캘린더:** `react-big-calendar`
- **실시간 통신:** `@stomp/stompjs`
- **지도:** `@vis.gl/react-google-maps`

## 시작하기

### 환경변수 설정

이 프로젝트를 실행하기 위해서는 `.env` 파일을 프로젝트 루트에 생성하고 아래의 환경변수들을 설정해야 합니다.

```
VITE_API_BASE_URL=http://localhost:8999/api
VITE_WS_URL=ws://localhost:8999/ws
VITE_GOOGLE_MAPS_API_KEY=...
```

### 설치 및 실행

의존성을 설치하고 프로젝트를 개발 모드로 실행하는 명령어는 다음과 같습니다.

```bash
npm install
npm run dev
```

프로젝트 빌드는 다음 명령어를 사용합니다.

```bash
npm run build
```

## 기술적 특징

- **반응형 UI:** TailwindCSS와 Material-UI를 활용하여 다양한 디바이스에서 최적화된 사용자 경험을 제공하는 반응형 웹 디자인을 구현했습니다.
- **국제화 (i18n):** `react-i18next` 라이브러리를 사용하여 한국어, 영어, 일본어 3개 국어를 지원하며, 사용자가 언어를 쉽게 전환할 수 있도록 구현했습니다.
- **WYSIWYG 에디터:** `react-quill-new`를 도입하여 사용자 친화적인 콘텐츠 작성 환경을 제공합니다.
- **간편한 API 통신:** Axios를 사용하여 백엔드 API와 효율적으로 통신하며, 인증 토큰 자동 삽입 및 오류 발생 시 로그인 페이지로 리다이렉트하는 기능을 구현하여 사용자 경험을 향상시켰습니다.
- **실시간 채팅:** `@stomp/stompjs`를 사용하여 백엔드 WebSocket 서버와 연동, 실시간 채팅 기능을 구현했습니다.
- **Google Maps 통합:** `@vis.gl/react-google-maps`를 활용하여 현지 동네 리뷰 및 이벤트 제보 시스템에 Google Maps 기능을 통합했습니다.



## 라이센스

이 프로젝트는 [GNU LGPLv3](LICENSE.md) 라이센스를 따릅니다.