<details open>
<summary>한국어</summary>

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

- **반응형 UI:** TailwindCSS와 Material-UI를 활용하여 다양한 디바이스에서 최적화된 사용자 경험을 제공하는 웹 디자인을 구현했습니다.
- **국제화 (i18n):** `react-i18next` 라이브러리를 사용하여 한국어, 영어, 일본어 3개 국어를 지원하며, 사용자가 언어를 쉽게 전환할 수 있도록 구현했습니다.
- **WYSIWYG 에디터:** `react-quill-new`를 도입하여 사용자 친화적인 콘텐츠 작성 환경을 제공합니다.
- **간편한 API 통신:** Axios를 사용하여 백엔드 API와 효율적으로 통신하며, 인증 토큰 자동 삽입 및 오류 발생 시 로그인 페이지로 리다이렉트하는 기능을 구현하여 사용자 경험을 향상시켰습니다.
- **실시간 채팅:** `@stomp/stompjs`를 사용하여 백엔드 WebSocket 서버와 연동, 실시간 채팅 기능을 구현했습니다.
- **Google Maps 통합:** `@vis.gl/react-google-maps`를 활용하여 현지 동네 리뷰 및 이벤트 제보 시스템에 Google Maps 기능을 통합했습니다.

## 라이센스

이 프로젝트는 [GNU LGPLv3](LICENSE.md) 라이센스를 따릅니다.

</details>

<details>
<summary>English</summary>

# Tonarinet となりネット - Frontend

[![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![License: LGPL v3](https://img.shields.io/badge/License-LGPL%20v3-blue.svg)](https://www.gnu.org/licenses/lgpl-3.0)

**Demo Site: https://tn.thxx.xyz**

## Introduction

**Tonarinet** is an integrated management and support platform for international students and foreign workers. This project is the frontend client for a team project (4bits) conducted in the SMART Cloud IT Master 47th course.

Through a user-friendly interface, Tonarinet helps international students and foreign workers easily adapt to local life, obtain necessary information, and form communities.

## Tech Stack

- **Language:** JavaScript
- **Framework:** React (Vite)
- **State Management:** React Hooks
- **UI Libraries:** TailwindCSS, Material-UI (MUI)
- **Routing:** React Router DOM
- **API Communication:** Axios
- **Internationalization (i18n):** `react-i18next`
- **WYSIWYG Editor:** `react-quill-new`
- **Calendar:** `react-big-calendar`
- **Real-time Communication:** `@stomp/stompjs`
- **Maps:** `@vis.gl/react-google-maps`

## Getting Started

### Environment Variables

To run this project, you need to create a `.env` file in the project root and set the following environment variables.

```
VITE_API_BASE_URL=http://localhost:8999/api
VITE_WS_URL=ws://localhost:8999/ws
VITE_GOOGLE_MAPS_API_KEY=...
```

### Installation and Running

The commands to install dependencies and run the project in development mode are as follows:

```bash
npm install
npm run dev
```

To build the project, use the following command:

```bash
npm run build
```

## Technical Features

- **Responsive UI:** Implemented a looking-good web design using TailwindCSS and Material-UI to provide an better user experience.
- **Internationalization (i18n):** Supports Korean, English, and Japanese using the `react-i18next` library, allowing users to easily switch languages.
- **WYSIWYG Editor:** Integrated `react-quill-new` to provide a user-friendly content creation environment.
- **Streamlined API Communication:** Utilizes Axios for efficient communication with the backend API, including automatic authentication token injection and redirection to the login page upon authentication errors, enhancing user experience.
- **Real-time Chat:** Implemented real-time chat functionality by integrating with the backend WebSocket server using `@stomp/stompjs`.
- **Google Maps Integration:** Integrated Google Maps features into the local neighborhood review and event reporting system using `@vis.gl/react-google-maps`.

## License

This project is licensed under the [GNU LGPLv3](LICENSE.md) License.

</details>

<details>
<summary>日本語</summary>

# となりネット - フロントエンド

[![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![License: LGPL v3](https://img.shields.io/badge/License-LGPL%20v3-blue.svg)](https://www.gnu.org/licenses/lgpl-3.0)

**デモサイト: https://tn.thxx.xyz**

## 紹介

**となりネット**は、留学生や外国人労働者のための統合管理・支援プラットフォームです。このプロジェクトは、SMART Cloud IT Master 第 47 期のチームプロジェクト(4bits)のフロントエンドクライアントです。

ユーザーフレンドリーなインターフェースを通じて、留学生や外国人労働者が現地生活に容易に適応し、必要な情報を取得し、コミュニティを形成できるよう支援します。

## 技術スタック

- **言語:** JavaScript
- **フレームワーク:** React (Vite)
- **状態管理:** React Hooks
- **UI ライブラリ:** TailwindCSS, Material-UI (MUI)
- **ルーティング:** React Router DOM
- **API 通信:** Axios
- **国際化 (i18n):** `react-i18next`
- **WYSIWYG エディタ:** `react-quill-new`
- **カレンダー:** `react-big-calendar`
- **リアルタイム通信:** `@stomp/stompjs`
- **地図:** `@vis.gl/react-google-maps`

## 始め方

### 環境変数

このプロジェクトを実行するには、プロジェクトのルートに`.env`ファイルを作成し、次の環境変数を設定する必要があります。

```
VITE_API_BASE_URL=http://localhost:8999/api
VITE_WS_URL=ws://localhost:8999/ws
VITE_GOOGLE_MAPS_API_KEY=...
```

### インストールと実行

依存関係をインストールし、開発モードでプロジェクトを実行するコマンドは次のとおりです。

```bash
npm install
npm run dev
```

プロジェクトをビルドするには、次のコマンドを使用します。

```bash
npm run build
```

## 技術的な特徴

- **レスポンシブ UI:** TailwindCSS と Material-UI を活用し、優れたユーザーエクスペリエンスを提供するウェブデザインを実装しました。
- **国際化 (i18n):** `react-i18next`ライブラリを使用して、韓国語、英語、日本語の 3 ヶ国語をサポートし、ユーザーが言語を簡単に切り替えられるように実装しました。
- **WYSIWYG エディタ:** `react-quill-new`を導入し、ユーザーフレンドリーなコンテンツ作成環境を提供します。
- **効率的な API 通信:** Axios を使用してバックエンド API と効率的に通信し、認証トークンの自動挿入や認証エラー時のログインページへのリダイレクト機能を実装することで、ユーザーエクスペリエンスを向上させました。
- **リアルタイムチャット:** `@stomp/stompjs`を使用してバックエンド WebSocket サーバーと連携し、リアルタイムチャット機能を実装しました。
- **Google Maps 統合:** `@vis.gl/react-google-maps`を活用し、地域のレビューおよびイベント報告システムに Google Maps 機能を統合しました。

## ライセンス

このプロジェクトは、[GNU LGPLv3](LICENSE.md)ライセンスの下でライセンスされています。

</details>
