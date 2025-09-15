<!--
Please do not edit directly.
Instead, edit the language-specific files: README.en.md, README.ko.md, README.ja.md
-->

<details open>
<summary><strong>English</strong></summary>

# Tonarinet - Community Platform

Tonarinet is a modern, feature-rich web application designed to connect local communities. It provides a platform for users to interact with their neighbors, join local groups, share information, and engage in community activities.

- **View the full English README [here](./README.en.md).**

## ✨ Key Features

- **Multi-Language Support**: Seamlessly switch between English, Korean (한국어), and Japanese (日本語).
- **Community Boards**: Create and discuss topics with a rich text editor, share images, and engage with posts.
- **Real-Time Chat**: Instantly communicate with other users and groups.
- **Group Management**: Create or join organizations and parties (smaller groups) to collaborate on projects or activities.
- **Task System**: Assign and manage tasks within organizations.
- **Interactive Map**: Discover local reviews and information using an integrated Google Map.
- **User Authentication**: Secure sign-up and sign-in functionality.
- **My Page**: A personalized dashboard to manage your activities, profile, and groups.
- **Admin Panels**: Dedicated interfaces for system-wide and organization-specific administration.

## 🛠️ Tech Stack

- **Core**: React 19, Vite
- **Styling**: Material-UI (MUI) & Tailwind CSS
- **Routing**: React Router
- **API Communication**: Axios (for RESTful APIs), StompJS (for WebSocket communication)
- **Internationalization (i18n)**: i18next & React-i18next
- **Text Editing**: React Quill (Rich Text Editor)
- **Mapping**: Google Maps React API

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### Installation

