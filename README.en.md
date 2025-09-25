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

- **Responsive UI:** Implemented a responsive web design using TailwindCSS and Material-UI to provide an optimized user experience across various devices.
- **Internationalization (i18n):** Supports Korean, English, and Japanese using the `react-i18next` library, allowing users to easily switch languages.
- **WYSIWYG Editor:** Integrated `react-quill-new` to provide a user-friendly content creation environment.
- **Streamlined API Communication:** Utilizes Axios for efficient communication with the backend API, including automatic authentication token injection and redirection to the login page upon authentication errors, enhancing user experience.
- **Real-time Chat:** Implemented real-time chat functionality by integrating with the backend WebSocket server using `@stomp/stompjs`.
- **Google Maps Integration:** Integrated Google Maps features into the local neighborhood review and event reporting system using `@vis.gl/react-google-maps`.


## License

This project is licensed under the [GNU LGPLv3](LICENSE.md) License.