# となりネット - フロントエンド

[![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![License: LGPL v3](https://img.shields.io/badge/License-LGPL%20v3-blue.svg)](https://www.gnu.org/licenses/lgpl-3.0)

**デモサイト: https://tn.thxx.xyz**

## 紹介

**となりネット**は、留学生や外国人労働者のための統合管理・支援プラットフォームです。このプロジェクトは、SMART Cloud IT Master 第47期のチームプロジェクト(4bits)のフロントエンドクライアントです。

ユーザーフレンドリーなインターフェースを通じて、留学生や外国人労働者が現地生活に容易に適応し、必要な情報を取得し、コミュニティを形成できるよう支援します。

## 技術スタック

- **言語:** JavaScript
- **フレームワーク:** React (Vite)
- **状態管理:** React Hooks
- **UIライブラリ:** TailwindCSS, Material-UI (MUI)
- **ルーティング:** React Router DOM
- **API通信:** Axios
- **国際化 (i18n):** `react-i18next`
- **WYSIWYGエディタ:** `react-quill-new`
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

- **レスポンシブUI:** TailwindCSSとMaterial-UIを活用し、様々なデバイスで最適化されたユーザーエクスペリエンスを提供するレスポンシブウェブデザインを実装しました。
- **国際化 (i18n):** `react-i18next`ライブラリを使用して、韓国語、英語、日本語の3ヶ国語をサポートし、ユーザーが言語を簡単に切り替えられるように実装しました。
- **WYSIWYGエディタ:** `react-quill-new`を導入し、ユーザーフレンドリーなコンテンツ作成環境を提供します。
- **効率的なAPI通信:** Axiosを使用してバックエンドAPIと効率的に通信し、認証トークンの自動挿入や認証エラー時のログインページへのリダイレクト機能を実装することで、ユーザーエクスペリエンスを向上させました。
- **リアルタイムチャット:** `@stomp/stompjs`を使用してバックエンドWebSocketサーバーと連携し、リアルタイムチャット機能を実装しました。
- **Google Maps統合:** `@vis.gl/react-google-maps`を活用し、地域のレビューおよびイベント報告システムにGoogle Maps機能を統合しました。


## ライセンス

このプロジェクトは、[GNU LGPLv3](LICENSE.md)ライセンスの下でライセンスされています。