1.  **Clone the repository:**

    ```sh
    git clone https://github.com/tonarinet/tonarinet-fe-react.git
    cd tonarinet-fe-react
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

## 📜 Available Scripts

In the project directory, you can run the following commands:

- `npm run dev`
  Runs the app in development mode. Open [http://localhost:5173](http://localhost:5173) to view it in the browser. The page will reload if you make edits.

- `npm run build`
  Builds the app for production to the `dist` folder. It correctly bundles React in production mode and optimizes the build for the best performance.

- `npm run lint`
  Lints the source code using ESLint to find and fix problems in your code.

- `npm run preview`
  Serves the locally-built production app from the `dist` directory.

## 📁 Project Structure

The `src` folder contains the core application logic:

```
src/
├── assets/         # Static assets like images and icons
├── components/     # Reusable React components (e.g., Header, Footer)
├── data/           # Static data files (e.g., JSON)
├── hooks/          # Custom React hooks for business logic and data fetching
├── locales/        # Translation files for i18n (en, ko, ja)
├── pages/          # Top-level page components for each route
├── utils/          # Utility functions, API clients, and helper scripts
├── App.jsx         # Main application component with routing setup
├── i18n.js         # i18next configuration
└── main.jsx        # The entry point of the application
```

## 📄 License

This project is not currently licensed. Please add a license file if you intend to distribute it.

</details>

<details>
<summary><strong>한국어</strong></summary>

# Tonarinet - 커뮤니티 플랫폼

Tonarinet은 지역 커뮤니티를 연결하기 위해 설계된 현대적이고 기능이 풍부한 웹 애플리케이션입니다. 사용자들이 이웃과 교류하고, 지역 그룹에 가입하며, 정보를 공유하고, 커뮤니티 활동에 참여할 수 있는 플랫폼을 제공합니다.

- **전체 한국어 README는 [여기](./README.ko.md)에서 확인하세요.**

## ✨ 주요 기능

- **다국어 지원**: 영어, 한국어(Korean), 일본어(Japanese) 간의 원활한 언어 전환이 가능합니다.
- **커뮤니티 게시판**: 리치 텍스트 에디터를 사용하여 주제를 생성하고 토론하며, 이미지를 공유하고 게시물에 참여할 수 있습니다.
- **실시간 채팅**: 다른 사용자 및 그룹과 즉시 소통할 수 있습니다.
- **그룹 관리**: 프로젝트나 활동에 협력하기 위해 조직 및 파티(소규모 그룹)를 생성하거나 가입할 수 있습니다.
- **작업 시스템**: 조직 내에서 작업을 할당하고 관리합니다.
- **인터랙티브 지도**: 통합된 Google 지도를 사용하여 지역 리뷰 및 정보를 발견할 수 있습니다.
- **사용자 인증**: 안전한 회원가입 및 로그인 기능을 제공합니다.
- **마이페이지**: 활동, 프로필 및 그룹을 관리할 수 있는 개인화된 대시보드입니다.
- **관리자 패널**: 시스템 전반 및 조직별 관리를 위한 전용 인터페이스를 제공합니다.

## 🛠️ 기술 스택

- **코어**: React 19, Vite
- **스타일링**: Material-UI (MUI) & Tailwind CSS
- **라우팅**: React Router
- **API 통신**: Axios (RESTful API용), StompJS (WebSocket 통신용)
- **국제화 (i18n)**: i18next & React-i18next
- **텍스트 편집기**: React Quill (리치 텍스트 에디터)
- **매핑**: Google Maps React API

## 🚀 시작하기

개발 및 테스트 목적으로 로컬 컴퓨터에서 프로젝트를 복사하여 실행하려면 다음 지침을 따르십시오.

### 사전 요구 사항

- [Node.js](https://nodejs.org/) (LTS 버전 권장)
- [npm](https://www.npmjs.com/) (Node.js와 함께 제공)

### 설치

1.  **리포지토리 클론:**

    ```sh
    git clone https://github.com/tonarinet/tonarinet-fe-react.git
    cd tonarinet-fe-react
    ```

2.  **의존성 설치:**
    ```sh
    npm install
    ```

## 📜 사용 가능한 스크립트

프로젝트 디렉토리에서 다음 명령을 실행할 수 있습니다:

- `npm run dev`
  개발 모드에서 앱을 실행합니다. 브라우저에서 [http://localhost:5173](http://localhost:5173)을 열어 확인하세요. 코드를 수정하면 페이지가 다시 로드됩니다.

- `npm run build`
  `dist` 폴더에 프로덕션용 앱을 빌드합니다. 프로덕션 모드에서 React를 올바르게 번들링하고 최상의 성능을 위해 빌드를 최적화합니다.

- `npm run lint`
  ESLint를 사용하여 소스 코드를 린트하여 코드의 문제를 찾아 수정합니다.

- `npm run preview`
  `dist` 디렉토리에서 로컬로 빌드된 프로덕션 앱을 제공합니다.

## 📁 프로젝트 구조

`src` 폴더에는 핵심 애플리케이션 로직이 포함되어 있습니다:

```
src/
├── assets/         # 이미지 및 아이콘과 같은 정적 자산
├── components/     # 재사용 가능한 React 컴포넌트 (예: Header, Footer)
├── data/           # 정적 데이터 파일 (예: JSON)
├── hooks/          # 비즈니스 로직 및 데이터 페칭을 위한 커스텀 React 훅
├── locales/        # i18n을 위한 번역 파일 (en, ko, ja)
├── pages/          # 각 라우트에 대한 최상위 페이지 컴포넌트
├── utils/          # 유틸리티 함수, API 클라이언트 및 헬퍼 스크립트
├── App.jsx         # 라우팅 설정이 포함된 메인 애플리케이션 컴포넌트
├── i18n.js         # i18next 설정
└── main.jsx        # 애플리케이션의 진입점
```

## 📄 라이선스

이 프로젝트는 현재 라이선스가 없습니다. 배포할 계획이라면 라이선스 파일을 추가하십시오.

</details>

<details>
<summary><strong>日本語</strong></summary>

# Tonarinet - コミュニティプラットフォーム

Tonarinet は、地域コミュニティをつなぐために設計された、モダンで機能豊富なウェブアプリケーションです。ユーザーが隣人と交流し、地域のグループに参加し、情報を共有し、コミュニティ活動に参加するためのプラットフォームを提供します。

- **日本語の README 全体は[こちら](./README.ja.md)でご覧いただけます。**

## ✨ 主な機能

- **多言語サポート**: 英語、韓国語（한국어）、日本語（Japanese）をシームレスに切り替え可能。
- **コミュニティ掲示板**: リッチテキストエディタでトピックを作成・議論し、画像を共有し、投稿に参加できます。
- **リアルタイムチャット**: 他のユーザーやグループと即座にコミュニケーションが取れます。
- **グループ管理**: プロジェクトや活動で協力するために、組織やパーティー（小規模グループ）を作成・参加できます。
- **タスクシステム**: 組織内でタスクを割り当て、管理します。
- **インタラクティブマップ**: 統合された Google マップを使用して、地域のレビューや情報を発見できます。
- **ユーザー認証**: 安全なサインアップとサインイン機能を提供します。
- **マイページ**: アクティビティ、プロフィール、グループを管理するためのパーソナライズされたダッシュボードです。
- **管理者パネル**: システム全体および組織固有の管理のための専用インターフェースを提供します。

## 🛠️ 技術スタック

- **コア**: React 19, Vite
- **スタイリング**: Material-UI (MUI) & Tailwind CSS
- **ルーティング**: React Router
- **API 通信**: Axios (RESTful API 用), StompJS (WebSocket 通信用)
- **国際化 (i18n)**: i18next & React-i18next
- **テキストエディタ**: React Quill (リッチテキストエディタ)
- **マッピング**: Google Maps React API

## 🚀 はじめに

開発およびテスト目的で、ローカルマシンでプロジェクトのコピーを起動して実行するには、次の手順に従ってください。

### 前提条件

- [Node.js](https://nodejs.org/) (LTS 版を推奨)
- [npm](https://www.npmjs.com/) (Node.js に付属)

### インストール

1.  **リポジトリをクローン:**

    ```sh
    git clone https://github.com/tonarinet/tonarinet-fe-react.git
    cd tonarinet-fe-react
    ```

2.  **依存関係をインストール:**
    ```sh
    npm install
    ```

## 📜 利用可能なスクリプト

プロジェクトディレクトリでは、次のコマンドを実行できます:

- `npm run dev`
  開発モードでアプリを実行します。ブラウザで [http://localhost:5173](http://localhost:5173) を開いて表示します。編集を行うと、ページはリロードされます。

- `npm run build`
  `dist` フォルダに本番用のアプリをビルドします。本番モードで React を正しくバンドルし、最高のパフォーマンスのためにビルドを最適化します。

- `npm run lint`
  ESLint を使用してソースコードをリントし、コードの問題を見つけて修正します。

- `npm run preview`
  `dist` ディレクトリからローカルにビルドされた本番アプリを提供します。

## 📁 プロジェクト構造

`src` フォルダには、コアアプリケーションロジックが含まれています:

```
src/
├── assets/         # 画像やアイコンなどの静的アセット
├── components/     # 再利用可能なReactコンポーネント (例: Header, Footer)
├── data/           # 静的データファイル (例: JSON)
├── hooks/          # ビジネスロジックとデータフェッチのためのカスタムReactフック
├── locales/        # i18n用の翻訳ファイル (en, ko, ja)
├── pages/          # 各ルートのトップレベルページコンポーネント
├── utils/          # ユーティリティ関数、APIクライアント、ヘルパースクリプト
├── App.jsx         # ルーティング設定を含むメインアプリケーションコンポーネント
├── i18n.js         # i18nextの設定
└── main.jsx        # アプリケーションのエントリポイント
```

## 📄 ライセンス

このプロジェクトは現在ライセンスされていません。配布する場合は、ライセンスファイルを追加してください。

</details>
