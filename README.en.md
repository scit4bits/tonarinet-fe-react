# Tonarinet - Community Platform

Tonarinet is a modern, feature-rich web application designed to connect local communities. It provides a platform for users to interact with their neighbors, join local groups, share information, and engage in community activities.

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

-   `npm run dev`
    Runs the app in development mode. Open [http://localhost:5173](http://localhost:5173) to view it in the browser. The page will reload if you make edits.

-   `npm run build`
    Builds the app for production to the `dist` folder. It correctly bundles React in production mode and optimizes the build for the best performance.

-   `npm run lint`
    Lints the source code using ESLint to find and fix problems in your code.

-   `npm run preview`
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
